'use client'

import { useState } from 'react'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  servingSize: string
  source: 'AFCD' | 'USDA' | 'CUSTOM'
  brand?: string | null
  country: string
  classification?: string
  sodium?: number
  calcium?: number
  iron?: number
  vitaminC?: number
}

interface FoodSearchProps {
  onFoodSelect: (food: FoodItem) => void
}

export default function FoodSearch({ onFoodSelect }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchStats, setSearchStats] = useState<any>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  
  // Custom food form state
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    servingSize: '100g'
  })

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')
    
    try {
      console.log('🔍 Searching for:', searchTerm)
      const response = await fetch(`/api/food/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log('✅ Enhanced search results:', data.results.length, 'foods found')
        console.log('📊 Sources:', data.sources)
        console.log('🔧 Debug:', data.debug)
        
        setSearchResults(data.results)
        setSearchStats(data.sources)
        
        if (data.results.length === 0) {
          setError(`No foods found for "${searchTerm}". You can add it as a custom food below.`)
        }
      } else {
        console.error('❌ Search error:', data.error)
        setError(data.error || 'Search failed. You can add custom foods below.')
      }
    } catch (error) {
      console.error('💥 Search failed:', error)
      setError('Search failed. You can add custom foods below.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setError('')
    setSearchStats(null)
  }

  const quickSearchFood = (food: string) => {
    setSearchTerm(food)
    setTimeout(() => handleSearch(), 100)
  }

  // Handle custom food creation
  const handleCustomFoodSubmit = () => {
    // Validate required fields
    if (!customFood.name.trim() || !customFood.calories || !customFood.protein || !customFood.carbs || !customFood.fat) {
      alert('Please fill in all required fields (name, calories, protein, carbs, fat)')
      return
    }

    // Create custom food object
    const customFoodItem: FoodItem = {
      id: `custom-${Date.now()}`,
      name: customFood.name.trim(),
      calories: parseFloat(customFood.calories),
      protein: parseFloat(customFood.protein),
      carbs: parseFloat(customFood.carbs),
      fat: parseFloat(customFood.fat),
      fiber: parseFloat(customFood.fiber) || 0,
      servingSize: customFood.servingSize,
      source: 'CUSTOM',
      brand: null,
      country: 'Custom Entry'
    }

    // Add to food selection
    onFoodSelect(customFoodItem)

    // Reset form
    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      servingSize: '100g'
    })
    setShowCustomForm(false)

    // Show success message
    alert(`✅ "${customFoodItem.name}" added successfully!`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Australian Food Database</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
            🇦🇺 AFCD + USDA • 600K+ Foods
          </span>
          {searchStats && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {searchStats.afcd} Australian • {searchStats.usda} International
            </span>
          )}
        </div>
      </div>
      
      {/* Enhanced Search Input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search Australian foods (e.g., kangaroo, barramundi, vegemite)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 pr-8"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading || !searchTerm.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Can't Find Food? Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="w-full py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {showCustomForm ? 'Hide Custom Food Form' : "Can't find your food? Add it manually"}
        </button>
      </div>

      {/* Custom Food Form */}
      {showCustomForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-semibold text-orange-900 mb-4">Add Custom Food</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                value={customFood.name}
                onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Vegemite, Tim Tams, Lamington"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Calories * (per {customFood.servingSize})
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.calories}
                onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="e.g., 250"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Protein * (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.protein}
                onChange={(e) => setCustomFood(prev => ({ ...prev, protein: e.target.value }))}
                placeholder="e.g., 10.5"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Carbs * (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.carbs}
                onChange={(e) => setCustomFood(prev => ({ ...prev, carbs: e.target.value }))}
                placeholder="e.g., 30.2"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Fat * (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.fat}
                onChange={(e) => setCustomFood(prev => ({ ...prev, fat: e.target.value }))}
                placeholder="e.g., 15.8"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Fiber (g) - Optional
              </label>
              <input
                type="number"
                step="0.1"
                value={customFood.fiber}
                onChange={(e) => setCustomFood(prev => ({ ...prev, fiber: e.target.value }))}
                placeholder="e.g., 2.5"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Serving Size
              </label>
              <select
                value={customFood.servingSize}
                onChange={(e) => setCustomFood(prev => ({ ...prev, servingSize: e.target.value }))}
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-gray-900 focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="100g">100g</option>
                <option value="1 serving">1 serving</option>
                <option value="1 piece">1 piece</option>
                <option value="1 slice">1 slice</option>
                <option value="1 cup">1 cup</option>
                <option value="1 tablespoon">1 tablespoon</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCustomForm(false)}
              className="flex-1 px-4 py-2 text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomFoodSubmit}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Add Custom Food
            </button>
          </div>
          
          <p className="text-xs text-orange-600 mt-2">
            💡 Tip: You can find nutrition info on food packaging or nutrition websites like CalorieKing
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Searching Australian food database...</p>
          </div>
        )}
        
        {searchResults.map((food) => (
          <div
            key={food.id}
            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onFoodSelect(food)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{food.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    food.source === 'AFCD' 
                      ? 'bg-green-100 text-green-700' 
                      : food.source === 'CUSTOM'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {food.source === 'AFCD' ? '🇦🇺 Australian' : 
                     food.source === 'CUSTOM' ? '📝 Custom' : '🌍 International'}
                  </span>
                </div>
                
                {food.classification && (
                  <p className="text-xs text-purple-600 mb-1">Category: {food.classification}</p>
                )}
                {food.brand && (
                  <p className="text-xs text-blue-600 mb-1">Brand: {food.brand}</p>
                )}
                <p className="text-sm text-gray-600">Per {food.servingSize}</p>
              </div>
              
              <div className="text-right text-sm text-gray-600 ml-4">
                <div className="font-medium text-lg">{food.calories} cal</div>
                <div className="text-xs space-y-1">
                  <div>Protein: {food.protein}g</div>
                  <div>Carbs: {food.carbs}g</div>
                  <div>Fat: {food.fat}g</div>
                  {food.fiber > 0 && <div>Fiber: {food.fiber}g</div>}
                  
                  {/* Show additional Australian nutrients */}
                  {food.source === 'AFCD' && (
                    <div className="pt-1 border-t border-gray-200 mt-1">
                      {food.sodium != null && food.sodium > 0 && <div className="text-orange-600">Sodium: {food.sodium}mg</div>}
                      {food.calcium != null && food.calcium > 0 && <div className="text-green-600">Calcium: {food.calcium}mg</div>}
                      {food.iron != null && food.iron > 0 && <div className="text-red-600">Iron: {food.iron}mg</div>}
                      {food.vitaminC != null && food.vitaminC > 0 && <div className="text-yellow-600">Vit C: {food.vitaminC}mg</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Add Popular Australian Foods */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Australian Foods:</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'Vegemite', category: 'spread' },
            { name: 'Kangaroo', category: 'meat' },
            { name: 'Barramundi', category: 'fish' },
            { name: 'Lamb', category: 'meat' },
            { name: 'Tim Tam', category: 'snack' },
            { name: 'Lamington', category: 'dessert' },
            { name: 'Anzac Biscuit', category: 'snack' },
            { name: 'Pavlova', category: 'dessert' },
            { name: 'Wattleseed', category: 'native' },
            { name: 'Macadamia', category: 'nut' },
            { name: 'Emu', category: 'meat' },
            { name: 'Balmain Bug', category: 'seafood' }
          ].map((food) => (
            <button
              key={food.name}
              onClick={() => quickSearchFood(food.name)}
              className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-xs transition-colors text-center"
              title={`Search for ${food.name} (${food.category})`}
            >
              {food.name}
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          💡 Tip: If you can't find a food, use the orange "Add manually" button above to create custom entries
        </div>
      </div>
    </div>
  )
}

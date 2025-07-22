'use client'

import { useState, useEffect } from 'react'
import FoodSearch from './FoodSearch'

interface Client {
  id: string
  name: string
}

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  servingSize: string
  brand?: string | null
  quantityGrams: number
  unitType: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

interface CreatedMeal {
  id: string
  name: string
  description?: string
  foods: FoodItem[]
  isCustomMeal: boolean
}

interface MealGroup {
  id: string
  name: string
  meals: CreatedMeal[]
  category: string
}

interface MealPlanBuilderInterfaceProps {
  clients: Client[]
}

export default function MealPlanBuilderInterface({ clients }: MealPlanBuilderInterfaceProps) {
  const [planName, setPlanName] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [activeMealId, setActiveMealId] = useState<string>('breakfast')
  const [activeCreatedMealId, setActiveCreatedMealId] = useState<string | null>(null)
  const [meals, setMeals] = useState<MealGroup[]>([
    { id: 'breakfast', name: 'Breakfast', meals: [], category: 'main' },
    { id: 'lunch', name: 'Lunch', meals: [], category: 'main' },
    { id: 'dinner', name: 'Dinner', meals: [], category: 'main' },
    { id: 'snacks', name: 'Snacks', meals: [], category: 'main' }
  ])
  const [saving, setSaving] = useState(false)
  const [showCreateMealModal, setShowCreateMealModal] = useState(false)
  const [newMealName, setNewMealName] = useState('')
  const [newMealDescription, setNewMealDescription] = useState('')

  // Enhanced food selection with meal and created meal selection
  const handleFoodSelect = (food: FoodItem) => {
    if (!activeMealId) {
      alert('Please select a meal period first (Breakfast, Lunch, etc.)')
      return
    }

    const enhancedFood: FoodItem = {
      ...food,
      id: `${food.id}-${Date.now()}`,
      quantityGrams: 100,
      unitType: 'grams',
      caloriesPer100g: food.calories,
      proteinPer100g: food.protein,
      carbsPer100g: food.carbs,
      fatPer100g: food.fat
    }

    setMeals(prev => prev.map(mealGroup => {
      if (mealGroup.id === activeMealId) {
        if (activeCreatedMealId) {
          // Add to specific created meal
          return {
            ...mealGroup,
            meals: mealGroup.meals.map(createdMeal =>
              createdMeal.id === activeCreatedMealId
                ? { ...createdMeal, foods: [...createdMeal.foods, enhancedFood] }
                : createdMeal
            )
          }
        } else {
          // Create a new "Individual Items" meal if none exists
          const individualMeal = mealGroup.meals.find(m => !m.isCustomMeal)
          if (individualMeal) {
            return {
              ...mealGroup,
              meals: mealGroup.meals.map(createdMeal =>
                createdMeal.id === individualMeal.id
                  ? { ...createdMeal, foods: [...createdMeal.foods, enhancedFood] }
                  : createdMeal
              )
            }
          } else {
            // Create new individual items meal
            const newIndividualMeal: CreatedMeal = {
              id: `individual-${Date.now()}`,
              name: 'Individual Items',
              foods: [enhancedFood],
              isCustomMeal: false
            }
            return {
              ...mealGroup,
              meals: [...mealGroup.meals, newIndividualMeal]
            }
          }
        }
      }
      return mealGroup
    }))
  }

  // Create new custom meal within a meal period
  const createCustomMeal = () => {
    if (!newMealName.trim() || !activeMealId) return

    const newCreatedMeal: CreatedMeal = {
      id: `meal-${Date.now()}`,
      name: newMealName,
      description: newMealDescription,
      foods: [],
      isCustomMeal: true
    }

    setMeals(prev => prev.map(mealGroup =>
      mealGroup.id === activeMealId
        ? { ...mealGroup, meals: [...mealGroup.meals, newCreatedMeal] }
        : mealGroup
    ))

    setActiveCreatedMealId(newCreatedMeal.id)
    setNewMealName('')
    setNewMealDescription('')
    setShowCreateMealModal(false)
  }

  // Update food quantity and recalculate nutrition
  const updateFoodQuantity = (mealGroupId: string, createdMealId: string, foodId: string, quantity: number, unit: string) => {
    setMeals(prev => prev.map(mealGroup =>
      mealGroup.id === mealGroupId
        ? {
            ...mealGroup,
            meals: mealGroup.meals.map(createdMeal =>
              createdMeal.id === createdMealId
                ? {
                    ...createdMeal,
                    foods: createdMeal.foods.map(food =>
                      food.id === foodId
                        ? {
                            ...food,
                            quantityGrams: unit === 'grams' ? quantity : quantity * 100,
                            unitType: unit,
                            calories: (food.caloriesPer100g * quantity) / 100,
                            protein: (food.proteinPer100g * quantity) / 100,
                            carbs: (food.carbsPer100g * quantity) / 100,
                            fat: (food.fatPer100g * quantity) / 100
                          }
                        : food
                    )
                  }
                : createdMeal
            )
          }
        : mealGroup
    ))
  }

  // Remove food from specific created meal
  const removeFoodItem = (mealGroupId: string, createdMealId: string, foodId: string) => {
    setMeals(prev => prev.map(mealGroup =>
      mealGroup.id === mealGroupId
        ? {
            ...mealGroup,
            meals: mealGroup.meals.map(createdMeal =>
              createdMeal.id === createdMealId
                ? { ...createdMeal, foods: createdMeal.foods.filter(food => food.id !== foodId) }
                : createdMeal
            )
          }
        : mealGroup
    ))
  }

  // Remove entire created meal
  const removeCreatedMeal = (mealGroupId: string, createdMealId: string) => {
    setMeals(prev => prev.map(mealGroup =>
      mealGroup.id === mealGroupId
        ? { ...mealGroup, meals: mealGroup.meals.filter(meal => meal.id !== createdMealId) }
        : mealGroup
    ))
    
    if (activeCreatedMealId === createdMealId) {
      setActiveCreatedMealId(null)
    }
  }

  // Update created meal name
  const updateCreatedMealName = (mealGroupId: string, createdMealId: string, newName: string) => {
    setMeals(prev => prev.map(mealGroup =>
      mealGroup.id === mealGroupId
        ? {
            ...mealGroup,
            meals: mealGroup.meals.map(createdMeal =>
              createdMeal.id === createdMealId
                ? { ...createdMeal, name: newName }
                : createdMeal
            )
          }
        : mealGroup
    ))
  }

  // Calculate totals across all meals
  const allFoods = meals.flatMap(mealGroup => 
    mealGroup.meals.flatMap(createdMeal => createdMeal.foods)
  )
  const totalCalories = allFoods.reduce((sum, food) => sum + food.calories, 0)
  const totalProtein = allFoods.reduce((sum, food) => sum + food.protein, 0)
  const totalCarbs = allFoods.reduce((sum, food) => sum + food.carbs, 0)
  const totalFat = allFoods.reduce((sum, food) => sum + food.fat, 0)

  // Calculate created meal totals
  const getCreatedMealTotals = (foods: FoodItem[]) => ({
    calories: Math.round(foods.reduce((sum, food) => sum + food.calories, 0)),
    protein: Math.round(foods.reduce((sum, food) => sum + food.protein, 0)),
    carbs: Math.round(foods.reduce((sum, food) => sum + food.carbs, 0)),
    fat: Math.round(foods.reduce((sum, food) => sum + food.fat, 0))
  })

  // Enhanced save function
  const handleSave = async () => {
    setSaving(true)

    try {
      const mealPlanData = {
        planName,
        clientId: selectedClient,
        mealGroups: meals.map(mealGroup => ({
          name: mealGroup.name,
          category: mealGroup.category,
          meals: mealGroup.meals.map(createdMeal => ({
            name: createdMeal.name,
            description: createdMeal.description,
            isCustomMeal: createdMeal.isCustomMeal,
            foods: createdMeal.foods.map(food => ({
              name: food.name,
              brand: food.brand,
              quantityGrams: food.quantityGrams,
              unitType: food.unitType,
              calories: food.calories,
              protein: food.protein,
              carbs: food.carbs,
              fat: food.fat,
              servingSize: food.servingSize
            }))
          }))
        })),
        totalNutrition: {
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat
        }
      }

      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealPlanData)
      })

      if (response.ok) {
        alert('Meal plan saved successfully! 🎉')
        
        setPlanName('')
        setSelectedClient('')
        setMeals([
          { id: 'breakfast', name: 'Breakfast', meals: [], category: 'main' },
          { id: 'lunch', name: 'Lunch', meals: [], category: 'main' },
          { id: 'dinner', name: 'Dinner', meals: [], category: 'main' },
          { id: 'snacks', name: 'Snacks', meals: [], category: 'main' }
        ])
        setActiveMealId('breakfast')
        setActiveCreatedMealId(null)
      } else {
        throw new Error('Failed to save meal plan')
      }
      
    } catch (error) {
      console.error('Save error:', error)
      alert('An error occurred while saving the meal plan')
    } finally {
      setSaving(false)
    }
  }

  // Update header button
  useEffect(() => {
    const headerBtn = document.getElementById('header-meal-save-btn') as HTMLButtonElement
    
    if (headerBtn) {
      headerBtn.textContent = `Save Meal Plan (${Math.round(totalCalories)} calories)`
      
      const isDisabled = !planName || allFoods.length === 0 || !selectedClient || saving
      headerBtn.disabled = isDisabled
      
      if (isDisabled) {
        headerBtn.className = 'bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2 rounded-md text-sm'
      } else {
        headerBtn.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm'
      }
      
      headerBtn.onclick = handleSave
    }

    const headerDesc = document.querySelector('#meal-plan-description')
    if (headerDesc) {
      const totalMeals = meals.reduce((sum, group) => sum + group.meals.length, 0)
      if (allFoods.length > 0 && selectedClient && planName) {
        headerDesc.textContent = `Ready to save "${planName}" with ${totalMeals} meals and ${allFoods.length} foods`
      } else {
        headerDesc.textContent = 'Complete the meal plan details below to save'
      }
    }
  }, [meals, planName, selectedClient, saving, totalCalories, allFoods])

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Enhanced Food Search Sidebar */}
      <div className="col-span-4">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Foods</h3>
          
          {/* Active Selection Indicators */}
          <div className="space-y-2 mb-4">
            {activeMealId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Meal Period: {meals.find(m => m.id === activeMealId)?.name}
                  </span>
                </div>
              </div>
            )}
            
            {activeCreatedMealId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-800">
                    Adding to: {meals
                      .find(m => m.id === activeMealId)?.meals
                      .find(cm => cm.id === activeCreatedMealId)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Foods will be added to the selected meal below
          </p>
        </div>
        <FoodSearch onFoodSelect={handleFoodSelect} />
      </div>

      {/* Enhanced Meal Plan Builder */}
      <div className="col-span-8 space-y-6">
        {/* Plan Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Plan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g., High Protein Meal Plan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Nutrition Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(totalCalories)}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(totalProtein)}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{Math.round(totalCarbs)}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{Math.round(totalFat)}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>

          {totalCalories > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
              <div>
                <span className="font-medium">Protein:</span> {Math.round((totalProtein * 4 / totalCalories) * 100 || 0)}%
              </div>
              <div>
                <span className="font-medium">Carbs:</span> {Math.round((totalCarbs * 4 / totalCalories) * 100 || 0)}%
              </div>
              <div>
                <span className="font-medium">Fat:</span> {Math.round((totalFat * 9 / totalCalories) * 100 || 0)}%
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Meal Groups with Created Meals */}
        <div className="space-y-6">
          {meals.map((mealGroup) => {
            const isActivePeriod = activeMealId === mealGroup.id
            const mealGroupTotals = getCreatedMealTotals(
              mealGroup.meals.flatMap(meal => meal.foods)
            )
            
            return (
              <div 
                key={mealGroup.id} 
                className={`bg-white rounded-lg shadow transition-all ${
                  isActivePeriod 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Meal Period Header */}
                <div 
                  className="p-6 border-b border-gray-200 cursor-pointer"
                  onClick={() => {
                    setActiveMealId(mealGroup.id)
                    setActiveCreatedMealId(null)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {isActivePeriod && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">{mealGroup.name}</h3>
                      <span className="ml-4 text-sm text-gray-600">
                        {mealGroup.meals.length} meals • {mealGroupTotals.calories} calories
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>P: {mealGroupTotals.protein}g • C: {mealGroupTotals.carbs}g • F: {mealGroupTotals.fat}g</div>
                      </div>
                      
                      {isActivePeriod && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowCreateMealModal(true)
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create Meal
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Created Meals */}
                <div className="p-6 space-y-4">
                  {mealGroup.meals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <p>No meals created for {mealGroup.name.toLowerCase()} yet</p>
                      <p className="text-sm mt-1">Click "Create Meal" to add structured meals</p>
                    </div>
                  ) : (
                    mealGroup.meals.map((createdMeal) => {
                      const isActiveMeal = activeCreatedMealId === createdMeal.id
                      const createdMealTotals = getCreatedMealTotals(createdMeal.foods)
                      
                      return (
                        <div 
                          key={createdMeal.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isActiveMeal 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setActiveMealId(mealGroup.id)
                            setActiveCreatedMealId(createdMeal.id)
                          }}
                        >
                          {/* Created Meal Header */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              {isActiveMeal && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              )}
                              
                              {createdMeal.isCustomMeal ? (
                                <input
                                  type="text"
                                  value={createdMeal.name}
                                  onChange={(e) => updateCreatedMealName(mealGroup.id, createdMeal.id, e.target.value)}
                                  className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h4 className="font-semibold text-gray-900">{createdMeal.name}</h4>
                              )}
                              
                              <span className="ml-3 text-sm text-gray-600">
                                {createdMeal.foods.length} items • {createdMealTotals.calories} cal
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="text-right text-xs text-gray-600">
                                P: {createdMealTotals.protein}g • C: {createdMealTotals.carbs}g • F: {createdMealTotals.fat}g
                              </div>
                              
                              {createdMeal.isCustomMeal && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeCreatedMeal(mealGroup.id, createdMeal.id)
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                                  title="Remove meal"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Meal Description */}
                          {createdMeal.description && (
                            <p className="text-sm text-gray-600 mb-3 italic">{createdMeal.description}</p>
                          )}

                          {/* Active Meal Instructions */}
                          {isActiveMeal && createdMeal.foods.length === 0 && (
                            <div className="mb-3 p-2 bg-green-100 border border-green-200 rounded text-sm text-green-800">
                              🎯 This meal is selected! Search for foods in the sidebar to add them here.
                            </div>
                          )}

                          {/* Foods in Created Meal */}
                          {createdMeal.foods.length > 0 && (
                            <div className="space-y-2">
                              {createdMeal.foods.map((food) => (
                                <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-900">{food.name}</span>
                                    {food.brand && (
                                      <span className="text-xs text-blue-600 ml-2">({food.brand})</span>
                                    )}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center space-x-2 mr-3">
                                    <input
                                      type="number"
                                      min="1"
                                      max="1000"
                                      value={food.unitType === 'grams' ? food.quantityGrams : food.quantityGrams / 100}
                                      onChange={(e) => updateFoodQuantity(mealGroup.id, createdMeal.id, food.id, parseFloat(e.target.value) || 0, food.unitType)}
                                      className="w-12 px-1 py-1 text-xs border border-gray-300 rounded text-center text-gray-900 bg-white focus:ring-1 focus:ring-blue-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <select
                                      value={food.unitType}
                                      onChange={(e) => updateFoodQuantity(mealGroup.id, createdMeal.id, food.id, food.quantityGrams, e.target.value)}
                                      className="text-xs border border-gray-300 rounded px-1 py-1 text-gray-900 bg-white focus:ring-1 focus:ring-blue-500"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <option value="grams">g</option>
                                      <option value="servings">servings</option>
                                      <option value="cups">cups</option>
                                      <option value="pieces">pieces</option>
                                    </select>
                                  </div>

                                  {/* Nutrition & Remove */}
                                  <div className="flex items-center space-x-2">
                                    <div className="text-right text-xs text-gray-600">
                                      <div>{Math.round(food.calories)} cal</div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        removeFoodItem(mealGroup.id, createdMeal.id, food.id)
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors"
                                      title="Remove food"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Meal Modal */}
      {showCreateMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Meal for {meals.find(m => m.id === activeMealId)?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  placeholder="e.g., Egg Toast with Bacon, Greek Yogurt Bowl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newMealDescription}
                  onChange={(e) => setNewMealDescription(e.target.value)}
                  placeholder="e.g., High protein breakfast with healthy fats"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateMealModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCustomMeal}
                disabled={!newMealName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface USDANutrient {
  nutrientId: number
  value: number
}

interface USDAFood {
  fdcId: number
  description: string
  foodNutrients: USDANutrient[]
  brandOwner?: string
}

// Helper function to extract USDA nutrient values
function getNutrientValue(nutrients: USDANutrient[], nutrientId: number): number {
  const nutrient = nutrients.find(n => n.nutrientId === nutrientId)
  return nutrient?.value || 0
}

// Enhanced search function for AFCD with better matching
async function searchAFCDDatabase(query: string) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
  
  // Multiple search strategies for better results
  const searchStrategies = [
    // Exact phrase match (highest priority)
    {
      where: {
        foodName: {
          contains: query,
          mode: 'insensitive' as const
        }
      },
      priority: 10
    },
    // Individual word matches
    ...searchTerms.map(term => ({
      where: {
        OR: [
          { foodName: { contains: term, mode: 'insensitive' as const } },
          { classification: { contains: term, mode: 'insensitive' as const } }
        ]
      },
      priority: searchTerms.length > 1 ? 5 : 8
    })),
    // Broader classification search
    {
      where: {
        classification: {
          contains: query,
          mode: 'insensitive' as const
        }
      },
      priority: 3
    }
  ]

  let allResults: any[] = []

  // Execute searches and combine results
  for (const strategy of searchStrategies) {
    try {
      const results = await prisma.aFCDFood.findMany({
        where: strategy.where,
        take: 8,
        orderBy: [
          { foodName: 'asc' }
        ]
      })
      
      // Add priority and avoid duplicates
      const prioritizedResults = results.map(food => ({
        ...food,
        searchPriority: strategy.priority
      }))
      
      allResults = [...allResults, ...prioritizedResults]
    } catch (error) {
      console.log(`Search strategy failed for query: ${query}`, error)
    }
  }

  // Remove duplicates and sort by priority
  const uniqueResults = allResults.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.publicFoodKey === current.publicFoodKey)
    if (existingIndex === -1) {
      acc.push(current)
    } else if (current.searchPriority > acc[existingIndex].searchPriority) {
      acc[existingIndex] = current
    }
    return acc
  }, [])

  return uniqueResults
    .sort((a, b) => b.searchPriority - a.searchPriority)
    .slice(0, 12)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.userType !== 'pt') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Enhanced AFCD search for:', query)

    // Use enhanced search function
    const afcdResults = await searchAFCDDatabase(query)

    console.log(`📊 AFCD Search Results: ${afcdResults.length} foods found`)

    // Transform AFCD results to standard format with enhanced data
    const transformedAFCDResults = afcdResults.map(food => {
      // Convert kJ to calories for consistency
      const calories = Math.round(food.energyKJ * 0.239)
      
      return {
        id: `afcd-${food.id}`,
        name: food.foodName,
        calories: calories,
        protein: Math.round(food.protein * 10) / 10,
        carbs: Math.round(food.carbohydrate * 10) / 10,
        fat: Math.round(food.fat * 10) / 10,
        fiber: food.fiber ? Math.round(food.fiber * 10) / 10 : 0,
        servingSize: '100g',
        source: 'AFCD',
        brand: null,
        country: 'Australia',
        classification: food.classification,
        // Add additional Australian-specific data
        sodium: food.sodium ? Math.round(food.sodium * 10) / 10 : 0,
        calcium: food.calcium ? Math.round(food.calcium * 10) / 10 : 0,
        iron: food.iron ? Math.round(food.iron * 10) / 10 : 0,
        vitaminC: food.vitaminC ? Math.round(food.vitaminC * 10) / 10 : 0
      }
    })

    let allResults = transformedAFCDResults

    // 2. If AFCD results are limited, supplement with USDA
    if (afcdResults.length < 8 && process.env.USDA_API_KEY) {
      try {
        console.log('🌐 Supplementing with USDA results...')
        
        const usdaResponse = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=6&dataType=Foundation,SR%20Legacy`
        )

        if (usdaResponse.ok) {
          const usdaData = await usdaResponse.json()
          
          const transformedUSDAResults = (usdaData.foods || [])
            .map((food: USDAFood) => ({
              id: `usda-${food.fdcId}`,
              name: food.description,
              calories: Math.round(getNutrientValue(food.foodNutrients, 1008)),
              protein: Math.round(getNutrientValue(food.foodNutrients, 1003) * 10) / 10,
              carbs: Math.round(getNutrientValue(food.foodNutrients, 1005) * 10) / 10,
              fat: Math.round(getNutrientValue(food.foodNutrients, 1004) * 10) / 10,
              fiber: Math.round(getNutrientValue(food.foodNutrients, 1079) * 10) / 10,
              servingSize: '100g',
              source: 'USDA',
              brand: food.brandOwner || null,
              country: 'International',
              // Add USDA nutrient data
              sodium: Math.round(getNutrientValue(food.foodNutrients, 1093) * 10) / 10,
              calcium: Math.round(getNutrientValue(food.foodNutrients, 1087) * 10) / 10,
              iron: Math.round(getNutrientValue(food.foodNutrients, 1089) * 10) / 10,
              vitaminC: Math.round(getNutrientValue(food.foodNutrients, 1162) * 10) / 10
            }))
            .filter((food: { calories: number }) => food.calories > 0)
            .slice(0, 5) // Limit USDA supplements

          allResults = [...transformedAFCDResults, ...transformedUSDAResults]
        }
      } catch (usdaError) {
        console.log('⚠️ USDA supplement failed, using AFCD only')
      }
    }

    console.log(`📊 Total Results: ${allResults.length} foods (${transformedAFCDResults.length} AFCD, ${allResults.length - transformedAFCDResults.length} USDA)`)

    return NextResponse.json({ 
      results: allResults.slice(0, 15),
      query: query,
      sources: {
        afcd: transformedAFCDResults.length,
        usda: allResults.length - transformedAFCDResults.length,
        primary: 'AFCD (Australia)',
        searchStrategies: 'Enhanced multi-term matching'
      },
      // Add debug information
      debug: {
        originalQuery: query,
        searchTermsUsed: query.toLowerCase().split(' ').filter(term => term.length > 2),
        afcdResultsFound: afcdResults.length
      }
    })

  } catch (error) {
    console.error('💥 Enhanced food search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

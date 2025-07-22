import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importAFCDData() {
  try {
    console.log('📊 Starting AFCD data import...');
    
    // Load the Excel file
    const workbook = xlsx.readFile('./data/Release-2-Nutrient-file.xlsx');
    const sheetName = 'All solids & liquids per 100g';
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log(`📈 Found ${jsonData.length} food items to process`);
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const row of jsonData) {
      try {
        // Skip rows without essential data
        if (!row['Public Food Key'] || !row['Food Name'] || !row['Energy with dietary fibre, equated \n(kJ)']) {
          skippedCount++;
          continue;
        }
        
        // Convert kJ to calories (1 kJ = 0.239 calories)
        const energyKJ = parseFloat(row['Energy with dietary fibre, equated \n(kJ)']) || 0;
        const calories = Math.round(energyKJ * 0.239);
        
        // Skip foods with no energy data
        if (calories <= 0) {
          skippedCount++;
          continue;
        }
        
        const foodData = {
          publicFoodKey: row['Public Food Key'].toString(),
          classification: row['Classification']?.toString() || null,
          foodName: row['Food Name'].toString(),
          energyKJ: energyKJ,
          energyKJNoDibre: parseFloat(row['Energy, without dietary fibre, equated \n(kJ)']) || 0,
          moisture: parseFloat(row['Moisture (water) \n(g)']) || 0,
          protein: parseFloat(row['Protein \n(g)']) || 0,
          fat: parseFloat(row['Fat, total \n(g)']) || 0,
          carbohydrate: parseFloat(row['Available carbohydrate, without sugar alcohols \n(g)']) || 0,
          fiber: parseFloat(row['Total dietary fibre \n(g)']) || null,
          ash: parseFloat(row['Ash \n(g)']) || null,
          calcium: parseFloat(row['Calcium (Ca) \n(mg)']) || null,
          iron: parseFloat(row['Iron (Fe) \n(mg)']) || null,
          sodium: parseFloat(row['Sodium (Na) \n(mg)']) || null,
          potassium: parseFloat(row['Potassium (K) \n(mg)']) || null,
          vitaminC: parseFloat(row['Vitamin C \n(mg)']) || null,
          thiamin: parseFloat(row['Thiamin (B1) \n(mg)']) || null,
          riboflavin: parseFloat(row['Riboflavin (B2) \n(mg)']) || null,
          niacin: parseFloat(row['Niacin (B3) \n(mg)']) || null,
        };
        
        // Import to database
        await prisma.aFCDFood.upsert({
          where: { publicFoodKey: foodData.publicFoodKey },
          update: foodData,
          create: foodData,
        });
        
        importedCount++;
        
        // Log progress every 100 items
        if (importedCount % 100 === 0) {
          console.log(`✅ Imported ${importedCount} foods...`);
        }
        
      } catch (error) {
        console.error(`❌ Error importing food ${row['Food Name']}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log(`🎉 Import complete! Imported: ${importedCount}, Skipped: ${skippedCount}`);
    
  } catch (error) {
    console.error('💥 Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importAFCDData();

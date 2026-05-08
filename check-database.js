const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MedicineSchema = new mongoose.Schema({
  name: String,
  brandName: String,
  price: Number,
  quantity: Number,
  pharmacyId: mongoose.Schema.Types.ObjectId,
});

const PharmacySchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
});

const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', PharmacySchema);

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    const medicineCount = await Medicine.countDocuments();
    const pharmacyCount = await Pharmacy.countDocuments();

    console.log('📊 Database Status:');
    console.log(`   Medicines: ${medicineCount}`);
    console.log(`   Pharmacies: ${pharmacyCount}\n`);

    if (medicineCount === 0 || pharmacyCount === 0) {
      console.log('⚠️  Database is empty! You need to seed it.');
      console.log('   Run: npm run seed:medicines\n');
    } else {
      console.log('✅ Database has data!\n');
      
      // Show sample data
      const sampleMedicine = await Medicine.findOne().populate('pharmacyId');
      if (sampleMedicine) {
        console.log('📦 Sample Medicine:');
        console.log(`   Name: ${sampleMedicine.brandName || sampleMedicine.name}`);
        console.log(`   Price: $${sampleMedicine.price}`);
        console.log(`   Quantity: ${sampleMedicine.quantity}`);
        if (sampleMedicine.pharmacyId) {
          console.log(`   Pharmacy: ${sampleMedicine.pharmacyId.name}`);
        }
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();

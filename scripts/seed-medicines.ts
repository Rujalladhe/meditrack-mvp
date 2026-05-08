import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Medicine Schema
const MedicineSchema = new mongoose.Schema({
  name: String,
  brandName: String,
  genericName: String,
  category: String,
  price: Number,
  quantity: Number,
  expiryDate: Date,
  gender: String,
  ageGroup: String,
  discount: Number,
  pharmacyId: mongoose.Schema.Types.ObjectId,
  symptoms: [String],
  dosage: String,
  sideEffects: [String],
  precautions: [String],
  whenToUse: String,
  whenNotToUse: String,
  timingInstructions: String,
  createdAt: Date,
});

// Pharmacy Schema
const PharmacySchema = new mongoose.Schema({
  name: String,
  ownerId: mongoose.Schema.Types.ObjectId,
  address: String,
  latitude: Number,
  longitude: Number,
  contactNumber: String,
  createdAt: Date,
});

const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', PharmacySchema);
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}));

const medicinesData = [
  // Pain Relief & Fever
  {
    name: 'Paracetamol',
    brandName: 'Tylenol',
    genericName: 'Acetaminophen',
    category: 'Pain Relief & Fever',
    price: 8.99,
    quantity: 100,
    gender: 'unisex',
    ageGroup: 'Adults & Children (6+)',
    discount: 10,
    symptoms: ['headache', 'fever', 'body ache', 'toothache', 'muscle pain', 'cold', 'flu'],
    dosage: 'Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day. Children (6-12): 250-500mg every 4-6 hours.',
    sideEffects: ['Rare: skin rash', 'allergic reactions', 'liver damage (with overdose)'],
    precautions: [
      'Do not exceed recommended dose',
      'Avoid alcohol consumption',
      'Consult doctor if you have liver disease',
      'Not for children under 6 without medical advice',
    ],
    whenToUse: 'Use for mild to moderate pain, fever, headaches, muscle aches, arthritis, backache, toothaches, colds, and flu.',
    whenNotToUse: 'Do not use if allergic to paracetamol, have severe liver disease, or are taking other paracetamol-containing products.',
    timingInstructions: 'Can be taken with or without food. Space doses at least 4 hours apart. Do not take for more than 10 days for pain or 3 days for fever without consulting a doctor.',
  },
  {
    name: 'Ibuprofen',
    brandName: 'Advil',
    genericName: 'Ibuprofen',
    category: 'Pain Relief & Anti-inflammatory',
    price: 12.99,
    quantity: 80,
    gender: 'unisex',
    ageGroup: 'Adults & Children (12+)',
    discount: 15,
    symptoms: ['headache', 'fever', 'inflammation', 'arthritis', 'menstrual cramps', 'muscle pain', 'back pain', 'dental pain'],
    dosage: 'Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day (OTC). Children (12+): 200mg every 6-8 hours.',
    sideEffects: ['stomach upset', 'nausea', 'heartburn', 'dizziness', 'rare: stomach bleeding'],
    precautions: [
      'Take with food or milk to reduce stomach upset',
      'Avoid if you have stomach ulcers',
      'Not recommended during pregnancy (especially third trimester)',
      'Consult doctor if you have heart disease or high blood pressure',
    ],
    whenToUse: 'Use for pain, fever, inflammation, arthritis, menstrual cramps, headaches, dental pain, and minor injuries.',
    whenNotToUse: 'Do not use if allergic to NSAIDs, have active stomach ulcers, severe heart failure, or are in late pregnancy.',
    timingInstructions: 'Take with food or milk. Space doses at least 4-6 hours apart. Do not use for more than 10 days for pain or 3 days for fever without medical advice.',
  },
  {
    name: 'Aspirin',
    brandName: 'Bayer Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief & Blood Thinner',
    price: 7.49,
    quantity: 120,
    gender: 'unisex',
    ageGroup: 'Adults (18+)',
    discount: 5,
    symptoms: ['headache', 'fever', 'muscle pain', 'inflammation', 'heart attack prevention', 'stroke prevention'],
    dosage: 'Adults: 325-650mg every 4 hours for pain. Low-dose (81mg) daily for heart protection (only under doctor supervision).',
    sideEffects: ['stomach irritation', 'heartburn', 'nausea', 'increased bleeding risk', 'rare: allergic reactions'],
    precautions: [
      'Take with food to reduce stomach upset',
      'Not for children under 18 (risk of Reye\'s syndrome)',
      'Avoid if you have bleeding disorders',
      'Consult doctor before using for heart protection',
    ],
    whenToUse: 'Use for mild to moderate pain, fever, inflammation. Low-dose aspirin for heart attack/stroke prevention (only as directed by doctor).',
    whenNotToUse: 'Do not use in children under 18, if allergic to aspirin, have bleeding disorders, active ulcers, or severe liver/kidney disease.',
    timingInstructions: 'Take with food or after meals. For pain relief, space doses at least 4 hours apart. For heart protection, take at the same time daily as prescribed.',
  },

  // Cold & Flu
  {
    name: 'Cetirizine',
    brandName: 'Zyrtec',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine',
    price: 14.99,
    quantity: 60,
    gender: 'unisex',
    ageGroup: 'Adults & Children (6+)',
    discount: 10,
    symptoms: ['allergies', 'hay fever', 'runny nose', 'sneezing', 'itchy eyes', 'hives', 'itching'],
    dosage: 'Adults & Children (6+): 10mg once daily. Can be taken in the evening if drowsiness occurs.',
    sideEffects: ['drowsiness', 'dry mouth', 'fatigue', 'headache', 'dizziness'],
    precautions: [
      'May cause drowsiness - avoid driving if affected',
      'Avoid alcohol',
      'Consult doctor if you have kidney disease',
      'Use caution in elderly patients',
    ],
    whenToUse: 'Use for seasonal allergies, hay fever, allergic rhinitis, hives, and itching due to allergic reactions.',
    whenNotToUse: 'Do not use if allergic to cetirizine or hydroxyzine, or have severe kidney disease without medical advice.',
    timingInstructions: 'Take once daily, preferably in the evening. Can be taken with or without food. Effects last 24 hours.',
  },
  {
    name: 'Pseudoephedrine',
    brandName: 'Sudafed',
    genericName: 'Pseudoephedrine HCL',
    category: 'Decongestant',
    price: 11.99,
    quantity: 50,
    gender: 'unisex',
    ageGroup: 'Adults & Children (12+)',
    discount: 0,
    symptoms: ['nasal congestion', 'sinus pressure', 'stuffy nose', 'cold', 'flu', 'allergies'],
    dosage: 'Adults & Children (12+): 60mg every 4-6 hours. Maximum 240mg per day.',
    sideEffects: ['nervousness', 'restlessness', 'insomnia', 'increased heart rate', 'elevated blood pressure'],
    precautions: [
      'Do not use if you have high blood pressure or heart disease',
      'Avoid taking close to bedtime (may cause insomnia)',
      'Not for use with MAO inhibitors',
      'May cause false positive drug tests',
    ],
    whenToUse: 'Use for temporary relief of nasal congestion due to colds, hay fever, or other respiratory allergies.',
    whenNotToUse: 'Do not use if you have severe high blood pressure, severe heart disease, are taking MAO inhibitors, or have narrow-angle glaucoma.',
    timingInstructions: 'Take every 4-6 hours as needed. Avoid taking within 4 hours of bedtime. Do not use for more than 7 days.',
  },
  {
    name: 'Dextromethorphan',
    brandName: 'Robitussin DM',
    genericName: 'Dextromethorphan HBr',
    category: 'Cough Suppressant',
    price: 9.99,
    quantity: 70,
    gender: 'unisex',
    ageGroup: 'Adults & Children (6+)',
    discount: 5,
    symptoms: ['dry cough', 'persistent cough', 'cold', 'flu', 'bronchitis'],
    dosage: 'Adults: 10-20mg every 4 hours or 30mg every 6-8 hours. Maximum 120mg per day. Children (6-12): 5-10mg every 4 hours.',
    sideEffects: ['drowsiness', 'dizziness', 'nausea', 'stomach upset', 'rare: confusion'],
    precautions: [
      'Do not use with MAO inhibitors',
      'Avoid alcohol',
      'May cause drowsiness',
      'Not for chronic cough from smoking or asthma',
    ],
    whenToUse: 'Use for temporary relief of cough due to minor throat and bronchial irritation from colds or inhaled irritants.',
    whenNotToUse: 'Do not use if taking MAO inhibitors, have chronic cough from smoking/asthma/emphysema, or cough with excessive mucus.',
    timingInstructions: 'Take every 4-6 hours as needed. Can be taken with or without food. Do not use for more than 7 days.',
  },

  // Digestive Health
  {
    name: 'Omeprazole',
    brandName: 'Prilosec OTC',
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor',
    price: 18.99,
    quantity: 42,
    gender: 'unisex',
    ageGroup: 'Adults (18+)',
    discount: 20,
    symptoms: ['heartburn', 'acid reflux', 'GERD', 'stomach acid', 'indigestion'],
    dosage: 'Adults: 20mg once daily before breakfast for 14 days. May repeat 14-day course every 4 months.',
    sideEffects: ['headache', 'stomach pain', 'nausea', 'diarrhea', 'gas', 'rare: vitamin B12 deficiency with long-term use'],
    precautions: [
      'Take 30-60 minutes before first meal of the day',
      'Not for immediate relief - takes 1-4 days to work fully',
      'Do not use for more than 14 days without medical advice',
      'May mask symptoms of serious conditions',
    ],
    whenToUse: 'Use for frequent heartburn (2+ days per week), acid reflux, and GERD symptoms.',
    whenNotToUse: 'Do not use if allergic to omeprazole or other PPIs, have trouble swallowing, or have immediate heartburn relief needs.',
    timingInstructions: 'Take once daily, 30-60 minutes before breakfast. Swallow whole, do not crush or chew. Course lasts 14 days.',
  },
  {
    name: 'Loperamide',
    brandName: 'Imodium',
    genericName: 'Loperamide HCL',
    category: 'Anti-diarrheal',
    price: 10.99,
    quantity: 48,
    gender: 'unisex',
    ageGroup: 'Adults & Children (6+)',
    discount: 10,
    symptoms: ['diarrhea', 'loose stools', 'travelers diarrhea', 'upset stomach'],
    dosage: 'Adults: 4mg initially, then 2mg after each loose stool. Maximum 8mg per day (OTC). Children (6-12): consult dosing chart.',
    sideEffects: ['constipation', 'dizziness', 'drowsiness', 'nausea', 'stomach cramps'],
    precautions: [
      'Do not use if you have bloody or black stools',
      'Stop if constipation occurs',
      'Not for use with high fever',
      'Drink plenty of fluids to prevent dehydration',
    ],
    whenToUse: 'Use for relief of diarrhea, including travelers\' diarrhea.',
    whenNotToUse: 'Do not use if you have bloody diarrhea, high fever, or diarrhea caused by antibiotics (C. diff risk).',
    timingInstructions: 'Take after first loose stool, then after each subsequent loose stool. Do not exceed maximum daily dose. Do not use for more than 2 days without medical advice.',
  },
  {
    name: 'Bismuth Subsalicylate',
    brandName: 'Pepto-Bismol',
    genericName: 'Bismuth Subsalicylate',
    category: 'Antacid & Anti-diarrheal',
    price: 8.99,
    quantity: 90,
    gender: 'unisex',
    ageGroup: 'Adults & Children (12+)',
    discount: 5,
    symptoms: ['upset stomach', 'indigestion', 'nausea', 'heartburn', 'diarrhea'],
    dosage: 'Adults: 524mg (2 tablets) every 30-60 minutes as needed. Maximum 8 doses per day.',
    sideEffects: ['black tongue', 'black stools (harmless)', 'constipation', 'rare: ringing in ears'],
    precautions: [
      'Contains salicylate - avoid if allergic to aspirin',
      'Not for children under 12 (Reye\'s syndrome risk)',
      'Black stools are normal and harmless',
      'Stop if ringing in ears occurs',
    ],
    whenToUse: 'Use for upset stomach, indigestion, nausea, heartburn, and diarrhea.',
    whenNotToUse: 'Do not use in children under 12, if allergic to aspirin/salicylates, have bleeding disorders, or are taking blood thinners.',
    timingInstructions: 'Take every 30-60 minutes as needed. Can be taken with or without food. Do not use for more than 2 days.',
  },

  // Allergy & Skin
  {
    name: 'Diphenhydramine',
    brandName: 'Benadryl',
    genericName: 'Diphenhydramine HCL',
    category: 'Antihistamine',
    price: 9.99,
    quantity: 100,
    gender: 'unisex',
    ageGroup: 'Adults & Children (6+)',
    discount: 10,
    symptoms: ['allergies', 'hives', 'itching', 'insomnia', 'motion sickness', 'runny nose', 'sneezing'],
    dosage: 'Adults: 25-50mg every 4-6 hours. Maximum 300mg per day. Children (6-12): 12.5-25mg every 4-6 hours.',
    sideEffects: ['drowsiness', 'dry mouth', 'dizziness', 'blurred vision', 'constipation'],
    precautions: [
      'Causes significant drowsiness - do not drive',
      'Avoid alcohol',
      'Use caution in elderly (increased fall risk)',
      'Not for use with other sedating medications',
    ],
    whenToUse: 'Use for allergic reactions, hives, itching, hay fever, motion sickness, and as a sleep aid.',
    whenNotToUse: 'Do not use if you have glaucoma, enlarged prostate, breathing problems, or are taking MAO inhibitors.',
    timingInstructions: 'Take every 4-6 hours as needed. For sleep, take 30 minutes before bedtime. Avoid activities requiring alertness.',
  },
  {
    name: 'Hydrocortisone Cream',
    brandName: 'Cortizone-10',
    genericName: 'Hydrocortisone 1%',
    category: 'Topical Steroid',
    price: 7.99,
    quantity: 50,
    gender: 'unisex',
    ageGroup: 'Adults & Children (2+)',
    discount: 0,
    symptoms: ['itching', 'rash', 'eczema', 'insect bites', 'poison ivy', 'dermatitis', 'skin irritation'],
    dosage: 'Apply thin layer to affected area 2-4 times daily. Use for up to 7 days unless directed by doctor.',
    sideEffects: ['skin irritation', 'burning', 'dryness', 'rare: skin thinning with prolonged use'],
    precautions: [
      'For external use only',
      'Avoid contact with eyes',
      'Do not use on large areas of body',
      'Do not bandage tightly unless directed',
    ],
    whenToUse: 'Use for temporary relief of itching and rash due to eczema, insect bites, poison ivy/oak, dermatitis, and minor skin irritations.',
    whenNotToUse: 'Do not use on infected skin, open wounds, acne, or in diaper area unless directed by doctor.',
    timingInstructions: 'Apply 2-4 times daily to clean, dry skin. Wash hands after application. Do not use for more than 7 days without medical advice.',
  },

  // Sleep & Anxiety
  {
    name: 'Melatonin',
    brandName: 'Nature Made Melatonin',
    genericName: 'Melatonin',
    category: 'Sleep Aid',
    price: 12.99,
    quantity: 90,
    gender: 'unisex',
    ageGroup: 'Adults (18+)',
    discount: 15,
    symptoms: ['insomnia', 'jet lag', 'sleep problems', 'difficulty falling asleep'],
    dosage: 'Adults: 1-5mg taken 30-60 minutes before bedtime. Start with lowest dose.',
    sideEffects: ['daytime drowsiness', 'dizziness', 'headache', 'nausea', 'vivid dreams'],
    precautions: [
      'May cause drowsiness - do not drive after taking',
      'Not for long-term use without medical advice',
      'May interact with blood thinners and diabetes medications',
      'Avoid alcohol',
    ],
    whenToUse: 'Use for occasional insomnia, jet lag, or to help regulate sleep-wake cycle.',
    whenNotToUse: 'Do not use if pregnant, breastfeeding, have autoimmune disorders, or are taking immunosuppressants.',
    timingInstructions: 'Take 30-60 minutes before desired bedtime. Use lowest effective dose. Avoid bright lights after taking.',
  },

  // Vitamins & Supplements
  {
    name: 'Vitamin C',
    brandName: 'Emergen-C',
    genericName: 'Ascorbic Acid',
    category: 'Vitamin Supplement',
    price: 15.99,
    quantity: 120,
    gender: 'unisex',
    ageGroup: 'Adults & Children (4+)',
    discount: 10,
    symptoms: ['immune support', 'cold prevention', 'vitamin deficiency', 'antioxidant'],
    dosage: 'Adults: 500-1000mg daily. Children (4-12): 250-500mg daily. Can increase during illness.',
    sideEffects: ['stomach upset', 'diarrhea (high doses)', 'nausea', 'kidney stones (very high doses)'],
    precautions: [
      'High doses may cause diarrhea',
      'May interact with blood thinners',
      'Consult doctor if you have kidney disease',
      'Take with food to reduce stomach upset',
    ],
    whenToUse: 'Use for immune support, cold prevention, vitamin C deficiency, and as an antioxidant.',
    whenNotToUse: 'Use caution if you have kidney stones, kidney disease, or are taking blood thinners.',
    timingInstructions: 'Take with food. Can be divided into multiple doses throughout the day for better absorption.',
  },
  {
    name: 'Vitamin D3',
    brandName: 'Nature Made Vitamin D3',
    genericName: 'Cholecalciferol',
    category: 'Vitamin Supplement',
    price: 13.99,
    quantity: 100,
    gender: 'unisex',
    ageGroup: 'All Ages',
    discount: 10,
    symptoms: ['vitamin D deficiency', 'bone health', 'immune support', 'mood support'],
    dosage: 'Adults: 1000-2000 IU daily. Higher doses may be needed for deficiency (consult doctor).',
    sideEffects: ['rare: nausea', 'constipation', 'weakness (with very high doses)'],
    precautions: [
      'Take with fat-containing meal for better absorption',
      'Do not exceed recommended dose without medical advice',
      'May interact with certain medications',
      'Regular blood tests recommended for high-dose supplementation',
    ],
    whenToUse: 'Use for vitamin D deficiency, bone health, immune support, and mood support.',
    whenNotToUse: 'Use caution if you have kidney disease, high calcium levels, or sarcoidosis.',
    timingInstructions: 'Take once daily with a meal containing fat. Morning or afternoon preferred over evening.',
  },
];

async function seedMedicines() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ Connected to MongoDB successfully');

    // Find or create pharmacies
    const pharmaciesData = [
      {
        name: 'HealthPlus Pharmacy',
        address: '123 Main Street, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        contactNumber: '+1-555-0101',
      },
      {
        name: 'CareWell Drugstore',
        address: '456 Oak Avenue, Midtown',
        latitude: 40.7589,
        longitude: -73.9851,
        contactNumber: '+1-555-0102',
      },
      {
        name: 'MediCare Pharmacy',
        address: '789 Pine Road, Uptown',
        latitude: 40.7829,
        longitude: -73.9654,
        contactNumber: '+1-555-0103',
      },
      {
        name: 'QuickMeds Pharmacy',
        address: '321 Elm Street, Eastside',
        latitude: 40.7489,
        longitude: -73.9680,
        contactNumber: '+1-555-0104',
      },
    ];

    // Find a pharmacist user or create a dummy one
    let pharmacistUser = await User.findOne({ role: 'pharmacist' });
    
    if (!pharmacistUser) {
      console.log('No pharmacist found, creating dummy pharmacist...');
      pharmacistUser = await User.create({
        name: 'Demo Pharmacist',
        email: 'pharmacist@demo.com',
        password: 'hashed_password',
        role: 'pharmacist',
      });
    }

    console.log('Creating/updating pharmacies...');
    const pharmacies = [];
    
    for (const pharmData of pharmaciesData) {
      let pharmacy = await Pharmacy.findOne({ name: pharmData.name });
      
      if (!pharmacy) {
        pharmacy = await Pharmacy.create({
          ...pharmData,
          ownerId: pharmacistUser._id,
          createdAt: new Date(),
        });
        console.log(`Created pharmacy: ${pharmacy.name}`);
      } else {
        console.log(`Pharmacy already exists: ${pharmacy.name}`);
      }
      
      pharmacies.push(pharmacy);
    }

    console.log('Seeding medicines...');
    
    // Distribute medicines across pharmacies
    for (let i = 0; i < medicinesData.length; i++) {
      const medData = medicinesData[i];
      const pharmacy = pharmacies[i % pharmacies.length];
      
      // Check if medicine already exists for this pharmacy
      const existingMed = await Medicine.findOne({
        name: medData.name,
        brandName: medData.brandName,
        pharmacyId: pharmacy._id,
      });

      if (!existingMed) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);

        await Medicine.create({
          ...medData,
          pharmacyId: pharmacy._id,
          expiryDate,
          createdAt: new Date(),
        });
        
        console.log(`✓ Created: ${medData.brandName} at ${pharmacy.name}`);
      } else {
        console.log(`- Already exists: ${medData.brandName} at ${pharmacy.name}`);
      }
    }

    // Also add some medicines to multiple pharmacies for variety
    console.log('\nAdding popular medicines to multiple locations...');
    const popularMedicines = medicinesData.slice(0, 5); // First 5 medicines
    
    for (const medData of popularMedicines) {
      for (const pharmacy of pharmacies) {
        const existingMed = await Medicine.findOne({
          name: medData.name,
          brandName: medData.brandName,
          pharmacyId: pharmacy._id,
        });

        if (!existingMed) {
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 2);

          await Medicine.create({
            ...medData,
            pharmacyId: pharmacy._id,
            expiryDate,
            createdAt: new Date(),
            // Vary quantities and prices slightly
            quantity: medData.quantity + Math.floor(Math.random() * 50),
            price: medData.price + (Math.random() * 2 - 1),
          });
          
          console.log(`✓ Added: ${medData.brandName} to ${pharmacy.name}`);
        }
      }
    }

    const totalMedicines = await Medicine.countDocuments();
    const totalPharmacies = await Pharmacy.countDocuments();
    
    console.log('\n=================================');
    console.log('Seeding completed successfully!');
    console.log(`Total Pharmacies: ${totalPharmacies}`);
    console.log(`Total Medicines: ${totalMedicines}`);
    console.log('=================================\n');

    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding medicines:', error);
    process.exit(1);
  }
}

seedMedicines();

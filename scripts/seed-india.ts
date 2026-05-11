import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MedicineSchema = new mongoose.Schema({
  name: String, brandName: String, genericName: String, category: String,
  price: Number, quantity: Number, expiryDate: Date, gender: String,
  ageGroup: String, discount: Number, pharmacyId: mongoose.Schema.Types.ObjectId,
  symptoms: [String], dosage: String, sideEffects: [String],
  precautions: [String], whenToUse: String, whenNotToUse: String,
  timingInstructions: String, createdAt: Date,
});

const PharmacySchema = new mongoose.Schema({
  name: String, ownerId: mongoose.Schema.Types.ObjectId,
  address: String, latitude: Number, longitude: Number,
  contactNumber: String, createdAt: Date,
});

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String });

const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', PharmacySchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Mumbai-area pharmacies with real coordinates
const pharmaciesData = [
  { name: 'Apollo Pharmacy - Andheri West', address: 'Andheri West, Mumbai - 400058', latitude: 19.1136, longitude: 72.8697, contactNumber: '+91-22-26288100' },
  { name: 'MedPlus - Bandra West', address: 'Hill Road, Bandra West, Mumbai - 400050', latitude: 19.0596, longitude: 72.8295, contactNumber: '+91-22-26401234' },
  { name: 'Wellness Forever - Powai', address: 'Hiranandani Gardens, Powai, Mumbai - 400076', latitude: 19.1197, longitude: 72.9098, contactNumber: '+91-22-25703456' },
  { name: 'Sanjivani Medical - Dadar', address: 'Dadar West, Mumbai - 400028', latitude: 19.0178, longitude: 72.8478, contactNumber: '+91-22-24303333' },
  { name: 'HealthMart Pharmacy - Borivali', address: 'Borivali West, Mumbai - 400092', latitude: 19.2307, longitude: 72.8567, contactNumber: '+91-22-28958888' },
  { name: 'Raj Medical - Thane', address: 'Naupada, Thane West - 400602', latitude: 19.1972, longitude: 72.9720, contactNumber: '+91-22-25413200' },
  { name: 'LifeCare Pharmacy - Pune', address: 'FC Road, Shivajinagar, Pune - 411005', latitude: 18.5236, longitude: 73.8478, contactNumber: '+91-20-25536789' },
];

const medicinesData = [
  {
    name: 'Paracetamol', brandName: 'Calpol 500mg', genericName: 'Acetaminophen',
    category: 'Pain Relief & Fever', price: 28, quantity: 200, gender: 'unisex',
    ageGroup: 'Adults & Children (6+)', discount: 10,
    symptoms: ['fever', 'headache', 'body ache', 'toothache', 'cold', 'flu'],
    dosage: 'Adults: 500mg every 4–6 hrs. Max 4g/day. Children: as per weight.',
    sideEffects: ['Rare: skin rash', 'Overdose: liver damage'],
    precautions: ['Do not exceed dose', 'Avoid alcohol', 'Consult if liver disease'],
    whenToUse: 'Mild to moderate pain, fever, headache, flu.',
    whenNotToUse: 'Severe liver disease, allergy to paracetamol.',
    timingInstructions: 'With or without food. At least 4 hrs between doses.',
  },
  {
    name: 'Ibuprofen', brandName: 'Brufen 400mg', genericName: 'Ibuprofen',
    category: 'Pain Relief & Anti-inflammatory', price: 45, quantity: 150, gender: 'unisex',
    ageGroup: 'Adults & Children (12+)', discount: 5,
    symptoms: ['headache', 'fever', 'joint pain', 'muscle pain', 'menstrual cramps', 'dental pain'],
    dosage: 'Adults: 400mg every 6–8 hrs after food. Max 1200mg/day.',
    sideEffects: ['Stomach upset', 'Nausea', 'Heartburn', 'Rare: GI bleed'],
    precautions: ['Take with food', 'Avoid in peptic ulcer', 'Not in 3rd trimester'],
    whenToUse: 'Pain, fever, arthritis, menstrual pain.',
    whenNotToUse: 'Stomach ulcers, severe kidney/heart disease, late pregnancy.',
    timingInstructions: 'Always after meals. Space doses 6–8 hrs.',
  },
  {
    name: 'Metformin', brandName: 'Glycomet 500mg', genericName: 'Metformin HCl',
    category: 'Anti-diabetic', price: 55, quantity: 100, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 15,
    symptoms: ['type 2 diabetes', 'high blood sugar', 'insulin resistance'],
    dosage: 'Initially 500mg twice daily with meals. Doctor adjusts dose.',
    sideEffects: ['Nausea', 'Diarrhoea', 'Stomach upset (usually settles)'],
    precautions: ['Take with food', 'Monitor blood sugar', 'Avoid alcohol', 'Stop before contrast CT scans'],
    whenToUse: 'Type 2 diabetes management, PCOS.',
    whenNotToUse: 'Kidney failure, liver disease, heavy alcohol use.',
    timingInstructions: 'With or after meals twice daily.',
  },
  {
    name: 'Amlodipine', brandName: 'Amlopres 5mg', genericName: 'Amlodipine Besylate',
    category: 'Antihypertensive', price: 72, quantity: 90, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 0,
    symptoms: ['high blood pressure', 'hypertension', 'chest pain', 'angina'],
    dosage: '5mg once daily. May increase to 10mg as directed by doctor.',
    sideEffects: ['Ankle swelling', 'Flushing', 'Headache', 'Dizziness'],
    precautions: ['Do not stop suddenly', 'Monitor BP regularly', 'Rise slowly from sitting'],
    whenToUse: 'Hypertension, stable angina.',
    whenNotToUse: 'Severe low BP, allergy to amlodipine.',
    timingInstructions: 'Once daily at the same time. Can be taken with or without food.',
  },
  {
    name: 'Atorvastatin', brandName: 'Atorva 10mg', genericName: 'Atorvastatin Calcium',
    category: 'Cholesterol-lowering', price: 98, quantity: 80, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 20,
    symptoms: ['high cholesterol', 'high LDL', 'cardiovascular risk'],
    dosage: '10–80mg once daily at night as prescribed.',
    sideEffects: ['Muscle pain', 'Liver enzyme rise', 'Headache', 'Nausea'],
    precautions: ['Avoid grapefruit juice', 'Regular liver tests', 'Report muscle pain immediately'],
    whenToUse: 'High LDL cholesterol, heart disease prevention.',
    whenNotToUse: 'Active liver disease, pregnancy, breastfeeding.',
    timingInstructions: 'Preferably at bedtime. With or without food.',
  },
  {
    name: 'Cetirizine', brandName: 'Zyrtec 10mg', genericName: 'Cetirizine HCl',
    category: 'Antihistamine', price: 38, quantity: 120, gender: 'unisex',
    ageGroup: 'Adults & Children (6+)', discount: 10,
    symptoms: ['allergies', 'hay fever', 'runny nose', 'sneezing', 'itchy eyes', 'hives', 'skin rash'],
    dosage: 'Adults & Children (6+): 10mg once daily.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    precautions: ['May cause drowsiness', 'Avoid driving if affected', 'Avoid alcohol'],
    whenToUse: 'Allergic rhinitis, urticaria, seasonal allergies.',
    whenNotToUse: 'Severe kidney disease without dose adjustment.',
    timingInstructions: 'Once daily, preferably evening. With or without food.',
  },
  {
    name: 'Omeprazole', brandName: 'Omez 20mg', genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor', price: 62, quantity: 60, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 15,
    symptoms: ['acidity', 'heartburn', 'acid reflux', 'GERD', 'stomach ulcer', 'gastritis'],
    dosage: '20mg once daily 30 min before breakfast for 4–8 weeks.',
    sideEffects: ['Headache', 'Nausea', 'Diarrhoea', 'B12 deficiency (long-term)'],
    precautions: ['Take before meals', 'Not for immediate relief', 'Long-term use with doctor supervision'],
    whenToUse: 'Frequent heartburn, GERD, peptic ulcer.',
    whenNotToUse: 'Allergy to PPIs.',
    timingInstructions: '30 mins before first meal. Swallow capsule whole.',
  },
  {
    name: 'Azithromycin', brandName: 'Azithral 500mg', genericName: 'Azithromycin',
    category: 'Antibiotic', price: 135, quantity: 50, gender: 'unisex',
    ageGroup: 'Adults & Children (6+)', discount: 0,
    symptoms: ['throat infection', 'chest infection', 'pneumonia', 'ear infection', 'typhoid', 'sinusitis'],
    dosage: 'Adults: 500mg once daily for 3–5 days (as prescribed).',
    sideEffects: ['Nausea', 'Diarrhoea', 'Stomach pain', 'Rare: irregular heartbeat'],
    precautions: ['Complete the full course', 'Do not skip doses', 'Inform doctor of heart issues'],
    whenToUse: 'Bacterial respiratory, ENT, and skin infections.',
    whenNotToUse: 'Allergy to macrolides, severe liver disease.',
    timingInstructions: 'Can be taken with or without food. Same time each day.',
  },
  {
    name: 'Pantoprazole', brandName: 'Pan 40mg', genericName: 'Pantoprazole Sodium',
    category: 'Proton Pump Inhibitor', price: 52, quantity: 110, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 10,
    symptoms: ['acidity', 'gastric ulcer', 'GERD', 'heartburn', 'Zollinger-Ellison syndrome'],
    dosage: '40mg once daily before breakfast.',
    sideEffects: ['Headache', 'Diarrhoea', 'Flatulence', 'Nausea'],
    precautions: ['Take 30–60 min before meals', 'Consult doctor for long-term use'],
    whenToUse: 'GERD, peptic ulcer, acid hypersecretion.',
    whenNotToUse: 'Allergy to pantoprazole.',
    timingInstructions: 'Once daily, 30 mins before breakfast.',
  },
  {
    name: 'Montelukast', brandName: 'Montair 10mg', genericName: 'Montelukast Sodium',
    category: 'Anti-asthmatic', price: 118, quantity: 70, gender: 'unisex',
    ageGroup: 'Adults & Children (6+)', discount: 5,
    symptoms: ['asthma', 'wheezing', 'allergic rhinitis', 'shortness of breath', 'exercise-induced asthma'],
    dosage: 'Adults: 10mg once daily in the evening.',
    sideEffects: ['Headache', 'Stomach pain', 'Rare: mood changes'],
    precautions: ['Not for acute asthma attacks', 'Report mood changes to doctor'],
    whenToUse: 'Chronic asthma prevention, allergic rhinitis.',
    whenNotToUse: 'Acute bronchospasm.',
    timingInstructions: 'Once daily in the evening, with or without food.',
  },
  {
    name: 'Levothyroxine', brandName: 'Thyronorm 50mcg', genericName: 'Levothyroxine Sodium',
    category: 'Thyroid Hormone', price: 88, quantity: 90, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 0,
    symptoms: ['hypothyroidism', 'fatigue', 'weight gain', 'cold intolerance', 'dry skin', 'thyroid deficiency'],
    dosage: '50–100mcg once daily on empty stomach as prescribed.',
    sideEffects: ['Palpitations (if over-dosed)', 'Tremors', 'Weight loss', 'Insomnia'],
    precautions: ['Take 30 mins before breakfast', 'Separate from calcium/antacids by 4 hrs', 'Regular TSH monitoring'],
    whenToUse: 'Hypothyroidism, thyroid hormone replacement.',
    whenNotToUse: 'Untreated adrenal gland problem, allergy to thyroxine.',
    timingInstructions: 'Fasting, 30–60 mins before breakfast.',
  },
  {
    name: 'Dolo 650', brandName: 'Dolo 650mg', genericName: 'Paracetamol',
    category: 'Pain Relief & Fever', price: 34, quantity: 250, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 0,
    symptoms: ['fever', 'headache', 'body pain', 'COVID-19 fever', 'post-vaccination fever'],
    dosage: 'Adults: 650mg every 4–6 hrs. Max 4 doses/day.',
    sideEffects: ['Rare: liver damage (overdose)', 'Skin rash'],
    precautions: ['Do not exceed 4 doses/day', 'Avoid alcohol', 'Check other medicines for paracetamol content'],
    whenToUse: 'Fever, mild-moderate pain. Commonly used for COVID and post-vaccine fever.',
    whenNotToUse: 'Liver disease, allergy to paracetamol.',
    timingInstructions: 'With or after food. Every 4–6 hrs as needed.',
  },
  {
    name: 'Vitamin D3 + K2', brandName: 'D-Rise 60K', genericName: 'Cholecalciferol + Menaquinone',
    category: 'Vitamin Supplement', price: 145, quantity: 60, gender: 'unisex',
    ageGroup: 'All Ages', discount: 20,
    symptoms: ['vitamin D deficiency', 'bone pain', 'muscle weakness', 'fatigue', 'poor immunity'],
    dosage: '60,000 IU (1 sachet) once weekly for 8 weeks, then monthly.',
    sideEffects: ['Rare: nausea, constipation (at very high doses)'],
    precautions: ['Take with fatty meal for absorption', 'Do not exceed dose', 'Regular blood test'],
    whenToUse: 'Vitamin D deficiency, bone health, immune support.',
    whenNotToUse: 'Hypercalcaemia, kidney stones.',
    timingInstructions: 'Once weekly with a fat-containing meal.',
  },
  {
    name: 'Cefixime', brandName: 'Zifi 200mg', genericName: 'Cefixime',
    category: 'Antibiotic', price: 168, quantity: 40, gender: 'unisex',
    ageGroup: 'Adults & Children (6+)', discount: 0,
    symptoms: ['urinary tract infection', 'throat infection', 'ear infection', 'gonorrhoea', 'typhoid'],
    dosage: 'Adults: 200–400mg daily or in divided doses for 5–14 days.',
    sideEffects: ['Diarrhoea', 'Nausea', 'Stomach pain', 'Rare: allergic reaction'],
    precautions: ['Complete full course', 'Tell doctor about penicillin allergy', 'Increase fluid intake for UTI'],
    whenToUse: 'Bacterial UTI, ENT, and respiratory infections.',
    whenNotToUse: 'Allergy to cephalosporins.',
    timingInstructions: 'With or without food. Same time daily.',
  },
  {
    name: 'Ranitidine', brandName: 'Zinetac 150mg', genericName: 'Ranitidine HCl',
    category: 'H2 Blocker', price: 42, quantity: 100, gender: 'unisex',
    ageGroup: 'Adults & Children (12+)', discount: 10,
    symptoms: ['acidity', 'heartburn', 'gastric ulcer', 'indigestion', 'GERD'],
    dosage: 'Adults: 150mg twice daily or 300mg at night.',
    sideEffects: ['Headache', 'Constipation', 'Dizziness'],
    precautions: ['Do not use long-term without supervision', 'Inform doctor of kidney issues'],
    whenToUse: 'Short-term acidity, gastric ulcer, GERD.',
    whenNotToUse: 'Severe kidney disease.',
    timingInstructions: 'With or without food. Twice daily or at bedtime.',
  },
  {
    name: 'Combiflam', brandName: 'Combiflam Tablet', genericName: 'Ibuprofen + Paracetamol',
    category: 'Pain Relief & Fever', price: 32, quantity: 180, gender: 'unisex',
    ageGroup: 'Adults (18+)', discount: 5,
    symptoms: ['fever', 'muscle pain', 'joint pain', 'headache', 'dental pain', 'post-surgery pain'],
    dosage: '1 tablet every 8 hrs after food. Max 3 tablets/day.',
    sideEffects: ['Stomach irritation', 'Nausea', 'Heartburn'],
    precautions: ['Always take with food', 'Avoid in stomach ulcer', 'Not in pregnancy'],
    whenToUse: 'Moderate pain with fever, arthritis, dental pain.',
    whenNotToUse: 'Peptic ulcer, kidney disease, pregnancy.',
    timingInstructions: 'After food, every 8 hrs.',
  },
];

async function seedIndia() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✓ Connected');

  // Find or create a pharmacist user
  let pharmacist = await User.findOne({ role: 'pharmacist' });
  if (!pharmacist) {
    pharmacist = await User.create({ name: 'Demo Pharmacist', email: 'pharmacist@demo.com', password: 'hashed', role: 'pharmacist' });
    console.log('Created demo pharmacist');
  }

  // Create pharmacies
  const pharmacies: any[] = [];
  for (const pd of pharmaciesData) {
    let ph = await Pharmacy.findOne({ name: pd.name });
    if (!ph) {
      ph = await Pharmacy.create({ ...pd, ownerId: pharmacist._id, createdAt: new Date() });
      console.log(`✓ Created pharmacy: ${ph.name}`);
    } else {
      console.log(`- Exists: ${ph.name}`);
    }
    pharmacies.push(ph);
  }

  // Seed medicines across all pharmacies
  let created = 0;
  for (let i = 0; i < medicinesData.length; i++) {
    const med = medicinesData[i];
    // Each medicine goes to 3 pharmacies for variety
    const targets = [pharmacies[i % pharmacies.length], pharmacies[(i + 1) % pharmacies.length], pharmacies[(i + 2) % pharmacies.length]];
    for (const ph of targets) {
      const exists = await Medicine.findOne({ name: med.name, pharmacyId: ph._id });
      if (!exists) {
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 2);
        await Medicine.create({
          ...med,
          pharmacyId: ph._id,
          expiryDate: expiry,
          quantity: med.quantity + Math.floor(Math.random() * 80),
          price: parseFloat((med.price + (Math.random() * 4 - 2)).toFixed(2)),
          createdAt: new Date(),
        });
        created++;
      }
    }
  }

  const totalMed = await Medicine.countDocuments();
  const totalPh = await Pharmacy.countDocuments();
  console.log(`\n✅ Done! Pharmacies: ${totalPh} | Medicines: ${totalMed} (added ${created} new)\n`);
  await mongoose.connection.close();
}

seedIndia().catch((e) => { console.error(e); process.exit(1); });

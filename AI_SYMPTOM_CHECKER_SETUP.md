# AI Symptom Checker - Setup Guide

## 🎉 What's Been Added

A complete AI-powered Symptom Checker feature that:
- Uses Groq AI (Llama 3.3 70B model) to understand symptoms
- Recommends appropriate over-the-counter medicines
- Shows detailed medicine information (dosage, side effects, precautions, timing)
- Displays nearby pharmacies with stock availability
- Suggests alternative medicines if primary choice is unavailable
- Calculates distances to pharmacies based on user location

## 📁 Files Created/Modified

### New Files:
1. **`app/api/ai-symptom-checker/route.ts`** - AI API endpoint using Groq
2. **`app/symptom-checker/page.tsx`** - Beautiful chat interface for symptom checking
3. **`scripts/seed-medicines.ts`** - Comprehensive medicine database seeder
4. **`.env.local`** - Added GROQ_API_KEY

### Modified Files:
1. **`models/Medicine.ts`** - Added medical information fields:
   - `genericName`, `category`
   - `symptoms[]` - Array of symptoms the medicine treats
   - `dosage` - Detailed dosage instructions
   - `sideEffects[]` - List of side effects
   - `precautions[]` - Important precautions
   - `whenToUse` - When to use the medicine
   - `whenNotToUse` - Contraindications
   - `timingInstructions` - When and how to take it

2. **`app/page.tsx`** - Added AI Symptom Checker links in navigation and hero section

3. **`package.json`** - Added seed:medicines script

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database with Medicine Data
```bash
npm run seed:medicines
```

This will create:
- 4 pharmacies at different locations
- 15+ medicines with complete medical information
- Multiple stock locations for popular medicines

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Access the AI Symptom Checker
Navigate to: `http://localhost:3001/symptom-checker`

Or click "AI Symptom Checker" in the navigation menu on the homepage.

## 💊 Medicine Database

The seed script includes comprehensive data for:

### Pain Relief & Fever:
- Paracetamol (Tylenol)
- Ibuprofen (Advil)
- Aspirin (Bayer)

### Cold & Flu:
- Cetirizine (Zyrtec) - Antihistamine
- Pseudoephedrine (Sudafed) - Decongestant
- Dextromethorphan (Robitussin) - Cough suppressant

### Digestive Health:
- Omeprazole (Prilosec) - Acid reflux
- Loperamide (Imodium) - Anti-diarrheal
- Bismuth Subsalicylate (Pepto-Bismol)

### Allergy & Skin:
- Diphenhydramine (Benadryl)
- Hydrocortisone Cream (Cortizone-10)

### Sleep & Supplements:
- Melatonin
- Vitamin C
- Vitamin D3

Each medicine includes:
- ✅ Symptoms it treats
- ✅ Detailed dosage instructions
- ✅ Side effects
- ✅ Precautions
- ✅ When to use / when NOT to use
- ✅ Timing instructions
- ✅ Price and stock information
- ✅ Pharmacy location

## 🤖 How It Works

1. **User describes symptoms** in natural language
   - Example: "I have a headache and fever"
   - Example: "I can't sleep at night"
   - Example: "My stomach hurts and I have heartburn"

2. **AI analyzes symptoms** using Groq's Llama 3.3 70B model
   - Matches symptoms to medicine database
   - Considers age, gender, and contraindications

3. **AI provides comprehensive response**:
   - Recommended medicine(s)
   - Why it's suitable
   - Complete dosage and timing
   - Precautions and contraindications
   - Side effects to watch for
   - Price information

4. **Shows nearby pharmacies**:
   - Calculates distance from user location
   - Shows which medicines are in stock
   - Provides contact information
   - Sorted by distance (nearest first)

5. **Suggests alternatives**:
   - If medicine is out of stock
   - If user has contraindications
   - Similar medicines with same effects

## 🎨 Features

### Chat Interface:
- Beautiful, modern UI with smooth animations
- Real-time typing indicators
- Message history maintained
- Mobile responsive

### Medicine Cards:
- Brand name and generic name
- Price and stock availability
- Dosage information
- Pharmacy location

### Pharmacy Cards:
- Distance from user
- Full address and contact
- List of available medicines
- Sorted by proximity

### Safety Features:
- Disclaimer about consulting healthcare professionals
- Clear contraindications
- Warnings about serious conditions
- Age and gender considerations

## 🔑 API Key

The Groq API key should be configured in `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
```

**Important:** Never commit your actual API key to Git!

Model: `llama-3.3-70b-versatile`

## 📱 User Experience

### Example Conversation:

**User:** "I have a headache and mild fever"

**AI Response:**
- Recommends Paracetamol (Tylenol) or Ibuprofen (Advil)
- Explains why each is suitable
- Provides dosage: "Adults: 500-1000mg every 4-6 hours"
- Lists precautions: "Do not exceed 4000mg per day"
- Shows side effects: "Rare: skin rash, liver damage with overdose"
- Displays 3 nearby pharmacies with stock
- Mentions price: $8.99
- Reminds to consult doctor if symptoms persist

### Location Features:
- Automatically requests user location
- Shows "Location enabled" indicator
- Calculates distances to all pharmacies
- Prioritizes nearest locations
- Works without location (shows all pharmacies)

## 🛠️ Customization

### Add More Medicines:
Edit `scripts/seed-medicines.ts` and add to the `medicinesData` array:

```typescript
{
  name: 'Generic Name',
  brandName: 'Brand Name',
  genericName: 'Chemical Name',
  category: 'Category',
  price: 10.99,
  quantity: 100,
  gender: 'unisex',
  ageGroup: 'Adults',
  discount: 10,
  symptoms: ['symptom1', 'symptom2'],
  dosage: 'Detailed dosage instructions',
  sideEffects: ['effect1', 'effect2'],
  precautions: ['precaution1', 'precaution2'],
  whenToUse: 'When to use description',
  whenNotToUse: 'Contraindications',
  timingInstructions: 'Timing details',
}
```

### Modify AI Behavior:
Edit the system prompt in `app/api/ai-symptom-checker/route.ts`

### Change UI:
Edit `app/symptom-checker/page.tsx` for styling and layout changes

## 🎯 Testing Examples

Try these queries:
1. "I have a headache and fever"
2. "I can't sleep at night"
3. "My nose is stuffy and I'm sneezing"
4. "I have heartburn after eating"
5. "I have an itchy rash on my arm"
6. "I need something for diarrhea"
7. "What can I take for allergies?"
8. "I have a dry cough"

## 📊 Database Schema

The Medicine model now includes:
```typescript
{
  name: string;
  brandName: string;
  genericName: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate: Date;
  gender: 'male' | 'female' | 'unisex';
  ageGroup: string;
  discount: number;
  pharmacyId: ObjectId;
  symptoms: string[];
  dosage: string;
  sideEffects: string[];
  precautions: string[];
  whenToUse: string;
  whenNotToUse: string;
  timingInstructions: string;
  createdAt: Date;
}
```

## 🚨 Important Notes

1. **Medical Disclaimer**: This is for informational purposes only. Always includes disclaimer to consult healthcare professionals.

2. **OTC Only**: Only recommends over-the-counter medicines, not prescription drugs.

3. **Location Privacy**: Location access is optional. App works without it but won't show distances.

4. **API Limits**: Groq has rate limits. For production, implement rate limiting and error handling.

5. **Data Accuracy**: Medicine information should be verified by medical professionals before production use.

## 🎉 You're All Set!

The AI Symptom Checker is now fully integrated into your MediTrack application. Users can describe their symptoms in natural language and get intelligent medicine recommendations with nearby pharmacy locations!

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
// Import Pharmacy BEFORE Medicine to ensure it's registered first
import Pharmacy from '@/models/Pharmacy';
import User from '@/models/User';
import Medicine from '@/models/Medicine';
import { calculateDistance } from '@/lib/distance';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Force model registration (Next.js API route fix)
    const PharmacyModel = mongoose.models.Pharmacy || Pharmacy;
    const MedicineModel = mongoose.models.Medicine || Medicine;

    const body = await request.json();
    const { message, conversationHistory, userLocation } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch all medicines with pharmacy details
    const medicines = await MedicineModel.find({ quantity: { $gt: 0 } })
      .populate('pharmacyId')
      .lean();

    // Create a simplified medicine database context for AI (to reduce token usage)
    const medicineContext = medicines.map((med: any) => ({
      name: med.name,
      brand: med.brandName,
      symptoms: med.symptoms?.slice(0, 5) || [], // Limit symptoms to 5
      dosage: med.dosage?.substring(0, 150) || '', // Truncate long dosage
      price: med.price,
      pharmacy: med.pharmacyId?.name || 'Unknown',
    }));

    // System prompt for the AI (simplified to reduce tokens)
    const systemPrompt = `You are a medical assistant for OTC medicine recommendations.

GUIDELINES:
- Recommend medicines from the database below
- Provide dosage, timing, precautions, and side effects
- Mention nearby pharmacies
- Suggest alternatives if needed
- Remind users to consult a doctor for serious conditions

AVAILABLE MEDICINES:
${JSON.stringify(medicineContext, null, 2)}

Provide clear, helpful responses with:
- Recommended medicine(s) and why
- Dosage and timing
- Important precautions
- Price and pharmacy location
- Alternatives if needed

Always remind users to consult a healthcare professional if symptoms persist.`;

    // Build conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message },
    ];

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024, // Reduced from 2048 to save tokens
      top_p: 1,
      stream: false,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    // Extract medicine names mentioned in the response to provide structured data
    const mentionedMedicines = medicines.filter((med: any) => 
      aiResponse.toLowerCase().includes(med.name.toLowerCase()) ||
      aiResponse.toLowerCase().includes(med.brandName.toLowerCase())
    );

    // Return full medicine details (not the truncated version)
    const fullMedicineDetails = mentionedMedicines.map((med: any) => ({
      id: med._id,
      name: med.name,
      brandName: med.brandName,
      genericName: med.genericName,
      price: med.price,
      quantity: med.quantity,
      dosage: med.dosage,
      sideEffects: med.sideEffects,
      precautions: med.precautions,
      whenToUse: med.whenToUse,
      whenNotToUse: med.whenNotToUse,
      timingInstructions: med.timingInstructions,
      symptoms: med.symptoms,
      pharmacy: {
        name: med.pharmacyId?.name,
        address: med.pharmacyId?.address,
        contact: med.pharmacyId?.contactNumber,
      },
    }));

    // Calculate distances if user location is provided
    let pharmaciesWithDistance: any[] = [];
    if (userLocation && fullMedicineDetails.length > 0) {
      const pharmacyMap = new Map();
      
      mentionedMedicines.forEach((med: any) => {
        const pharmacy = med.pharmacyId;
        if (pharmacy && !pharmacyMap.has(pharmacy._id.toString())) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pharmacy.latitude,
            pharmacy.longitude
          );
          
          pharmacyMap.set(pharmacy._id.toString(), {
            id: pharmacy._id,
            name: pharmacy.name,
            address: pharmacy.address,
            contact: pharmacy.contactNumber,
            latitude: pharmacy.latitude,
            longitude: pharmacy.longitude,
            distance: distance,
            medicines: [],
          });
        }
        
        if (pharmacy) {
          const pharmacyData = pharmacyMap.get(pharmacy._id.toString());
          pharmacyData.medicines.push({
            name: med.name,
            brandName: med.brandName,
            price: med.price,
            quantity: med.quantity,
          });
        }
      });

      pharmaciesWithDistance = Array.from(pharmacyMap.values())
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Top 5 nearest pharmacies
    }

    return NextResponse.json({
      response: aiResponse,
      mentionedMedicines: fullMedicineDetails,
      nearbyPharmacies: pharmaciesWithDistance,
    });

  } catch (error: any) {
    console.error('AI Symptom Checker Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}

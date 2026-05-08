# 🏗️ AI Symptom Checker - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                   /symptom-checker (Next.js)                    │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Chat Input   │  │ Message List │  │ Medicine     │        │
│  │ Component    │  │ Component    │  │ Cards        │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Pharmacy     │  │ Location     │  │ Loading      │        │
│  │ Cards        │  │ Detector     │  │ States       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│              /api/ai-symptom-checker (Route Handler)            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Receive user message & conversation history          │  │
│  │ 2. Fetch medicines from MongoDB                         │  │
│  │ 3. Build AI context with medicine database              │  │
│  │ 4. Call Groq AI API                                     │  │
│  │ 5. Parse AI response                                    │  │
│  │ 6. Extract mentioned medicines                          │  │
│  │ 7. Calculate pharmacy distances                         │  │
│  │ 8. Return structured response                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   GROQ AI API    │  │   MongoDB Atlas  │  │  Distance Calc   │
│                  │  │                  │  │                  │
│ Llama 3.3 70B    │  │  Medicine DB     │  │  Haversine       │
│ Versatile Model  │  │  Pharmacy DB     │  │  Formula         │
│                  │  │  User DB         │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Data Flow

### 1. User Input Flow
```
User Types Symptom
      │
      ▼
React State Update
      │
      ▼
Form Submit Handler
      │
      ▼
Add User Message to Chat
      │
      ▼
API Call with:
  - message
  - conversationHistory
  - userLocation
```

### 2. API Processing Flow
```
Receive Request
      │
      ▼
Connect to MongoDB
      │
      ▼
Fetch All Medicines (with Pharmacy data)
      │
      ▼
Build Medicine Context Array
      │
      ▼
Create System Prompt with Medicine DB
      │
      ▼
Build Conversation History
      │
      ▼
Call Groq AI API
      │
      ▼
Receive AI Response
      │
      ▼
Extract Mentioned Medicines
      │
      ▼
Calculate Distances (if location provided)
      │
      ▼
Sort Pharmacies by Distance
      │
      ▼
Return Structured Response
```

### 3. Response Display Flow
```
Receive API Response
      │
      ▼
Add AI Message to Chat
      │
      ▼
Render Message Bubble
      │
      ▼
Render Medicine Cards (if any)
      │
      ▼
Render Pharmacy Cards (if any)
      │
      ▼
Scroll to Bottom
      │
      ▼
Ready for Next Input
```

## Database Schema

### Medicine Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Generic name
  brandName: String,         // Brand name
  genericName: String,       // Chemical name
  category: String,          // Medicine category
  price: Number,             // Price in USD
  quantity: Number,          // Stock quantity
  expiryDate: Date,          // Expiry date
  gender: String,            // 'male' | 'female' | 'unisex'
  ageGroup: String,          // Age restrictions
  discount: Number,          // Discount percentage
  pharmacyId: ObjectId,      // Reference to Pharmacy
  
  // Medical Information
  symptoms: [String],        // Array of symptoms
  dosage: String,            // Dosage instructions
  sideEffects: [String],     // Side effects list
  precautions: [String],     // Precautions list
  whenToUse: String,         // Usage guidelines
  whenNotToUse: String,      // Contraindications
  timingInstructions: String,// Timing details
  
  createdAt: Date
}
```

### Pharmacy Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Pharmacy name
  ownerId: ObjectId,         // Reference to User
  address: String,           // Full address
  latitude: Number,          // GPS latitude
  longitude: Number,         // GPS longitude
  contactNumber: String,     // Phone number
  createdAt: Date
}
```

## Component Structure

### Symptom Checker Page (`/app/symptom-checker/page.tsx`)
```
SymptomCheckerPage
│
├── Header Section
│   ├── Title & Icon
│   └── Location Status
│
├── Messages Container
│   ├── Welcome Message
│   ├── User Messages
│   │   └── User Icon + Message Bubble
│   │
│   └── AI Messages
│       ├── Bot Icon + Message Bubble
│       ├── Medicine Cards (optional)
│       │   ├── Brand Name & Generic Name
│       │   ├── Price & Stock
│       │   ├── Dosage Info
│       │   └── Pharmacy Info
│       │
│       └── Pharmacy Cards (optional)
│           ├── Name & Address
│           ├── Distance
│           ├── Contact
│           └── Available Medicines List
│
└── Input Section
    ├── Text Input
    ├── Send Button
    └── Disclaimer
```

## API Endpoint Structure

### POST `/api/ai-symptom-checker`

**Request:**
```typescript
{
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}
```

**Response:**
```typescript
{
  response: string;              // AI-generated text
  mentionedMedicines: Array<{
    id: string;
    name: string;
    brandName: string;
    genericName: string;
    price: number;
    quantity: number;
    dosage: string;
    symptoms: string[];
    pharmacy: {
      name: string;
      address: string;
      contact: string;
    };
  }>;
  nearbyPharmacies: Array<{
    id: string;
    name: string;
    address: string;
    contact: string;
    latitude: number;
    longitude: number;
    distance: number;          // in kilometers
    medicines: Array<{
      name: string;
      brandName: string;
      price: number;
      quantity: number;
    }>;
  }>;
}
```

## AI System Prompt Structure

```
System Prompt
│
├── Role Definition
│   └── "You are a helpful medical assistant..."
│
├── Responsibilities
│   ├── Listen to symptoms
│   ├── Recommend OTC medicines
│   ├── Provide detailed information
│   ├── Suggest nearby pharmacies
│   └── Suggest alternatives
│
├── Guidelines
│   ├── Only OTC medicines
│   ├── Be empathetic
│   ├── Mention when to see doctor
│   ├── Provide complete info
│   └── Include pharmacy locations
│
├── Medicine Database (JSON)
│   └── Full medicine catalog with details
│
└── Response Format Instructions
    ├── Recommended medicine(s)
    ├── Why suitable
    ├── Dosage & timing
    ├── Precautions
    ├── Side effects
    ├── Price
    ├── Nearby pharmacies
    ├── Alternatives
    └── Doctor consultation reminder
```

## Technology Stack

```
Frontend:
├── Next.js 16 (React 19)
├── TypeScript
├── Tailwind CSS
├── Framer Motion (animations)
└── Lucide React (icons)

Backend:
├── Next.js API Routes
├── MongoDB (Mongoose)
└── Node.js

AI:
├── Groq SDK
└── Llama 3.3 70B Versatile

Utilities:
├── Haversine Distance Calculation
└── Geolocation API
```

## Security & Privacy

```
Security Measures:
│
├── API Key Protection
│   └── Stored in .env.local (not committed)
│
├── Input Validation
│   ├── Message length limits
│   └── Sanitization
│
├── Rate Limiting (recommended)
│   └── Prevent API abuse
│
├── Location Privacy
│   ├── Optional permission
│   ├── Not stored
│   └── Used only for distance calc
│
└── Medical Disclaimers
    ├── Prominent display
    ├── Every response
    └── Clear limitations
```

## Performance Optimizations

```
Optimizations:
│
├── Database
│   ├── Indexed queries
│   ├── Lean queries (no Mongoose overhead)
│   └── Populate only needed fields
│
├── API
│   ├── Single database query
│   ├── Efficient filtering
│   └── Limit pharmacy results (top 5)
│
├── Frontend
│   ├── React state management
│   ├── Smooth scrolling
│   ├── Loading states
│   └── Error boundaries
│
└── AI
    ├── Optimized prompt
    ├── Temperature: 0.7 (balanced)
    └── Max tokens: 2048
```

## Deployment Considerations

```
Production Checklist:
│
├── Environment Variables
│   ├── GROQ_API_KEY (secure)
│   ├── MONGODB_URI (secure)
│   └── NEXTAUTH_SECRET (secure)
│
├── Database
│   ├── Production MongoDB cluster
│   ├── Backup strategy
│   └── Index optimization
│
├── API
│   ├── Rate limiting
│   ├── Error logging
│   ├── Monitoring
│   └── Caching strategy
│
├── Frontend
│   ├── Build optimization
│   ├── Image optimization
│   └── Code splitting
│
└── Legal
    ├── Medical disclaimers
    ├── Privacy policy
    ├── Terms of service
    └── HIPAA compliance (if applicable)
```

## Scalability Path

```
Future Scaling:
│
├── Horizontal Scaling
│   ├── Load balancer
│   ├── Multiple API instances
│   └── CDN for static assets
│
├── Database Scaling
│   ├── Read replicas
│   ├── Sharding
│   └── Caching layer (Redis)
│
├── AI Optimization
│   ├── Response caching
│   ├── Batch processing
│   └── Model fine-tuning
│
└── Feature Expansion
    ├── User accounts
    ├── Medicine reviews
    ├── Prescription integration
    └── Telemedicine
```

---

This architecture provides a solid foundation for the AI Symptom Checker feature while maintaining scalability and security.

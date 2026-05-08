'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Phone, DollarSign, AlertCircle, Clock, Pill } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  medicines?: any[];
  pharmacies?: any[];
}

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI medical assistant. Please describe your symptoms, and I\'ll recommend appropriate over-the-counter medicines and nearby pharmacies. Remember, for serious conditions, always consult a healthcare professional.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/ai-symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show helpful error message
        let errorMessage = data.error || 'Failed to get response';
        if (data.details) {
          errorMessage += `\n\n${data.details}`;
        }
        if (data.hint) {
          errorMessage += `\n\n💡 ${data.hint}`;
        }
        throw new Error(errorMessage);
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          medicines: data.mentionedMedicines,
          pharmacies: data.nearbyPharmacies,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Symptom Checker</h1>
              <p className="text-gray-600">Describe your symptoms and get medicine recommendations</p>
            </div>
          </div>
          {userLocation && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <MapPin className="w-4 h-4" />
              <span>Location enabled - showing nearby pharmacies</span>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="bg-white shadow-lg p-6 h-[600px] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="bg-indigo-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>

                  {/* Medicine Cards */}
                  {message.medicines && message.medicines.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        Recommended Medicines:
                      </h3>
                      {message.medicines.map((med, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-indigo-600">{med.brandName}</h4>
                              <p className="text-sm text-gray-600">{med.name}</p>
                              {med.genericName && (
                                <p className="text-xs text-gray-500">Generic: {med.genericName}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                                ₹{med.price}
                              </div>
                              <p className="text-xs text-gray-500">{med.quantity} in stock</p>
                            </div>
                          </div>
                          
                          {/* Dosage */}
                          {med.dosage && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-start gap-2">
                                <Pill className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-blue-900 text-sm">Dosage:</span>
                                  <p className="text-sm text-blue-800 mt-1">{med.dosage}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Timing Instructions */}
                          {med.timingInstructions && (
                            <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-purple-900 text-sm">Timing:</span>
                                  <p className="text-sm text-purple-800 mt-1">{med.timingInstructions}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* When to Use / Not Use */}
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
                            {med.whenToUse && (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <span className="font-semibold text-green-900 text-xs block mb-1">✓ When to Use:</span>
                                <p className="text-xs text-green-800">{med.whenToUse}</p>
                              </div>
                            )}
                            {med.whenNotToUse && (
                              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                <span className="font-semibold text-red-900 text-xs block mb-1">✗ When NOT to Use:</span>
                                <p className="text-xs text-red-800">{med.whenNotToUse}</p>
                              </div>
                            )}
                          </div>

                          {/* Side Effects Table */}
                          {med.sideEffects && med.sideEffects.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="font-semibold text-gray-900 text-sm">Side Effects:</span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border border-gray-200 rounded">
                                  <tbody>
                                    {med.sideEffects.map((effect: string, i: number) => (
                                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-3 py-2 border-b border-gray-200">
                                          <span className="text-orange-600 mr-2">⚠</span>
                                          {effect}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Precautions Table */}
                          {med.precautions && med.precautions.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="font-semibold text-gray-900 text-sm">Precautions:</span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border border-gray-200 rounded">
                                  <tbody>
                                    {med.precautions.map((precaution: string, i: number) => (
                                      <tr key={i} className={i % 2 === 0 ? 'bg-red-50' : 'bg-white'}>
                                        <td className="px-3 py-2 border-b border-gray-200">
                                          <span className="text-red-600 mr-2">⚠️</span>
                                          {precaution}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {/* Pharmacy Info with Google Maps Link */}
                          {med.pharmacy && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-700 mb-2">
                                <span className="font-semibold">Available at:</span> {med.pharmacy.name}
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-500">{med.pharmacy.address}</p>
                                  {med.pharmacy.contact && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                      <Phone className="w-3 h-3" />
                                      {med.pharmacy.contact}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    const address = encodeURIComponent(med.pharmacy.address || med.pharmacy.name);
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                                  }}
                                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                  <MapPin className="w-3 h-3" />
                                  View on Map
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nearby Pharmacies */}
                  {message.pharmacies && message.pharmacies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Nearby Pharmacies:
                      </h3>
                      {message.pharmacies.map((pharmacy, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-800">{pharmacy.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{pharmacy.address}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                {pharmacy.contact}
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {pharmacy.distance.toFixed(2)} km
                              </div>
                              <button
                                onClick={() => {
                                  const query = encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}`);
                                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <MapPin className="w-3 h-3" />
                                Directions
                              </button>
                            </div>
                          </div>
                          
                          {pharmacy.medicines && pharmacy.medicines.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Available medicines:</p>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-gray-200 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b">Medicine</th>
                                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-b">Price</th>
                                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-b">Stock</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pharmacy.medicines.map((med: any, medIdx: number) => (
                                      <tr key={medIdx} className={medIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-2 text-gray-800 border-b border-gray-200">{med.brandName}</td>
                                        <td className="px-3 py-2 text-right text-green-600 font-semibold border-b border-gray-200">₹{med.price}</td>
                                        <td className="px-3 py-2 text-right text-gray-600 border-b border-gray-200">{med.quantity}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="bg-indigo-600 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="bg-indigo-600 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 border-t">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms... (e.g., 'I have a headache and fever')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </form>
          
          <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> This AI assistant provides general information about over-the-counter medicines. 
              Always consult a healthcare professional for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

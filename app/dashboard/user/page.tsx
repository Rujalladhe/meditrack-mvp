'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Navigation, Phone, ShoppingBag,
    Filter, LogOut, User, Menu, X, Pill, Star,
    ArrowRight, Clock, Percent, ShieldCheck
} from 'lucide-react';

const PharmacyMap = dynamic(() => import('@/components/PharmacyMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50 animate-pulse rounded-3xl" />
});

const FAKE_DATA: SearchResult[] = [
    {
        medicineId: 'fake-1', medicineName: 'Paracetamol 500mg', brandName: 'Crocin', price: 35, quantity: 120, discount: 10,
        expiryDate: '2027-08-15', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-1', name: 'Apollo Pharmacy', address: 'Andheri West, Mumbai', latitude: 19.1364, longitude: 72.8296, contactNumber: '+91 98201 12345' },
        distance: 1.2, finalPrice: 31.5,
    },
    {
        medicineId: 'fake-2', medicineName: 'Azithromycin 250mg', brandName: 'Zithromax', price: 180, quantity: 30, discount: 15,
        expiryDate: '2027-05-20', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-2', name: 'MedPlus', address: 'Bandra East, Mumbai', latitude: 19.0596, longitude: 72.8495, contactNumber: '+91 98201 22345' },
        distance: 2.5, finalPrice: 153,
    },
    {
        medicineId: 'fake-3', medicineName: 'Cetirizine 10mg', brandName: 'Zyrtec', price: 45, quantity: 200, discount: 5,
        expiryDate: '2028-01-10', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-3', name: 'Wellness Forever', address: 'Powai, Mumbai', latitude: 19.1176, longitude: 72.9060, contactNumber: '+91 98201 33345' },
        distance: 3.1, finalPrice: 42.75,
    },
    {
        medicineId: 'fake-4', medicineName: 'Amoxicillin 500mg', brandName: 'Mox', price: 95, quantity: 60, discount: 20,
        expiryDate: '2027-11-30', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-4', name: 'Netmeds Store', address: 'Dadar West, Mumbai', latitude: 19.0178, longitude: 72.8478, contactNumber: '+91 98201 44345' },
        distance: 4.0, finalPrice: 76,
    },
    {
        medicineId: 'fake-5', medicineName: 'Pantoprazole 40mg', brandName: 'Pan-D', price: 120, quantity: 90, discount: 12,
        expiryDate: '2027-09-25', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-1', name: 'Apollo Pharmacy', address: 'Andheri West, Mumbai', latitude: 19.1364, longitude: 72.8296, contactNumber: '+91 98201 12345' },
        distance: 1.2, finalPrice: 105.6,
    },
    {
        medicineId: 'fake-6', medicineName: 'Ibuprofen 400mg', brandName: 'Brufen', price: 28, quantity: 150, discount: 8,
        expiryDate: '2028-03-18', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-5', name: 'HealthKart Pharmacy', address: 'Juhu, Mumbai', latitude: 19.1075, longitude: 72.8263, contactNumber: '+91 98201 55345' },
        distance: 1.8, finalPrice: 25.76,
    },
    {
        medicineId: 'fake-7', medicineName: 'Metformin 500mg', brandName: 'Glycomet', price: 55, quantity: 300, discount: 18,
        expiryDate: '2027-12-01', gender: 'unisex', ageGroup: 'Senior',
        pharmacy: { id: 'ph-6', name: 'PharmEasy Store', address: 'Malad West, Mumbai', latitude: 19.1874, longitude: 72.8484, contactNumber: '+91 98201 66345' },
        distance: 5.3, finalPrice: 45.1,
    },
    {
        medicineId: 'fake-8', medicineName: 'Vitamin D3 60K IU', brandName: 'D-Rise', price: 150, quantity: 45, discount: 25,
        expiryDate: '2028-06-10', gender: 'unisex', ageGroup: 'All Ages',
        pharmacy: { id: 'ph-2', name: 'MedPlus', address: 'Bandra East, Mumbai', latitude: 19.0596, longitude: 72.8495, contactNumber: '+91 98201 22345' },
        distance: 2.5, finalPrice: 112.5,
    },
    {
        medicineId: 'fake-9', medicineName: 'Dolo 650mg', brandName: 'Dolo', price: 30, quantity: 500, discount: 0,
        expiryDate: '2027-07-22', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-3', name: 'Wellness Forever', address: 'Powai, Mumbai', latitude: 19.1176, longitude: 72.9060, contactNumber: '+91 98201 33345' },
        distance: 3.1, finalPrice: 30,
    },
    {
        medicineId: 'fake-10', medicineName: 'ORS Sachets', brandName: 'Electral', price: 22, quantity: 1000, discount: 5,
        expiryDate: '2028-04-15', gender: 'unisex', ageGroup: 'All Ages',
        pharmacy: { id: 'ph-5', name: 'HealthKart Pharmacy', address: 'Juhu, Mumbai', latitude: 19.1075, longitude: 72.8263, contactNumber: '+91 98201 55345' },
        distance: 1.8, finalPrice: 20.9,
    },
    {
        medicineId: 'fake-11', medicineName: 'Montelukast 10mg', brandName: 'Montair', price: 210, quantity: 40, discount: 10,
        expiryDate: '2027-10-05', gender: 'unisex', ageGroup: 'Adult',
        pharmacy: { id: 'ph-4', name: 'Netmeds Store', address: 'Dadar West, Mumbai', latitude: 19.0178, longitude: 72.8478, contactNumber: '+91 98201 44345' },
        distance: 4.0, finalPrice: 189,
    },
    {
        medicineId: 'fake-12', medicineName: 'Calpol Syrup', brandName: 'Calpol', price: 65, quantity: 80, discount: 12,
        expiryDate: '2027-06-28', gender: 'unisex', ageGroup: 'Child',
        pharmacy: { id: 'ph-6', name: 'PharmEasy Store', address: 'Malad West, Mumbai', latitude: 19.1874, longitude: 72.8484, contactNumber: '+91 98201 66345' },
        distance: 5.3, finalPrice: 57.2,
    },
];

interface SearchResult {
    medicineId: string;
    medicineName: string;
    brandName: string;
    price: number;
    quantity: number;
    discount: number;
    expiryDate: string;
    gender: string;
    ageGroup: string;
    pharmacy: {
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contactNumber: string;
    };
    distance: number;
    finalPrice: number;
}

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({ lat: 19.0760, lng: 72.8777 });
    const [sortBy, setSortBy] = useState<'distance' | 'price' | 'discount'>('distance');
    const [selectedPharmacy, setSelectedPharmacy] = useState<SearchResult | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        else if (status === 'authenticated' && session?.user?.role && session.user.role !== 'user') router.push('/dashboard');
    }, [session, status, router]);

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        if (userLocation) performSearch();
    }, [userLocation, sortBy]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                (error) => console.error('Error getting location:', error)
            );
        }
    };

    const performSearch = async (term: string = searchTerm) => {
        if (!userLocation) return;
        setLoading(true);
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medicineName: term, userLatitude: userLocation.lat, userLongitude: userLocation.lng, sortBy }),
            });
            if (response.ok) {
                const data = await response.json();
                // Use fake data as fallback when the database is empty
                if (data.results && data.results.length > 0) {
                    setResults(data.results);
                } else {
                    let fallback = [...FAKE_DATA];
                    if (term && term.trim()) {
                        fallback = fallback.filter(r => r.medicineName.toLowerCase().includes(term.toLowerCase()) || r.brandName.toLowerCase().includes(term.toLowerCase()));
                    }
                    if (sortBy === 'price') fallback.sort((a, b) => a.finalPrice - b.finalPrice);
                    else if (sortBy === 'discount') fallback.sort((a, b) => b.discount - a.discount);
                    else fallback.sort((a, b) => a.distance - b.distance);
                    setResults(fallback);
                }
            } else {
                // API error – still show fake data
                setResults([...FAKE_DATA].sort((a, b) => a.distance - b.distance));
            }
        } catch (error) {
            console.error('Search error:', error);
            // Network error – show fake data so UI is never empty
            setResults([...FAKE_DATA].sort((a, b) => a.distance - b.distance));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch();
    };

    if (status === 'loading') return <LoadingState />;

    return (
        <div className="h-screen bg-[#FDFDFD] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="shrink-0 bg-white border-b border-slate-100 z-50">
                <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity cursor-pointer">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Pill className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">MediTrack</span>
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Find your medication..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-slate-100 rounded-2xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 transition-all outline-none border border-slate-100"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-600 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                                <User className="w-4 h-4" /> {session?.user?.name}
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-red-500 shadow-sm border border-slate-100 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Results Column */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD]">
                    <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
                        {/* Filters & Title */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2 uppercase tracking-widest leading-none">
                                    <MapPin className="w-3 h-3" /> Maharashtra, India
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {searchTerm ? `Results for "${searchTerm}"` : 'Nearby Solutions'}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                {(['distance', 'price', 'discount'] as const).map((id) => (
                                    <button
                                        key={id}
                                        onClick={() => setSortBy(id)}
                                        className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${sortBy === id
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900'
                                            }`}
                                    >
                                        Sort by {id.charAt(0).toUpperCase() + id.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max pb-20">
                            <AnimatePresence mode="popLayout">
                                {results.map((result, idx) => (
                                    <MedicineCard
                                        key={result.medicineId}
                                        result={result}
                                        index={idx}
                                        isSelected={selectedPharmacy?.medicineId === result.medicineId}
                                        onSelect={() => setSelectedPharmacy(result)}
                                    />
                                ))}
                            </AnimatePresence>

                            {!loading && results.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">No stock found in this area</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your search or check alternative locations</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Sidebar - Truly Static */}
                <aside className="hidden lg:block w-[450px] shrink-0 border-l border-slate-100 bg-white relative">
                    <div className="absolute inset-4 rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                        {userLocation && (
                            <PharmacyMap
                                userLocation={userLocation}
                                pharmacies={results.map((r) => ({
                                    id: r.pharmacy.id,
                                    name: r.pharmacy.name,
                                    position: { lat: r.pharmacy.latitude, lng: r.pharmacy.longitude },
                                    address: r.pharmacy.address,
                                    contactNumber: r.pharmacy.contactNumber,
                                }))}
                                selectedPharmacyId={selectedPharmacy?.pharmacy.id}
                            />
                        )}
                        <div className="absolute top-6 left-6 z-20 bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                            <span className="text-xs font-bold text-white/90">Live Coverage Area</span>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

const medicineImages = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1562243061-204550d8a2c9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1729703551869-354dc14a27d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI5fHx8ZW58MHx8fHx8'
];

function MedicineCard({ result, index, isSelected, onSelect }: {
    result: SearchResult; index: number; isSelected: boolean; onSelect: () => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={onSelect}
            className={`premium-card p-6 flex flex-col gap-6 cursor-pointer border-2 transition-all ${isSelected ? 'border-slate-900 ring-4 ring-slate-100' : 'border-transparent'
                }`}
        >
            <div className="relative aspect-square rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden group">
                <img
                    src={medicineImages[index % medicineImages.length]}
                    alt={result.medicineName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {result.discount > 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 z-10">
                        <Percent className="w-3 h-3" /> {result.discount}% Off
                    </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-900 text-xs font-bold rounded-lg flex items-center gap-1 z-10">
                    <Clock className="w-3 h-3 text-blue-500" /> Exp: {new Date(result.expiryDate).getFullYear()}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{result.medicineName}</h3>
                        <p className="text-sm font-medium text-slate-400">{result.brandName}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-black text-slate-900">₹{result.finalPrice}</div>
                        {result.discount > 0 && (
                            <div className="text-xs text-slate-400 line-through">₹{result.price}</div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md flex items-center gap-1">
                        <User className="w-3 h-3" /> {result.ageGroup}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                        {result.gender}
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex flex-col gap-4 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                        <Navigation className="w-5 h-5 text-slate-900" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                            {result.pharmacy.name} <ShieldCheck className="w-3 h-3 text-green-500 shrink-0" />
                        </div>
                        <div className="text-xs font-medium text-slate-400 truncate tracking-tight">
                            {result.distance} km away • {result.pharmacy.address}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${result.pharmacy.latitude},${result.pharmacy.longitude}`, '_blank');
                        }}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        Directions <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${result.pharmacy.contactNumber}`;
                        }}
                        className="aspect-square w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <Phone className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full mb-8"
            />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Syncing Healthcare Inventory</h2>
            <p className="text-slate-500">Just a moment while we find the best prices for you...</p>
        </div>
    );
}

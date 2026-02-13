'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pill, Plus, Store, Phone, MapPin, Trash2, Edit3,
    LogOut, LayoutDashboard, Package, TrendingDown,
    AlertCircle, ChevronRight, X, CheckCircle2, Navigation
} from 'lucide-react';

interface Medicine {
    _id: string;
    name: string;
    brandName: string;
    price: number;
    quantity: number;
    expiryDate: string;
    gender: string;
    ageGroup: string;
    discount: number;
}

interface Pharmacy {
    _id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    contactNumber: string;
}

export default function PharmacistDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPharmacyForm, setShowPharmacyForm] = useState(false);
    const [showMedicineForm, setShowMedicineForm] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

    const [pharmacyForm, setPharmacyForm] = useState({
        name: '', address: '', latitude: '', longitude: '', contactNumber: '',
    });

    const [medicineForm, setMedicineForm] = useState({
        name: '', brandName: '', price: '', quantity: '', expiryDate: '', gender: 'unisex', ageGroup: '', discount: '0',
    });

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        else if (session?.user?.role !== 'pharmacist') router.push('/dashboard');
    }, [session, status, router]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pharmacyRes, medicineRes] = await Promise.all([
                fetch('/api/pharmacy'),
                fetch('/api/medicine'),
            ]);
            if (pharmacyRes.ok) {
                const data = await pharmacyRes.json();
                if (data.pharmacies.length > 0) setPharmacy(data.pharmacies[0]);
            }
            if (medicineRes.ok) {
                const data = await medicineRes.json();
                setMedicines(data.medicines);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMedicineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingMedicine ? 'PUT' : 'POST';
            const body = editingMedicine ? { id: editingMedicine._id, ...medicineForm } : medicineForm;
            const response = await fetch('/api/medicine', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                setShowMedicineForm(false);
                setEditingMedicine(null);
                fetchData();
                resetMedicineForm();
            }
        } catch (error) {
            console.error('Error saving medicine:', error);
        }
    };

    const resetMedicineForm = () => {
        setMedicineForm({ name: '', brandName: '', price: '', quantity: '', expiryDate: '', gender: 'unisex', ageGroup: '', discount: '0' });
    };

    const handlePharmacySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = pharmacy ? 'PUT' : 'POST';
            const body = pharmacy ? { id: pharmacy._id, ...pharmacyForm } : pharmacyForm;
            const response = await fetch('/api/pharmacy', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                setShowPharmacyForm(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error saving pharmacy:', error);
        }
    };

    const handleDeleteMedicine = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            const response = await fetch(`/api/medicine?id=${id}`, { method: 'DELETE' });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    const openMap = () => {
        if (pharmacy) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`, '_blank');
        }
    };

    if (loading || status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Store className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Pharmacy Control</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-400">
                            Logged as <span className="text-slate-900 font-bold not-italic">{session?.user?.name}</span>
                        </div>
                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
                {!pharmacy ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex items-center justify-center">
                        <div className="premium-card p-12 max-w-lg w-full text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                <LayoutDashboard className="w-10 h-10 text-slate-300" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4">Onboard your pharmacy</h1>
                            <p className="text-slate-500 mb-10">To start listing medications and reaching patients, you first need to register your physical store details.</p>
                            <button onClick={() => setShowPharmacyForm(true)} className="btn-primary w-full py-4 rounded-[2rem]">Get Started Now</button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Package, label: 'Active Listings', value: medicines.length, color: 'blue' },
                                { icon: TrendingDown, label: 'Low Stock Alerts', value: medicines.filter(m => m.quantity < 10).length, color: 'orange' },
                                { icon: AlertCircle, label: 'Expiring Soon', value: medicines.filter(m => new Date(m.expiryDate).getTime() < Date.now() + 30 * 24 * 60 * 60 * 1000).length, color: 'red' }
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="premium-card p-6 flex items-center gap-6">
                                    <div className={`w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">{stat.label}</p>
                                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pharmacy Header Card */}
                        <div className="premium-card p-8 bg-slate-900 text-white border-transparent relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2 tracking-tight">{pharmacy.name}</h2>
                                    <div className="flex flex-col gap-2 text-slate-400">
                                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {pharmacy.address}</span>
                                        <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {pharmacy.contactNumber}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setPharmacyForm({
                                                name: pharmacy.name,
                                                address: pharmacy.address,
                                                latitude: pharmacy.latitude.toString(),
                                                longitude: pharmacy.longitude.toString(),
                                                contactNumber: pharmacy.contactNumber,
                                            });
                                            setShowPharmacyForm(true);
                                        }}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-bold backdrop-blur-sm transition-colors flex items-center gap-2"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit Profile
                                    </button>
                                    <button
                                        onClick={openMap}
                                        className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-black transition-transform active:scale-95 flex items-center gap-2"
                                    >
                                        <Navigation className="w-4 h-4" /> View Map
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Medicines List Interface */}
                        <section className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    Inventory Management <span className="px-3 py-1 bg-slate-100 text-slate-400 text-xs rounded-full">LIVE</span>
                                </h3>
                                <button
                                    onClick={() => { setEditingMedicine(null); resetMedicineForm(); setShowMedicineForm(true); }}
                                    className="btn-primary py-3 flex items-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" /> New Listing
                                </button>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {medicines.map((m, idx) => (
                                        <motion.div
                                            key={m._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-slate-900 transition-all"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                                                    <Pill className="text-slate-300 w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{m.name}</h4>
                                                    <p className="text-sm text-slate-400 font-medium">{m.brandName}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1 max-w-2xl px-0 md:px-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Price</p>
                                                    <p className="font-black text-slate-900">₹{m.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Stock</p>
                                                    <p className={`font-black ${m.quantity < 10 ? 'text-red-500' : 'text-slate-900'}`}>{m.quantity} u</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Expiry</p>
                                                    <p className="font-bold text-slate-600 text-sm">{new Date(m.expiryDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Discount</p>
                                                    <p className="font-black text-green-600">{m.discount}%</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => { setEditingMedicine(m); setMedicineForm({ ...m, price: m.price.toString(), quantity: m.quantity.toString(), discount: m.discount.toString(), expiryDate: m.expiryDate.split('T')[0] }); setShowMedicineForm(true); }}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMedicine(m._id)}
                                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {medicines.length === 0 && (
                                    <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 italic text-slate-400">
                                        Your inventory is empty. Start adding products.
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Medicine Modal */}
            <AnimatePresence>
                {showMedicineForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMedicineForm(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-10 sm:p-14">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8">{editingMedicine ? 'Update Medication' : 'Add New Medication'}</h3>
                            <form onSubmit={handleMedicineSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Common Name</label>
                                    <input type="text" required placeholder="Paracetamol" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.name} onChange={e => setMedicineForm({ ...medicineForm, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Brand Name</label>
                                    <input type="text" required placeholder="Crocin" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.brandName} onChange={e => setMedicineForm({ ...medicineForm, brandName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Price (₹)</label>
                                    <input type="number" step="0.01" required placeholder="25.00" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.price} onChange={e => setMedicineForm({ ...medicineForm, price: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Quantity</label>
                                    <input type="number" required placeholder="100" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.quantity} onChange={e => setMedicineForm({ ...medicineForm, quantity: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Expiry Date</label>
                                    <input type="date" required className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.expiryDate} onChange={e => setMedicineForm({ ...medicineForm, expiryDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Discount %</label>
                                    <input type="number" min="0" max="100" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={medicineForm.discount} onChange={e => setMedicineForm({ ...medicineForm, discount: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 pt-6 flex gap-4">
                                    <button type="submit" className="flex-1 btn-primary py-5 rounded-[2rem] text-lg font-black">{editingMedicine ? 'Apply Changes' : 'Confirm & Publish'}</button>
                                    <button type="button" onClick={() => setShowMedicineForm(false)} className="btn-secondary py-5 px-8 rounded-[2rem] border-slate-100"><X className="w-6 h-6" /></button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Pharmacy Modal */}
            <AnimatePresence>
                {showPharmacyForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPharmacyForm(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-10 sm:p-14">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8">{pharmacy ? 'Update Profile' : 'Setup Pharmacy'}</h3>
                            <form onSubmit={handlePharmacySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Pharmacy Name</label>
                                    <input type="text" required placeholder="HealthPlus Medics" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={pharmacyForm.name} onChange={e => setPharmacyForm({ ...pharmacyForm, name: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Store Address</label>
                                    <input type="text" required placeholder="123 Health Ave, Clinic District" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={pharmacyForm.address} onChange={e => setPharmacyForm({ ...pharmacyForm, address: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Latitude</label>
                                    <input type="text" required placeholder="19.0760" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={pharmacyForm.latitude} onChange={e => setPharmacyForm({ ...pharmacyForm, latitude: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Longitude</label>
                                    <input type="text" required placeholder="72.8777" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={pharmacyForm.longitude} onChange={e => setPharmacyForm({ ...pharmacyForm, longitude: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Contact Number</label>
                                    <input type="text" required placeholder="+91 9876543210" className="w-full bg-slate-100 border-none rounded-[1.5rem] py-4 px-6 focus:ring-4 focus:ring-slate-900/5 outline-none font-bold" value={pharmacyForm.contactNumber} onChange={e => setPharmacyForm({ ...pharmacyForm, contactNumber: e.target.value })} />
                                </div>
                                <div className="sm:col-span-2 pt-6 flex gap-4">
                                    <button type="submit" className="flex-1 btn-primary py-5 rounded-[2rem] text-lg font-black">Save Store Profile</button>
                                    <button type="button" onClick={() => setShowPharmacyForm(false)} className="btn-secondary py-5 px-8 rounded-[2rem] border-slate-100"><X className="w-6 h-6" /></button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

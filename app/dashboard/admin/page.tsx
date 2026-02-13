'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Users, Store, LogOut, CheckCircle2,
    XCircle, Filter, Search, Activity, UserPlus,
    ArrowUpRight, Mail, Phone, Calendar, Trash2,
    AlertCircle, ChevronRight, MapPin
} from 'lucide-react';

interface Pharmacist {
    _id: string;
    name: string;
    email: string;
    isApproved: boolean;
    createdAt: string;
}

interface Pharmacy {
    _id: string;
    name: string;
    address: string;
    contactNumber: string;
    ownerId: {
        name: string;
        email: string;
    };
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pharmacists' | 'pharmacies'>('pharmacists');

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        else if (session?.user?.role !== 'admin') router.push('/dashboard');
    }, [session, status, router]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pharmaRes, pharmaciesRes] = await Promise.all([
                fetch('/api/admin/approve'),
                fetch('/api/pharmacy'),
            ]);
            if (pharmaRes.ok) setPharmacists((await pharmaRes.json()).pharmacists);
            if (pharmaciesRes.ok) setPharmacies((await pharmaciesRes.json()).pharmacies);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (userId: string, isApproved: boolean) => {
        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isApproved }),
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeletePharmacy = async (pharmacyId: string) => {
        if (!confirm('Are you sure you want to delete this pharmacy?')) return;
        try {
            const response = await fetch(`/api/pharmacy?id=${pharmacyId}`, { method: 'DELETE' });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error deleting pharmacy:', error);
        }
    };

    if (loading || status === 'loading') return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Platform Admin</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-slate-900 leading-none">{session?.user?.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</span>
                        </div>
                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 max-w-7xl mx-auto w-full px-6 flex flex-col gap-12">
                {/* Platform Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Partners', value: pharmacists.length, icon: Users, trend: 'Global', sub: 'Pharmacists' },
                        { label: 'Active Stores', value: pharmacies.length, icon: Store, trend: 'Verified', sub: 'Pharmacies' },
                        { label: 'Pending Apps', value: pharmacists.filter(p => !p.isApproved).length, icon: UserPlus, trend: 'Review', sub: 'Needs attention' },
                        { label: 'Uptime', value: '99.9%', icon: Activity, trend: 'Optimal', sub: 'Core services' }
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="premium-card p-6 border-transparent bg-white shadow-xl shadow-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-slate-900" />
                                </div>
                                <span className="text-[10px] font-black px-2 py-1 bg-slate-900 text-white rounded-md">
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h4 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h4>
                            <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Management Interface */}
                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="px-10 h-24 border-b border-slate-100 flex items-center justify-between gap-8 bg-slate-50/50">
                        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                            <button onClick={() => setActiveTab('pharmacists')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pharmacists' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
                                Pharmacists ({pharmacists.length})
                            </button>
                            <button onClick={() => setActiveTab('pharmacies')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pharmacies' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
                                Pharmacies ({pharmacies.length})
                            </button>
                        </div>
                        <div className="flex-1 max-w-md relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" placeholder="Global search..." className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-slate-100 transition-all font-medium" />
                        </div>
                    </div>

                    <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="grid grid-cols-1 gap-4"
                            >
                                {activeTab === 'pharmacists' ? (
                                    pharmacists.map((p, idx) => (
                                        <div key={p._id} className="premium-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-slate-900 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                                                    <Store className="w-7 h-7 text-slate-900 opacity-20" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                                        {p.name}
                                                        {p.isApproved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                    </h5>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400"><Mail className="w-3 h-3" /> {p.email}</span>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.isApproved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                                            }`}>{p.isApproved ? 'Approved' : 'Pending'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {!p.isApproved ? (
                                                    <button onClick={() => handleApproval(p._id, true)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all">Approve Access</button>
                                                ) : (
                                                    <button onClick={() => handleApproval(p._id, false)} className="px-6 py-2.5 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all">Revoke Access</button>
                                                )}
                                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-all"><ArrowUpRight className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    pharmacies.map((ph, idx) => (
                                        <div key={ph._id} className="premium-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-slate-900 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                                                    <MapPin className="w-7 h-7 text-slate-900 opacity-20" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-black text-slate-900">{ph.name}</h5>
                                                    <p className="text-xs font-medium text-slate-400 mt-1 max-w-sm">{ph.address}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Owner</p>
                                                    <p className="text-sm font-bold text-slate-900">{ph.ownerId.name}</p>
                                                    <p className="text-[10px] text-slate-400">{ph.ownerId.email}</p>
                                                </div>
                                                <button onClick={() => handleDeletePharmacy(ph._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {(activeTab === 'pharmacists' ? pharmacists.length === 0 : pharmacies.length === 0) && (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <AlertCircle className="w-12 h-12 text-slate-100 mb-4" />
                                        <p className="text-slate-400 font-medium italic">No data found in this category.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
}

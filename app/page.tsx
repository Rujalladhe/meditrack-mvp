'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Zap, ChevronRight, Activity, Pill, User, Smartphone } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      {/* Navigation & Credits */}
      <div className="fixed top-0 w-full z-50">
        <div className="w-full bg-slate-900 text-white/90 py-2 text-center text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase border-b border-white/10">
          made by Hardik Mangesh dandgaval & HAJBE AKASH SHIVANAND
        </div>
        <nav className="w-full glass bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MediTrack</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Sign in</Link>
              <Link href="/register" className="btn-primary py-2.5 px-5 text-sm">Get Started</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-48 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Real-time stock tracking now live
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
                Your health, <br />
                <span className="text-slate-500">mapped in real-time.</span>
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-xl">
                The most advanced platform to track, find, and secure medicines near you. Built for speed, accuracy, and you.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/register" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                  Start searching <ChevronRight className="w-4 h-4" />
                </Link>

              </div>
            </motion.div>


            <div className="flex-[1.2] w-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              >

                <source src="/151adb5a32514414d06a07946846adaa.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Precision crafted features</h2>
            <p className="text-slate-500">Everything you need to manage medications effectively</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: MapPin, title: "Nearby Search", desc: "Precision location tracking within 500m" },
              { icon: Shield, title: "Verified Stock", desc: "Real-time verification from pharmacists" },
              { icon: Zap, title: "Instant Access", desc: "Get directions and call with one tap" },
              { icon: Search, title: "Smart Discovery", desc: "Medicine alternatives" }
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="p-8 rounded-3xl bg-slate-50/50 hover:bg-white transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                  <feature.icon className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="premium-card p-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Users</h3>
              <p className="text-slate-500 mb-10">Search, find and secure your medications without the hassle of visiting multiple stores.</p>
              <Link href="/register" className="btn-secondary w-full py-4 text-sm font-semibold">Join as a User</Link>
            </div>

            <div className="premium-card p-10 flex flex-col items-center text-center group bg-slate-900 text-white border-transparent">
              <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Pill className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pharmacists</h3>
              <p className="text-slate-400 mb-10">Digitize your inventory and reach thousands of patients in your immediate vicinity.</p>
              <Link href="/register" className="btn-primary bg-white text-slate-900 hover:bg-slate-100 w-full py-4 text-sm font-semibold">Join as a Pharmacist</Link>
            </div>

            <div className="premium-card p-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Admins</h3>
              <p className="text-slate-500 mb-10">Manage platforms, approve verification workflows, and maintain data integrity standards.</p>
              <Link href="/login" className="btn-secondary w-full py-4 text-sm font-semibold">Admin Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-slate-900">MediTrack</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 MediTrack platform. Built with passion for better healthcare.</p>
          <div className="flex gap-6">

          </div>
        </div>
      </footer>
    </div>
  );
}

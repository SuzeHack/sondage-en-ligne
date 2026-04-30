import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Profil = () => {
  const { user } = useAuth();

  const stats = [
    { icon: User, label: 'Nom complet', value: user?.nom, color: 'text-violet-600', bg: 'bg-violet-50' },
    { icon: Mail, label: 'Adresse Email', value: user?.email, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Shield, label: 'Type de Compte', value: user?.role, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar />
      
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/3 text-center"
          >
            <div className="glass-card rounded-[3rem] p-10 shadow-pro border-white/40 mb-6">
              <div className="w-24 h-24 bg-violet-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mx-auto mb-6">
                {user?.nom?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{user?.nom}</h2>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
                <ShieldCheck size={12} /> {user?.role}
              </span>
            </div>
            
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
              Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] p-10 shadow-pro border-white/40"
            >
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10">Informations Personnelles</h3>
              <div className="space-y-6">
                {stats.map((s, i) => (
                  <motion.div 
                    key={s.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/50 border border-slate-50 group hover:border-violet-100 transition-colors"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", s.bg, s.color)}>
                      <s.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                      <p className="text-sm font-bold text-slate-900">{s.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-[2.5rem] p-8 shadow-pro border-white/40 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-black text-slate-900">Paramètres Avancés</p>
                <p className="text-xs text-slate-500 font-bold">Gérez votre sécurité et vos préférences</p>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-transform">
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profil;
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { usersAPI } from '../../services/api';
import { Users, Layout, CheckCircle, Activity, ArrowUpRight, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getStatistiques()
      .then(r => setStats(r.data.statistiques))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center"><Loader /></main>
    </div>
  );

  const cards = [
    { label: 'Utilisateurs',   value: stats?.total_utilisateurs,  icon: Users, gradient: 'bg-violet-600', trend: '+5%' },
    { label: 'Projets',       value: stats?.total_sondages,       icon: Layout, gradient: 'bg-emerald-500', trend: '+12%' },
    { label: 'Publiés',        value: stats?.sondages_publies,     icon: CheckCircle, gradient: 'bg-fuchsia-500', trend: '88%' },
    { label: 'Votes', value: stats?.total_participations, icon: Activity, gradient: 'bg-amber-500', trend: '+24%' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto relative z-10">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                <Shield className="text-violet-600" size={32} /> 
                Administration <span className="text-violet-600">Centrale</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
                Pollify Global Infrastructure • Système {stats?.total_utilisateurs > 0 ? 'Opérationnel' : 'Initialisation'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-violet-50 px-4 py-2 rounded-full text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
              <Sparkles size={14} /> Données synchronisées
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {cards.map((card, i) => (
              <motion.div 
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-[2.5rem] p-8 shadow-pro border-white/40 group transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", card.gradient)}>
                    <card.icon size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} /> {card.trend}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{card.value || 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-[3rem] p-10 shadow-pro border-white/40"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <Users className="text-violet-600" size={18} /> Segmentation Utilisateurs
                </h3>
              </div>
              <div className="space-y-6">
                {stats?.utilisateurs_par_role?.map((r, i) => (
                  <div key={r.role} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-slate-600 capitalize">{r.role}</span>
                      <span className="text-lg font-black text-slate-900">{r.total}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.total / stats.total_utilisateurs) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                        className={cn("h-full rounded-full", i === 0 ? 'bg-violet-600' : 'bg-fuchsia-500')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-[3rem] p-10 shadow-pro border-white/40"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <TrendingUp className="text-violet-600" size={18} /> Performance Projets
                </h3>
              </div>
              <div className="space-y-4">
                {stats?.top_5_sondages?.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-50 group hover:border-violet-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-[10px] font-black">
                        #{i + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{s.titre}</span>
                    </div>
                    <span className="bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-violet-500/20">
                      {s.participations} Votes
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
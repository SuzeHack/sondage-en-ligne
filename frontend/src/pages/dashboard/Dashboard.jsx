import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { sondagesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle, Edit3, BarChart3,
  Trash2, Eye, Activity, Layers, ArrowUpRight

} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { jour: 'Lun', réponses: 12 },
  { jour: 'Mar', réponses: 28 },
  { jour: 'Mer', réponses: 18 },
  { jour: 'Jeu', réponses: 45 },
  { jour: 'Ven', réponses: 32 },
  { jour: 'Sam', réponses: 8  },
  { jour: 'Dim', réponses: 15 },
];

const StatCard = ({ label, value, icon: Icon, color, trend, gradient, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="glass-card rounded-[2rem] p-6 shadow-pro border-white/40 flex flex-col justify-between h-full"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", gradient)}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const getBadge = (s) => ({
  publie:    'bg-emerald-50 text-emerald-600 border-emerald-100',
  brouillon: 'bg-amber-50 text-amber-600 border-amber-100',
  ferme:     'bg-rose-50 text-rose-600 border-rose-100',
}[s] || 'bg-violet-50 text-violet-700 border-violet-100');

const Dashboard = () => {
  const [sondages, setSondages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    sondagesAPI.getAll()
      .then(r => setSondages(r.data.sondages))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const del = async (id) => {
    if (!window.confirm('Supprimer ce sondage ?')) return;
    try {
      await sondagesAPI.delete(id);
      setSondages(p => p.filter(s => s.id_sondage !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  const pub = async (id) => {
    try {
      await sondagesAPI.publier(id);
      setSondages(p => p.map(s =>
        s.id_sondage === id ? { ...s, statut: 'publie' } : s
      ));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  const stats = {
    total:     sondages.length,
    publies:   sondages.filter(s => s.statut === 'publie').length,
    brouillon: sondages.filter(s => s.statut === 'brouillon').length,
    fermes:    sondages.filter(s => s.statut === 'ferme').length,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tighter"
            >
              Bonjour, <span className="text-violet-600">{user?.nom?.split(' ')[0]}</span> 👋
            </motion.h1>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60">
              Tableau de Bord • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/sondages/creer" className="btn-primary py-3.5 px-6 group shadow-xl shadow-violet-500/20">
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Nouveau Projet
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-1">
            <StatCard 
              label="Total Sondages" 
              value={stats.total} 
              icon={Layers} 
              trend="+12%" 
              gradient="bg-violet-600" 
              delay={0}
            />
          </div>
          <div className="md:col-span-1">
            <StatCard 
              label="En Ligne" 
              value={stats.publies} 
              icon={Activity} 
              gradient="bg-emerald-500" 
              delay={0.1}
            />
          </div>
          
          {/* Chart Integrated in Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 md:row-span-2 glass-card rounded-[2.5rem] p-8 shadow-pro border-white/40 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Réponses Hebdomadaires</h2>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-violet-500" />
              </div>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="jour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="réponses" 
                    stroke="#8b5cf6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="md:col-span-1">
            <StatCard 
              label="Brouillons" 
              value={stats.brouillon} 
              icon={Edit3} 
              gradient="bg-amber-500" 
              delay={0.3}
            />
          </div>
          <div className="md:col-span-1">
            <StatCard 
              label="Fermés" 
              value={stats.fermes} 
              icon={Trash2} 
              gradient="bg-slate-400" 
              delay={0.4}
            />
          </div>
        </div>

        {/* Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-[2.5rem] shadow-pro border-white/40 overflow-hidden"
        >
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Layers className="text-violet-600" size={24} />
              Mes Projets
            </h2>
            <div className="bg-violet-50 px-4 py-1.5 rounded-full text-violet-600 text-xs font-black uppercase tracking-widest">
              {sondages.length} au total
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader /></div>
          ) : sondages.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold mb-8">Aucun sondage actif</p>
              <Link to="/sondages/creer" className="btn-primary inline-flex">
                Créer mon premier sondage
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    {['Sondage','Statut','Date','Actions'].map(h => (
                      <th key={h} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sondages.map((s, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      key={s.id_sondage} 
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <p className="font-black text-slate-900 text-sm group-hover:text-violet-600 transition-colors">{s.titre}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest", getBadge(s.statut))}>
                          {s.statut}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        {new Date(s.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/sondages/${s.id_sondage}/questions`} className="p-3 bg-white shadow-sm border border-slate-100 text-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all" title="Modifier">
                            <Edit3 size={16} />
                          </Link>
                          <Link to={`/sondages/${s.id_sondage}/resultats`} className="p-3 bg-white shadow-sm border border-slate-100 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all" title="Analyses">
                            <BarChart3 size={16} />
                          </Link>
                          {s.statut === 'brouillon' && (
                            <button onClick={() => pub(s.id_sondage)} className="p-3 bg-white shadow-sm border border-slate-100 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all" title="Publier">
                              <Eye size={16} />
                            </button>
                          )}
                          <button onClick={() => del(s.id_sondage)} className="p-3 bg-white shadow-sm border border-slate-100 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
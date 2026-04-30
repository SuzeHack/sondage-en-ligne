import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { sondagesAPI } from '../../services/api';
import { Trash2, Eye, Layout, User, Calendar, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const AdminSondages = () => {
  const [sondages, setSondages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    sondagesAPI.getAll()
      .then(r => setSondages(r.data.sondages))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce sondage ?')) return;
    try {
      await sondagesAPI.delete(id);
      setSondages(p => p.filter(s => s.id_sondage !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  const getStatusStyles = (statut) => {
    switch(statut) {
      case 'publie': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'brouillon': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'ferme': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto relative z-10">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Gestion des <span className="text-violet-600">Sondages</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
                {sondages.length} Projets Actifs • Surveillance Système
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
              <ShieldCheck className="text-emerald-500" size={14} /> Intégrité des Données
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[3rem] shadow-pro border-white/40 overflow-hidden"
          >
            {loading ? (
              <div className="py-20 flex justify-center"><Loader /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50">
                      {[
                        { label: 'Titre du Projet', icon: Layout },
                        { label: 'Propriétaire', icon: User },
                        { label: 'État', icon: Sparkles },
                        { label: 'Date de Création', icon: Calendar },
                        { label: 'Modération', icon: AlertCircle },
                      ].map(h => (
                        <th key={h.label} className="px-8 py-6">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <h.icon size={12} className="text-violet-500" /> {h.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {sondages.map((s, i) => (
                        <motion.tr 
                          key={s.id_sondage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 group-hover:text-violet-600 transition-colors">{s.titre}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #{s.id_sondage}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                {s.nom_createur?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm font-bold text-slate-500">{s.nom_createur}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              getStatusStyles(s.statut)
                            )}>
                              {s.statut}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-700">
                              {new Date(s.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link to={`/sondages/${s.id_sondage}`} className="p-2.5 text-violet-400 hover:bg-violet-50 rounded-xl transition-all inline-block">
                                  <Eye size={18} />
                                </Link>
                              </motion.div>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => supprimer(s.id_sondage)}
                                className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminSondages;
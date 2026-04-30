import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { usersAPI } from '../../services/api';
import { Trash2, ShieldAlert, UserCog, Mail, Calendar, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const ROLES = ['repondant', 'createur', 'admin'];

const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getAll()
      .then(r => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const changerRole = async (id, actuel) => {
    const r = prompt(`Nouveau rôle (${ROLES.join(', ')}) :`, actuel);
    if (r && ROLES.includes(r)) {
      try {
        await usersAPI.changerRole(id, r);
        setUsers(p => p.map(u =>
          u.id_utilisateur === id ? { ...u, role: r } : u
        ));
      } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await usersAPI.supprimer(id);
      setUsers(p => p.filter(u => u.id_utilisateur !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  const getBadgeStyles = (role) => {
    switch(role) {
      case 'admin': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'createur': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'repondant': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
                Gestion des <span className="text-violet-600">Utilisateurs</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
                {users.length} Comptes Enregistrés • Sécurité Critique
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
              <Sparkles className="text-violet-600" size={14} /> Intelligence de Modération
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
                        { label: 'Identité', icon: Shield },
                        { label: 'Contact', icon: Mail },
                        { label: 'Permissions', icon: UserCog },
                        { label: 'Ancienneté', icon: Calendar },
                        { label: 'Contrôles', icon: ShieldAlert },
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
                      {users.map((u, i) => (
                        <motion.tr 
                          key={u.id_utilisateur}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                                {u.nom?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm font-black text-slate-900">{u.nom}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm font-bold text-slate-500">{u.email}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              getBadgeStyles(u.role)
                            )}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">
                                {new Date(u.date_inscription).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Membre Certifié</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => changerRole(u.id_utilisateur, u.role)}
                                className="p-2.5 text-violet-400 hover:bg-violet-50 rounded-xl transition-all"
                                title="Modifier le rôle"
                              >
                                <UserCog size={18} />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => supprimer(u.id_utilisateur)}
                                className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                title="Révoquer l'accès"
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

export default AdminUsers;

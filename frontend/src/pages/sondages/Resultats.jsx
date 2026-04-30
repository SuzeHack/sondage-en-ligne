import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { participationsAPI } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, PieChart as PieIcon, MessageSquare, Layout } from 'lucide-react';
import { cn } from '../../lib/utils';

const COLORS = ['#7c3aed', '#db2777', '#f43f5e', '#fb923c', '#8b5cf6', '#d946ef'];

const Resultats = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participationsAPI.getResultats(id)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center"><Loader /></main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto relative">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors font-bold text-xs uppercase tracking-widest mb-4"
              >
                <ArrowLeft size={16} /> Retour au Dashboard
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Analyses des <span className="text-violet-600">Résultats</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
                Pollify Intelligence • Données en temps réel
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-6 py-3 rounded-2xl border-white/40 shadow-pro flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                  <Layout size={20} />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">
                    {data?.resultats?.reduce((acc, q) => acc + (q.total_reponses || 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Votes Totaux</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Résultats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data?.resultats?.map((q, i) => (
              <motion.div 
                key={q.id_question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card rounded-[2.5rem] p-10 shadow-pro border-white/40",
                  q.type === 'texte_libre' ? 'md:col-span-2' : ''
                )}
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      {q.type === 'texte_libre' ? <MessageSquare size={24} /> : q.type === 'choix_unique' ? <BarChart3 size={24} /> : <PieIcon size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{q.texte_question}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {q.type.replace('_', ' ')} • {q.total_reponses} réponses
                      </p>
                    </div>
                  </div>
                </div>

                {q.type === 'texte_libre' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {q.donnees?.length === 0 ? (
                      <p className="text-slate-300 font-bold text-center py-10 col-span-full">Aucune réponse pour le moment</p>
                    ) : q.donnees?.map((r, j) => (
                      <div key={j} className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-600 font-bold text-sm leading-relaxed mb-4 italic">"{r.texte_reponse}"</p>
                         <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.nom_repondant || 'Anonyme'}</span>
                          <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest">{new Date(r.date_soumission).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : q.type === 'choix_unique' ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={q.donnees}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="texte_option" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                        />
                        <Bar dataKey="nb_votes" radius={[10, 10, 0, 0]}>
                          {q.donnees?.map((_, idx) => (
                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2 h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={q.donnees}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={90}
                            paddingAngle={5}
                            dataKey="nb_votes"
                            nameKey="texte_option"
                          >
                            {q.donnees?.map((_, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      {q.donnees?.map((o, idx) => {
                        const pct = q.total_reponses > 0 ? Math.round(o.nb_votes / q.total_reponses * 100) : 0;
                        return (
                          <div key={o.id_option} className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest truncate max-w-[150px]">{o.texte_option}</span>
                              <span className="text-xs font-black text-indigo-600">{pct}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resultats;
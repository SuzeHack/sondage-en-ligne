import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Loader from '../../components/common/Loader';
import { sondagesAPI } from '../../services/api';
import { ArrowLeft, Clock, User, HelpCircle, BarChart3, Shield, Zap, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const DetailSondage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [sondage, setSondage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sondagesAPI.getOne(id)
      .then(r => setSondage(r.data.sondage))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]"><Loader /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar />

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-aurora opacity-10 blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header Action */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link to="/sondages" className="group flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à l'exploration
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            
            {/* Hero Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[3.5rem] p-10 md:p-16 shadow-pro border-white/40 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sondage Actif
                  </span>
                  <span className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-violet-100 flex items-center gap-2">
                    <Sparkles size={12} /> Premium
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
                  {sondage?.titre}
                </h1>

                <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
                  {sondage?.description || 'Découvrez ce projet de recherche innovant et partagez votre vision pour nous aider à façonner le futur.'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 pt-12 border-t border-slate-100">
                  {[
                    { icon: User, value: sondage?.nom_createur?.split(' ')[0], label: 'Auteur', color: 'text-violet-600' },
                    { icon: HelpCircle, value: sondage?.questions?.length || 0, label: 'Questions', color: 'text-fuchsia-600' },
                    { icon: Clock, value: `~${sondage?.questions?.length || 1}m`, label: 'Durée', color: 'text-indigo-600' },
                    { icon: Shield, value: 'Privé', label: 'Sécurité', color: 'text-emerald-600' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <div className={cn("flex items-center gap-2 mb-1", stat.color)}>
                        <stat.icon size={16} />
                        <span className="text-lg font-black text-slate-900">{stat.value}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/sondages/${id}/repondre`)}
                  className="btn-primary w-full py-5 text-lg shadow-2xl shadow-violet-500/20 flex items-center justify-center gap-4"
                >
                  Démarrer l'Expérience <ChevronRight size={24} />
                </motion.button>
              </div>
            </motion.div>

            {/* Questions Preview & Trust */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-[2.5rem] p-8 shadow-pro border-white/40"
              >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Layers className="text-violet-600" size={18} /> Aperçu de la Structure
                </h3>
                <div className="space-y-4">
                  {sondage?.questions?.slice(0, 3).map((q, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-slate-50 group hover:border-violet-100 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-slate-600 truncate">{q.texte_question}</p>
                    </div>
                  ))}
                  {sondage?.questions?.length > 3 && (
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
                      + {sondage.questions.length - 3} autres thématiques
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 gap-4"
              >
                {[
                  { icon: Zap, label: 'Réponse Instantanée', desc: 'Vos données sont traitées en temps réel' },
                  { icon: BarChart3, label: 'Analyses Avancées', desc: 'Visualisez les tendances du projet' },
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-[2rem] p-6 shadow-pro border-white/40 flex items-center gap-6">
                    <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">{item.label}</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailSondage;
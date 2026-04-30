import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Loader from '../../components/common/Loader';
import { sondagesAPI } from '../../services/api';
import { Search, Calendar, ArrowRight, BarChart3, Zap, Filter, Sparkles } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const categories = [
  { label: 'Tous', value: 'all' },
  { label: 'Satisfaction', value: 'satisfaction' },
  { label: 'Opinion', value: 'opinion' },
  { label: 'Marché', value: 'marche' },
  { label: 'RH', value: 'rh' },
  { label: 'Éducation', value: 'education' },
];

const ListeSondages = () => {
  const [sondages, setSondages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    sondagesAPI.getAll()
      .then(r => setSondages(r.data.sondages))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sondages.filter(s =>
    s.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Aurora Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-10 blur-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} /> Explorez le Futur
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6"
          >
            Découvrez les <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Sondages</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Participez aux recherches les plus innovantes et partagez votre vision avec le monde entier.
          </motion.p>

          {/* Search Bar - Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition-all duration-500" />
            <div className="relative glass-card rounded-[2rem] p-2 flex items-center shadow-pro border-white/40">
              <div className="pl-6 pr-4 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                <Search size={24} />
              </div>
              <input 
                type="text"
                placeholder="Rechercher une thématique, un projet..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none py-4 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
              <button className="bg-violet-600 text-white p-4 rounded-[1.5rem] shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all">
                <Filter size={24} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Stats */}
      <section className="py-12 border-y border-slate-100 bg-white/50 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                  activeCategory === cat.value
                    ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-8 border-l border-slate-100 pl-8">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none">{sondages.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actifs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none">24k+</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Votes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Survey Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="flex justify-center py-20"><Loader /></div>
            ) : filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[3rem] border border-slate-100"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Aucun résultat</h2>
                <p className="text-slate-500 font-bold">Essayez d'ajuster vos filtres de recherche.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((s, index) => (
                  <motion.div
                    key={s.id_sondage}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link to={`/sondages/${s.id_sondage}`} className="block">
                      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-pro border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2">
                        <div className={cn(
                          "h-48 relative overflow-hidden p-8 flex items-center justify-center",
                          [
                            "bg-gradient-to-br from-indigo-500 to-purple-600",
                            "bg-gradient-to-br from-violet-500 to-fuchsia-600",
                            "bg-gradient-to-br from-blue-500 to-indigo-600",
                            "bg-gradient-to-br from-emerald-500 to-teal-600",
                            "bg-gradient-to-br from-rose-500 to-orange-600",
                          ][index % 5]
                        )}>
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent)]" />
                          <BarChart3 size={64} className="text-white/20 group-hover:scale-110 transition-transform duration-700" />
                          
                          <div className="absolute top-6 left-6">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/20">
                              Nouveau
                            </span>
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black">
                              {s.nom_createur?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.nom_createur}</span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">
                            {s.titre}
                          </h3>
                          
                          <p className="text-slate-500 font-bold text-sm mb-8 line-clamp-2 leading-relaxed">
                            {s.description || 'Découvrez ce nouveau projet passionnant et apportez vos réponses.'}
                          </p>

                          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                              <Calendar size={14} />
                              {new Date(s.date_creation).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                            </div>
                             <div className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                              Participer <ArrowRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto relative rounded-[4rem] overflow-hidden"
        >
           <div className="absolute inset-0 bg-violet-600" />
          <div className="absolute inset-0 bg-aurora opacity-30 blur-3xl" />
          <div className="relative p-12 md:p-24 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-8 max-w-2xl mx-auto">
              Prêt à lancer votre propre enquête ?
            </h2>
            <p className="text-violet-100 font-bold text-lg mb-12 max-w-xl mx-auto">
              Rejoignez des milliers de créateurs et obtenez des réponses pertinentes en temps réel.
            </p>
            <Link to="/register" className="bg-white text-violet-600 px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3">
              Commencer l'Aventure <Zap size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ListeSondages;
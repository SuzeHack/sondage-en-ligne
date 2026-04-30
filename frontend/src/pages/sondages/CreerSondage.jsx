import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { sondagesAPI } from '../../services/api';
import { AlertCircle, ArrowLeft, ArrowRight, Calendar, FileText, Layout, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CreerSondage = () => {
  const [form, setForm] = useState({
    titre: '', description: '', date_fin: ''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await sondagesAPI.create(form);
      navigate(`/sondages/${r.data.sondage.id_sondage}/questions`);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto relative z-10">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors font-bold text-xs uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={16} /> Retour au Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Nouveau <span className="text-violet-600">Sondage</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
              Étape 1 • Configuration de base
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-rose-50 text-rose-600 p-4 rounded-2xl mb-8 text-sm font-bold border border-rose-100"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] p-10 shadow-pro border-white/40 bg-white"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Détails du Projet</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Layout size={14} className="text-violet-600" /> Titre du Sondage *
                </label>
                <input 
                  type="text" required
                  value={form.titre}
                  onChange={e => setForm({ ...form, titre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-300"
                  placeholder="Ex: Satisfaction Client 2024"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={14} className="text-violet-600" /> Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-300 resize-none"
                  placeholder="Expliquez l'objectif de ce sondage à vos participants..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} className="text-violet-600" /> Date d'expiration (Optionnel)
                </label>
                <input 
                  type="datetime-local"
                  value={form.date_fin}
                  onChange={e => setForm({ ...form, date_fin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-violet-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Suivant <ArrowRight size={18} /></>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreerSondage;
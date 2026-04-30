import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/common/Loader';
import { sondagesAPI, questionsAPI } from '../../services/api';
import { Plus, Trash2, CheckCircle, HelpCircle, Layers, Settings, ArrowLeft, Send, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const TYPES = [
  { value: 'choix_unique',   label: 'Choix unique', icon: HelpCircle },
  { value: 'choix_multiple', label: 'Choix multiple', icon: Layers },
  { value: 'texte_libre',    label: 'Texte libre', icon: Send },
];

const defaultForm = {
  texte_question: '', type: 'choix_unique',
  est_obligatoire: true, options: ['', '']
};

const GererQuestions = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [sondage,  setSondage]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(defaultForm);
  const [saving,   setSaving]   = useState(false);

  const reload = useCallback(() =>
    sondagesAPI.getOne(id)
      .then(r => setSondage(r.data.sondage))
      .catch(console.error), [id]);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [id, reload]);

  const addQuestion = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await questionsAPI.create({
        id_sondage:      parseInt(id),
        texte_question:  form.texte_question,
        type:            form.type,
        ordre:           (sondage?.questions?.length || 0) + 1,
        est_obligatoire: form.est_obligatoire,
        options: form.type !== 'texte_libre'
          ? form.options.filter(o => o.trim()) : [],
      });
      await reload();
      setForm(defaultForm);
      setShowForm(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur.');
    } finally {
      setSaving(false);
    }
  };

  const delQuestion = async (idQ) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    try {
      await questionsAPI.delete(idQ);
      setSondage(p => ({ ...p, questions: p.questions.filter(q => q.id_question !== idQ) }));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  const publier = async () => {
    try {
      await sondagesAPI.publier(id);
      navigate('/dashboard');
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center"><Loader /></main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto relative z-10">
        <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors font-bold text-xs uppercase tracking-widest mb-4"
              >
                <ArrowLeft size={16} /> Retour au Dashboard
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Gestion des <span className="text-violet-600">Questions</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-[0.2em] opacity-60">
                {sondage?.titre} • {sondage?.questions?.length || 0} Questions
              </p>
            </div>
            {sondage?.statut === 'brouillon' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={publier}
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 py-3.5 px-8 shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle size={20} /> Publier le Sondage
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Questions list */}
            <div className="space-y-6">
              {sondage?.questions?.map((q, i) => (
                <motion.div 
                  key={q.id_question}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-[2.5rem] p-8 shadow-pro border-white/40 group relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg">
                          {i + 1}
                        </span>
                        <span className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-violet-100">
                          {q.type.replace('_', ' ')}
                        </span>
                        {q.est_obligatoire && (
                          <span className="bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-rose-100">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">
                        {q.texte_question}
                      </h3>
                      {q.options?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {q.options.map((o, idx) => (
                            <div key={o.id_option} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                {idx + 1}
                              </div>
                              <span className="text-sm font-bold text-slate-600">{o.texte_option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {sondage.statut === 'brouillon' && (
                      <button 
                        onClick={() => delQuestion(q.id_question)}
                        className="absolute top-8 right-8 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add question form */}
            {sondage?.statut === 'brouillon' && (
              <div className="mt-8">
                {!showForm ? (
                  <motion.button 
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowForm(true)}
                    className="w-full py-12 border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/30 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                      <Plus size={32} />
                    </div>
                    <span className="font-black text-lg uppercase tracking-widest">Ajouter une Question</span>
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[3rem] p-10 shadow-pro border-white/40 bg-white"
                  >
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                        <Sparkles size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Nouvelle Question</h3>
                    </div>

                    <form onSubmit={addQuestion} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé de la question</label>
                        <input 
                          type="text" required
                          value={form.texte_question}
                          onChange={e => setForm({ ...form, texte_question: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-300"
                          placeholder="Ex: Quel est votre niveau de satisfaction ?"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type de réponse</label>
                          <div className="grid grid-cols-1 gap-2">
                            {TYPES.map(t => (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => setForm({ ...form, type: t.value })}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                                  form.type === t.value ? "border-violet-600 bg-violet-50" : "border-slate-50 bg-slate-50 hover:border-slate-100"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <t.icon size={18} className={form.type === t.value ? "text-violet-600" : "text-slate-400"} />
                                  <span className={cn("text-xs font-bold", form.type === t.value ? "text-violet-900" : "text-slate-600")}>{t.label}</span>
                                </div>
                                {form.type === t.value && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Options de configuration</label>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, est_obligatoire: !form.est_obligatoire })}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                              form.est_obligatoire ? "border-rose-600 bg-rose-50" : "border-slate-50 bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Settings size={18} className={form.est_obligatoire ? "text-rose-500" : "text-slate-400"} />
                              <span className={cn("text-xs font-bold", form.est_obligatoire ? "text-rose-900" : "text-slate-600")}>Réponse Obligatoire</span>
                            </div>
                            <div className={cn("w-10 h-5 rounded-full relative transition-colors", form.est_obligatoire ? "bg-rose-500" : "bg-slate-200")}>
                              <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", form.est_obligatoire ? "left-6" : "left-1")} />
                            </div>
                          </button>
                        </div>
                      </div>

                      {form.type !== 'texte_libre' && (
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Options de réponse</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {form.options.map((opt, i) => (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i} 
                                className="flex gap-2"
                              >
                                <input 
                                  type="text" required
                                  value={opt}
                                  onChange={e => {
                                    const opts = [...form.options];
                                    opts[i] = e.target.value;
                                    setForm({ ...form, options: opts });
                                  }}
                                  className="flex-1 bg-white border border-slate-200 rounded-2xl py-3 px-6 text-sm font-bold text-slate-900 focus:border-violet-500 outline-none transition-all"
                                  placeholder={`Option ${i + 1}`}
                                />
                                {form.options.length > 2 && (
                                  <button 
                                    type="button"
                                    onClick={() => setForm({ ...form, options: form.options.filter((_, j) => j !== i) })}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                             <button 
                              type="button"
                              onClick={() => setForm({ ...form, options: [...form.options, ''] })}
                              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/50 transition-all text-xs font-black uppercase tracking-widest"
                            >
                              <Plus size={16} /> Ajouter une Option
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-6 border-t border-slate-50">
                        <button 
                          type="button"
                          onClick={() => { setShowForm(false); setForm(defaultForm); }}
                          className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                          Annuler
                        </button>
                        <button 
                          type="submit" disabled={saving}
                          className="flex-1 py-4 px-6 rounded-2xl bg-violet-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {saving ? 'Enregistrement...' : 'Valider la Question'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GererQuestions;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sondagesAPI, participationsAPI } from '../../services/api';
import { PageLoader } from '../../components/common/Loader';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Clock, HelpCircle, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const RepondreSondage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [sondage,    setSondage]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [started,    setStarted]    = useState(false);
  const [current,    setCurrent]    = useState(0);
  const [reponses,   setReponses]   = useState({});
  const [nomRepondant, setNom]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    sondagesAPI.getOne(id)
      .then(r => setSondage(r.data.sondage))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  const rawQuestions = sondage?.questions || [];
  const questions = rawQuestions.filter((q, i, arr) =>
    arr.findIndex(x => x.id_question === q.id_question || x.texte_question === q.texte_question) === i
  );
  const q         = questions[current];
  const progress  = started ? ((current + 1) / questions.length) * 100 : 0;

  const setReponse = (idQ, value, type) => {
    if (type === 'choix_multiple') {
      const cur = reponses[idQ]?.id_options || [];
      const upd = cur.includes(value)
        ? cur.filter(v => v !== value)
        : [...cur, value];
      setReponses({ ...reponses, [idQ]: { id_question: idQ, id_options: upd } });
    } else if (type === 'choix_unique') {
      setReponses({ ...reponses, [idQ]: { id_question: idQ, id_options: [value] } });
    } else {
      setReponses({ ...reponses, [idQ]: { id_question: idQ, texte_reponse: value } });
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await participationsAPI.participer({
        id_sondage:    parseInt(id),
        nom_repondant: nomRepondant || null,
        reponses:      Object.values(reponses),
      });
      navigate('/confirmation');
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la soumission.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 bg-aurora opacity-5 blur-[100px] pointer-events-none" />

      {/* Modern Top Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/50 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-xs">P</span>
            </div>
            <span className="font-black text-slate-900 text-sm truncate max-w-[150px] md:max-w-xs">
              {sondage?.titre}
            </span>
          </div>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-50">
              <motion.div 
                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>

          <button onClick={() => navigate('/sondages')} className="text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="glass-card rounded-[3rem] p-10 md:p-16 shadow-pro border-white/40 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-8">
                  <Sparkles size={12} /> Nouveau Sondage
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1]">
                  {sondage?.titre}
                </h1>
                
                <p className="text-slate-500 font-bold text-lg mb-12 leading-relaxed">
                  {sondage?.description || 'Merci de prendre le temps de répondre à ces quelques questions.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <HelpCircle className="text-violet-600 mx-auto mb-3" size={24} />
                    <p className="font-black text-slate-900 text-sm">{questions.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <Clock className="text-violet-600 mx-auto mb-3" size={24} />
                    <p className="font-black text-slate-900 text-sm">~{Math.ceil(questions.length / 2)} min</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Durée</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <Shield className="text-violet-600 mx-auto mb-3" size={24} />
                    <p className="font-black text-slate-900 text-sm">Privé</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anonyme</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-left space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identité (Optionnel)</label>
                    <input 
                      type="text"
                      value={nomRepondant}
                      onChange={e => setNom(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-300"
                      placeholder="Comment souhaitez-vous être appelé ?"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStarted(true)}
                    className="btn-primary w-full py-5 text-lg shadow-xl shadow-violet-500/20"
                  >
                    Commencer l'Expérience <ArrowRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`q-${current}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-card rounded-[3rem] p-10 md:p-16 shadow-pro border-white/40"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] bg-violet-50 px-4 py-2 rounded-full">
                    Question {current + 1} • {questions.length}
                  </span>
                  {q?.est_obligatoire && (
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Requis
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-[1.2] tracking-tight">
                  {q?.texte_question}
                </h2>

                {/* Question Types */}
                <div className="space-y-4">
                  {(q?.type === 'choix_unique' || q?.type === 'choix_multiple') && (
                    <div className="grid grid-cols-1 gap-4">
                      {q.options?.map((opt, i) => {
                        const isSelected = reponses[q.id_question]?.id_options?.includes(opt.id_option);
                        return (
                          <motion.button
                            key={opt.id_option}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => setReponse(q.id_question, opt.id_option, q.type)}
                            className={cn(
                              "flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all text-left group",
                              isSelected 
                                ? "border-violet-600 bg-violet-50 shadow-lg shadow-violet-500/5" 
                                : "border-slate-100 bg-white hover:border-slate-200"
                            )}
                          >
                            <span className={cn("font-bold text-lg", isSelected ? "text-violet-900" : "text-slate-700")}>
                              {opt.texte_option}
                            </span>
                            <div className={cn(
                              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                              isSelected ? "bg-violet-600 border-violet-600 text-white" : "border-slate-200"
                            )}>
                              {isSelected && (q.type === 'choix_multiple' ? <CheckCircle size={18} /> : <div className="w-2.5 h-2.5 rounded-full bg-white" />)}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {q?.type === 'texte_libre' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <textarea
                        value={reponses[q.id_question]?.texte_reponse || ''}
                        onChange={e => setReponse(q.id_question, e.target.value, 'texte_libre')}
                        rows={6}
                        className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-200 resize-none"
                        placeholder="Écrivez votre réponse ici..."
                      />
                    </motion.div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-50">
                  <button
                    onClick={() => setCurrent(Math.max(0, current - 1))}
                    disabled={current === 0}
                    className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all"
                  >
                    <ArrowLeft size={16} /> Précédent
                  </button>

                  <div className="flex items-center gap-4">
                    {current < questions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrent(current + 1)}
                        className="btn-primary px-8"
                      >
                        Suivant <ArrowRight size={18} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={submit}
                        disabled={submitting}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-700 px-8"
                      >
                        {submitting ? "Envoi..." : "Terminer"} <Send size={18} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center justify-center gap-6 opacity-40 group hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Shield size={12} /> Sécurisé SSL
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <CheckCircle size={12} /> Données Privées
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RepondreSondage;
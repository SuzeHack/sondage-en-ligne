import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, AlertCircle, ArrowLeft, ShieldCheck, PenTool } from 'lucide-react';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Register = () => {
  const [form, setForm] = useState({
    nom: '', email: '', mot_de_passe: '', role: 'repondant'
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      if      (user.role === 'admin')    navigate('/admin');
      else if (user.role === 'createur') navigate('/dashboard');
      else                               navigate('/sondages');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { 
      value: 'repondant', 
      label: 'Répondant', 
      icon: ShieldCheck,
      desc: 'Participez aux sondages' 
    },
    { 
      value: 'createur', 
      label: 'Créateur', 
      icon: PenTool,
      desc: 'Gérez vos propres sondages' 
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-aurora opacity-10 blur-[100px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm z-20"
      >
        <ArrowLeft size={18} /> Retour
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card rounded-[2.5rem] p-10 shadow-pro border-white/40">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Rejoignez-nous</h1>
            <p className="text-slate-500 font-medium">Créez votre compte Pollify en quelques secondes</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nom complet</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" required
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="email" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                    placeholder="jean@exemple.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="password" required minLength={6}
                  value={form.mot_de_passe}
                  onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                  placeholder="Min. 6 caractères"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1">Je souhaite être...</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      form.role === r.value 
                        ? "border-violet-600 bg-violet-50/50" 
                        : "border-slate-100 bg-white/50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      form.role === r.value ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <r.icon size={24} />
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm", form.role === r.value ? "text-violet-900" : "text-slate-700")}>{r.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <motion.button 
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 text-lg shadow-xl shadow-violet-500/20 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </div>
              ) : (
                'Créer mon compte'
              )}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-violet-600 font-black hover:text-violet-700 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
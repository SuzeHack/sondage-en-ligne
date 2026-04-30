import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

import { motion } from 'framer-motion';

const Login = () => {
  const [form,    setForm]    = useState({ email: '', mot_de_passe: '' });
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.mot_de_passe);
      if      (user.role === 'admin')    navigate('/admin');
      else if (user.role === 'createur') navigate('/dashboard');
      else                               navigate('/sondages');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-aurora opacity-10 blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
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
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-violet-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-violet-500/40 group-hover:scale-110 transition-transform">
              <span className="font-black text-2xl">P</span>
            </div>
            <span className="font-black text-slate-900 text-2xl tracking-tighter uppercase">Pollify</span>
          </Link>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 shadow-pro border-white/40">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Bon retour !</h1>
            <p className="text-slate-500 font-medium">Connectez-vous pour continuer</p>
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
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-400"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type={show ? 'text' : 'password'} 
                  required
                  value={form.mot_de_passe}
                  onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <a href="javascript:void(0)" className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">Mot de passe oublié ?</a>
              </div>
            </div>

            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 text-lg shadow-xl shadow-violet-500/20"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Nouveau ici ?{' '}
              <Link to="/register" className="text-violet-600 font-black hover:text-violet-700 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


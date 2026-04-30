import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Confirmation = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
    {/* Aurora Background */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-aurora opacity-10 blur-[100px]" />
    </div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-card max-w-md w-full p-12 text-center shadow-pro border-white/40 relative z-10"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex justify-center mb-10"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 relative">
          <CheckCircle size={48} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg"
          >
            <Sparkles size={16} />
          </motion.div>
        </div>
      </motion.div>

      <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
        Participation <span className="text-emerald-600">Confirmée</span> !
      </h1>
      
      <p className="text-slate-500 font-bold text-lg mb-12 leading-relaxed">
        Vos précieuses réponses ont été enregistrées avec succès dans notre système.
      </p>

      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/sondages" className="btn-primary w-full py-5 text-lg shadow-xl shadow-violet-500/20">
            Découvrir d'autres projets <ArrowRight size={20} />
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors">
            <Home size={18} /> Retour au portail
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default Confirmation;
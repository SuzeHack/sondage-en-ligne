import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ArrowRight, Zap, BarChart3, Users, CheckCircle, MessageSquare, Shield, Globe } from 'lucide-react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

const features = [
  {
    icon: Zap,
    title: 'Création Ultra-Rapide',
    desc: 'Générez des sondages complexes en quelques secondes grâce à notre interface intuitive.',
    size: 'col-span-2 row-span-2',
    color: 'bg-violet-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  },
  {
    icon: BarChart3,
    title: 'Analyses IA',
    desc: 'Visualisez vos données avec une clarté absolue.',
    size: 'col-span-1 row-span-1',
    color: 'bg-purple-500',
  },
  {
    icon: Users,
    title: 'Collaboration',
    desc: 'Travaillez en équipe en temps réel.',
    size: 'col-span-1 row-span-1',
    color: 'bg-pink-500',
  },
  {
    icon: Globe,
    title: 'Diffusion Globale',
    desc: 'Partagez vos sondages partout dans le monde avec un lien unique.',
    size: 'col-span-1 row-span-1',
    color: 'bg-blue-500',
  },
  {
    icon: Shield,
    title: 'Sécurité Maximale',
    desc: 'Vos données sont chiffrées et protégées selon les normes RGPD.',
    size: 'col-span-1 row-span-1',
    color: 'bg-emerald-500',
  }
];

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Aurora Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Aurora */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora opacity-20 blur-[100px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 shadow-glass"
          >
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">BIENVENUE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8"
          >
            Sondages <br />
            <span className="text-gradient">Intelligents.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            La plateforme de sondage nouvelle génération. Créez, partagez et analysez 
            vos données avec une puissance et une simplicité inégalées.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary w-full sm:w-auto text-lg group">
              Démarrer le Projet 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/sondages" className="btn-secondary w-full sm:w-auto text-lg">
              Explorer les Modèles
            </Link>
          </motion.div>

          {/* Floating Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, type: 'spring' }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="glass-card p-4 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" 
                alt="Dashboard Preview"
                className="rounded-[2rem] w-full shadow-pro"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-10 top-20 glass-card p-6 rounded-3xl shadow-pro hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white">
                    <BarChart3 size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">+124% Engagement</p>
                    <p className="text-xs text-slate-500">Semaine dernière</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Zap size={14} /> Fonctionnalités Pro
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              Pensé pour la <span className="text-violet-600">Performance.</span>
            </h2>
            <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">
              Une suite d'outils puissants intégrés dans une interface minimaliste et ultra-réactive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[300px]">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10 }}
                className={cn(
                  "relative group rounded-[3rem] overflow-hidden border border-white/40 bg-white shadow-pro p-10 flex flex-col justify-between transition-all duration-500",
                  f.size === 'col-span-2 row-span-2' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                )}
              >
                {f.image && (
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={f.image} 
                      alt={f.title} 
                      className="w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500", f.color)}>
                    <f.icon size={32} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kinetic Marquee Section */}
      <section className="py-20 border-y border-slate-100 bg-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-12">
              <span className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Pollify Intelligence</span>
              <div className="w-3 h-3 rounded-full bg-violet-600" />
              <span className="text-4xl font-black text-slate-100 uppercase tracking-tighter">UX Pro Max</span>
              <div className="w-3 h-3 rounded-full bg-violet-600" />
              <span className="text-4xl font-black text-slate-100 uppercase tracking-tighter">Next Gen Surveys</span>
              <div className="w-3 h-3 rounded-full bg-violet-600" />
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-pro border-white/40">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[120px]" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-8"
                >
                  <CheckCircle size={12} /> Utilisé par les leaders
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 leading-[1.1] tracking-tighter">
                  Ils nous font <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Confiance.</span>
                </h2>
                <div className="grid grid-cols-2 gap-12">
                  {[
                    { val: '2M+', label: 'Utilisateurs' },
                    { val: '150+', label: 'Pays' },
                    { val: '99.9%', label: 'Uptime' },
                    { val: '24/7', label: 'Support' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {[
                  { name: 'Alex Rivers', role: 'CEO @ TechFlow', text: "Le meilleur outil de sondage que j'ai jamais utilisé. L'interface est absolument sublime." },
                  { name: 'Sarah Chen', role: 'Design Lead', text: "Une expérience utilisateur parfaite. On sent que chaque détail a été pensé pour la conversion." },
                ].map((t, i) => (
                  <motion.div 
                    key={t.name}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-pro border border-slate-50 group hover:-translate-x-4 transition-all duration-500"
                  >
                    <MessageSquare className="text-violet-600 mb-6 group-hover:scale-125 transition-transform" size={28} />
                    <p className="text-slate-600 font-bold text-lg mb-8 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{t.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Pro Max */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
            {/* Animated background lines */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute h-px bg-white/20 w-full"
                  style={{ top: `${i * 10}%`, left: 0 }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                Prêt à <span className="text-violet-400 text-glow">Transformer</span> vos données ?
              </h2>
              <p className="text-slate-400 text-xl max-w-xl mx-auto mb-12">
                Rejoignez la révolution Pollify dès aujourd'hui. Aucun frais d'entrée.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="btn-primary bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 text-xl">
                  Commencer l'Aventure
                </Link>
                <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                  <CheckCircle size={18} className="text-violet-400" />
                  Pas de carte requise
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <span className="font-black">P</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Pollify</span>
          </div>
          <div className="flex items-center gap-8 text-slate-500 text-sm font-medium">
            <a href="javascript:void(0)" className="hover:text-violet-600 transition-colors">Produit</a>
            <a href="javascript:void(0)" className="hover:text-violet-600 transition-colors">Tarifs</a>
            <a href="javascript:void(0)" className="hover:text-violet-600 transition-colors">Mentions Légales</a>
          </div>

          <p className="text-slate-400 text-xs font-medium">
            © 2024 Pollify. Conçu avec UI/UX Pro Max.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Settings, Compass } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const { user, isAuth, logout, isAdmin, isCreateur } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Sondages', path: '/sondages', icon: Compass },
    ...(isAuth() && isCreateur() ? [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    ...(isAuth() && isAdmin() ? [{ name: 'Admin', path: '/admin', icon: Settings }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "max-w-7xl mx-auto rounded-[2rem] transition-all duration-500",
          scrolled 
            ? "glass-card shadow-pro py-3 px-8" 
            : "bg-transparent py-4 px-4"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
              <span className="font-black text-lg">P</span>
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tighter uppercase hidden sm:block">
              Pollify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  location.pathname === link.path 
                    ? "bg-violet-50 text-violet-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-4" />

            {isAuth() ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 glass-card rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user?.nom?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{user?.nom}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary py-2 px-6 text-sm">
                  Démarrer Gratuitement
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center glass-card rounded-xl text-slate-900"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-6 pb-4 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                      location.pathname === link.path 
                        ? "bg-violet-600 text-white shadow-lg" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <link.icon size={18} />
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-slate-100 my-4 mx-4" />
                
                {isAuth() ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link 
                      to="/login" 
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-slate-50"
                    >
                      Connexion
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-2xl text-sm font-bold text-white bg-violet-600 shadow-lg"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
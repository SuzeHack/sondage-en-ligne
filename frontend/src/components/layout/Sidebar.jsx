import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid, List, PlusCircle,
  Users, Settings, LogOut,
  Shield, BarChart3, ChevronRight,
  User as UserIcon, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const createurLinks = [
    { to: '/dashboard',      icon: LayoutGrid,       label: 'Dashboard' },
    { to: '/sondages',       icon: List,       label: 'Projets'    },
    { to: '/sondages/creer', icon: PlusCircle, label: 'Nouveau'           },
  ];

  const adminLinks = [
    { to: '/admin',          icon: Shield,   label: 'Infrastucture'    },
    { to: '/admin/users',    icon: Users,    label: 'Utilisateurs'    },
    { to: '/admin/sondages', icon: BarChart3,label: 'Sondages'        },
  ];

  const links = isAdmin() ? adminLinks : createurLinks;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-950 flex flex-col shrink-0 border-r border-white/5 relative overflow-hidden">
      {/* Background kinetic effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 blur-[100px] -mr-32 -mt-32" />
      </div>

      {/* Logo */}
      <div className="px-8 py-10">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 group">
            <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-2xl tracking-tighter">Pollify</span>
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] -mt-1">Pro Max</span>
          </div>
        </Link>
      </div>

      {/* User Card */}
      <div className="px-6 mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
          onClick={() => navigate('/profil')}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-xl border border-white/20">
            <span className="text-white font-black text-lg">
              {user?.nom?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-white text-sm font-black truncate leading-tight">{user?.nom}</p>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role}</span>
          </div>
          <ChevronRight size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Principal</span>
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group",
              isActive(to)
                ? "bg-violet-600 text-white shadow-xl shadow-violet-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}>
            <Icon size={20} className={cn(isActive(to) ? "text-white" : "text-slate-500 group-hover:text-violet-400")} />
            <span>{label}</span>
            {isActive(to) && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-8 border-t border-white/5 space-y-2">
        <Link to="/profil"
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-slate-400 hover:text-white hover:bg-white/5",
            isActive('/profil') && "bg-white/5 text-white"
          )}>
          <Settings size={20} className="text-slate-500" />
          <span>Paramètres</span>
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 w-full">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
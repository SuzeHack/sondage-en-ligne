import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

import Login           from '../pages/auth/Login';
import Register        from '../pages/auth/Register';
import Home            from '../pages/Home';
import ListeSondages   from '../pages/sondages/ListeSondages';
import DetailSondage   from '../pages/sondages/DetailSondage';
import RepondreSondage from '../pages/sondages/RepondreSondage';
import Confirmation    from '../pages/misc/Confirmation';
import NotFound        from '../pages/misc/NotFound';
import Dashboard       from '../pages/dashboard/Dashboard';
import CreerSondage    from '../pages/sondages/CreerSondage';
import GererQuestions  from '../pages/sondages/GererQuestions';
import Resultats       from '../pages/sondages/Resultats';
import Profil          from '../pages/misc/Profil';
import AdminDashboard  from '../pages/admin/AdminDashboard';
import AdminUsers      from '../pages/admin/AdminUsers';
import AdminSondages   from '../pages/admin/AdminSondages';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm font-medium">Chargement...</p>
    </div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuth() ? children : <Navigate to="/login" replace />;
};

const CreateurRoute = ({ children }) => {
  const { isCreateur, loading } = useAuth();
  if (loading) return <Loader />;
  return isCreateur() ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  return isAdmin() ? children : <Navigate to="/" replace />;
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"                       element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/sondages"               element={<PageWrapper><ListeSondages /></PageWrapper>} />
        <Route path="/sondages/:id"           element={<PageWrapper><DetailSondage /></PageWrapper>} />
        <Route path="/sondages/:id/repondre"  element={<PageWrapper><RepondreSondage /></PageWrapper>} />
        <Route path="/confirmation"           element={<PageWrapper><Confirmation /></PageWrapper>} />
        <Route path="/login"                  element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register"               element={<PageWrapper><Register /></PageWrapper>} />

        {/* Créateur */}
        <Route path="/dashboard" element={
          <CreateurRoute><PageWrapper><Dashboard /></PageWrapper></CreateurRoute>
        }/>
        <Route path="/sondages/creer" element={
          <CreateurRoute><PageWrapper><CreerSondage /></PageWrapper></CreateurRoute>
        }/>
        <Route path="/sondages/:id/questions" element={
          <CreateurRoute><PageWrapper><GererQuestions /></PageWrapper></CreateurRoute>
        }/>
        <Route path="/sondages/:id/resultats" element={
          <CreateurRoute><PageWrapper><Resultats /></PageWrapper></CreateurRoute>
        }/>
        <Route path="/profil" element={
          <PrivateRoute><PageWrapper><Profil /></PageWrapper></PrivateRoute>
        }/>

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>
        }/>
        <Route path="/admin/users" element={
          <AdminRoute><PageWrapper><AdminUsers /></PageWrapper></AdminRoute>
        }/>
        <Route path="/admin/sondages" element={
          <AdminRoute><PageWrapper><AdminSondages /></PageWrapper></AdminRoute>
        }/>

        {/* 404 */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default AppRouter;
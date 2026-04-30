import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-8xl font-black text-primary-100 mb-2 leading-none">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
      <p className="text-gray-400 text-sm mb-8">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary inline-flex">
        <FiArrowLeft size={16} /> Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
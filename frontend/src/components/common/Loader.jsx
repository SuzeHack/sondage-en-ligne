import React from 'react';

const Loader = ({ text = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm font-medium">Chargement de Pollify...</p>
    </div>
  </div>
);

export default Loader;
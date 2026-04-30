import React, { useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const icons = {
  success: <FiCheck   className="text-green-500"  size={18} />,
  error:   <FiX       className="text-red-500"    size={18} />,
  warning: <FiAlertCircle className="text-yellow-500" size={18} />,
  info:    <FiInfo    className="text-blue-500"   size={18} />,
};

const borders = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  warning: 'border-l-yellow-500',
  info:    'border-l-blue-500',
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3
      bg-white border border-gray-100 border-l-4 ${borders[type]}
      rounded-xl shadow-modal px-4 py-3 min-w-72 max-w-sm
      animate-slide-in`}>
      {icons[type]}
      <p className="text-sm text-gray-700 flex-1">{message}</p>
      <button onClick={onClose}
        className="text-gray-300 hover:text-gray-500 transition ml-2">
        <FiX size={15} />
      </button>
    </div>
  );
};

export default Toast;
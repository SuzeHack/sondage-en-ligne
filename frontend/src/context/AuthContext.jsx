import React, {
  createContext, useState,
  useContext, useEffect, useCallback
} from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('pollify_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, mot_de_passe) => {
    const { data } = await authAPI.login({ email, mot_de_passe });
    localStorage.setItem('pollify_token', data.token);
    localStorage.setItem('pollify_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authAPI.register(payload);
    localStorage.setItem('pollify_token', data.token);
    localStorage.setItem('pollify_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('pollify_token');
    localStorage.removeItem('pollify_user');
    setUser(null);
  }, []);

  const isAdmin    = () => user?.role === 'admin';
  const isCreateur = () => ['createur','admin'].includes(user?.role);
  const isAuth     = () => !!user;

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      isAdmin, isCreateur, isAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
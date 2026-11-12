import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth.js';

const AuthContext = createContext(null);

const leerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(leerUsuario);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }, []);

  // El cliente de la API avisa por este evento cuando el token venció
  useEffect(() => {
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, [logout]);

  const login = useCallback(async (email, contrasena) => {
    const data = await loginRequest(email, contrasena);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setToken(data.token);
    setUsuario(data.usuario);
  }, []);

  const register = useCallback(
    async (nombre, email, contrasena) => {
      await registerRequest(nombre, email, contrasena);
      await login(email, contrasena);
    },
    [login]
  );

  const value = useMemo(
    () => ({ token, usuario, isAuthenticated: Boolean(token), login, register, logout }),
    [token, usuario, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);
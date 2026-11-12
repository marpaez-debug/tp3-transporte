import { request } from './client.js';

export const loginRequest = (email, contrasena) =>
  request('/auth/login', { method: 'POST', body: { email, contrasena }, auth: false });

export const registerRequest = (nombre, email, contrasena) =>
  request('/auth/register', { method: 'POST', body: { nombre, email, contrasena }, auth: false });
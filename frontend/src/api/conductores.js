import { request } from './client.js';

export const listarConductores = (apellido = '') =>
  request(`/conductores${apellido ? `?apellido=${encodeURIComponent(apellido)}` : ''}`);

export const crearConductor = (datos) =>
  request('/conductores', { method: 'POST', body: datos });

export const actualizarConductor = (id, datos) =>
  request(`/conductores/${id}`, { method: 'PUT', body: datos });

export const eliminarConductor = (id) =>
  request(`/conductores/${id}`, { method: 'DELETE' });
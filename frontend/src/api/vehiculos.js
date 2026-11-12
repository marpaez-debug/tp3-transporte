import { request } from './client.js';

export const listarVehiculos = (marca = '') =>
  request(`/vehiculos${marca ? `?marca=${encodeURIComponent(marca)}` : ''}`);

export const crearVehiculo = (datos) =>
  request('/vehiculos', { method: 'POST', body: datos });

export const actualizarVehiculo = (id, datos) =>
  request(`/vehiculos/${id}`, { method: 'PUT', body: datos });

export const eliminarVehiculo = (id) =>
  request(`/vehiculos/${id}`, { method: 'DELETE' });
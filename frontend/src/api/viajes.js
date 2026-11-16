import { request } from './client.js';

export const listarViajes = () => request('/viajes');

export const historialVehiculo = (id) => request(`/viajes/vehiculo/${id}`);

export const historialConductor = (id) => request(`/viajes/conductor/${id}`);

export const crearViaje = (datos) =>
  request('/viajes', { method: 'POST', body: datos });

export const actualizarViaje = (id, datos) =>
  request(`/viajes/${id}`, { method: 'PUT', body: datos });

export const eliminarViaje = (id) =>
  request(`/viajes/${id}`, { method: 'DELETE' });
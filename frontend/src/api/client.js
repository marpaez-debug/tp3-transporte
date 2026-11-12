const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(message, status, detalles = []) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem('token');
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  // Token vencido o inválido: se cierra la sesión
  if (response.status === 401 && auth && token) {
    window.dispatchEvent(new Event('auth:logout'));
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detalles = data?.errors ?? [];
    const mensaje =
      data?.error ||
      (detalles.length ? detalles.map((e) => e.mensaje).join('. ') : 'Error inesperado del servidor');
    throw new ApiError(mensaje, response.status, detalles);
  }

  return data;
}
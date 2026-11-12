export const requerido = (valor, mensaje) => (String(valor ?? '').trim() ? '' : mensaje);

export const emailValido = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? '').trim()) ? '' : 'El email no es válido';

export const minimo = (valor, largo, mensaje) =>
  String(valor ?? '').length >= largo ? '' : mensaje;
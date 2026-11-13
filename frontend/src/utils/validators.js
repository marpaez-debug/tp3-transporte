export const requerido = (valor, mensaje) => (String(valor ?? '').trim() ? '' : mensaje);

export const emailValido = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? '').trim()) ? '' : 'El email no es válido';

export const minimo = (valor, largo, mensaje) =>
  String(valor ?? '').length >= largo ? '' : mensaje;

export const maximo = (valor, largo, mensaje) =>
  String(valor ?? '').length <= largo ? '' : mensaje;

export const enteroEnRango = (valor, min, max, mensaje) => {
  const texto = String(valor ?? '').trim();
  const numero = Number(texto);
  return texto !== '' && Number.isInteger(numero) && numero >= min && numero <= max
    ? ''
    : mensaje;
};

export const numeroMayorACero = (valor, mensaje) => {
  const texto = String(valor ?? '').trim().replace(',', '.');
  const numero = Number(texto);
  return texto !== '' && Number.isFinite(numero) && numero > 0 ? '' : mensaje;
};

export const patenteValida = (valor) => {
  const limpia = String(valor ?? '').replace(/[\s-]/g, '').toUpperCase();
  return /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/.test(limpia)
    ? ''
    : 'Patente inválida (ejemplos: ABC123 o AB123CD)';
};

export const documentoValido = (valor) =>
  /^\d{7,8}$/.test(String(valor ?? '').trim())
    ? ''
    : 'El documento debe tener 7 u 8 dígitos, sin puntos';

// Fecha en formato AAAA-MM-DD (el que devuelve <input type="date">)
export const fechaValida = (valor, mensaje) => {
  const texto = String(valor ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return mensaje;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const existe =
    fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  return existe ? '' : mensaje;
};

// Comprueba que "despues" sea posterior a "antes" (ambas AAAA-MM-DD)
export const fechaPosterior = (antes, despues, mensaje) =>
  String(despues) > String(antes) ? '' : mensaje;
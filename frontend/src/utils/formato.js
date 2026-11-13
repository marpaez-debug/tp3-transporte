export const formatearFecha = (valor) => {
  if (!valor) return '';
  const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
};

export const formatearFechaHora = (valor) => {
  if (!valor) return '';
  const texto = String(valor);
  return `${formatearFecha(texto)} ${texto.slice(11, 16)}`;
};

export const formatearNumero = (valor) => Number(valor).toLocaleString('es-AR');

// Fecha de hoy como AAAA-MM-DD, en la zona horaria local
export const hoy = () => {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
};
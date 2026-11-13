import { useState } from 'react';
import { actualizarConductor, crearConductor } from '../api/conductores.js';
import Field from './Field.jsx';
import {
  documentoValido,
  fechaPosterior,
  fechaValida,
  maximo,
  requerido,
} from '../utils/validators.js';

const valoresIniciales = (conductor) => ({
  nombre: conductor?.nombre ?? '',
  apellido: conductor?.apellido ?? '',
  numero_documento: conductor?.numero_documento ?? '',
  numero_licencia: conductor?.numero_licencia ?? '',
  fecha_alta_licencia: conductor?.fecha_alta_licencia ?? '',
  fecha_vencimiento_licencia: conductor?.fecha_vencimiento_licencia ?? '',
});

export default function ConductorForm({ conductor, onGuardado, onCancelar }) {
  const [form, setForm] = useState(valoresIniciales(conductor));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};

    const errorNombre =
      requerido(form.nombre, 'El nombre es obligatorio') ||
      maximo(form.nombre.trim(), 60, 'El nombre es demasiado largo');
    if (errorNombre) nuevos.nombre = errorNombre;

    const errorApellido =
      requerido(form.apellido, 'El apellido es obligatorio') ||
      maximo(form.apellido.trim(), 60, 'El apellido es demasiado largo');
    if (errorApellido) nuevos.apellido = errorApellido;

    const errorDocumento =
      requerido(form.numero_documento, 'El documento es obligatorio') ||
      documentoValido(form.numero_documento);
    if (errorDocumento) nuevos.numero_documento = errorDocumento;

    const errorLicencia =
      requerido(form.numero_licencia, 'El número de licencia es obligatorio') ||
      maximo(form.numero_licencia.trim(), 30, 'El número de licencia es demasiado largo');
    if (errorLicencia) nuevos.numero_licencia = errorLicencia;

    const errorAlta = fechaValida(
      form.fecha_alta_licencia,
      'La fecha de alta de la licencia es obligatoria y debe ser válida'
    );
    if (errorAlta) nuevos.fecha_alta_licencia = errorAlta;

    const errorVencimiento =
      fechaValida(
        form.fecha_vencimiento_licencia,
        'La fecha de vencimiento es obligatoria y debe ser válida'
      ) ||
      (!errorAlta &&
        fechaPosterior(
          form.fecha_alta_licencia,
          form.fecha_vencimiento_licencia,
          'El vencimiento debe ser posterior a la fecha de alta'
        ));
    if (errorVencimiento) nuevos.fecha_vencimiento_licencia = errorVencimiento;

    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      numero_documento: form.numero_documento.trim(),
      numero_licencia: form.numero_licencia.trim(),
      fecha_alta_licencia: form.fecha_alta_licencia,
      fecha_vencimiento_licencia: form.fecha_vencimiento_licencia,
    };

    setEnviando(true);
    try {
      if (conductor) {
        await actualizarConductor(conductor.id, datos);
        onGuardado('Conductor actualizado correctamente');
      } else {
        await crearConductor(datos);
        onGuardado('Conductor creado correctamente');
      }
    } catch (error) {
      if (error.detalles?.length) {
        const porCampo = {};
        error.detalles.forEach((d) => {
          porCampo[d.campo] = d.mensaje;
        });
        setErrores(porCampo);
        setErrorServidor('Revisá los datos ingresados');
      } else {
        setErrorServidor(error.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="panel">
      <h2>{conductor ? 'Modificar conductor' : 'Nuevo conductor'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {errorServidor && <div className="alert alert-error">{errorServidor}</div>}

        <div className="form-grid">
          <Field
            label="Nombre"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />
          <Field
            label="Apellido"
            id="apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            error={errores.apellido}
          />
          <Field
            label="Número de documento"
            id="numero_documento"
            name="numero_documento"
            inputMode="numeric"
            value={form.numero_documento}
            onChange={handleChange}
            error={errores.numero_documento}
            placeholder="Sin puntos"
          />
          <Field
            label="Número de licencia"
            id="numero_licencia"
            name="numero_licencia"
            value={form.numero_licencia}
            onChange={handleChange}
            error={errores.numero_licencia}
          />
          <Field
            label="Alta de la licencia"
            id="fecha_alta_licencia"
            name="fecha_alta_licencia"
            type="date"
            value={form.fecha_alta_licencia}
            onChange={handleChange}
            error={errores.fecha_alta_licencia}
          />
          <Field
            label="Vencimiento de la licencia"
            id="fecha_vencimiento_licencia"
            name="fecha_vencimiento_licencia"
            type="date"
            value={form.fecha_vencimiento_licencia}
            onChange={handleChange}
            error={errores.fecha_vencimiento_licencia}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
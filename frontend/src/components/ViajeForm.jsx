import { useState } from 'react';
import { actualizarViaje, crearViaje } from '../api/viajes.js';
import { aInputFechaHora } from '../utils/formato.js';
import Field from './Field.jsx';
import {
  fechaHoraValida,
  maximo,
  noAnterior,
  numeroMayorACero,
  requerido,
} from '../utils/validators.js';

const valoresIniciales = (viaje) => ({
  vehiculo_id: viaje?.vehiculo_id ? String(viaje.vehiculo_id) : '',
  conductor_id: viaje?.conductor_id ? String(viaje.conductor_id) : '',
  fecha_salida: aInputFechaHora(viaje?.fecha_salida),
  fecha_llegada: aInputFechaHora(viaje?.fecha_llegada),
  origen: viaje?.origen ?? '',
  destino: viaje?.destino ?? '',
  kilometros: viaje?.kilometros ?? '',
  observaciones: viaje?.observaciones ?? '',
});

export default function ViajeForm({ viaje, vehiculos, conductores, onGuardado, onCancelar }) {
  const [form, setForm] = useState(valoresIniciales(viaje));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};

    const errorVehiculo = requerido(form.vehiculo_id, 'Elegí un vehículo');
    if (errorVehiculo) nuevos.vehiculo_id = errorVehiculo;

    const errorConductor = requerido(form.conductor_id, 'Elegí un conductor');
    if (errorConductor) nuevos.conductor_id = errorConductor;

    const errorSalida = fechaHoraValida(
      form.fecha_salida,
      'La fecha y hora de salida son obligatorias'
    );
    if (errorSalida) nuevos.fecha_salida = errorSalida;

    const errorLlegada =
      fechaHoraValida(form.fecha_llegada, 'La fecha y hora de llegada son obligatorias') ||
      (!errorSalida &&
        noAnterior(
          form.fecha_salida,
          form.fecha_llegada,
          'La llegada no puede ser anterior a la salida'
        ));
    if (errorLlegada) nuevos.fecha_llegada = errorLlegada;

    const errorOrigen =
      requerido(form.origen, 'El origen es obligatorio') ||
      maximo(form.origen.trim(), 100, 'El origen es demasiado largo');
    if (errorOrigen) nuevos.origen = errorOrigen;

    const errorDestino =
      requerido(form.destino, 'El destino es obligatorio') ||
      maximo(form.destino.trim(), 100, 'El destino es demasiado largo');
    if (errorDestino) nuevos.destino = errorDestino;

    const errorKm = numeroMayorACero(
      form.kilometros,
      'Los kilómetros deben ser un número mayor a 0'
    );
    if (errorKm) nuevos.kilometros = errorKm;

    const errorObs = maximo(form.observaciones, 1000, 'Las observaciones son demasiado largas');
    if (errorObs) nuevos.observaciones = errorObs;

    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      vehiculo_id: Number(form.vehiculo_id),
      conductor_id: Number(form.conductor_id),
      fecha_salida: form.fecha_salida,
      fecha_llegada: form.fecha_llegada,
      origen: form.origen.trim(),
      destino: form.destino.trim(),
      kilometros: Number(String(form.kilometros).replace(',', '.')),
      observaciones: form.observaciones.trim(),
    };

    setEnviando(true);
    try {
      if (viaje) {
        await actualizarViaje(viaje.id, datos);
        onGuardado('Viaje actualizado correctamente');
      } else {
        await crearViaje(datos);
        onGuardado('Viaje registrado correctamente');
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
      <h2>{viaje ? 'Modificar viaje' : 'Registrar viaje'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {errorServidor && <div className="alert alert-error">{errorServidor}</div>}

        <div className="form-grid">
          <Field
            as="select"
            label="Vehículo"
            id="vehiculo_id"
            name="vehiculo_id"
            value={form.vehiculo_id}
            onChange={handleChange}
            error={errores.vehiculo_id}
          >
            <option value="">Elegí un vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} ({v.patente})
              </option>
            ))}
          </Field>

          <Field
            as="select"
            label="Conductor"
            id="conductor_id"
            name="conductor_id"
            value={form.conductor_id}
            onChange={handleChange}
            error={errores.conductor_id}
          >
            <option value="">Elegí un conductor</option>
            {conductores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.apellido}, {c.nombre}
              </option>
            ))}
          </Field>

          <Field
            label="Fecha y hora de salida"
            id="fecha_salida"
            name="fecha_salida"
            type="datetime-local"
            value={form.fecha_salida}
            onChange={handleChange}
            error={errores.fecha_salida}
          />
          <Field
            label="Fecha y hora de llegada"
            id="fecha_llegada"
            name="fecha_llegada"
            type="datetime-local"
            value={form.fecha_llegada}
            onChange={handleChange}
            error={errores.fecha_llegada}
          />
          <Field
            label="Origen"
            id="origen"
            name="origen"
            value={form.origen}
            onChange={handleChange}
            error={errores.origen}
          />
          <Field
            label="Destino"
            id="destino"
            name="destino"
            value={form.destino}
            onChange={handleChange}
            error={errores.destino}
          />
          <Field
            label="Kilómetros"
            id="kilometros"
            name="kilometros"
            type="number"
            step="any"
            value={form.kilometros}
            onChange={handleChange}
            error={errores.kilometros}
          />
        </div>

        <Field
          as="textarea"
          label="Observaciones (opcional)"
          id="observaciones"
          name="observaciones"
          rows={3}
          value={form.observaciones}
          onChange={handleChange}
          error={errores.observaciones}
        />

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
import { useState } from 'react';
import { actualizarVehiculo, crearVehiculo } from '../api/vehiculos.js';
import Field from './Field.jsx';
import {
  enteroEnRango,
  maximo,
  numeroMayorACero,
  patenteValida,
  requerido,
} from '../utils/validators.js';

const ANIO_MAXIMO = new Date().getFullYear() + 1;

const valoresIniciales = (vehiculo) => ({
  marca: vehiculo?.marca ?? '',
  modelo: vehiculo?.modelo ?? '',
  patente: vehiculo?.patente ?? '',
  anio: vehiculo?.anio ?? '',
  capacidad_carga: vehiculo?.capacidad_carga ?? '',
});

export default function VehiculoForm({ vehiculo, onGuardado, onCancelar }) {
  const [form, setForm] = useState(valoresIniciales(vehiculo));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};

    const errorMarca =
      requerido(form.marca, 'La marca es obligatoria') ||
      maximo(form.marca.trim(), 60, 'La marca es demasiado larga');
    if (errorMarca) nuevos.marca = errorMarca;

    const errorModelo =
      requerido(form.modelo, 'El modelo es obligatorio') ||
      maximo(form.modelo.trim(), 60, 'El modelo es demasiado largo');
    if (errorModelo) nuevos.modelo = errorModelo;

    const errorPatente =
      requerido(form.patente, 'La patente es obligatoria') || patenteValida(form.patente);
    if (errorPatente) nuevos.patente = errorPatente;

    const errorAnio = enteroEnRango(
      form.anio,
      1950,
      ANIO_MAXIMO,
      `El año debe ser un número entre 1950 y ${ANIO_MAXIMO}`
    );
    if (errorAnio) nuevos.anio = errorAnio;

    const errorCapacidad = numeroMayorACero(
      form.capacidad_carga,
      'La capacidad de carga debe ser un número mayor a 0'
    );
    if (errorCapacidad) nuevos.capacidad_carga = errorCapacidad;

    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      patente: form.patente.trim(),
      anio: Number(form.anio),
      capacidad_carga: Number(String(form.capacidad_carga).replace(',', '.')),
    };

    setEnviando(true);
    try {
      if (vehiculo) {
        await actualizarVehiculo(vehiculo.id, datos);
        onGuardado('Vehículo actualizado correctamente');
      } else {
        await crearVehiculo(datos);
        onGuardado('Vehículo creado correctamente');
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
      <h2>{vehiculo ? 'Modificar vehículo' : 'Nuevo vehículo'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {errorServidor && <div className="alert alert-error">{errorServidor}</div>}

        <div className="form-grid">
          <Field
            label="Marca"
            id="marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            error={errores.marca}
          />
          <Field
            label="Modelo"
            id="modelo"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            error={errores.modelo}
          />
          <Field
            label="Patente"
            id="patente"
            name="patente"
            value={form.patente}
            onChange={handleChange}
            error={errores.patente}
            placeholder="ABC123 o AB123CD"
          />
          <Field
            label="Año"
            id="anio"
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
            error={errores.anio}
          />
          <Field
            label="Capacidad de carga (kg)"
            id="capacidad_carga"
            name="capacidad_carga"
            type="number"
            step="any"
            value={form.capacidad_carga}
            onChange={handleChange}
            error={errores.capacidad_carga}
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
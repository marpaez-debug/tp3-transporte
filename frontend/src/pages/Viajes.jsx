import { useEffect, useState } from 'react';
import { listarConductores } from '../api/conductores.js';
import { listarVehiculos } from '../api/vehiculos.js';
import {
  eliminarViaje,
  historialConductor,
  historialVehiculo,
  listarViajes,
} from '../api/viajes.js';
import Field from '../components/Field.jsx';
import ViajeForm from '../components/ViajeForm.jsx';
import { formatearFechaHora, formatearNumero } from '../utils/formato.js';

const sumarKilometros = (lista) =>
  Math.round(lista.reduce((acc, v) => acc + Number(v.kilometros), 0) * 100) / 100;

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [resumen, setResumen] = useState({ cantidad: 0, total: 0 });
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [modo, setModo] = useState('todos'); 
  const [seleccionId, setSeleccionId] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [formulario, setFormulario] = useState(null); 

  // Vehículos y conductores para los selectores
  useEffect(() => {
    Promise.all([listarVehiculos(), listarConductores()])
      .then(([listaVehiculos, listaConductores]) => {
        setVehiculos(listaVehiculos);
        setConductores(listaConductores);
      })
      .catch((e) => setError(e.message));
  }, []);

  // Viajes según el filtro elegido
  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      try {
        let lista;
        let datosResumen;

        if (modo === 'vehiculo' && seleccionId) {
          const data = await historialVehiculo(seleccionId);
          lista = data.viajes;
          datosResumen = { cantidad: data.cantidad_viajes, total: data.total_kilometros };
        } else if (modo === 'conductor' && seleccionId) {
          const data = await historialConductor(seleccionId);
          lista = data.viajes;
          datosResumen = { cantidad: data.cantidad_viajes, total: data.total_kilometros };
        } else {
          lista = await listarViajes();
          datosResumen = { cantidad: lista.length, total: sumarKilometros(lista) };
        }

        if (cancelado) return;
        setViajes(lista);
        setResumen(datosResumen);
        setError('');
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [modo, seleccionId, recarga]);

  const cambiarModo = (e) => {
    setModo(e.target.value);
    setSeleccionId('');
  };

  const abrirFormulario = (viaje = null) => {
    setAviso('');
    setFormulario({ viaje });
  };

  const handleGuardado = (mensaje) => {
    setFormulario(null);
    setAviso(mensaje);
    setRecarga((n) => n + 1);
  };

  const handleEliminar = async (viaje) => {
    const confirmado = window.confirm(
      `¿Eliminar el viaje de ${viaje.origen} a ${viaje.destino} del ${formatearFechaHora(viaje.fecha_salida)}?`
    );
    if (!confirmado) return;

    setAviso('');
    setError('');
    try {
      await eliminarViaje(viaje.id);
      setAviso('Viaje eliminado correctamente');
      setRecarga((n) => n + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  const ambito = (() => {
    if (modo === 'vehiculo' && seleccionId) {
      const v = vehiculos.find((x) => String(x.id) === seleccionId);
      return v ? `Vehículo: ${v.marca} ${v.modelo} (${v.patente})` : 'Vehículo';
    }
    if (modo === 'conductor' && seleccionId) {
      const c = conductores.find((x) => String(x.id) === seleccionId);
      return c ? `Conductor: ${c.apellido}, ${c.nombre}` : 'Conductor';
    }
    return 'Todos los viajes';
  })();

  const faltanDatos = vehiculos.length === 0 || conductores.length === 0;

  return (
    <>
      <div className="page-header">
        <h1>Viajes</h1>
        <button type="button" className="btn" onClick={() => abrirFormulario()}>
          Registrar viaje
        </button>
      </div>

      {aviso && <div className="alert alert-ok">{aviso}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {formulario &&
        (faltanDatos ? (
          <div className="alert alert-error">
            Antes de registrar un viaje tenés que cargar al menos un vehículo y un conductor.
          </div>
        ) : (
          <ViajeForm
            key={formulario.viaje?.id ?? 'nuevo'}
            viaje={formulario.viaje}
            vehiculos={vehiculos}
            conductores={conductores}
            onGuardado={handleGuardado}
            onCancelar={() => setFormulario(null)}
          />
        ))}

      <section className="panel">
        <div className="filtros">
          <Field
            as="select"
            label="Consultar"
            id="modo"
            value={modo}
            onChange={cambiarModo}
          >
            <option value="todos">Todos los viajes</option>
            <option value="vehiculo">Historial por vehículo</option>
            <option value="conductor">Historial por conductor</option>
          </Field>

          {modo === 'vehiculo' && (
            <Field
              as="select"
              label="Vehículo"
              id="filtro-vehiculo"
              value={seleccionId}
              onChange={(e) => setSeleccionId(e.target.value)}
            >
              <option value="">Elegí un vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} ({v.patente})
                </option>
              ))}
            </Field>
          )}

          {modo === 'conductor' && (
            <Field
              as="select"
              label="Conductor"
              id="filtro-conductor"
              value={seleccionId}
              onChange={(e) => setSeleccionId(e.target.value)}
            >
              <option value="">Elegí un conductor</option>
              {conductores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.apellido}, {c.nombre}
                </option>
              ))}
            </Field>
          )}
        </div>

        <p>{ambito}</p>
        <div className="resumen">
          <div>
            <strong>{resumen.cantidad}</strong>
            viajes
          </div>
          <div>
            <strong>{formatearNumero(resumen.total)} km</strong>
            recorridos en total
          </div>
        </div>
      </section>

      <div className="table-wrap">
        {cargando ? (
          <p className="vacio">Cargando viajes...</p>
        ) : viajes.length === 0 ? (
          <p className="vacio">No hay viajes para mostrar.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Salida</th>
                <th>Llegada</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Vehículo</th>
                <th>Conductor</th>
                <th>Km</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {viajes.map((v) => (
                <tr key={v.id}>
                  <td>{formatearFechaHora(v.fecha_salida)}</td>
                  <td>{formatearFechaHora(v.fecha_llegada)}</td>
                  <td>{v.origen}</td>
                  <td>{v.destino}</td>
                  <td>{v.marca} {v.modelo} ({v.patente})</td>
                  <td>{v.conductor_apellido}, {v.conductor_nombre}</td>
                  <td>{formatearNumero(v.kilometros)}</td>
                  <td className="obs">{v.observaciones}</td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => abrirFormulario(v)}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(v)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
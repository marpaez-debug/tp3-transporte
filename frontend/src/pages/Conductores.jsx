import { useEffect, useState } from 'react';
import { eliminarConductor, listarConductores } from '../api/conductores.js';
import ConductorForm from '../components/ConductorForm.jsx';
import { formatearFecha, hoy } from '../utils/formato.js';

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [formulario, setFormulario] = useState(null); // null o { conductor }

  useEffect(() => {
    let cancelado = false;

    listarConductores(busqueda)
      .then((datos) => {
        if (cancelado) return;
        setConductores(datos);
        setError('');
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [busqueda, recarga]);

  const buscar = (e) => {
    e.preventDefault();
    setBusqueda(filtro.trim());
  };

  const limpiarBusqueda = () => {
    setFiltro('');
    setBusqueda('');
  };

  const abrirFormulario = (conductor = null) => {
    setAviso('');
    setFormulario({ conductor });
  };

  const handleGuardado = (mensaje) => {
    setFormulario(null);
    setAviso(mensaje);
    setRecarga((n) => n + 1);
  };

  const handleEliminar = async (conductor) => {
    const confirmado = window.confirm(
      `¿Eliminar al conductor ${conductor.apellido}, ${conductor.nombre}?`
    );
    if (!confirmado) return;

    setAviso('');
    setError('');
    try {
      await eliminarConductor(conductor.id);
      setAviso('Conductor eliminado correctamente');
      setRecarga((n) => n + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  const fechaHoy = hoy();

  return (
    <>
      <div className="page-header">
        <h1>Conductores</h1>
        <button type="button" className="btn" onClick={() => abrirFormulario()}>
          Nuevo conductor
        </button>
      </div>

      {aviso && <div className="alert alert-ok">{aviso}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {formulario && (
        <ConductorForm
          key={formulario.conductor?.id ?? 'nuevo'}
          conductor={formulario.conductor}
          onGuardado={handleGuardado}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <form className="panel" onSubmit={buscar}>
        <div className="form-actions">
          <input
            type="search"
            placeholder="Buscar por apellido"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Buscar por apellido"
          />
          <button type="submit" className="btn btn-secondary">Buscar</button>
          {busqueda && (
            <button type="button" className="btn btn-secondary" onClick={limpiarBusqueda}>
              Quitar filtro
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        {cargando ? (
          <p className="vacio">Cargando conductores...</p>
        ) : conductores.length === 0 ? (
          <p className="vacio">
            {busqueda
              ? 'No hay conductores con ese apellido.'
              : 'Todavía no hay conductores cargados.'}
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Apellido y nombre</th>
                <th>Documento</th>
                <th>N.º de licencia</th>
                <th>Alta de licencia</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id}>
                  <td>{c.apellido}, {c.nombre}</td>
                  <td>{c.numero_documento}</td>
                  <td>{c.numero_licencia}</td>
                  <td>{formatearFecha(c.fecha_alta_licencia)}</td>
                  <td>
                    {formatearFecha(c.fecha_vencimiento_licencia)}{' '}
                    {c.fecha_vencimiento_licencia < fechaHoy && (
                      <span className="badge badge-error">Vencida</span>
                    )}
                  </td>
                  <td className="acciones">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => abrirFormulario(c)}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(c)}
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
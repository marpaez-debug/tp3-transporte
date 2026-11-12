import { useEffect, useState } from 'react';
import { eliminarVehiculo, listarVehiculos } from '../api/vehiculos.js';
import VehiculoForm from '../components/VehiculoForm.jsx';

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [formulario, setFormulario] = useState(null); // null o { vehiculo }

  useEffect(() => {
    let cancelado = false;

    listarVehiculos(busqueda)
      .then((datos) => {
        if (cancelado) return;
        setVehiculos(datos);
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

  const abrirFormulario = (vehiculo = null) => {
    setAviso('');
    setFormulario({ vehiculo });
  };

  const handleGuardado = (mensaje) => {
    setFormulario(null);
    setAviso(mensaje);
    setRecarga((n) => n + 1);
  };

  const handleEliminar = async (vehiculo) => {
    const confirmado = window.confirm(
      `¿Eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.patente})?`
    );
    if (!confirmado) return;

    setAviso('');
    setError('');
    try {
      await eliminarVehiculo(vehiculo.id);
      setAviso('Vehículo eliminado correctamente');
      setRecarga((n) => n + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Vehículos</h1>
        <button type="button" className="btn" onClick={() => abrirFormulario()}>
          Nuevo vehículo
        </button>
      </div>

      {aviso && <div className="alert alert-ok">{aviso}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {formulario && (
        <VehiculoForm
          key={formulario.vehiculo?.id ?? 'nuevo'}
          vehiculo={formulario.vehiculo}
          onGuardado={handleGuardado}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <form className="panel" onSubmit={buscar}>
        <div className="form-actions">
          <input
            type="search"
            placeholder="Buscar por marca"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Buscar por marca"
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
          <p className="vacio">Cargando vehículos...</p>
        ) : vehiculos.length === 0 ? (
          <p className="vacio">
            {busqueda ? 'No hay vehículos con esa marca.' : 'Todavía no hay vehículos cargados.'}
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Patente</th>
                <th>Año</th>
                <th>Capacidad de carga</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.patente}</td>
                  <td>{v.anio}</td>
                  <td>{Number(v.capacidad_carga).toLocaleString('es-AR')} kg</td>
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
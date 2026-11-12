import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Inicio() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="hero">
        <h1>Gestión de vehículos, conductores y viajes</h1>
        <p>
          Registrá la flota de tu empresa de transporte, sus conductores y cada viaje realizado.
          Consultá el historial y los kilómetros recorridos por vehículo o por conductor.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <Link className="btn" to="/vehiculos">Ver vehículos</Link>
              <Link className="btn btn-secondary" to="/conductores">Ver conductores</Link>
              <Link className="btn btn-secondary" to="/viajes">Ver viajes</Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Iniciar sesión</Link>
              <Link className="btn btn-secondary" to="/registro">Crear cuenta</Link>
            </>
          )}
        </div>
      </section>

      <section className="cards">
        <article className="card">
          <h3>Vehículos</h3>
          <p>Alta, modificación y baja de la flota, con marca, modelo, patente, año y capacidad de carga.</p>
        </article>
        <article className="card">
          <h3>Conductores</h3>
          <p>Datos personales y control de la licencia, con sus fechas de alta y vencimiento.</p>
        </article>
        <article className="card">
          <h3>Viajes</h3>
          <p>Registro de cada viaje, historial por vehículo o conductor y total de kilómetros.</p>
        </article>
      </section>
    </>
  );
}
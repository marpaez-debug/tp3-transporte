import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { isAuthenticated, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">Gestión de Transporte</Link>

          <nav className="nav">
            <NavLink to="/" end>Inicio</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/vehiculos">Vehículos</NavLink>
                <NavLink to="/conductores">Conductores</NavLink>
                <NavLink to="/viajes">Viajes</NavLink>
              </>
            )}
          </nav>

          <div className="session">
            {isAuthenticated ? (
              <>
                <span className="session-name">Hola, {usuario?.nombre}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn-sm">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
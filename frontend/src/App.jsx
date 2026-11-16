import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Conductores from './pages/Conductores.jsx';
import Inicio from './pages/Inicio.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Vehiculos from './pages/Vehiculos.jsx';
import Viajes from './pages/Viajes.jsx';

function NoEncontrada() {
  return (
    <section className="panel">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />

        <Route
          path="vehiculos"
          element={<ProtectedRoute><Vehiculos /></ProtectedRoute>}
        />
        <Route
          path="conductores"
          element={<ProtectedRoute><Conductores /></ProtectedRoute>}
        />
        <Route
          path="viajes"
          element={<ProtectedRoute><Viajes /></ProtectedRoute>}
        />

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
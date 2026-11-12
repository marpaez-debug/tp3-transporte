import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Inicio from './pages/Inicio.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Vehiculos from './pages/Vehiculos.jsx';

function EnConstruccion({ titulo }) {
  return (
    <section className="panel">
      <h1>{titulo}</h1>
      <p>Esta sección se construye en el próximo paso.</p>
    </section>
  );
}

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
          element={<ProtectedRoute><EnConstruccion titulo="Conductores" /></ProtectedRoute>}
        />
        <Route
          path="viajes"
          element={<ProtectedRoute><EnConstruccion titulo="Viajes" /></ProtectedRoute>}
        />

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
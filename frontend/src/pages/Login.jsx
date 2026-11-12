import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { emailValido, requerido } from '../utils/validators.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};
    const errorEmail =
      requerido(form.email, 'El email es obligatorio') || emailValido(form.email);
    if (errorEmail) nuevos.email = errorEmail;
    const errorContrasena = requerido(form.contrasena, 'La contraseña es obligatoria');
    if (errorContrasena) nuevos.contrasena = errorContrasena;
    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      await login(form.email.trim(), form.contrasena);
      navigate(location.state?.from?.pathname || '/vehiculos', { replace: true });
    } catch (error) {
      setErrorServidor(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} noValidate>
        {errorServidor && <div className="alert alert-error">{errorServidor}</div>}

        <Field
          label="Email"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errores.email}
          autoComplete="email"
        />
        <Field
          label="Contraseña"
          id="contrasena"
          name="contrasena"
          type="password"
          value={form.contrasena}
          onChange={handleChange}
          error={errores.contrasena}
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-block" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="auth-link">
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}
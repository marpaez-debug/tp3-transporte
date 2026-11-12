import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { emailValido, minimo, requerido } from '../utils/validators.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', email: '', contrasena: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};

    const errorNombre = requerido(form.nombre, 'El nombre es obligatorio');
    if (errorNombre) nuevos.nombre = errorNombre;

    const errorEmail =
      requerido(form.email, 'El email es obligatorio') || emailValido(form.email);
    if (errorEmail) nuevos.email = errorEmail;

    const errorContrasena =
      requerido(form.contrasena, 'La contraseña es obligatoria') ||
      minimo(form.contrasena, 8, 'La contraseña debe tener al menos 8 caracteres');
    if (errorContrasena) nuevos.contrasena = errorContrasena;

    if (form.confirmar !== form.contrasena) {
      nuevos.confirmar = 'Las contraseñas no coinciden';
    }

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
      await register(form.nombre.trim(), form.email.trim(), form.contrasena);
      navigate('/vehiculos', { replace: true });
    } catch (error) {
      setErrorServidor(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit} noValidate>
        {errorServidor && <div className="alert alert-error">{errorServidor}</div>}

        <Field
          label="Nombre"
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          error={errores.nombre}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <Field
          label="Repetir contraseña"
          id="confirmar"
          name="confirmar"
          type="password"
          value={form.confirmar}
          onChange={handleChange}
          error={errores.confirmar}
          autoComplete="new-password"
        />

        <button type="submit" className="btn btn-block" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="auth-link">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}
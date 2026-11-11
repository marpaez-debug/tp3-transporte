import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body;

    const [existentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existentes.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    const valida = usuario && (await bcrypt.compare(contrasena, usuario.contrasena));
    if (!valida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '4h',
    });

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    next(error);
  }
};
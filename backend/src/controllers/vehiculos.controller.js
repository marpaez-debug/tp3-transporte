import { pool } from '../config/db.js';

export const listar = async (req, res, next) => {
  try {
    const { marca } = req.query;
    let sql = 'SELECT * FROM vehiculos';
    const params = [];
    if (marca) {
      sql += ' WHERE marca LIKE ?';
      params.push(`%${marca}%`);
    }
    sql += ' ORDER BY id';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;
    const [result] = await pool.query(
      'INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, anio, capacidad_carga]
    );
    res.status(201).json({ id: result.insertId, marca, modelo, patente, anio, capacidad_carga });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe un vehículo con esa patente' });
    }
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;
    const [result] = await pool.query(
      'UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, anio = ?, capacidad_carga = ? WHERE id = ?',
      [marca, modelo, patente, anio, capacidad_carga, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    res.json({ id: req.params.id, marca, modelo, patente, anio, capacidad_carga });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe un vehículo con esa patente' });
    }
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM vehiculos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar: el vehículo tiene viajes asociados' });
    }
    next(error);
  }
};
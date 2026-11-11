import { pool } from '../config/db.js';

const mensajeDuplicado = (error) =>
  error.sqlMessage?.includes('numero_licencia')
    ? 'Ya existe un conductor con ese número de licencia'
    : 'Ya existe un conductor con ese número de documento';

export const listar = async (req, res, next) => {
  try {
    const { apellido } = req.query;
    let sql = 'SELECT * FROM conductores';
    const params = [];
    if (apellido) {
      sql += ' WHERE apellido LIKE ?';
      params.push(`%${apellido}%`);
    }
    sql += ' ORDER BY apellido, nombre';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM conductores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;
    const [result] = await pool.query(
      `INSERT INTO conductores
       (nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia]
    );
    res.status(201).json({
      id: result.insertId,
      nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: mensajeDuplicado(error) });
    }
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;
    const [result] = await pool.query(
      `UPDATE conductores
       SET nombre = ?, apellido = ?, numero_documento = ?, numero_licencia = ?,
           fecha_alta_licencia = ?, fecha_vencimiento_licencia = ?
       WHERE id = ?`,
      [nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    res.json({
      id: req.params.id,
      nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: mensajeDuplicado(error) });
    }
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM conductores WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar: el conductor tiene viajes asociados' });
    }
    next(error);
  }
};
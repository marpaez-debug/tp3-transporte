import { pool } from '../config/db.js';

const SELECT_VIAJE = `
  SELECT v.*,
         ve.marca, ve.modelo, ve.patente,
         c.nombre AS conductor_nombre, c.apellido AS conductor_apellido
  FROM viajes v
  JOIN vehiculos ve ON ve.id = v.vehiculo_id
  JOIN conductores c ON c.id = v.conductor_id`;

const errorReferencia = (error) => {
  if (error.code !== 'ER_NO_REFERENCED_ROW_2') return null;
  return error.sqlMessage?.includes('fk_viaje_vehiculo')
    ? 'El vehículo indicado no existe'
    : 'El conductor indicado no existe';
};

const sumarKilometros = (viajes) =>
  Math.round(viajes.reduce((acc, v) => acc + Number(v.kilometros), 0) * 100) / 100;

export const listar = async (req, res, next) => {
  try {
    const { vehiculo_id, conductor_id } = req.query;
    const condiciones = [];
    const params = [];
    if (vehiculo_id) {
      condiciones.push('v.vehiculo_id = ?');
      params.push(vehiculo_id);
    }
    if (conductor_id) {
      condiciones.push('v.conductor_id = ?');
      params.push(conductor_id);
    }
    const where = condiciones.length ? ` WHERE ${condiciones.join(' AND ')}` : '';
    const [rows] = await pool.query(`${SELECT_VIAJE}${where} ORDER BY v.fecha_salida DESC`, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const obtener = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`${SELECT_VIAJE} WHERE v.id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;
    const [result] = await pool.query(
      `INSERT INTO viajes
       (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones || null]
    );
    const [rows] = await pool.query(`${SELECT_VIAJE} WHERE v.id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    const mensaje = errorReferencia(error);
    if (mensaje) return res.status(400).json({ error: mensaje });
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;
    const [result] = await pool.query(
      `UPDATE viajes
       SET vehiculo_id = ?, conductor_id = ?, fecha_salida = ?, fecha_llegada = ?,
           origen = ?, destino = ?, kilometros = ?, observaciones = ?
       WHERE id = ?`,
      [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    const [rows] = await pool.query(`${SELECT_VIAJE} WHERE v.id = ?`, [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    const mensaje = errorReferencia(error);
    if (mensaje) return res.status(400).json({ error: mensaje });
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM viajes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const historialVehiculo = async (req, res, next) => {
  try {
    const [vehiculos] = await pool.query(
      'SELECT id, marca, modelo, patente FROM vehiculos WHERE id = ?',
      [req.params.id]
    );
    if (vehiculos.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    const [viajes] = await pool.query(
      `${SELECT_VIAJE} WHERE v.vehiculo_id = ? ORDER BY v.fecha_salida DESC`,
      [req.params.id]
    );
    res.json({
      vehiculo: vehiculos[0],
      cantidad_viajes: viajes.length,
      total_kilometros: sumarKilometros(viajes),
      viajes,
    });
  } catch (error) {
    next(error);
  }
};

export const historialConductor = async (req, res, next) => {
  try {
    const [conductores] = await pool.query(
      'SELECT id, nombre, apellido, numero_documento FROM conductores WHERE id = ?',
      [req.params.id]
    );
    if (conductores.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    const [viajes] = await pool.query(
      `${SELECT_VIAJE} WHERE v.conductor_id = ? ORDER BY v.fecha_salida DESC`,
      [req.params.id]
    );
    res.json({
      conductor: conductores[0],
      cantidad_viajes: viajes.length,
      total_kilometros: sumarKilometros(viajes),
      viajes,
    });
  } catch (error) {
    next(error);
  }
};
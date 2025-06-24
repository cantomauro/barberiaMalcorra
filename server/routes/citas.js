// server/routes/citas.js
const router = require('express').Router();
const db = require('../db');

// Obtener citas de un barbero
router.get('/barbero/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM citas WHERE barbero_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear cita, validando solapamientos
router.post('/barbero/:id', async (req, res) => {
  const barbero_id = req.params.id;
  const { cliente_nombre, cliente_telefono, fecha, duracion_min } = req.body;

  try {
    // Validar solapamiento
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fechaInicio.getTime() + duracion_min * 60000);
    const [conflict] = await db.query(`
      SELECT COUNT(*) AS cnt FROM citas
       WHERE barbero_id = ?
         AND fecha < ?
         AND DATE_ADD(fecha, INTERVAL duracion_min MINUTE) > ?`,
      [barbero_id, fechaFin, fechaInicio]
    );
    if (conflict[0].cnt > 0) {
      return res.status(400).json({ error: 'Horario no disponible' });
    }

    // Insertar cita
    await db.query(
      'INSERT INTO citas (barbero_id, cliente_nombre, cliente_telefono, fecha, duracion_min) VALUES (?,?,?,?,?)',
      [barbero_id, cliente_nombre, cliente_telefono, fecha, duracion_min]
    );
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cliente_nombre, cliente_telefono, fecha, duracion_min } = req.body;
    try {
      // (Opcional) podrías volver a validar solapamientos aquí…
      const [result] = await db.query(
        'UPDATE citas SET cliente_nombre = ?, cliente_telefono = ?, fecha = ?, duracion_min = ? WHERE id = ?',
        [cliente_nombre, cliente_telefono, fecha, duracion_min, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // DELETE /api/citas/:id — cancelar una cita
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query(
        'DELETE FROM citas WHERE id = ?',
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/fullcalendar', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id AS id,
        c.barbero_id AS resourceId,
        c.cliente_nombre AS title,
        fecha AS start,
        DATE_ADD(fecha, INTERVAL duracion_min MINUTE) AS end
      FROM citas c
    `);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});
  
module.exports = router;

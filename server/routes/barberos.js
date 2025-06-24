const express = require('express');
const router = express.Router();
const { sql, dbConfig } = require('../db');

router.get('/', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT Id AS id, Nombre AS nombre FROM Barberos');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener barberos');
  }
});

router.post('/', async (req, res) => {
  const { nombre } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`INSERT INTO Barberos (Nombre) VALUES (${nombre})`;
    res.status(201).send('Barbero creado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear barbero');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`UPDATE Barberos SET Nombre = ${nombre} WHERE Id = ${id}`;
    res.send('Barbero actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar barbero');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(dbConfig);
    await sql.query`DELETE FROM Barberos WHERE Id = ${id}`;
    res.send('Barbero eliminado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar barbero');
  }
});

module.exports = router;

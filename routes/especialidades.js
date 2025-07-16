const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Especialidad = require('../models/Especialidad');

// Obtener todas las especialidades
router.get('/', auth, async (req, res) => {
  try {
    const lista = await Especialidad.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener especialidades' });
  }
});

// Registrar una nueva especialidad
router.post('/', auth, async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = new Especialidad({ nombre });
    await nueva.save();
    res.json({ mensaje: 'Especialidad registrada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar especialidad' });
  }
});

module.exports = router;

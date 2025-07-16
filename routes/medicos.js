const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medico = require('../models/Medico');

router.get('/', auth, async (req, res) => {
  const medicos = await Medico.find().populate('especialidad').populate('unidad_medica');
  res.json(medicos);
});

router.post('/', auth, async (req, res) => {
  try {
    const { nombre, especialidad, unidad_medica } = req.body;
    const nuevo = new Medico({ nombre, especialidad, unidad_medica });
    await nuevo.save();
    res.json({ mensaje: 'Médico registrado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar médico' });
  }
});

module.exports = router;

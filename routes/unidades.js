const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Unidad = require('../models/Unidad');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Unidad.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener unidades médicas' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const nueva = new Unidad({ nombre, direccion });
    await nueva.save();
    res.status(201).json({ mensaje: 'Unidad médica registrada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar unidad médica' });
  }
});

module.exports = router;

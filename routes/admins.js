const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Administrador = require('../models/Administrador');

// Obtener todos los administradores
router.get('/', auth, async (req, res) => {
  try {
    const admins = await Administrador.find({}, '-password_hash');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener administradores' });
  }
});

// Crear nuevo administrador
router.post('/', auth, async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Administrador.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El email ya existe' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevo = new Administrador({ nombre, email, password_hash, rol });
    await nuevo.save();

    res.json({ mensaje: 'Administrador registrado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar administrador' });
  }
});

module.exports = router;

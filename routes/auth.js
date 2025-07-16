const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');


// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;
  console.log("Intento de login:", email);

  try {
    let usuario = await Usuario.findOne({ email });
    let tipo = 'cliente';

    if (!usuario) {
      usuario = await Administrador.findOne({ email });
      tipo = 'admin';
    }

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const payload = {
      id: usuario._id,
      rol: usuario.rol || tipo,
      tipo,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'claveSecretaPorDefecto', {
      expiresIn: '6h',
    });

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || tipo,
      },
    });

  } catch (error) {
    console.error("❌ Error al hacer login:", error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});




// ✅ REGISTRO DE NUEVOS CLIENTES
router.post('/registro', async (req, res) => {
  const { nombre, email, contrasena, telefono, fecha_nacimiento } = req.body;

  try {
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      telefono,
      fecha_nacimiento,
      contrasena: hash,
      rol: 'cliente'
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

module.exports = router;

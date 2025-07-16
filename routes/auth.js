const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');


// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;
  console.log("Intentando iniciar sesión:", email);
  
  try {
    // Primero busca en la colección de usuarios normales
    let usuario = await Usuario.findOne({ email });
    let tipo = 'cliente';

    // Si no lo encuentra, busca en la colección de administradores
    if (!usuario) {
      usuario = await Administrador.findOne({ email });
      tipo = 'admin';
    }

    // Si no se encuentra ningún usuario o no tiene contraseña, error
    if (!usuario || !usuario.contrasena) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado o sin contraseña' });
    }

    // Compara la contraseña ingresada con la almacenada (cifrada)
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Crear el payload del JWT
    const payload = {
      id: usuario._id,
      rol: usuario.rol || tipo,
      tipo
    };

    // Firmar el token con duración de 6h
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    // Respuesta exitosa
    res.json({
      token,
      tipo,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || tipo
      }
    });

  } catch (error) {
  console.error('Error al iniciar sesión:', error);  
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

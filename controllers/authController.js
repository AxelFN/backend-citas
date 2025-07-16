const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) return res.status(400).json({ msg: 'El usuario ya existe' });

    const nuevoUsuario = new Usuario({ nombre, email, password, rol });
    const salt = await bcrypt.genSalt(10);
    nuevoUsuario.password = await bcrypt.hash(password, salt);
    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const esMatch = await bcrypt.compare(password, usuario.password);
    if (!esMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

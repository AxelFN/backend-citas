const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'cliente'], default: 'cliente' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

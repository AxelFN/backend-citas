const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password_hash: String,
  rol: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
});

module.exports = mongoose.model('Administrador', administradorSchema, 'administradores');

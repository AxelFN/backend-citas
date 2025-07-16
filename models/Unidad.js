const mongoose = require('mongoose');

const unidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String }
});

module.exports = mongoose.model('Unidad', unidadSchema);

const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad', required: true },
  unidad_medica: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad', required: true }
});

module.exports = mongoose.model('Medico', medicoSchema);

const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
  especialidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad' },
  unidad_medica: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad' },
  fecha: Date,
  hora: String,
  servicio: String,
  estatus: { type: String, default: 'pendiente' }
}, { timestamps: true });

module.exports = mongoose.model('Cita', citaSchema);

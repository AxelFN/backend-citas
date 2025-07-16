// controllers/medicoController.js
const Medico = require('../models/Medico');

const listar = async (req, res) => {
  try {
    const medicos = await Medico.find().populate('especialidad').populate('unidad');
    res.json(medicos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los médicos' });
  }
};

module.exports = { listar };

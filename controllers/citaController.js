const Cita = require('../models/Cita');

exports.agendarCita = async (req, res) => {
  try {
    const cita = new Cita({ ...req.body, usuario_id: req.usuario.id });
    await cita.save();
    res.status(201).json(cita);
  } catch (error) {
    res.status(500).json({ msg: 'Error al agendar cita' });
  }
};

exports.obtenerCitas = async (req, res) => {
  try {
    const filtro = req.usuario.rol === 'admin' ? {} : { usuario_id: req.usuario.id };
    const citas = await Cita.find(filtro)
      .populate('medico_id')
      .populate('especialidad_id')
      .populate('unidad_medica_id')
      .populate('usuario_id');
    res.json(citas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener citas' });
  }
};

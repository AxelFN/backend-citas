const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cita = require('../models/Cita');

// Verificar si ya existe una cita para un médico en una fecha específica
router.get('/medico/:medicoId/fecha/:fecha', async (req, res) => {
  try {
    const { medicoId, fecha } = req.params;

    const fechaSeleccionada = new Date(fecha);
    const horaInicio = new Date(fechaSeleccionada);
    const horaFin = new Date(fechaSeleccionada);
    horaFin.setMinutes(horaFin.getMinutes() + 59); // Rango de 1 hora

    const citaExistente = await Cita.findOne({
      medico: medicoId,
      fecha: {
        $gte: horaInicio,
        $lte: horaFin
      }
    });

    if (citaExistente) {
      return res.json({ existe: true });
    } else {
      return res.json({ existe: false });
    }
  } catch (error) {
    console.error("Error al verificar cita:", error);
    res.status(500).json({ mensaje: "Error al verificar disponibilidad de cita" });
  }
});

// Crear nueva cita
router.post('/', auth, async (req, res) => {
  try {
    const { medico, unidad_medica, especialidad, fecha, hora, servicio } = req.body;

    const nuevaCita = new Cita({
      usuario: req.usuario.id,
      medico,
      unidad_medica,
      especialidad,
      fecha,
      hora,
      servicio
    });

    await nuevaCita.save();
    res.status(201).json({ mensaje: 'Cita agendada correctamente' });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ mensaje: 'Error al agendar la cita' });
  }
});

// Consultar citas del usuario
router.get('/mias', auth, async (req, res) => {
  try {
    const citas = await Cita.find({ usuario: req.usuario.id })
      .populate('medico')
      .populate('unidad_medica')
      .populate('especialidad');
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las citas' });
  }
});

// Cancelar cita
router.delete('/:id', auth, async (req, res) => {
  try {
    const cita = await Cita.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id
    });

    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    res.json({ mensaje: 'Cita cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar la cita' });
  }
});

// Obtener todas las citas (para panel admin)
router.get('/todas', auth, async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('usuario', 'nombre')
      .populate('medico', 'nombre')
      .populate('especialidad', 'nombre')
      .populate('unidad_medica', 'nombre');
    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener citas' });
  }
});

// Actualizar estado de cita (aceptar, cancelar, etc.)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { estatus } = req.body;
    await Cita.findByIdAndUpdate(req.params.id, { estatus });
    res.json({ mensaje: 'Cita actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar cita' });
  }
});

module.exports = router;


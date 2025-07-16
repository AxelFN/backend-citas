//aqui conectamos la base de mongoodb
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


//aviso para ver si la conexion fue un exito
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en la conexión MongoDB:', err));

  //Las rutas para conectar la base de datos
app.use('/api/usuarios', require('./routes/auth'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/especialidades', require('./routes/especialidades'));
app.use('/api/unidades', require('./routes/unidades'));
app.use('/api/citas', require('./routes/citas'));



//el puerto que se usara
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));

//Registros
const citasRoutes = require('./routes/citas');
app.use('/api/citas', citasRoutes);
const medicoRoutes = require('./routes/medicos');
app.use('/api/medicos', medicoRoutes);
const especialidadesRoutes = require('./routes/especialidades');
app.use('/api/especialidades', especialidadesRoutes);
const adminRoutes = require('./routes/admins');
app.use('/api/admins', adminRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

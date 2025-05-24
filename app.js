// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Inicializar la aplicación
const app = express();
const PORT = 3000;

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// Importar rutas (fachadas)
const productoRoutes = require('./routes/producto'); // automáticamente busca index.js
const ordenRoutes = require('./routes/orden'); // automáticamente busca index.js
const facturaRoutes = require('./routes/factura'); // automáticamente busca index.js

// Usar las rutas montadas
app.use('/producto', productoRoutes);
app.use('/orden', ordenRoutes);
app.use('/factura', facturaRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('API del restaurante funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
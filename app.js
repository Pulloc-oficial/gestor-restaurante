//Archivo app.js
//Librerias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

//Esta parte inicializa la aplicacion node que es una app express:
const app = express();
const PORT = 3000;

//usamos los filtros que recibiran las peticiones:
app.use(cors());
app.use(bodyParser.json());

//LEER-->creacion de ruta para leer los archivos del excel:
app.get('/productos', (req, res) => {
  const filePath = path.join(__dirname, './db/producto.xlsx');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(productos);
});

//ESCRIBIR-->Creacion de ruta para escribir el archivo excel de productos
const jsonParser = bodyParser.json()
app.post('/productos', jsonParser, function (req, res) {
  const filePath = path.join(__dirname, './db/producto.xlsx');
  
  if (!req.body) res.sendStatus(400);
  // create user in req.body
  res.json(req.body);
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


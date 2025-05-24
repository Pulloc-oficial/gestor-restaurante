//Archivo app.js
//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
    

//fichero db producto.xlsx
const filePath = path.join(__dirname, '../../db/producto.xlsx');

//GET -> productos
router.get('/', (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(productos);
});

//POST -> productos
router.post('/', (req, res) => {
  const nuevoProducto = req.body;
  let productos = [];

  if (fs.existsSync(filePath)) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    productos = xlsx.utils.sheet_to_json(sheet);
  }

  productos.push(nuevoProducto);

  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(productos);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Productos');
  xlsx.writeFile(newWorkbook, filePath);

  res.status(201).json({ mensaje: 'Producto guardado correctamente', producto: nuevoProducto });

})

module.exports = router;


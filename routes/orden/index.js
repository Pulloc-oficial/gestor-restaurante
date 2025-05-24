
//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
    

//fichero db producto.xlsx
const filePath = path.join(__dirname, '../../db/orden.xlsx');

//GET -> productos
router.get('/', (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo orden.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const ordenes = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(ordenes);
});

//POST -> productos
router.post('/', (req, res) => {
  const nuevaOrden = req.body;
  let ordenes = [];

  if (fs.existsSync(filePath)) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    ordenes = xlsx.utils.sheet_to_json(sheet);
  }

  ordenes.push(nuevaOrden);

  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(ordenes);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'ordenes');
  xlsx.writeFile(newWorkbook, filePath);

  res.status(201).json({ mensaje: 'Orden guardada correctamente', orden: nuevaOrden });

})

module.exports = router;


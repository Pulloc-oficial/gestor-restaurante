
//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
    

//fichero db producto.xlsx
const filePath = path.join(__dirname, '../../db/factura.xlsx');

//GET -> productos
router.get('/', (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo factura.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const facturas = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(facturas);
});

//POST -> productos
router.post('/', (req, res) => {
  const nuevaFactura = req.body;
  let facturas = [];

  if (fs.existsSync(filePath)) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    facturas = xlsx.utils.sheet_to_json(sheet);
  }

  facturas.push(nuevaFactura);

  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(facturas);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'facturas');
  xlsx.writeFile(newWorkbook, filePath);

  res.status(201).json({ mensaje: 'factura guardada correctamente', factura: nuevaFactura });

})

module.exports = router;



//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const checkApiKey = require('../../middlewares/checkApiKey');
    

//fichero db factura.xlsx
const filePath = path.join(__dirname, '../../db/factura.xlsx');

//GET -> LEER TODAS LAS FACTURAS
router.get('/', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo factura.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const facturas = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(facturas);
});

//GET -> LEER ID DE UNA FACTURA
router.get('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const item = productos.find(p => String(p.Uid) === String(req.params.Uid));
  
  if (!item) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(item);
});

//POST -> AGREGAR UNA NUEVA FACTURA
router.post('/', checkApiKey, (req, res) => {
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

//PUT -> ACTUALIZAR UN ELEMENTO
router.delete('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo factura.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const facturas = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = facturas.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'factura no encontrado para actualizar' });
  }

  facturas[index] = { ...facturas[index], ...req.body };
  
  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(facturas);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'facturas');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'factura actualizada correctamente', factura: facturas[index] });

});

//DELETE -> ELIMINAR UN ELEMENTO
router.delete('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo factura.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const facturas = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = facturas.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'factura no encontrado para eliminar' });
  }

  facturas.splice(index, 1);
  
  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(facturas);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'facturas');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'factura eliminada correctamente', Uid: req.params.Uid });

});

module.exports = router;



//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const checkApiKey = require('../../middlewares/checkApiKey');
    

//fichero db orden.xlsx
const filePath = path.join(__dirname, '../../db/orden.xlsx');

//GET -> LEER TODAS LAS ORDENES
router.get('/', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo orden.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const ordenes = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(ordenes);
});

//GET -> LEER ID DE UNA ORDEN
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

//POST -> AGREGAR UNA ORDEN
router.post('/', checkApiKey, (req, res) => {
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

//PUT -> ACTUALIZAR UN ELEMENTO
router.delete('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo orden.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const ordenes = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = ordenes.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'orden no encontrado para actualizar' });
  }

  ordenes[index] = { ...ordenes[index], ...req.body };
  
  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(ordenes);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'ordenes');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'orden actualizada correctamente', orden: ordenes[index] });

});

//DELETE -> ELIMINAR UN ELEMENTO
router.delete('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo orden.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const ordenes = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = ordenes.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'orden no encontrado para eliminar' });
  }

  ordenes.splice(index, 1);
  
  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(ordenes);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'ordenes');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'orden eliminada correctamente', Uid: req.params.Uid });

});

module.exports = router;


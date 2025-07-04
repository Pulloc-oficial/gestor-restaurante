//Archivo app.js
//Librerias necesarias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const checkApiKey = require('../../middlewares/checkApiKey');
const { strictEqual } = require('assert');
    

//fichero db producto.xlsx
const filePath = path.join(__dirname, '../../db/producto.xlsx');

//GET -> LEER TODOS LOS PRODUCTOS
router.get('/', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(productos);
});

//GET -> OBTENER PAGINACION 25-Productos
router.get('/paginado', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }
 
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const page = parseInt(req.query.page) || 1;
 
  const start = (page - 1) * 25;
  const end = start + 25;
  const productosPagina = productos.slice(start, end);
  
  res.json(productosPagina);
});

//GET -> LEER ID DE UN PRODUCTO
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



//POST -> AGREGAR UN PRODUCTO
router.post('/', checkApiKey, (req, res) => {
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

//PUT -> ACTUALIZAR UN PRODUCTO
router.put('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = productos.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
  }

  productos[index] = { ...productos[index], ...req.body };

  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(productos);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Productos');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto: productos[index] });

});

//DELETE -> ELIMINAR UN ELEMENTO
router.delete('/:Uid', checkApiKey, (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo producto.xlsx no encontrado' });
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const productos = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const index = productos.findIndex(p => String(p.Uid) === String(req.params.Uid));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
  }

  productos.splice(index, 1);

  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(productos);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Productos');
  xlsx.writeFile(newWorkbook, filePath);
  
  res.status(200).json({ mensaje: 'Producto eliminado correctamente', Uid: req.params.Uid });

});




module.exports = router;


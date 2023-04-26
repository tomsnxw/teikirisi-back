var express = require('express');
var router = express.Router();
require('dotenv').config();
var nodemailer = require('nodemailer');
const mysql = require('mysql');
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'teikirisi'
});

router.get('/api/productos', function(req, res, next) {
  connection.query('SELECT * FROM productos', function(err, rows, fields) {
    if (err) throw err;

    res.json(rows);
  });
});

router.get('/api/productos/:id', function(req, res, next) {
  const id = req.params.id;
  connection.query('SELECT * FROM productos WHERE id = ?', [id], function(err, rows, fields) {
    if (err) throw err;

    res.json(rows[0]);
  });
});

router.post('/api/carrito/agregar', function(req, res, next) {
  const id_producto = req.body.id;
  const nombre_producto = req.body.nombre;
  const imagen_front_producto =req.body.imagen_front;
  const imagen_back_producto =req.body.imagen_back;
  const precio_producto = req.body.precio;

  connection.query('INSERT INTO carrito (id, nombre,imagen, precio) VALUES (?, ?, ?, ?)', [id_producto, nombre_producto,imagen_front_producto, imagen_back_producto, precio_producto], function(err, result) {
    if (err) throw err;

    res.json({ message: 'Producto agregado al carrito correctamente.' });
  });
});

router.post('/api/contacto', async (req,res)=>{
  const mail ={
    to: "410toms@gmail.com",
    subject: "contacto web",
    html: `${req.body.nombre} se contacto a traves de la web y queire más información a este correo: ${req.body.email} <br> Además hizo el siguiente comentario: ${req.body.mensaje} <br> Su telefono es es ${req.body.telefono}`
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth:{
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transport.sendMail(mail)
  res.status(201).json({
    error: false,
    message: 'mensaje enviado'
  })
});


module.exports = router;
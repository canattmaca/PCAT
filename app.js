//Save exact devDependies e atıyor
//--save dependencies= zorunlu !
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require('ejs');

const photoController = require('./controlllers/photoControllers');
const pageController = require('./controlllers/pageController');

const port = 3000;
const app = express();

//CONNECT DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
//birden fazla method u manipüle edeceksek bu şekilde yapmalıyız yoksa hata alırız.
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});

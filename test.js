const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//connect DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

//create  Schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});
const Photo = mongoose.model('Photo', PhotoSchema);

//create a photo
// Photo.create({
//   title: 'Photo Title 2',
//   description: 'Photo description 2 lorem ipsum',
// });

// Mongoose ODM object document maper aracıdır

// read a photo
// Photo.find({}).then((data) => {
//   console.log(data);
// });

//update a photo
const id = '645a3bcfba681d1cb86ffbdf';
// Photo.findByIdAndUpdate(
//   id,
//   {
//     title: 'Photo Title 1111 Updated',
//     description: 'Photo description 1111 updated',
//   },
//   { new: true }
// ).then((data) => console.log(data));

//delete a photo
// Photo.findByIdAndDelete(id).then((data) => console.log(data))

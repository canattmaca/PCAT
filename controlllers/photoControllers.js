const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 1;
  const totalPhotos = await Photo.find({}).countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    // photos:photos
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};
exports.getPhoto = async (req, res) => {
  // console.log(req.params.id);
  // res.render('add');
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  //req.files.image => name=image olarak post ediyorum oradan yakalıyorum
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  // console.log(uploadedImage);
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
  // console.log(uploadPath);

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

// edit işlemlerinde tarayıcıyı middleware kullanarak manipüle ettik bunun için methodOverride kullandık. Bu yöntemle aslında put olan yöntemi tarayıdan post olarak gönderdik. Tarayıcıda desteklemiyordu ama express tarafında app.put kullanarak devam ettik. ilgili dizine ulaşıp photo yu aldık ve photo.title ve description a => req.body {title,description} üzerinden alıp üzerine bastık ve save() komutu ile üzerine bastık. daha sonra tekrar edit sayfasına yönlendirdik.
exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

//DELETE İŞLEMİNİ YAPIYORUZ.
// delete işlemi yaparken yine methodOverride kullandık. Tarayıcı üzerinden ahref=''  get isteği gönderdik=> ama burda onu delete olarak karşıladık. id üzerinden photo ulaştık. Sonrasında databaseden sildik ama bu doğru yöntem değildi çünkü önce upload klasöründeki jpeg dosyasını silmeliydik bunun için yeni bir değişken olusturup dosya dizinini aldık. bunun için photo.image kullandık. daha sonra if açıp image var mı kontrol ettik ve bunu senkron şekilde yaptık. Sonrasında findByIdAndRemove kullanarak bunu databaseden de silip tekrar ana sayfaya yönlendirdik

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;

  if (fs.existsSync(deletedImage)) {
    fs.unlinkSync(deletedImage);
  }
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};

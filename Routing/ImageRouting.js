const expres = require("express");
const sharp = require("sharp");
const ImageRoute = expres.Router();

ImageRoute.get("/instansi", (req, res) => {
    const source = req.query.source;
    const size = req.query.size;
    sharp("./public/upload/" + source + ".png")
        .resize({ width: parseInt(size), height: parseInt(size) })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/berita", (req, res) => {
    const source = req.query.source;
    const size = req.query.size;
    sharp("./public/berita/" + source + ".jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/profil-kepala-dinas", (req, res) => {
    const size = req.query.size;
    sharp("./public/kepala-dinas/profil-kepala-dinas.jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/profil-walikota", (req, res) => {
    const size = req.query.size;
    sharp("./public/profil-walikota/profil-walikota.jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/banner", (req, res) => {
    const size = req.query.size;
    const target = req.query.target;
    sharp("./public/banner/" + target + ".jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/slide-show", (req, res) => {
    const size = req.query.size;
    const target = req.query.target;
    sharp("./public/slide-show/" + target + ".jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/galeri", (req, res) => {
    const size = req.query.size;
    const target = req.query.target;
    sharp("./public/galeri/" + target + ".jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
ImageRoute.get("/header", (req, res) => {
    const size = req.query.size;
    const target = req.query.target;
    sharp("./public/header-image/" + target + ".jpg")
        .resize({ width: parseInt(size), })
        .jpeg()
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Mengirim gambar sebagai respons HTTP dengan tipe konten "image/jpeg"
                res.setHeader('Content-Type', 'image/png');
                res.end(data);
            }
        });
})
module.exports = ImageRoute;
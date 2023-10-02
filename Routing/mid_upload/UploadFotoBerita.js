const path = require("path");

const multer = require("multer");
const random = require("../../utils/rand");
const { request } = require("http");
const location = "./public/berita";

const stroge = multer.diskStorage(
    {
        destination: (req, file, callback) => {
            callback(null, location);
        },
        filename: (req, file, callback) => {
            const extensi = ".jpg";
            const nama_file = random(1000000000, 9990099999) + "-berita.jpg";
            callback(null, nama_file);
        }

    }

)

const upload_foto_berita = multer({
    storage: stroge,
})
module.exports = upload_foto_berita;


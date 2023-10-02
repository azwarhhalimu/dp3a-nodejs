const multer = require("multer");
const path = require("path");
const random = require("../../utils/rand");

const location = "./public/profil-wakil-walikota";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, location);
    },

    filename: (req, file, callback) => {
        const nama_file = random(100000, 999999) + ".jpg";
        callback(null, nama_file);
    }

})
const upload_profil_wakil_walikota = multer({
    storage: storage
})
module.exports = upload_profil_wakil_walikota;
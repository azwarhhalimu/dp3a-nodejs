const multer = require("multer");
const path = require("path");
const random = require("../../utils/rand");

const location = "./public/kepala-dinas";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, location);
    },

    filename: (req, file, callback) => {
        const nama_file = random(100000, 999999) + ".jpg";
        callback(null, nama_file);
    }

})
const upload_foto_kepala_dinas = multer({
    storage: storage
})
module.exports = upload_foto_kepala_dinas;
const path = require("path");
const multer = require("multer");


const location = './public/upload';
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, location);
    },

    filename: function (req, file, callback) {

        const extensi = path.extname(file.originalname);
        const nama_File = Math.random() + "-okos.id.png";
        callback(null, nama_File);
    },


});
const upload_logo_instansi = multer({ storage: storage })


module.exports = upload_logo_instansi;




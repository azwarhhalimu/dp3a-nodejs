const multer = require("multer");
const random = require("../../utils/rand");
const location = "./public/banner";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, location);
    },
    filename: (req, file, callback) => {
        const nama_file = random(10000, 99999) + ".jpg";
        callback(null, nama_file);
    }
});
const upload_foto_banner = multer({
    storage: storage
})
module.exports = upload_foto_banner;
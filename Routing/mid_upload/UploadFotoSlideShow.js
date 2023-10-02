const multer = require("multer");
const random = require("../../utils/rand");

const destination = "./public/slide-show";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, destination);
    },
    filename: (req, file, callback) => {
        const name = "kdb-" + random(10000, 99999) + ".jpg";
        callback(null, name);
    }
})
const upload_foto_slide_show = multer({
    storage: storage
});
module.exports = upload_foto_slide_show;
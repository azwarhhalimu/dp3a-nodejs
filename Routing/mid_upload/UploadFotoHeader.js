const multer = require("multer");
const random = require("../../utils/rand");

const location = "./public/header-image";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, location);
    },
    filename: (req, file, callback) => {
        const name = "rdc-" + random(1000, 9999) + ".jpg"
        callback(null, name);

    }
})

const uploadFotoHeader = multer({
    storage: storage,
})
module.exports = uploadFotoHeader;
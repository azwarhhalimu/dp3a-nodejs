const AlertFlash = (req, res, next) => {

    console.log("azwar");
    next();
}
const createFlash = (req, type, pesan) => {
    req.session.flash_type = type;
    req.session.flash_pesan = pesan;
}
const sendFlash = (req, res) => {
    if (typeof req.session.pesan_flash != "undefined") {
        res.locals.pesan_flash = req.session.pesan_flash;
    }
    res.locals.pesan_flash = "";
}
module.exports = { AlertFlash, createFlash, sendFlash };


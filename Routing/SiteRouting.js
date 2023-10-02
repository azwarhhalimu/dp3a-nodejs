const express = require("express");
const site_router = express.Router();

site_router.get("/", async (req, res) => {
    let model = await new Slide
    res.render("index", {

    });
})
site_router.get("/instansi.html", (req, res) => {
    res.render("testing.ejs");
})

module.exports = site_router;
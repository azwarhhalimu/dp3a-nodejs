
var reload = require("reload");
const express = require("express");
const app = express();
const expressEjsLayouts = require("express-ejs-layouts");
const bodyParse = require("body-parser");
//routing
const siteRouting = require("./Routing/SiteRouting");
const admin_routing = require("./Routing/AdminRouting");
const ImageRoute = require("./Routing/ImageRouting");
const session = require("express-session");
const LoginPage = require("./Controller/LoginController");
const flash = require("connect-flash");
// setting template
app.set("view engine", "ejs");

app.use(expressEjsLayouts);
app.use("/template", express.static("public/template"));
app.use("/Swiper-master", express.static("public/Swiper-master"));
app.use("/admin-template", express.static("public/admin"));
app.use("/percircle", express.static("public/percircle"));
app.use("/assets", express.static("public/assets"))

app.use("/jcrop", express.static("public/jcrop"));
//routing
//midlele ware

app.set("layout", "./layout/layouts.ejs");
app.use("/", (req, res, next) => {
    app.set("layout", "./layout/layouts.ejs");
    next();
})
app.use(session({
    secret: 'ydfadf', // Change this to a secure secret key
    resave: true,
    cookie: {
        path: "/",
        maxAge: null,
    },
    saveUninitialized: true,
}));
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging purposes

    // Render a custom error page
    res.status(500).render('error', { error: err });
});
app.use(bodyParse.urlencoded({ extended: false }))
app.use(bodyParse.json());
app.use("/admin", (req, res, next) => {


    req.session.login = JSON.stringify({
        no: 3,
        id_user: '78888',
        username: 'okos',
        password: 'bW5ofg==',
        nama: 'DP3A BAUBAU'
    })

    app.use(express.urlencoded({ extended: true }));

    app.set("layout", "./layout/admin-layout.ejs");

    if (typeof req == "undefined") {
        res.send("error");
    }
    if (typeof req.session.login == "undefined") {
        res.redirect("/login.html?action=need-login");
    }
    else {
        next();
    }

})

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");

});
app.use(flash());
app.all("/login.html", LoginPage)
app.use("/", siteRouting);
app.use("/admin", admin_routing);
app.use("/images", ImageRoute);


const port = 2000;
app.listen(port, () => {
    console.log("aplikasi berjalan di port " + port);
})
reload(app);
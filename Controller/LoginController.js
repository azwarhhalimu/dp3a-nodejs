const LoginMdl = require("../model/LoginMdl");
const RC4 = require("../utils/Rc4");



const LoginPage = async (req, res) => {
    // res.render("login.ejs")
    switch (req.method) {
        case 'POST':
            const form_data = req.body;
            const login = await new LoginMdl().auth(req, form_data);
            if (login == "login_sukses") {
                res.redirect("/admin/");
            }
            else {
                res.redirect("/login.html?error=true");
            }

            break;
        default:

            res.render("login.ejs", { layout: false });
            break;
    }

}
module.exports = LoginPage;
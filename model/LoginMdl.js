const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const { encryptRc } = require("../utils/encryptRc");
const pool = mysql.createPool(dbConfig);

module.exports = class LoginMdl {
    async auth(req, form_data) {
        const [query] = await pool.query("SELECT *FROM login WHERE username=? and password=?", [
            form_data.username, encryptRc(form_data.password)
        ]);
        if (query.length == 1) {
            console.log(query[0])
            req.session.login = JSON.stringify(query[0]);
            return "login_sukses";
        }
        return "login_gagal";


    }
}


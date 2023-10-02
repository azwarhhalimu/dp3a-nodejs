const mysql = require("mysql2/promise")
const dbConfig = require("../utils/dbConfig")
const { encryptRc } = require("../utils/encryptRc")
const pool = mysql.createPool(dbConfig)
module.exports = class ProfilMdl {
    async update(form_data, session) {

        const [query] = await pool.query("SELECT * FROM login WHERE id_user=? && password=?",
            [session.id_user, encryptRc(form_data.password_lama)]);


        if (query.length == 1) {
            const [{ affectedRows }] = await pool.execute("UPDATE login SET nama=?, username=?, password=? WHERE id_user=?",
                [form_data.nama, form_data.username, encryptRc(form_data.password_baru), session.id_user])
            if (affectedRows > 0) {
                return "update_sukses";
            }
        }
        return "update_gagal";
    }
}
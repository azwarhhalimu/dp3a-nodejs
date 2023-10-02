const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

module.exports = class ProfilWakilWalikota {
    async getData() {
        const [data] = await pool.query("SELECT * FROM profil_wakil_walikota LIMIT 1");
        console.log(data);
        return data[0];
    }
    async update(form_data) {
        const [{ affectedRow }] = await pool.execute("UPDATE profil_wakil_walikota SET nama=?, isi=? WHERE no!=100", [form_data.nama, form_data.isi]);
        if (affectedRow > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
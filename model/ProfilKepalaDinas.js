const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

module.exports = class ProfilKepalaDinas {
    async getData() {
        const [data] = await pool.query("SELECT * FROM profil_kepala_dinas LIMIT 1");
        console.log(data);
        return data[0];
    }
    async update(form_data) {
        const [{ affectedRow }] = await pool.execute("UPDATE profil_kepala_dinas SET nama=?, isi=? WHERE no!=100", [form_data.nama, form_data.isi]);
        if (affectedRow > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
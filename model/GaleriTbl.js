const mysql = require("mysql2/promise")
const dbConfig = require("../utils/dbConfig")
const pool = mysql.createPool(dbConfig);

module.exports = class GaleriTbl {
    async getAll() {
        const [query] = await pool.query("SELECT * FROM galeri ORDER BY no DESC");
        return query;
    }
    async hapus(id_galeri) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM galeri WHERE id_galeri=?", [id_galeri]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async simpan(id_galeri, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO galeri (id_galeri, label) VALUES (?,?)", [id_galeri, form_data.label]
        );

        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
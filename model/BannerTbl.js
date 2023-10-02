const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

module.exports = class BannerTbl {
    async getAll() {
        const [query] = await pool.query("SELECT * FROM banner ORDER BY no DESC;");
        console.log(query);
        return query;
    }

    async getSingle(id_banner) {
        const [query] = await pool.query("SELECT * FROM banner WHERE id_banner=? ORDER BY no DESC;", [id_banner]);
        if (query.length > 0) {
            return query[0];
        }
        return "data_null"

    }

    async update(id_banner, form_data) {
        const [{ affectedRows }] = await pool.execute("UPDATE banner SET keterangan=?, lokasi=? WHERE id_banner=?",
            [form_data.keterangan, form_data.lokasi, id_banner])
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async delete(id_banner) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM banner WHERE id_banner=?", [id_banner]);
        if (affectedRows > 0) {
            return "sukses"
        }
        return "gagal";
    }
    async simpan(id, formData) {
        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO banner " +
            "   (id_banner, keterangan, lokasi) VALUES " +
            "   (?,?,?)",
            [id, formData.keterangan, formData.lokasi]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
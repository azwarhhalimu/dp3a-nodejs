const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

module.exports = class VideoTbl {
    async insert(id, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO video (id_video, url_youtube,judul) VALUES (?,?,?)",
            [id, form_data.url, form_data.judul]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async hapus(id_video) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM video WHERE id_video=?", [id_video]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async getAll() {
        const [query] = await pool.query("SELECT * FROM video ORDER BY no DESC;")
        return query;
    }

}
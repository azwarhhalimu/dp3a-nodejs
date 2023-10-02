const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

module.exports = class SlideShowTbl {
    async getAll() {
        const [query] = await pool.query('SELECT * FROM slide_show ORDER BY no DESC');
        return query;
    }
    async hapus(id_slide_show) {
        const [{ affectedRows }] = await pool.execute('DELETE FROM slide_show WHERE id_slide_show=?',
            [id_slide_show]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async getSingle(id_slide_show) {
        const [query] = await pool.query("SELECT * FROM slide_show WHERE id_slide_show=?", [id_slide_show]);
        return query[0];
    }
    async update(id_slide_show, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "UPDATE slide_show SET label=? WHERE id_slide_show=?",
            [form.label, id_slide_show]
        )
    }
    async simpan(id_slide_show, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "INSERT into slide_show (id_slide_show, label) VALUES (?,?)",
            [id_slide_show, form_data.label]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
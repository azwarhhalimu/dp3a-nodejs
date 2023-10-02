const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);
module.exports = class InfoTbl {
    async getAll() {
        const [query] = await pool.query("SELECT * FROM info ORDER BY no DESC;");
        return query;
    }
    async delete(id_info) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM info WHERE id_info=?", [id_info]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async update(id_info, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "UPDATE info SET info=?, tanggal=?  WHERE id_info=?", [form_data.isi, form_data.tanggal, id_info]
        )
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async insert(id_info, form_data) {
        const [{ affectedRows }] = await pool.execute("INSERT INTO info (id_info, info, tanggal) VALUES (?,?,?)", [id_info, form_data.isi, form_data.tanggal]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async getSingle(id_info) {
        const [query] = await pool.query("SELECT * FROM info WHERE id_info=?", [id_info]);
        if (query.length > 0) {
            console.log(query[0]);
            return query[0];
        }
        return {};
    }
}
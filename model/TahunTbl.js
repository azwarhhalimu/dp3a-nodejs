const mysql2 = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const pool = mysql2.createPool(dbConfig);
module.exports = class TahunTbl {
    async getAll() {
        const [query] = await pool.query("SELECT * FROM tahun ORDER BY tahun");
        console.log(query);
        return query;
    }
    async getSingle(id_tahun) {
        const [query] = await pool.query("SELECT * FROM tahun WHERE id_tahun=?", [
            id_tahun
        ])
        if (query.length > 0) {
            return query[0];
        }
        return "terjadi_masalah"


    }
    async delete(id_tahun) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM tahun WHERE id_tahun=?", [id_tahun]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async update(id_tahun, tahun) {
        const [{ affectedRows }] = await pool.execute("UPDATE tahun SET tahun=? WHERE id_tahun=?",
            [tahun, id_tahun]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async save(tahun) {
        const [{ affectedRows }] = await pool.execute("INSERT INTO tahun (id_tahun, tahun)value(?,?)",
            [random(1000000000, 9999999999), tahun]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
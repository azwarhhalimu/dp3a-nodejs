const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const pool = mysql.createPool(dbConfig);
module.exports = class IndikatorKuisionerTbl {
    async get(id_data_terpilah) {
        const [query] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_data_terpilah=? ORDER BY no DESC;",
            [id_data_terpilah]);

        // console.log(query);
        return query;
    }

    async getSingle(id_indikator_kuisioner, id_data_terpilah) {
        const [query] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_indikator_kuisioner=? && id_data_terpilah=?",
            [id_indikator_kuisioner, id_data_terpilah]);
        // console.log(query[0]);
        return query[0];
    }

    async update(indikator_kuisioner, id_indikator_kuisioner) {
        const [{ affectedRows }] = await pool.query("UPDATE indikator_kuisioner SET indikator_kuisioner=? WHERE id_indikator_kuisioner=?",
            [indikator_kuisioner, id_indikator_kuisioner]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async save(data) {
        const id = random(1000000000, 9999999999);
        const [{ affectedRows }] = await pool.query('INSERT INTO indikator_kuisioner (id_indikator_kuisioner, id_instansi, id_data_terpilah, id_kategori_data_terpilah, indikator_kuisioner) values (?,?,?,?,?)',
            [id, data.id_instansi, data.id_data_terpilah, data.id_kategori_data_terpilah, data.indikator_kuisioner]);

        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async delete(id) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM indikator_kuisioner WHERE id_indikator_kuisioner=?", [id])
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
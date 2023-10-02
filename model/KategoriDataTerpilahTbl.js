const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const pool = mysql.createPool(dbConfig);
class KategoriDataTerpilahTbl {
    async getAll() {
        const data = [];
        const [query] = await pool.query("SELECT * FROM kategori_data_terpilah ORDER BY no DESC");
        for (let i = 0; i < query.length; i++) {
            const getData = query[i];
            const [[c]] = await pool.query("SELECT COUNT(*) FROM data_terpilah WHERE id_kategori_data_terpilah=?",
                [getData.id_kategori_data_terpilah]);
            let jumlah = (c["COUNT(*)"]);
            data.push({
                id_kategori_data_terpilah: getData.id_kategori_data_terpilah,
                kategori_data_terpilah: getData.kategori_data_terpilah,
                jumlah_data: jumlah,
            });
        }

        return data;
    }
    async getSingle(id) {
        const [query] = await pool.query("SELECT * FROM kategori_data_terpilah WHERE id_kategori_data_terpilah=?", [id]);

        return query[0];
    }
    async save(text) {
        const id = random(1000000000, 9999999999);
        const [{ affectedRows }] = await pool.execute("INSERT INTO kategori_data_terpilah (id_kategori_data_terpilah, kategori_data_terpilah) VALUES (?,?)", [id, text])

        if (affectedRows > 0) {
            return "sukses"
        }
        return "gagal";
    }
    async update(id, text) {

        const [{ affectedRows }] = await pool.execute("UPDATE kategori_data_terpilah SET kategori_data_terpilah=? WHERE id_kategori_data_terpilah=?", [text, id])

        if (affectedRows > 0) {
            return "sukses"
        }
        return "gagal";
    }

    async delete(id) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM kategori_data_terpilah WHERE id_kategori_data_terpilah=?",
            [id]);
        if (affectedRows > 0) {
            return "sukses"
        }
        return "gagal";
    }
}

module.exports = KategoriDataTerpilahTbl;
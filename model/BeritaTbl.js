const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const TagBeritaTb = require("./TagBeritaTbl");
const pool = mysql.createPool(dbConfig);
class BeritaTbl {
    async get_all() {
        const [getData] = await pool.query("SELECT * FROM berita ORDER BY no DESC");
        const data = [];
        for (let i = 0; i < getData.length; i++) {
            const setData = getData[i];
            const getTags = await new TagBeritaTb().getSingle(setData.tags_berita);
            data.push({
                id_berita: setData.id_berita,
                judul: setData.judul,
                isi: "",
                tags_berita: getTags.tags_berita,
                tanggal: "",
            });
        }
        console.log(data);
        return data;
    }
    async save(idx, form_data) {

        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO berita" +
            "   (id_berita, judul, isi, tags_berita) VALUES" +
            "   (?,?,?,?)", [
            idx, form_data.judul, form_data.isi, form_data.tags_berita
        ]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }

    async delete(id_berita) {
        const [{ affectedRows }] = await pool.query("DELETE FROM berita WHERE id_berita=?", [id_berita]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }

    async getSingle(id_berita) {
        const [query] = await pool.query("SELECT * FROM berita WHERE id_berita=?", [id_berita]);
        console.log(query[0]);
        return query[0];
    }
    async update(id_berita, form_data) {
        const [{ affectedRows }] = await pool.query(
            "UPDATE berita SET judul=?,isi=?, tags_berita=? WHERE id_berita=?",
            [form_data.judul, form_data.isi, form_data.tags_berita, id_berita]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
module.exports = BeritaTbl;
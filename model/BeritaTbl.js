const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const TagBeritaTb = require("./TagBeritaTbl");
const pool = mysql.createPool(dbConfig);
class BeritaTbl {
    async getRandom() {
        const [query] = await pool.query(`
            SELECT * FROM berita INNER JOIN tags_berita ON berita.tags_berita= tags_berita.id_tags_berita`);
        console.log(query);
        if (query.length > 0) {
            return query;
        }
        return [];
    }
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
    async getSingle(id_berita) {
        const [query] = await pool.query("SELECT * FROM berita WHERE id_berita=?", [id_berita]);
        if (query.length > 0) {
            return query[0];
        }
        return {};
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

    async getBeritaByTags(id_tags) {
        const [query] = await pool.query("SELECT * FROM berita WHERE tags_berita=?", [id_tags]);
        return query;
    }

}
module.exports = BeritaTbl;
const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const pool = mysql.createPool(dbConfig);

module.exports = class TagBeritaTb {
    async getAll() {
        const [query] = await pool.query("SELECT * FROM tags_berita ORDER BY no DESC");
        // console.log(query);
        return query;
    }
    async save(tags_berita) {
        const idx = random(1000000000, 9999999999);
        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO tags_berita " +
            "   (id_tags_berita, tags_berita) VALUES" +
            "   (?,?)",
            [idx, tags_berita]
        );
        // console.log(affectedRows);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async delete(id_tags_berita) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM tags_berita WHERE id_tags_berita=?", [id_tags_berita]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async getSingle(id_tags_berita) {
        const [data] = await pool.query("SELECT * FROM tags_berita WHERE id_tags_berita=?", [id_tags_berita]);
        if (data.length > 0)
            return data[0];
        return "data_null"
    }
    async edit(id_tags_berita, tags_berita) {
        const [{ affectedRows }] = await pool.execute(
            "UPDATE tags_berita SET " +
            "   tags_berita=? WHERE id_tags_berita=?",
            [tags_berita, id_tags_berita]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
}

const mysql = require("mysql2/promise")
const dbConfig = require("../utils/dbConfig")
const pool = mysql.createPool(dbConfig)

module.exports = class HomePageMdl {
    async getBerita() {
        const [query] = await pool.query("SELECT * FROM berita ORDER BY no DESC lIMIT 6");
        return query;
    }
    async getWalikota() {
        const [query] = await pool.query("SELECT * FROM profil_walikota limit 1;")
        console.log(query);
        if (query.length > 0) {
            return query[0];
        }
        return {};
    }
    async getWakilWalikota() {
        const [query] = await pool.query("SELECT * FROM profil_wakil_walikota LIMIT 1")
        if (query.length > 0)
            return query[0];
        else
            return {}
    }
    async getKepalaDinas() {
        const [query] = await pool.query("SELECT * FROM profil_kepala_dinas LIMIT 1");
        if (query.length > 0)
            return query;
        else
            return {};
    }
    async getPoling() {
        const [query] = await pool.query("SELECT * FROM poling LIMIT 1")
        if (query.length > 0)
            return query[0]
        else { }
    }

}
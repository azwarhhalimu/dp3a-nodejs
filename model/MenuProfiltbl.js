const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const { query } = require("express");
const pool = mysql.createPool(dbConfig);
module.exports = class MenuProfilTbl {
    async getAll() {
        const [query] = await pool.query("SELECT *FROM menu_profil ORDER BY no DESC");
        return query;
    }
    async getSingle(id_menu_profil) {
        const [query] = await pool.query("SELECT * FROM menu_profil WHERE id_menu_profil=?", [id_menu_profil]);
        if (query.length > 0) {
            return query[0];
        }
        return {};
    }
    async update(id_menu_profil, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "UPDATE menu_profil " +
            "   SET judul=?, isi=? WHERE id_menu_profil=?",
            [form_data.judul, form_data.isi, id_menu_profil]
        )
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async insert(id_menu_profil, form_data) {
        const [{ affectedRows }] = await pool.execute(
            "INSERT INTO menu_profil (id_menu_profil, judul, isi) VALUES (?,?,?)",
            [id_menu_profil, form_data.judul, form_data.isi]
        );
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async delete(id_menu_profil) {
        const [{ affectedRow }] = await pool.execute("DELETE FROM menu_profil WHERE id_menu_profil=?", [id_menu_profil]);
        if (affectedRow > 0) {
            return "sukses";
        }
        return "gagal";
    }
}
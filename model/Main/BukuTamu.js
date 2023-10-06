const mysql = require("mysql2/promise");
const dbConfig = require("../../utils/dbConfig");
const random = require("../../utils/rand");
const pool = mysql.createPool(dbConfig);

const bukuTamu = async (form_data) => {
    const id = random(1000000000, 9999999999);
    const [{ affectedRows }] = await pool.execute(`
        INSERT INTO buku_tamu 
            (id_buku_tamu, nama, email,pesan)
            VALUES
            (?,?,?,?)
    `, [id, form_data.nama, form_data.email, form_data.pesan]);

    if (affectedRows > 0)
        return "sukses"
    return "gagal";
}

const getBukuTamu = async () => {
    const [query] = await pool.query("SELECT * FROM buku_tamu ORDER BY no DESC");
    return query;
}


module.exports = { getBukuTamu, bukuTamu };
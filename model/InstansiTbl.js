const c = require("mysql2/promise");

const dbConfig = require("../utils/dbConfig");
const pool = c.createPool(dbConfig);
class InstansiTbl {
    async delete(id_instansi) {

        const [{ affectedRows }] = await pool.execute("DELETE FROM instansi WHERE id_instansi=?", [id_instansi]);
        if (affectedRows) {
            return true;
        }
        return false;
    }
    async getSingle(id_instansi) {

        const [query] = await pool.query("SELECT * FROM instansi WHERE id_instansi=?",
            [
                id_instansi
            ]);
        if (query.length > 0) {
            return query[0];
        }
        return "data_null"

    }
    async getAll() {

        const [query] = await pool.query("SELECT * FROM instansi ORDER BY no desc",
        );

        return query;
    }
    async updateData(data) {
        const [{ affectedRows }] = await pool.execute("UPDATE instansi SET nama_instansi=?, alamat=?, username=?, password=? WHERE id_instansi=?", [
            data.nama_instansi, data.alamat, data.username, data.password, data.id_instansi
        ])
        if (affectedRows > 0) {
            return "data_update";
        }
        else {
            return "failed_update";
        }
    }
}

module.exports = InstansiTbl;
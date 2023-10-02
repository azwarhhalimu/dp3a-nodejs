const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const pool = mysql.createPool(dbConfig);
class DashboardMdl {
    async get() {
        const [[jumlah_instansi]] = await pool.execute("SELECT COUNT(*) FROM instansi");
        const [[data_terpilah]] = await pool.execute("SELECT COUNT(*) FROM data_terpilah");
        const [[indikator_kuisioner]] = await pool.execute("SELECT COUNT(*) FROM indikator_kuisioner");
        const [[poling]] = await pool.query("SELECT * FROM poling LIMIT 1");

        return {
            jumlah_instansi: jumlah_instansi["COUNT(*)"],
            jumlah_indikator_data_terpilah: data_terpilah["COUNT(*)"],
            jumlah_indikator_kuisioner: indikator_kuisioner['COUNT(*)'],
            poling: {
                sangat_puas: poling.sangat_puas,
                puas: poling.puas,
                kurang_puas: poling.kurang_puas,
                buruk: poling.buruk,
            }
        }
    }
}
module.exports = DashboardMdl;
const mysql = require("mysql2/promise");
const dbConfig = require("../../utils/dbConfig");
const { encryptRc } = require("../../utils/encryptRc");
const pool = mysql.createPool(dbConfig);

const c_updatae = async () => {

    const [y] = await pool.query("SELECT * FROM instansi");
    for (let i = 0; i < y.length; i++) {
        const data = y[i];
        let c = (encryptRc(data.password_dec))
        const cs = await pool.execute("UPDATE instansi SET password=? WHERE id_instansi=?", [c, data.id_instansi])
        if (cs)
            console.log("sukses");
    }
}
module.exports = c_updatae;
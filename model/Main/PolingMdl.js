const mysql = require("mysql2/promise");
const dbConfig = require("../../utils/dbConfig");
const pool = mysql.createPool(dbConfig);

const updatePoling = async (jawaban) => {
    let jawab = jawaban.toLowerCase().replace(" ", "_");
    const [{ affectedRows }] = await pool.execute(`UPDATE poling SET ${jawab}=(${jawab}+1) WHERE 1`);
    console.log(`UPDATE poling SET ${jawab}=${jawab}+1 WHERE 1`)

    if (affectedRows > 0) {
        return "berhasil";
    }
    return "gagal";


}
const persentase = (nilai, total) => {
    return Math.round((nilai / total) * 100);
}

const getHasilPoling = async () => {
    const [hasil] = await pool.query("SELECT * FROM  poling");
    const { sangat_puas, puas, kurang_puas, buruk } = hasil[0];
    let total = sangat_puas + puas + kurang_puas + buruk;
    const chasil = {
        sangat_puas: persentase(sangat_puas, total),
        puas: persentase(puas, total),
        kurang_puas: persentase(kurang_puas, total),
        buruk: persentase(buruk, total),
    }
    console.log(chasil);
    return chasil;


}
module.exports = updatePoling;
module.exports = getHasilPoling;
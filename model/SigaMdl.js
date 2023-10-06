const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const TahunTbl = require("./TahunTbl");
const pool = mysql.createPool(dbConfig)
module.exports = class SigaMdl {
    async getKategoriDataTerpilahTbl() {
        const [query] = await pool.query(`
        SELECT *,
            (
                SELECT COUNT(*) from  data_terpilah
                WHERE  
                    data_terpilah.id_kategori_data_terpilah=kategori_data_terpilah.id_kategori_data_terpilah) as jumlah_data
            FROM
        kategori_data_terpilah`);
        console.log(query);
        return query;
    }
    async getDataTerpilah(id_kategori_data_terpilah) {
        const [get] = await pool.query(`
            SELECT * FROM kategori_data_terpilah
                WHERE
                id_kategori_data_terpilah=?`, [id_kategori_data_terpilah]);

        const [query] = await pool.query(`
            SELECT * FROM data_terpilah  
                WHERE id_kategori_data_terpilah=?
        `, [id_kategori_data_terpilah]);
        return { root_data: get[0], data: query };

    }

    async getPageTahun(id_data_terpilah) {
        const [data] = await pool.query("SELECT * FROM data_terpilah WHERE id_data_terpilah=?", [id_data_terpilah]);
        if (data.length > 0) {
            return data[0];
        }
        return {}
    }
    async tampilData(id_tahun, id_data_terpilah) {
        const [indikator_kuisoner] = await pool.query(`SELECT * FROM indikator_kuisioner WHERE id_data_terpilah=?`, [id_data_terpilah]);
        const data = [];
        const [tahun] = await pool.query("SELECT * FROM tahun ORDER BY TAHUN desc");

        for (let i = 0; i < indikator_kuisoner.length; i++) {
            const cdata = indikator_kuisoner[i];
            let ctahun = [];
            for (let c = 0; c < tahun.length; c++) {
                const obj = tahun[c];
                let laki_laki = 0;
                let perempuan = 0;
                const [query] = await pool.query("SELECT * FROM input_kuisioner WHERE id_tahun=? && id_data_terpilah=? && id_indikator_kuisioner=?",
                    [obj.id_tahun, id_data_terpilah, cdata.id_indikator_kuisioner])
                if (query.length > 0) {
                    laki_laki = query[0].laki_laki;
                    perempuan = query[0].perempuan;
                }
                ctahun.push({
                    id_tahun: obj.id_tahun,
                    tahun: obj.tahun,
                    data: {
                        laki_laki: laki_laki,
                        perempuan: perempuan,
                    }
                })
            }
            data.push({
                id_indikator_kuisioner: cdata.id_indikator_kuisioner,
                id_instansi: cdata.id_instansi,
                id_data_terpilah: cdata.id_data_terpilah,
                id_kategori_data_terpilah: cdata.id_kategori_data_terpilah,
                indikator_kuisioner: cdata.indikator_kuisioner,
                tahun: ctahun,
            })
        }
        return data;
    }




}
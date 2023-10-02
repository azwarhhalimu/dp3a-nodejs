const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const msql = require("mysql");
const pool = mysql.createPool(dbConfig);

module.exports = class PresentingMdl {
    async get() {
        const [query] = await pool.query("SELECT * FROM instansi ORDER BY no desc;",);
        let data = [];
        for (let i = 0; i < query.length; i++) {
            var xdata = query[i];
            const [[jumlah]] = await pool.execute('SELECT COUNT(*) FROM data_terpilah WHERE id_instansi=?',
                [xdata["id_instansi"]]);
            const jml = jumlah["COUNT(*)"];
            data.push({
                "id_instansi": xdata['id_instansi'],
                "instansi": xdata['nama_instansi'],
                'jumlah': jumlah["COUNT(*)"],
            })
        }
        console.log(data);
        return data;
    }
    async lihat_data_terpilah(id_instansi) {
        const [query] = await pool.query("SELECT * FROM data_terpilah WHERE id_instansi=?",
            [id_instansi])
        const [$instasi] = await pool.query("SELECT * FROM instansi WHERE id_instansi=?", [id_instansi]);
        const data = [];
        const [tahun] = await pool.query("SELECT * FROM tahun order  by tahun asc");

        if (query.length > 0) {
            for (let i = 0; i < query.length; i++) {
                const a = query[i];
                const [indikator_kuisioner] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_data_terpilah=?",
                    [a.id_data_terpilah]);


                const list_tahun = [];
                for (let t = 0; t < tahun.length; t++) {
                    const g_tahun = tahun[t];

                    let l_terisi = 0;
                    for (let k = 0; k < indikator_kuisioner.length; k++) {
                        let k_indikatori_kuisioner = indikator_kuisioner[k];
                        let [jumlah_data_terisi] = await pool.execute(
                            "SELECT id_tahun FROM input_kuisioner WHERE " +
                            "   id_instansi=? && id_data_terpilah=? && id_indikator_kuisioner=? && id_tahun=?"
                            , [id_instansi, a.id_data_terpilah, k_indikatori_kuisioner.id_indikator_kuisioner, g_tahun.id_tahun,])

                        // l_terisi = l_terisi + jumlah_data_terisi["COUNT(*)"];
                        l_terisi = l_terisi + jumlah_data_terisi.length;
                    }
                    let persentase = (l_terisi / indikator_kuisioner.length) * 100;
                    list_tahun.push({
                        id_tahun: g_tahun.id_tahun,
                        tahun: g_tahun.tahun,
                        jumlah_data_terisi: l_terisi,
                        persentase: (persentase.toFixed(0)),
                    })
                }
                data.push({
                    id_data_terpilah: a.id_data_terpilah,
                    data_terpilah: a.data_terpilah,
                    list_tahun: list_tahun,
                    jumlah_data: indikator_kuisioner.length,
                })
            }
            const hasil = { "instansi": $instasi[0]["nama_instansi"], data: data };

            return hasil;
        }
        else
            return "data_null";

    }
}
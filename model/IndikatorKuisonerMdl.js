const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const random = require("../utils/rand");
const pool = mysql.createPool(dbConfig);
module.exports = class IndikatorKuisionerMdl {
    async getAll(id_data_terpilah) {
        const [getdata] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_data_terpilah=?",
            [id_data_terpilah]);

        const data = [];

        if (getdata.length > 0) {
            const [tahun] = await pool.query("SELECT * FROM tahun ORDER BY tahun");
            for (let i = 0; i < getdata.length; i++) {
                const cdata = getdata[i];

                const list_tahun = [];
                for (let c = 0; c < tahun.length; c++) {
                    const ctahun = tahun[c];
                    const [jumlah_data] = await pool.query("SELECT * FROM input_kuisioner WHERE id_indikator_kuisioner=? && id_instansi=? && id_data_terpilah=? && id_tahun=? LIMIT 1",
                        [
                            cdata.id_indikator_kuisioner, cdata.id_instansi, cdata.id_data_terpilah, ctahun.id_tahun
                        ])
                    console.log(jumlah_data[0]);
                    list_tahun.push({
                        id_tahun: ctahun.id_tahun,
                        tahun: ctahun.tahun,
                        data_gender: {
                            laki_laki: jumlah_data.length == 0 ? 0 : jumlah_data[0]["laki_laki"],
                            perempuan: jumlah_data.length == 0 ? 0 : jumlah_data[0]["perempuan"]
                        }
                    })
                }
                data.push({
                    id_indikator_kuisioner: cdata.id_indikator_kuisioner,
                    id_instansi: cdata.id_instansi,
                    id_data_terpilah: cdata.id_data_terpilah,
                    id_kategori_data_terpilah: cdata.id_kategori_data_terpilah,
                    indikator_kuisioner: cdata.indikator_kuisioner,
                    tahun: list_tahun,
                });
            }

            // console.log(data)
            return { data: data, tahun: tahun };
        }
        else {
            return "data_null";
        }


    }
    async save_data(id_data_terpilah, data) {
        const [query] = await pool.query("SELECT * FROM data_terpilah WHERE id_data_terpilah=?", [id_data_terpilah.id_data_terpilah]);

        const idx = random(1000000000, 9999999999);
        console.log(query[0]);
        if (query.length > 0) {
            const [{ affectedRows }] = await pool.execute("INSERT INTO indikator_kuisioner" +
                " (id_indikator_kuisioner, id_instansi, id_data_terpilah, id_kategori_data_terpilah,indikator_kuisioner) VALUES " +
                " (?,?,?,?,?)",
                [idx, query[0].id_instansi, query[0].id_data_terpilah, query[0].id_kategori_data_terpilah, data.indikator_kuisioner]
            );
            if (affectedRows > 0) {
                return "sukses";
            }
            return "gagal";
        }
        return "terjadi_masalah"
    }

    async getSingle(id_indikator_kuisioner) {
        const [get] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_indikator_kuisioner=?", [id_indikator_kuisioner]);
        console.log(get[0]);
        return get[0];
    }
    async update(id_indikator_kuisioner, form) {
        const [{ affectedRows }] = await pool.execute("UPDATE indikator_kuisioner SET indikator_kuisioner=? WHERE id_indikator_kuisioner=?",
            [form.indikator_kuisioner, id_indikator_kuisioner]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }

    async delete(id_indikator_kuisioner) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM indikator_kuisioner WHERE id_indikator_kuisioner=?", [id_indikator_kuisioner]);
        if (affectedRows > 0) {
            return "sukses"
        }
        return "gagal";
    }


}
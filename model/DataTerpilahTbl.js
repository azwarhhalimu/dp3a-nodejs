const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const { json } = require("body-parser");
const random = require("../utils/rand");
const pool = mysql.createPool(dbConfig);
class DataTerpilahTbl {
    async get_all(id) {
        const [getData] = await pool.query("SELECT * FROM data_terpilah ORDER BY no DESC");
        return getData;

    }
    async getSingle(id) {
        const [getData] = await pool.query("SELECT * FROM data_terpilah WHERE id_data_terpilah=?", [
            id
        ]);
        return getData[0].id_instansi;

    }
    async getSingle_lengkap(id) {
        const [getData] = await pool.query("SELECT * FROM data_terpilah WHERE id_data_terpilah=?", [
            id
        ]);
        return getData[0];

    }
    async get(_id) {
        const [getDatax] = await pool.query("SELECT * FROM data_terpilah WHERE id_kategori_data_terpilah=? ORDER BY no DESC",
            [_id]);
        const data = [];

        for (let i = 0; i < getDatax.length; i++) {

            let getData = getDatax[i];



            const [instansi] = await pool.query("SELECT * FROM instansi WHERE id_instansi=? ORDER BY no DESC;", [getData.id_instansi]);
            const [xdata] = await pool.query("SELECT * FROM indikator_kuisioner WHERE id_instansi=? && id_kategori_data_terpilah=? && id_data_terpilah=?",
                [getData.id_instansi, getData.id_kategori_data_terpilah, getData.id_data_terpilah]);

            const list_data_indikator = [];

            for (let c = 0; c < xdata.length; c++) {
                list_data_indikator.push({
                    indikator_kuisioner: xdata[c]["indikator_kuisioner"],
                });
            }
            // console.log(list_data_indikator);

            let get_data_terpilah = {
                data_terpilah: "sdf",
            }
            data.push({
                id_data_terpilah: getData.id_data_terpilah,
                id_kategori_data_terpilah: getData.id_kategori_data_terpilah,
                id_instansi: getData.id_instansi,
                nama_instansi: instansi[0]["nama_instansi"],
                list_data_terpilah: list_data_indikator,
                data_terpilah: getData.data_terpilah,
                label_tabel: getData.label_tabel,

            });


        }
        console.log(data);
        return data;


    }

    async update_data_terpilah(id_data_terpilah, data_map) {
        console.log(data_map);
        const [{ affectedRows }] = await pool.execute("UPDATE data_terpilah SET id_instansi=?, data_terpilah=?, label_tabel=? WHERE id_data_terpilah=?",
            [data_map.sumber_data, data_map.data_terpilah, data_map.label_tabel, id_data_terpilah]);

        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }

    async delete(id_data_terpilah) {
        const [{ affectedRows }] = await pool.execute("DELETE FROM data_terpilah WHERE id_data_terpilah=?",
            [id_data_terpilah]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";
    }
    async save(id_kategori_data_terpilah, data) {
        const idx = random(1000000000, 9999999999);
        const [{ affectedRows }] = await pool.execute("INSERT INTO data_terpilah (id_data_terpilah,id_kategori_data_terpilah,id_instansi, data_terpilah,label_tabel)VALUES (?,?,?,?,?)", [
            idx, id_kategori_data_terpilah, data.sumber_data, data.data_terpilah, data.label_tabel
        ]);
        if (affectedRows > 0) {
            return "sukses";
        }
        return "gagal";

    }
}
module.exports = DataTerpilahTbl;
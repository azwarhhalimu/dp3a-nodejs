const express = require("express");
const SlideShowTbl = require("../model/SlideShowTbl");
const InstansiTbl = require("../model/InstansiTbl");
const { apiBeranda } = require("../model/ApiModel");
const { getBukuTamu } = require("../model/Main/BukuTamu");
const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const GaleriTbl = require("../model/GaleriTbl");
const VideoTbl = require("../model/VideoTbl");
const MenuProfilTbl = require("../model/MenuProfiltbl");
const DataTerpilahTbl = require("../model/DataTerpilahTbl");
const TahunTbl = require("../model/TahunTbl");
const pool = mysql.createPool(dbConfig);
const api_routing = express();


api_routing.get("/beranda.json", async (req, res) => {

    const api_beranda = await apiBeranda();
    res.json(api_beranda);
})

api_routing.get('/get-buku-tamu.json', async (req, res) => {
    const [data] = await pool.query("SELECT nama, email,pesan ,tanggal FROM buku_tamu ORDER BY no DESC LIMIT 100 ")
    res.json(data);
})

api_routing.get("/semua-instansi.json", async (req, res) => {
    const [data] = await pool.query("SELECT id_instansi,nama_instansi FROM instansi");
    res.json(data);
})
api_routing.get("/lihat-berita.json/view/:id", async (req, res,) => {


    const [data] = await pool.query(`
    SELECT berita.id_berita, berita.judul, berita.tanggal,tags_berita.tags_berita, tags_berita.id_tags_berita
        FROM
        berita 
        JOIN tags_berita  ON tags_berita.id_tags_berita=berita.tags_berita
        WHERE id_berita=?`, [req.params.id])
    const [berita_lainnya] = await pool.query(`
    SELECT berita.judul, berita.id_berita,berita.judul, tags_berita.tags_berita
         FROM berita
   JOIN tags_berita ON berita.tags_berita=tags_berita.id_tags_berita WHERE berita.tags_berita=?`, [data[0].id_tags_berita])

    res.json({
        data: data[0],
        lainnya: berita_lainnya,
    })
})

api_routing.get("/galeri.json", async (req, res) => {
    const data = await new GaleriTbl().getAll();
    res.json(data);
})
api_routing.get("/video.json", async (req, res) => {
    const model = await new VideoTbl().getAll();
    res.json({ data: model })
})
api_routing.get("/lihat-video.json/view/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const [data] = await pool.query("SELECT * FROM video WHERE id_video=?",
        [
            id
        ])
    res.json(data[0]);
})
api_routing.get("/lihat-galeri.json", async (req, res) => {
    const galeri = await new GaleriTbl().getAll();
    res.json({
        "view_galeri": galeri,
        "thumb": galeri
    })
})
api_routing.get("/profil.json", async (req, res) => {
    const [profil] = await pool.query("SELECT id_menu_profil, judul FROM menu_profil");
    res.json(profil);
})
api_routing.get("/lihat-profil.json/:id", async (req, res) => {
    const [data] = await pool.query("SELECT * FROM menu_profil WHERE id_menu_profil=?",
        [req.params.id])
    if (data.length > 0) {
        res.json(data);
    }
    res.json({
        'status': "no_data"
    });
})
api_routing.get("/get-data-terpilah.json", async (req, res) => {
    const [data] = await pool.query("SELECT * FROM data_terpilah ORDER BY no DESC;")
    res.json({ data: data });
});
api_routing.get("/get-tahun.json", async (req, res) => {
    const data = await new TahunTbl().getAll();
    res.json({ data: data })
})

module.exports = api_routing;
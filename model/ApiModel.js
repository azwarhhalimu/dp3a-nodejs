const mysql = require("mysql2/promise");
const dbConfig = require("../utils/dbConfig");
const SlideShowTbl = require("./SlideShowTbl");
const InstansiTbl = require("./InstansiTbl");
const BannerTbl = require("./BannerTbl");
const ProfilWalikota = require("./ProfilWalikota");
const ProfilWakilWalikota = require("./ProfilWakilWalikota");
const ProfilKepalaDinas = require("./ProfilKepalaDinas");
const pool = mysql.createPool(dbConfig);

const apiBeranda = async () => {
    const slide_show = await new SlideShowTbl().getAll();
    const cinstansi = await new InstansiTbl().getAll();
    const banner = await new BannerTbl().getAll();
    const [berita_terbaru] = await pool.query("SELECT id_berita, judul, tags_berita,tanggal FROM berita limit 0,5;");
    const instansi = [];
    const walikota = await new ProfilWalikota().getData();
    const wakil_walikota = await new ProfilWakilWalikota().getData();
    const kepala_dinas = await new ProfilKepalaDinas().getData();
    const [berita] = await pool.query("SELECT id_berita, judul, tags_berita,tanggal FROM berita LIMIT 6,20");
    cinstansi.map((list, index) => {
        instansi.push({
            "nama_instansi": list.nama_instansi,
            "instansi": list.id_instansi,
        });
    })
    return {

        'status': "ok",
        'status_code': 200,
        'foto_walikota': 'profil-walikota',
        'foto_wakil_walikota': "profil-wakil-walikota",
        'foto_kepala_dinas': 'profil-kepala-dinas',

        'walikota': walikota.nama,
        'wakil_walikota': wakil_walikota.nama,
        'kepala_dinas': kepala_dinas.nama,


        "slide_show": slide_show,
        "instansi": instansi,
        "berita": berita,
        "berita_terbaru": berita_terbaru,
        "banner": banner,
    }
}

module.exports = { apiBeranda }
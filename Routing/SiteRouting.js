const express = require("express");
const SlideShowTbl = require("../model/SlideShowTbl");
const HomePageMdl = require("../model/HomePageMdl");
const InstansiTbl = require("../model/InstansiTbl");
const GaleriTbl = require("../model/GaleriTbl");
const VideoTbl = require("../model/VideoTbl");
const getYtId = require("../utils/getYtId");
const BannerTbl = require("../model/BannerTbl");
const BeritaTbl = require("../model/BeritaTbl");
const random = require("../utils/rand");
const updatePoling = require("../model/Main/PolingMdl");
const getHasilPoling = require("../model/Main/PolingMdl");
const ProfilMdl = require("../model/ProfilMdl");
const flash = require("express-flash");
const { createFlash } = require("../utils/AlertFlash");
const site_router = express.Router();

site_router.post("/", async (req, res) => {
    const { jawaban } = req.body;
    const c = await updatePoling(jawaban);
    if (c == "berhasil")
        req.session.isVote = "true";
    res.redirect('/');

})
site_router.get("/", async (req, res) => {

    const slide_show = await new SlideShowTbl().getAll()
    const berita = await new HomePageMdl().getBerita();
    const instansi = await new InstansiTbl().getAll();
    const galeri = await new GaleriTbl().getAll();
    const youtube = await new VideoTbl().getAll();
    var banner = await new BannerTbl().getAll();
    const walikota = await new HomePageMdl().getWalikota();
    const kepala_dinas = await new HomePageMdl().getKepalaDinas();
    const hasil_poling = await getHasilPoling();

    res.locals.hasil_poling = hasil_poling;
    res.locals.isVote = (typeof req.session.isVote == "undefined") ? false : true;

    res.render("index", {
        slide_show: slide_show,
        berita: berita,
        instansi: instansi,
        galeri: galeri,
        video: youtube,
        getYtId: getYtId,
        banner: banner,
        bannerx: banner,
        walikota: walikota,

        kepala_dinas: kepala_dinas

    });
})
site_router.get("/instansi.html", (req, res) => {
    res.render("testing.ejs");
})

site_router.get("/lihat-berita/:id/:label.html", async (req, res) => {
    const data = await new BeritaTbl().getSingle(req.params.id);
    const randomberita = await new BeritaTbl().getRandom();
    res.render('lihat-berita.ejs', {
        data: data,
        randomberita: randomberita,
    });
})
site_router.get("/lihat-foto.html", async (req, res) => {
    const galeri = await new GaleriTbl().getAll();
    res.render("lihat-galeri.ejs", { layout: false, galeri: galeri, galeri2: galeri },)
})

site_router.get("/tags-berita/:id/:label.html", async (req, res) => {
    const randomberita = await new BeritaTbl().getRandom();
    const getBeritaByTags = await new BeritaTbl().getBeritaByTags(req.params.id);
    res.render("tags-berita.ejs", { randomberita: randomberita, data: getBeritaByTags });
})

site_router.get("/profil/:id/:label.html", async (req, res) => {
    const data = await new ProfilMdl().getProfil(req.params.id);
    const randomberita = await new BeritaTbl().getRandom();
    res.render('profil.ejs', { data: data, randomberita: randomberita });
})
site_router.all("/buku-tamu.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            console.log(req.body);
            console.log(req.session.captcha);
            if (await req.session.captcha == req.body.captcha) {
                const model = await bukuTamu(req.body);
                if (model == "sukses") {
                    req.session.flash_type = "Sukses";
                    req.session.flash_pesan = "Data berhasil di simpan";
                    res.redirect('/');
                }
            }
            else {
                createFlash(req, "Gagal", "Captcha yang anda masukkan tidak benar")
                res.redirect("/buku-tamu.html");
            }
            break;
        default:
            res.locals.svgcapta = require("svg-captcha").create();
            const getData = await getBukuTamu();
            res.render("buku-tamu.ejs", { data: getData });
            break;
    }

});

const capt = require("svg-captcha");
const { bukuTamu, getBukuTamu } = require("../model/Main/BukuTamu");
const KategoriDataTerpilahTbl = require("../model/KategoriDataTerpilahTbl");
const SigaMdl = require("../model/SigaMdl");
const TahunTbl = require("../model/TahunTbl");
const DataTerpilahTbl = require("../model/DataTerpilahTbl");
const c_updatae = require("../model/Main/TestingDb");
site_router.get('/captcha', async (req, res) => {
    var captcha = capt.create(
    );

    req.session.captcha = captcha.text;

    console.log(captcha);
    res.type('svg');
    res.status(200).send(captcha.data);
});

site_router.get("/kontak.html", (req, res) => {
    res.render('kontak.ejs');
})
site_router.get("/siga.html", async (req, res) => {
    const data = await new SigaMdl().getKategoriDataTerpilahTbl();
    res.render('siga.ejs', { data: data });
})
site_router.get("/:id/data-terpilah/:label.html", async (req, res) => {
    const { id } = req.params;

    const { data } = await new SigaMdl().getDataTerpilah(id);
    const { root_data } = await new SigaMdl().getDataTerpilah(id);
    res.render('siga-data/data-terpilah.ejs', { data: data, root_data: root_data });
})
site_router.get('/:id_data_terpilah/pilih-tahun/:label.html', async (req, res) => {
    const getData = await new SigaMdl().getPageTahun(req.params.id_data_terpilah);
    const tahun = await new TahunTbl().getAll();
    res.locals.id_data_terpilah = req.params.id_data_terpilah;
    res.render('siga-data/pilih-tahun.ejs', {
        data: getData, tahun: tahun,
    });
})
site_router.get("/:id/tampil-data.html", async (req, res) => {
    const data = await new SigaMdl().tampilData(req.query.tahun, req.params.id);
    const data_terpilah = await new DataTerpilahTbl().getSingle_lengkap(req.params.id);
    const tahun = await new TahunTbl().getAll();
    // res.json(data);
    res.render("siga-data/tampil-data.ejs", { data: data, tahun: tahun, tahun2: tahun, data_terpilah: data_terpilah });
})

site_router.get("/send", async (req, res) => {
    const c = await c_updatae();
    res.send('df')
})
module.exports = site_router; 
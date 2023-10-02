const express = require("express");
const admin_routing = express.Router();
const db = require("mysql2/promise");
const fs = require("fs");
const { decryptRc } = require("../utils/encryptRc")
const dbConfig = require("../utils/dbConfig");
const upload_logo_instansi = require("./mid_upload/UploadFileInstansi");
const sharp = require("sharp");
const random = require("../utils/rand");
const InstansiTbl = require("../model/InstansiTbl");
const KategoriDataTerpilahTbl = require("../model/KategoriDataTerpilahTbl");
const DataTerpilahTbl = require("../model/DataTerpilahTbl");
const IndikatorKuisionerTbl = require("../model/IndikatorKuisionerTbl");
const TahunTbl = require("../model/TahunTbl");
const PresentingMdl = require("../model/PrestingMdl");
const IndikatorKuisionerMdl = require("../model/IndikatorKuisonerMdl");
const TagBeritaTb = require("../model/TagBeritaTbl");
const BeritaTbl = require("../model/BeritaTbl");
const upload_foto_berita = require("./mid_upload/UploadFotoBerita");
const ProfilKepalaDinas = require("../model/ProfilKepalaDinas");
const upload_foto_kepala_dinas = require("./mid_upload/UploadFotoKepalaDinas");
const ProfilWalikota = require("../model/ProfilWalikota");
const upload_profil_walikota = require("./mid_upload/UploadFotoProfilWalikota");
const upload_profil_wakil_walikota = require("./mid_upload/UploadFotoProfilWakilWalikota");
const ProfilWakilWalikota = require("../model/ProfilWakilWalikota");
const BannerTbl = require("../model/BannerTbl");
const upload_foto_banner = require("./mid_upload/UploadFotoBanner");
const SlideShowTbl = require("../model/SlideShowTbl");
const upload_foto_slide_show = require("./mid_upload/UploadFotoSlideShow");
const GaleriTbl = require("../model/GaleriTbl");
const upload_foto_galeri = require("./mid_upload/UploadFotoGaleri");
const InfoTbl = require("../model/InfoTbl");
const MenuProfilTbl = require("../model/MenuProfiltbl");
const VideoTbl = require("../model/VideoTbl");
const getYtId = require("../utils/getYtId");
const uploadFotoHeader = require("./mid_upload/UploadFotoHeader.js");
const DashboardMdl = require("../model/DashboardMdl");
const { lazyoutSource } = require("ejs-layout");
const { type } = require("image-clipper/lib/utils");
const ProfilMdl = require("../model/ProfilMdl");

admin_routing.get("/instansi.html/:delete?/:id?", async (req, res) => {


    const del = req.params.delete;
    const id = req.params.id;

    var cflash = false;

    //delete
    if (del == "delete") {
        const c = await new InstansiTbl().delete(id);
        if (c == true) {


            const ff = "./public/upload/" + id + ".png"
            fs.access(ff, fs.constants.F_OK, async (err) => {
                console.log(err);
                if (!err) {
                    fs.unlinkSync(ff);
                }
            })




            cflash = true;
            req.flash('success', `You've been successfully redirected to the Message route!`);

            res.redirect("/admin/instansi.html")
        }

    }
    const pool = db.createPool(dbConfig);
    const [query] = await pool.query("SELECT * FROM instansi order by no desc");



    res.render("admin/instansi", {
        data: query,
        data_table: "true",
        flash: cflash,
        menu: "instansi",

        dencrypt: decryptRc
    });




})


//instansi
admin_routing.all("/instansi/tambah-instansi.html", upload_logo_instansi.single("foto"), async (req, res) => {

    const target = req.query.target;
    const id = req.query.id;
    switch (req.method) {
        case "POST":

            var form = req.body;
            // pdate data
            console.log(id);
            if (id != undefined) {
                const update = await new InstansiTbl().updateData(
                    {
                        nama_instansi: form.nama_instansi,
                        alamat: form.alamat_instansi,
                        username: form.username,
                        password: (form.password),
                        id_instansi: form.id_instansi,
                    }
                )
                if (update) {
                    if (req.file) {
                        await sharp(req.file.path).extract({
                            left: parseInt(form["imgY1"]),
                            top: parseInt(form["imgX1"]),
                            width: parseInt(form["imgWidth"]),
                            height: parseInt(form["imgHeight"]),
                        }).toFile("./public/upload/" + form.id_instansi + ".png", () => {
                            require("fs").unlinkSync(req.file.path);
                        });
                        res.redirect("/admin/instansi.html");
                    }
                    else
                        res.redirect("/admin/instansi.html");

                }
                else {
                    res.send("Update gagal");
                }

            }
            else {
                var idx = random(1000000000, 9999999999);


                const pool = db.createPool(dbConfig);
                const [] = await pool.execute("INSERT INTO instansi (id_instansi,nama_instansi,alamat, username, password) values (?,?,?,?,?)",
                    [idx, form.nama_instansi, form.alamat_instansi, form.username, (form.password)]
                );

                await sharp(req.file.path).extract({
                    left: parseInt(form["imgY1"]),
                    top: parseInt(form["imgX1"]),
                    width: parseInt(form["imgWidth"]),
                    height: parseInt(form["imgHeight"]),
                }).toFile("./public/upload/" + idx + ".png", () => {
                    require("fs").unlinkSync(req.file.path);
                });
                res.redirect("/admin/instansi.html");
            }

            break;

        default:
            if (target === "edit") {
                const c = await new InstansiTbl().getSingle(id);
                if (c == "data_null")
                    res.redirect("/admin/instansi.html");
                else
                    res.render("admin/instansi/tambah-instansi", {
                        data: c,
                        menu: "instansi"
                    });

            }
            else {
                res.render("admin/instansi/tambah-instansi", { menu: "instansi", data: {}, });
            }
            break;

    }
})

admin_routing.get("/kategori-data-terpilah.html", async (req, res) => {
    const getData = await new KategoriDataTerpilahTbl().getAll();

    res.render("admin/kategori-data-terpilah.ejs", {
        data: getData,
        data_table: true,
        menu: "siga",
    });
});


admin_routing.all("/kategori-data-terpilah/tambah-kategori-data-terpilah.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            const { kategori_data_terpilah } = req.body;
            console.log(kategori_data_terpilah);
            const c = await new KategoriDataTerpilahTbl().save(kategori_data_terpilah);
            if (c == "sukses") {
                res.redirect("/admin/kategori-data-terpilah.html");
            }
            break;

        default:
            res.render("admin/kategori-data-terpilah/tambah-kategori-data-terpilah.ejs",
                {
                    menu: "siga"
                }
            );
            break;
    }
})
admin_routing.get("/hapus_kategori_data_terpilah", async (req, res) => {
    const id = req.query.id;
    const hapus = await new KategoriDataTerpilahTbl().delete(id);
    if (hapus == "sukses") {
        res.redirect("/admin/kategori-data-terpilah.html");
    }
})
admin_routing.all("/edit_kategori_data_terpilah", async (req, res) => {
    const idx = req.query.id;
    switch (req.method) {
        case "POST":
            res.redirect("/admin/kategori-data-terpilah.html");
            break;
        default:
            const getData = await new KategoriDataTerpilahTbl().getSingle(idx);

            res.render("admin/kategori-data-terpilah/tambah-kategori-data-terpilah.ejs", {
                data: getData,
                menu: "siga",
            });
            break;
    }

});

admin_routing.get("/data_terpilah", async (req, res) => {
    req.session.url = req.url;
    const id = req.query.id_kategori_data_terpilah;
    const data = await new DataTerpilahTbl().get(id);
    // res.json(data);
    res.render("admin/kategori-data-terpilah/data-terpilah/data-terpilah.ejs", {
        data: data,
        menu: "siga",
        id_kategori_data_terpilah: id,
        data_table: true,
    });
})
admin_routing.all("/data-indikator.html", async (req, res) => {

    req.session.url = req.url;
    const id = req.query.id_data_terpilah;
    const id_kategori_data_terpilah = req.query.id_kategori_data_terpilah;
    const getdata = await new IndikatorKuisionerTbl().get(id);
    const id_instansi = await new DataTerpilahTbl().getSingle(id);
    switch (req.method) {
        case "GET":
            res.render("admin/kategori-data-terpilah/data-terpilah/data-indikator.ejs", {
                data_table: true,
                data: getdata,
                menu: "siga",
                id_kategori_data_terpilah: id_kategori_data_terpilah,
                parem: req.query,
                id_instansi: id_instansi
            });
            break;

        case "POST":
            const form = req.body;
            const c = await new IndikatorKuisionerTbl().save(form);
            if (c == "sukses") {
                res.send('<script>window.location="";</script>');
            }
            break;
    }

});


//edit
admin_routing.all("/edit/indikator-kuisioner", async (req, res) => {
    switch (req.method) {
        case "GET":
            const data = await new IndikatorKuisionerTbl().getSingle(req.query.id_indikator_kuisioner, req.query.id_data_terpilah);
            // res.json(data)
            res.render("admin/kategori-data-terpilah/data-terpilah/edit-indikator-kuisioner.ejs", {
                parem: req.query,
                data: data,
                menu: "siga"
            })
            break;

        case "POST":

            const c = await new IndikatorKuisionerTbl().update(req.body.indikator_kuisioner, req.query.id_indikator_kuisioner)
            if (c == "sukses") {
                res.redirect("/admin" +

                    await req.session.url);
            }

            break;
        default:
            res.send("TERJADI MASALAH");
            break;
    }

})

admin_routing.get("/hapus-data-indikator-kuisioner", async (req, res) => {

    const c = await new IndikatorKuisionerTbl().delete(req.query.id);
    if (c == "sukses") {
        res.redirect("/admin" + await req.session.url);
    }
});
admin_routing.all("/edit-data-terpilah.html", async (req, res) => {

    const c = await new DataTerpilahTbl().getSingle_lengkap(req.query.id);
    const instansi = await new InstansiTbl().getAll();
    console.log(instansi);

    switch (req.method) {
        case "GET":
            res.render("admin/kategori-data-terpilah/data-terpilah/edit-data-terpilah.ejs", {
                data: c,
                instansi: instansi,
                menu: "siga",
                url: await req.session.url,
            })
            break;

        case "POST":
            const formData = req.body;
            const update = await new DataTerpilahTbl().update_data_terpilah(req.query.id, formData);
            if (update == "sukses") {
                res.redirect("/admin" + await req.session.url);
            }
            else {
                res.send("gagal");
            }

            break;
    }

})
admin_routing.get("/delete-data-terpilah", async (req, res) => {
    res.redirect("/admin" + await req.session.url);
})

admin_routing.all("/tambah-data-terpilah.html", async (req, res) => {
    const session = await req.session.url;
    const id_kategori_data_terpilah = req.query.id_kategori_data_terpilah;
    switch (req.method) {
        case "POST":
            const form = req.body;
            if (typeof req.query.id_instansi == "undefined") {
                var simpan = await new DataTerpilahTbl().save(id_kategori_data_terpilah, form);
            }
            else {
                console.log(form);
                if (req.query.target == "edit") {
                    console.log(req.session.url);
                    // update data dari presenting data
                    const update = await new DataTerpilahTbl().update_data_terpilah(req.query.id_data_terpilah, req.body);
                    if (update == "sukses") {

                        res.redirect("/admin" + await req.session.url);
                    }
                    else {
                        res.send("GAGAL");
                    }

                } else {
                    var simpan = await new DataTerpilahTbl().save(form.kategori_data_terpilah, form);
                }
            }
            if (simpan == "sukses") {
                res.redirect("/admin" + await req.session.url)
            }
            break;
        default:

            const getinstansi = await new InstansiTbl().getAll();
            const id_instansi = req.query.id_instansi;
            const kategori_data_terpilah = await new KategoriDataTerpilahTbl().getAll();
            let data_edit = {}
            if (req.query.target == "edit") {
                data_edit = await new DataTerpilahTbl().getSingle_lengkap(req.query.id_data_terpilah);
                console.log(data_edit)
            }

            console.log(session)
            res.render("admin/kategori-data-terpilah/data-terpilah/tambah-data-terpilah.ejs", {
                instansi: getinstansi,
                data_edit: data_edit,
                url: await session,
                id_data_terpilah: req.query.id_data_terpilah,
                from_presenting: { id_instansi, kategori_data_terpilah },
                id_kategori_data_terpilah: id_kategori_data_terpilah,

            });

            break;
    }
})
admin_routing.get("/komponen-tahun.html", async (req, res) => {
    const tahun = await new TahunTbl().getAll();
    res.render("admin/komponen-tahun.ejs", {
        tahun: tahun,
        menu: "tahun"
    });
})
admin_routing.all("/edit_tahun", async (req, res) => {
    const id_tahun = req.query.id;
    const data = await new TahunTbl().getSingle(id_tahun);


    switch (req.method) {
        case "POST":

            res.redirect('/admin/komponen-tahun.html');
            break;

        default:
            if (data == "terjadi_masalah") {
                res.redirect("/admin/komponen-tahun.html")
            }
            else {
                res.render("admin/tahun/edit-tahun.ejs", {
                    data: data,
                    menu: "tahun"
                });
            }

            break;
    }
})
admin_routing.all("/tambah-tahun.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            const form = req.body;
            const c = await new TahunTbl().save(form.tahun);
            if (c == "sukses") {
                res.redirect("/admin/komponen-tahun.html");
            }
            else {
                res.send("GAGAL");
            }
            break;

        default:
            res.render("admin/tahun/tambah-tahun.ejs", {
                menu: "tahun"
            });
            break;
    }
})

admin_routing.get("/hapus-tahun", async (req, res) => {
    const hapus = await new TahunTbl().delete(req.query.id);
    if (hapus == "sukses") {
        res.redirect("/admin/komponen-tahun.html");
    }
    else {

        res.send("GAGAL");
    }
})

admin_routing.get("/presenting-data.html", async (req, res) => {
    const getdata = await new PresentingMdl().get();
    res.render("admin/presenting-data.ejs", {
        data_table: true,
        data: getdata,
        menu: "presenting",
    });
})
admin_routing.get("/hapus-data-terpilah.html", async (req, res,) => {
    const id_data_terpilah = req.query.id_data_terpilah;
    const _delete = await new DataTerpilahTbl().delete(id_data_terpilah);
    if (_delete == "sukses") {
        res.redirect("/admin" + await req.session.url);
    }
    else {
        res.send("/admin" + await req.session.url);
    }
})
admin_routing.get("/lihat-data-terpilah", async (req, res) => {
    const id_instansi = req.query.id_instansi;
    const data = await new PresentingMdl().lihat_data_terpilah(id_instansi);
    req.session.url = req.url;
    if (data == "data_null")
        res.redirect("/admin/presenting-data.html")
    else
        res.render("admin/presenting-data/lihat-data-terpilah.ejs", {
            data: data,
            data_table: true,
            menu: "presenting",
            id_instansi: id_instansi
        });

})

admin_routing.get("/show-indikator-kuisioner.html", async (req, res) => {
    const getData = await new IndikatorKuisionerMdl().getAll(req.query.id_data_terpilah);
    // res.json(getData);
    req.session.url = req.url;

    if (getData == "data_null")
        res.redirect("/admin/presenting-data.html");
    else
        res.render("admin/presenting-data/show-indikator-kuisioner.ejs", {
            menu: "presenting",
            data: getData,
            data_table: true,
            id_data_terpilah: req.query.id_data_terpilah,
            url_back: await req.session.url,
        });

})
admin_routing.all("/tambah-indikator-kuisioner.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            let form = req.body;
            let id_indikator_kuisioner = req.query.id_indikator_kuisioner;
            let id_data_terpilah = req.query;

            if (req.query.target == "edit") {
                console.log(req.body.indikator_kuisioner);
                simpan = await new IndikatorKuisionerMdl().update(id_indikator_kuisioner, form);

            }
            else {
                simpan = await new IndikatorKuisionerMdl().save_data(id_data_terpilah, form);
            }
            console.log(req.session.url);
            res.redirect("/admin/" + await req.session.url);
            break;
        default:

            data = {};
            if (req.query.target == "edit") {
                const c = await new IndikatorKuisionerMdl().getSingle(req.query.id_indikator_kuisioner);
                data = c;
            }
            res.render("admin/presenting-data/tambah-indikator-kuisioner.ejs", {

                menu: "presenting",
                data: data

            });
            break;
    }

})


admin_routing.get("/delete-indikator-kuisioner.html", async (req, res) => {
    const hapus = await new IndikatorKuisionerMdl().delete(req.query.id_indikator_kuisioner);
    if (hapus == "sukses") {
        return res.redirect("/admin" + await req.session.url);
    }

});



admin_routing.get("/tags-berita.html", async (req, res) => {
    const getData = await new TagBeritaTb().getAll();
    res.render('admin/tags-berita.ejs', {
        menu: "tag-berita",
        data: getData
    });
});

admin_routing.all("/tambah-tags-berita.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            if (req.query.target == "edit")
                var simpan = await new TagBeritaTb().edit(req.query.id_tags_berita, req.body.tags_berita);
            else
                var simpan = await new TagBeritaTb().save(req.body.tags_berita);
            if (simpan == "sukses") {
                res.redirect("/admin/tags-berita.html");
            }
            else

                res.send("GAGAL");
            break;
        default:
            data = {};

            if (req.query.target == "edit") {
                data = await new TagBeritaTb().getSingle(req.query.id_tags_berita);
            }
            if (data != "data_null")
                res.render("admin/tags-berita/tambah-tags-berita.ejs", {
                    data: data,
                })
            else {
                res.status(500);

            }

            break;
    }

})
admin_routing.get("/delete-tags-berita.html", async (req, res) => {
    const hapus = await new TagBeritaTb().delete(req.query.id_tags_berita);
    if (hapus == "sukses")
        res.redirect('/admin/tags-berita.html');
    else
        res.send("gagal");
})
admin_routing.get("/berita.html", async (req, res) => {
    const berita = await new BeritaTbl().get_all();
    res.render("admin/berita.ejs", {
        data_table: "true",
        data: berita,
        menu: "berita"


    });
})
admin_routing.all("/tambah-berita.html", upload_foto_berita.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            const idx = random(1000000009, 9999999999);
            const form = req.body;

            //Menyimpan data
            if (req.query.target == "edit") {
                var simpan = await new BeritaTbl().update(req.query.id_berita, form);
            }
            else {
                var simpan = await new BeritaTbl().save(idx, form);
            }
            if (simpan == "sukses") {
                if (req.file)
                    await sharp(req.file.path).extract({
                        left: parseInt(form.imgX1),
                        top: parseInt(form.imgY1),
                        width: parseInt(form.imgWidth),
                        height: parseInt(form.imgHeight)
                    }).toFile("./public/berita/" + (req.query.target == "edit" ? req.query.id_berita : idx) + ".jpg", (err, info) => {
                        if (err) {
                            console.error('Error cropping image:', err);

                        } else {
                            if (fs.existsSync(req.file.path)) {
                                fs.unlink(req.file.path, (er) => {
                                    if (!er)
                                        console.log("SUKSS");
                                    else
                                        console.log("gagal");
                                })
                            }
                            console.log('Image cropped successfully:', info);
                        }
                    });

                res.redirect("/admin/berita.html");
            }
            else {
                res.send("GAGAL ISI DATA");
            }


            break;

        default:

            let data = {};
            let isImage = false;
            if (req.query.target == "edit") {
                data = await new BeritaTbl().getSingle(req.query.id_berita);
                if (fs.existsSync("./public/berita/" + req.query.id_berita + ".jpg")) {
                    isImage = true;
                }
            }
            const getTagsBerita = await new TagBeritaTb().getAll();

            res.render("admin/berita/tambah-berita.ejs", {
                menu: "berita",
                data: data,
                tags_berita: getTagsBerita,
                isImage: isImage,
            });
            break;
    }

})
admin_routing.get("/delete-berita.html", async (req, res) => {
    const hapus = await new BeritaTbl().delete(req.query.id_berita);
    if (hapus == "sukses") {
        const dir = "./public/berita/" + req.query.id_berita + ".jpg";
        if (fs.existsSync(dir)) {
            fs.unlink(dir, (err) => {
                if (!err) {
                    console.log("SUKSES");
                }
                else {
                    console.log("gagal");
                }
            })
        }
        res.redirect("/admin/berita.html");
    }
})


admin_routing.all("/profil-kepala-dinas.html", upload_foto_kepala_dinas.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            console.log(req.body);

            const form_data = req.body;
            console.log(form_data);

            const nama_baru = "./public/kepala-dinas/profil-kepala-dinas.jpg";

            if (req.file) {
                if (fs.existsSync(nama_baru)) {
                    fs.unlink(nama_baru, () => {

                    });
                }
                sharp(req.file.path).extract({
                    top: parseInt(form_data.imgX1),
                    left: parseInt(form_data.imgY1),
                    width: parseInt(form_data.imgWidth),
                    height: parseInt(form_data.imgHeight),
                }).toFile(nama_baru, (err, info) => {
                    console.log(info);
                    if (fs.existsSync(req.file.path)) {
                        fs.unlink(req.file.path, () => {
                        });
                    }
                });

            }
            else {
                console.log("tidak ada");
            }

            res.redirect("/admin/profil-kepala-dinas.html");

            break;

        default:
            const getData = await new ProfilKepalaDinas().getData();
            let isImage = false;

            res.render('admin/profil-kepala-dinas.ejs', {
                menu: "profil-kepala-dinas",
                data: getData,
                isImage: isImage
            });
            break;
    }

})

admin_routing.all("/profil-walikota.html", upload_profil_walikota.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            console.log(req.body);

            const form_data = req.body;
            console.log(form_data);

            const nama_baru = "./public/profil-walikota/profil-walikota.jpg";

            if (req.file) {
                if (fs.existsSync(nama_baru)) {
                    fs.unlink(nama_baru, () => {

                    });
                }
                sharp(req.file.path).extract({
                    top: parseInt(form_data.imgX1),
                    left: parseInt(form_data.imgY1),
                    width: parseInt(form_data.imgWidth),
                    height: parseInt(form_data.imgHeight),
                }).toFile(nama_baru, (err, info) => {
                    console.log(info);
                    if (fs.existsSync(req.file.path)) {
                        fs.unlink(req.file.path, () => {
                        });
                    }
                });

            }
            else {
                console.log("tidak ada");
            }

            res.redirect("/admin/profil-walikota.html");

            break;

        default:
            const getData = await new ProfilWalikota().getData();
            let isImage = false;
            if (fs.existsSync("./public/profil-walikota/profil-walikota.jpg")) {
                isImage = true;
            }
            res.render('admin/profil-walikota.ejs', {
                menu: "profil-walikota",
                data: getData,
                isImage: isImage
            });
            break;
    }

})

admin_routing.all("/profil-wakil-walikota.html", upload_profil_wakil_walikota.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            console.log(req.body);

            const form_data = req.body;
            console.log(form_data);

            const nama_baru = "./public/profil-wakil-walikota/profil-wakil-walikota.jpg";

            if (req.file) {
                if (fs.existsSync(nama_baru)) {
                    fs.unlink(nama_baru, () => {

                    });
                }
                sharp(req.file.path).extract({
                    top: parseInt(form_data.imgX1),
                    left: parseInt(form_data.imgY1),
                    width: parseInt(form_data.imgWidth),
                    height: parseInt(form_data.imgHeight),
                }).toFile(nama_baru, (err, info) => {
                    console.log(info);
                    if (fs.existsSync(req.file.path)) {
                        fs.unlink(req.file.path, () => {
                        });
                    }
                });

            }
            else {
                console.log("tidak ada");
            }

            res.redirect("/admin/profil-wakil-walikota.html");

            break;

        default:
            const getData = await new ProfilWakilWalikota().getData();
            let isImage = false;
            if (fs.existsSync("./public/profil-wakil-walikota/profil-wakil-walikota.jpg")) {
                isImage = true;
            }
            res.render('admin/profil-wakil-walikota.ejs', {
                menu: "profil-wakil-walikota",
                data: getData,
                isImage: isImage
            });
            break;
    }

})

admin_routing.get("/banner.html", async (req, res) => {
    const getData = await new BannerTbl().getAll();
    res.render("admin/banner.ejs", {
        data: getData,
        data_table: true,
        menu: 'banner'
    })
})
admin_routing.get('/delete-banner.html', async (req, res,) => {
    const id = req.query.id_banner;
    const hapus = await new BannerTbl().delete(id);
    if (hapus == "sukses") {
        let dir = "./public/banner/" + id + ".jpg";
        if (fs.existsSync(dir)) {
            fs.unlink(dir, (err) => {
                if (!err)
                    console.log("berhasil di hapus ");
                else
                    console.log("gagal")
            })
        }
        res.redirect("/admin/banner.html");
    }
    else {
        res.redirect("/admin/banner.html?c=gagal");
    }
})

admin_routing.all("/tambah-banner.html", upload_foto_banner.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            const idx = req.query.target == "edit" ? req.query.id_banner : random(1000000000, 9999999999)
            const dest = "./public/banner/" + idx + ".jpg";
            const form = req.body;

            if (req.query.target == "edit") {
                var model = await new BannerTbl().update(req.query.id_banner, form);
            }
            else {
                var model = await new BannerTbl().simpan(idx, form);
            }


            if (model == "sukses")

                if (req.file) {
                    console.log(req.file.path);
                    sharp(req.file.path).extract(
                        {
                            top: parseInt(form.imgX1),
                            left: parseInt(form.imgY1),
                            width: parseInt(form.imgWidth),
                            height: parseInt(form.imgHeight),
                        }
                    ).toFile(dest, (err, info) => {
                        console.log(err);
                        console.log(info);
                        if (!err) {
                            fs.unlink(req.file.path, () => {

                            });
                        }
                    })
                }
            res.redirect("/admin/banner.html");
            break;

        default:
            const id_banner = req.query.id_banner;
            let getData = {}
            let isImage = false;
            if (req.query.target == "edit") {
                if (fs.existsSync("./public/banner/" + id_banner + ".jpg")) {
                    isImage = true;
                }


                getData = await new BannerTbl().getSingle(id_banner);
            }


            if (getData == "data_null")
                res.redirect("/admin/banner.html")
            else
                res.render("admin/banner/tambah-banner.ejs", {
                    menu: 'banner',
                    req: req,
                    id_banner: id_banner,
                    isImage: isImage,
                    data: getData == "data_null" ?? {},
                });
            break;
    }
})
admin_routing.get("/slide-show.html", async (req, res) => {
    const getData = await new SlideShowTbl().getAll();
    res.render("admin/slide-show.ejs", {
        data: getData,
        data_table: true,
        menu: "slide-show"
    });
})
admin_routing.all("/tambah-slide-show.html", upload_foto_slide_show.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            const idx = random(1000000000, 9999999999);
            const form = req.body;
            console.log(form);
            const nama_baru = "./public/slide-show/" + idx + ".jpg";
            const simpan = await new SlideShowTbl().simpan(idx, form);
            if (simpan == "sukses") {
                sharp(req.file.path).extract({
                    top: parseInt(form.imgX1),
                    left: parseInt(form.imgY1),
                    width: parseInt(form.imgWidth),
                    height: parseInt(form.imgHeight),
                }).toFile(nama_baru, (err) => {
                    console.log(err);
                    fs.unlinkSync(req.file.path);
                    res.redirect("/admin/slide-show.html");
                })

            }

            break;
        default:
            res.render("admin/slide-show/tambah-slide-show.ejs", {
                data_table: true,
                menu: "slide-show"
            });
            break;
    }
})
admin_routing.get("/delete-slide-show.html", async (req, res) => {
    const hps = await new SlideShowTbl().hapus(req.query.id_slide_show);
    if (hps == "sukses") {
        const dir = "./public/slide-show/" + req.query.id_slide_show + ".jpg";
        if (fs.existsSync(dir)) {
            fs.unlink(dir, (err) => {
                console.log(err);
            })
        }
    }
    res.redirect("/admin/slide-show.html");
})

admin_routing.get("/galeri.html", async (req, res) => {
    const getData = await new GaleriTbl().getAll();
    res.render("admin/galeri.ejs", {
        data: getData,
        data_table: true,
        menu: "galeri"
    });
})

admin_routing.get("/hapus-galeri.html", async (req, res) => {
    const dir = "./public/galeri/" + req.query.id_galeri + ".jpg";
    const hapus = await new GaleriTbl().hapus(req.query.id_galeri);
    if (hapus == "sukses") {
        if (fs.existsSync(dir)) {
            fs.unlinkSync(dir);
        }
        res.redirect("/admin/galeri.html");
    }

})
admin_routing.all("/tambah-galeri.html", upload_foto_galeri.single("foto"), async (req, res) => {
    switch (req.method) {
        case "POST":
            const idx = random(1000000000, 9999999999);
            const form = req.body;
            const nama_baru = "public/galeri/" + idx + ".jpg";
            const save = await new GaleriTbl().simpan(idx, form);
            if (save == "sukses") {
                if (req.file) {
                    console.log(req.file.path);
                    sharp(req.file.path).extract({
                        top: parseInt(form.imgX1),
                        left: parseInt(form.imgY1),
                        width: parseInt(form.imgWidth),
                        height: parseInt(form.imgHeight),
                    }).resize(parseInt(form.imgWidth)).toFile(nama_baru, (err, info) => {
                        console.log(err);
                        console.log(info);
                        console.log(nama_baru);
                        fs.unlinkSync(req.file.path);
                        res.redirect("/admin/galeri.html")
                    })
                }
            }
            break;

        default:
            res.render("admin/galeri/tambah-galeri.ejs");
            break;
    }
});

admin_routing.get("/info.html", async (req, res) => {
    const getdata = await new InfoTbl().getAll()
    res.render("admin/info.ejs", {
        data: getdata,
        data_table: true,
        menu: "info"
    });
})
admin_routing.get("/hapus-info.html", async (req, res) => {
    const hapus = await new InfoTbl().delete(req.query.id_info);
    if (hapus == "sukses") {
        res.redirect("/admin/info.html");
    }
})
admin_routing.all("/tambah-info.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            const form_data = req.body;
            const id = req.query.target == "edit" ? req.query.id_info : random(1000000000, 9999999999);
            console.log(form_data);
            if (req.query.target == "edit") {
                var simpan = await new InfoTbl().update(id, form_data);

            }
            else {
                var simpan = await new InfoTbl().insert(id, form_data);
            }
            if (simpan == "sukses") {
                res.redirect("/admin/info.html");
            }
            break;

        default:
            const getData = await new InfoTbl().getSingle(req.query.id_info);
            res.render("admin/info/tambah-info.ejs", {
                menu: "info",
                data: getData,

                isEdit: req.query.target === "edit" ? true : false,
            });
            break;
    }

})
admin_routing.get("/menu-profil.html", async (req, res) => {
    const getData = await new MenuProfilTbl().getAll();
    res.render("admin/menu-profil.ejs", {
        menu: "menu-profil",
        data: getData,
    });
});
admin_routing.get("/hapus-menu-profil.html", async (req, res) => {
    const query = await new MenuProfilTbl().delete(req.query.id_menu_profil);
    if (query == "sukses") {
        res.redirect("/admin/menu-profil.html");
    }
    res.redirect("/admin/menu-profil.html?c=gagal");

});
admin_routing.all("/tambah-menu-profil.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            const form_data = req.body;
            const idx = req.query.target == "edit" ? req.query.id_menu_profil : random(1000000000, 9999999999);
            if (req.query.target == "edit") {
                var simpan = await new MenuProfilTbl().update(idx, form_data);
            }
            else {

                var simpan = await new MenuProfilTbl().insert(idx, form_data);
            }
            if (simpan == "sukses") {
                res.redirect("/admin/menu-profil.html");
            }
            break;

        default:
            const data = await new MenuProfilTbl().getSingle(req.query.id_menu_profil);
            res.render("admin/menu-profil/tambah-menu-profil.ejs", {
                data: data,
                isEdit: req.query.target == "edit" ?? true,
            });
            break;
    }

})

admin_routing.all("/video.html", async (req, res) => {
    switch (req.method) {
        case "POST":
            const form_data = req.body;
            console.log(form_data);
            const idx = random(1000000000, 9999999999);
            const save = await new VideoTbl().insert(idx, form_data);
            if (save == "sukses") {
                res.redirect("/admin/video.html");
            }
            break;

        default:
            const getData = await new VideoTbl().getAll();


            res.render("admin/video.ejs", {
                menu: "video",
                data: getData,
                fungsi: getYtId,
            })
            break;
    }

})
admin_routing.all("/header.html", (req, res) => {

    res.render("admin/header.ejs", {
        fs: fs,
        menu: "header",
    })
})
admin_routing.all("/ganti-header.html", uploadFotoHeader.single("foto"), async (req, res) => {
    const target = req.query.target;
    const form_data = req.body;
    const idx = target;
    switch (req.method) {
        case 'POST':
            if (req.file) {

                sharp(req.file.path).extract({
                    top: parseInt(form_data.imgX1),
                    left: parseInt(form_data.imgY1),
                    width: parseInt(form_data.imgWidth),
                    height: parseInt(form_data.imgHeight),
                }).toFile("./public/header-image/" + idx + ".jpg", (err) => {

                    if (!err) {
                        fs.unlinkSync(req.file.path);
                    }
                    res.redirect("/admin/header.html");
                });
            }
            break;
        default:
            fs.existsSync
            res.render('admin/header/ganti-header.ejs', {
                target: target,
                fs: fs,
            });
            break;
    }
})
admin_routing.get("/hapus-header.html", (req, res) => {
    const target = req.query.target;
    if (fs.existsSync("./public/header-image/" + target + ".jpg")) {
        fs.unlinkSync("./public/header-image/" + target + ".jpg");
        res.redirect("/admin/header.html");
    }
})
admin_routing.get("/", async (req, res) => {
    const getData = await new DashboardMdl().get();

    res.render("admin/beranda.ejs", { data: getData, menu: "beranda" });
})
admin_routing.get("/cetak.html", async (req, res) => {

    const getInstansi = await new InstansiTbl().getAll();

    res.render("admin/cetak.ejs", { layoutSource: false, layout: false, data: getInstansi });

})
admin_routing.get("/export.html", () => {

})
admin_routing.all("/query-box.html", (req, res) => {

    res.render('admin/query-box.ejs');
})
admin_routing.all("/ubah-profil.html", async (req, res) => {
    let getProfil = await req.session.login;
    switch (req.method) {
        case 'POST':
            const form_data = req.body;
            console.log(form_data)
            if (typeof form_data.update_profil != "undefined") {
                const update = await new ProfilMdl().update(form_data, JSON.parse(req.session.login));
                if (update == "update_sukses") {

                    res.redirect("/admin/ubah-profil.html");
                }
                else {
                    //tambahan pesan flash  
                    res.redirect("/admin/ubah-profil.html?auth=false");
                }
            }
            else if (typeof form_data.update_twitter != "undefined") {
                res.send("tiwitter")
            }
            break;

        default:
            getProfil = JSON.parse(getProfil);
            const password = await decryptRc(getProfil.password);

            res.render("admin/ubah-profil.ejs", { data: getProfil, datax: password });
            break;
    }

})


admin_routing.get("/logout.html", (req, res) => {
    delete req.session.login;
    res.redirect("/login.html");
})

admin_routing.get("*", (req, res) => {
    res.status(404).send("terjadi masalah 404");
})


module.exports = admin_routing;
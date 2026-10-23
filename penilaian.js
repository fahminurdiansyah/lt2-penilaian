import os, textwrap
content = r'''/**
 * penilaian.js — Konfigurasi instrumen penilaian LT II Regol 2026
 *
 * Cara mengubah:
 * 1. Setiap mata lomba memiliki kode (A1, A2, ...).
 * 2. Atur nilai maksimum tiap kriteria pada `criteria`.
 * 3. Jika kriteria tidak dipakai untuk suatu mata lomba, biarkan nilainya 0.
 * 4. `entryId` adalah ID Google Forms; jangan ubah kecuali Form diubah.
 * 5. Antarmuka dapat membaca `criteria` untuk membuat kontrol dan `maxScore`
 *    untuk menghitung nilai. Fungsi `buildFormPayload()` memetakan nilai ke
 *    entry Google Forms.
 *
 * Catatan: konfigurasi ini tidak mengirim form dengan sendirinya. File UI
 * perlu memuat penilaian.js dan memanggil fungsi-fungsi di bawah.
 */
(function (root) {
  "use strict";

  const FORM_RESPONSE_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSe1qSFeu5SvMp6JdAMDk66kyAQmJtwdHMnywVaml42oQMkPBw/formResponse";

  // Urutan ini juga menjadi acuan pemetaan nilai ke Google Forms.
  const CRITERIA = [
    { key: "sikapEtika", label: "Sikap dan etika", entryId: "1102203745" },
    { key: "kedisiplinan", label: "Kedisiplinan", entryId: "308553817" },
    { key: "dayaTanggap", label: "Daya tanggap", entryId: "473179287" },
    { key: "ketepatan", label: "Ketepatan", entryId: "646836897" },
    { key: "kesesuaianProsedur", label: "Kesesuaian Prosedur", entryId: "1748328363" },
    { key: "pengetahuanPemahaman", label: "Pengetahuan/pemahaman", entryId: "1374223098" },
    { key: "akurasi", label: "Akurasi", entryId: "1816097833" },
    { key: "ketelitian", label: "Ketelitian", entryId: "616625118" },
    { key: "kelengkapan", label: "Kelengkapan", entryId: "409883208" },
    { key: "kerapian", label: "Kerapian", entryId: "192813140" },
    { key: "kebersihan", label: "Kebersihan", entryId: "1486708454" },
    { key: "kualitasHasil", label: "Kualitas hasil", entryId: "1569268478" },
    { key: "fungsiKegunaan", label: "Fungsi/kegunaan", entryId: "274155439" },
    { key: "keselamatan", label: "Keselamatan", entryId: "1328534777" },
    { key: "kreativitas", label: "Kreativitas", entryId: "1631170157" },
    { key: "kekompakan", label: "Kekompakan", entryId: "1597175075" },
    { key: "kerjaSama", label: "Kerja sama", entryId: "1345773215" },
    { key: "kecepatanEfisiensiWaktu", label: "Kecepatan/efisiensi waktu", entryId: "1817279958" },
    { key: "pengelolaanSumberdaya", label: "Pengelolaan sumberdaya", entryId: "806863660" },
    { key: "komunikasi", label: "Komunikasi", entryId: "1550933585" }
  ];

  const META_ENTRIES = {
    mataLomba: "511078072",
    namaRegu: "1652413056"
  };

  /*
   * Nilai pada tiap kode adalah NILAI MAKSIMUM / bobot kriteria,
   * bukan nilai juri yang sedang diberikan.
   * Total bobot A1 = 100; total bobot A2 = 100.
   */
  const COMPETITIONS = {
    A1: {
      label: "A1",
      criteria: {
        sikapEtika: 5,
        kedisiplinan: 0,
        dayaTanggap: 0,
        ketepatan: 25,
        kesesuaianProsedur: 0,
        pengetahuanPemahaman: 0,
        akurasi: 0,
        ketelitian: 0,
        kelengkapan: 25,
        kerapian: 25,
        kebersihan: 10,
        kualitasHasil: 0,
        fungsiKegunaan: 0,
        keselamatan: 0,
        kreativitas: 0,
        kekompakan: 0,
        kerjaSama: 0,
        kecepatanEfisiensiWaktu: 0,
        pengelolaanSumberdaya: 0,
        komunikasi: 0
      }
    },
    A2: {
      label: "A2",
      criteria: {
        sikapEtika: 0,
        kedisiplinan: 0,
        dayaTanggap: 0,
        ketepatan: 30,
        kesesuaianProsedur: 0,
        pengetahuanPemahaman: 0,
        akurasi: 0,
        ketelitian: 0,
        kelengkapan: 40,
        kerapian: 15,
        kebersihan: 0,
        kualitasHasil: 0,
        fungsiKegunaan: 0,
        keselamatan: 0,
        kreativitas: 15,
        kekompakan: 0,
        kerjaSama: 0,
        kecepatanEfisiensiWaktu: 0,
        pengelolaanSumberdaya: 0,
        komunikasi: 0
      }
    }

    // Tambahkan A3, A4, dan seterusnya dengan pola yang sama.
  };

  function getCompetition(code) {
    const competition = COMPETITIONS[String(code || "").toUpperCase()];
    if (!competition) throw new Error("Kode mata lomba belum dikonfigurasi: " + code);
    return competition;
  }

  function getActiveCriteria(code) {
    const competition = getCompetition(code);
    return CRITERIA
      .filter(item => Number(competition.criteria[item.key] || 0) > 0)
      .map(item => ({
        ...item,
        maxScore: Number(competition.criteria[item.key])
      }));
  }

  function getTotalMax(code) {
    return getActiveCriteria(code).reduce((sum, item) => sum + item.maxScore, 0);
  }

  /*
   * values = skor aktual dari UI, contoh:
   * { sikapEtika: 4, ketepatan: 20, kelengkapan: 22, kerapian: 21, kebersihan: 8 }
   *
   * Kriteria yang tidak aktif/tidak dikirim UI otomatis bernilai 0.
   */
  function buildFormPayload(code, teamName, values) {
    const competition = getCompetition(code);
    const inputValues = values || {};
    const payload = {
      ["entry." + META_ENTRIES.mataLomba]: competition.label,
      ["entry." + META_ENTRIES.namaRegu]: teamName || ""
    };

    CRITERIA.forEach(item => {
      const max = Number(competition.criteria[item.key] || 0);
      const value = max > 0 ? Number(inputValues[item.key] || 0) : 0;
      payload["entry." + item.entryId] =
        Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0;
    });

    return payload;
  }

  function buildFormUrl(code, teamName, values) {
    const payload = buildFormPayload(code, teamName, values);
    const params = new URLSearchParams(payload);
    return FORM_RESPONSE_URL + "?" + params.toString();
  }

  const api = {
    FORM_RESPONSE_URL,
    META_ENTRIES,
    CRITERIA,
    COMPETITIONS,
    getCompetition,
    getActiveCriteria,
    getTotalMax,
    buildFormPayload,
    buildFormUrl
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PenilaianConfig = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
'''
# Fix syntax issue? Object literal COMPETITIONS comment currently after A2 object no comma needed? comment then closing brace is okay, but A2 entry ends } no comma and comment before close; valid.
path='/mnt/data/penilaian.js'
with open(path,'w',encoding='utf-8') as f: f.write(content)
print(path, os.path.getsize(path))

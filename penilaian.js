
/**
 * KONFIGURASI PENILAIAN LT II REGOL 2026
 *
 * File ini mengatur:
 * - Daftar kriteria penilaian
 * - Bobot setiap kriteria per mata lomba
 * - Pemetaan kriteria ke Google Forms
 * - Perhitungan total bobot
 * - Persiapan data untuk dikirim ke Google Forms
 *
 * Pastikan file ini berada satu folder dengan HTML antarmuka.
 */

(function (root) {
  "use strict";

  // =====================================================
  // 1. GOOGLE FORMS
  // =====================================================

  const FORM_RESPONSE_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSe1qSFeu5SvMp6JdAMDk66kyAQmJtwdHMnywVaml42oQMkPBw/formResponse";

  const META_ENTRIES = {
    mataLomba: "511078072",
    namaRegu: "1652413056"
  };

  // =====================================================
  // 2. DAFTAR SELURUH KRITERIA
  // entryId tidak perlu diubah selama Google Form
  // tidak diubah.
  // =====================================================

  const CRITERIA = [
    {
      key: "sikapEtika",
      label: "Sikap dan etika",
      entryId: "1102203745"
    },
    {
      key: "kedisiplinan",
      label: "Kedisiplinan",
      entryId: "308553817"
    },
    {
      key: "dayaTanggap",
      label: "Daya tanggap",
      entryId: "473179287"
    },
    {
      key: "ketepatan",
      label: "Ketepatan",
      entryId: "646836897"
    },
    {
      key: "kesesuaianProsedur",
      label: "Kesesuaian Prosedur",
      entryId: "1748328363"
    },
    {
      key: "pengetahuanPemahaman",
      label: "Pengetahuan/pemahaman",
      entryId: "1374223098"
    },
    {
      key: "akurasi",
      label: "Akurasi",
      entryId: "1816097833"
    },
    {
      key: "ketelitian",
      label: "Ketelitian",
      entryId: "616625118"
    },
    {
      key: "kelengkapan",
      label: "Kelengkapan",
      entryId: "409883208"
    },
    {
      key: "kerapian",
      label: "Kerapian",
      entryId: "192813140"
    },
    {
      key: "kebersihan",
      label: "Kebersihan",
      entryId: "1486708454"
    },
    {
      key: "kualitasHasil",
      label: "Kualitas hasil",
      entryId: "1569268478"
    },
    {
      key: "fungsiKegunaan",
      label: "Fungsi/kegunaan",
      entryId: "274155439"
    },
    {
      key: "keselamatan",
      label: "Keselamatan",
      entryId: "1328534777"
    },
    {
      key: "kreativitas",
      label: "Kreativitas",
      entryId: "1631170157"
    },
    {
      key: "kekompakan",
      label: "Kekompakan",
      entryId: "1597175075"
    },
    {
      key: "kerjaSama",
      label: "Kerja sama",
      entryId: "1345773215"
    },
    {
      key: "kecepatanEfisiensiWaktu",
      label: "Kecepatan/efisiensi waktu",
      entryId: "1817279958"
    },
    {
      key: "pengelolaanSumberdaya",
      label: "Pengelolaan sumberdaya",
      entryId: "806863660"
    },
    {
      key: "komunikasi",
      label: "Komunikasi",
      entryId: "1550933585"
    }
  ];

  // =====================================================
  // 3. MATRIKS PENILAIAN SETIAP MATA LOMBA
  //
  // Angka adalah BOBOT MAKSIMUM kriteria.
  // Bobot 0 berarti kriteria tidak digunakan.
  //
  // A1 = total 90 poin sesuai angka yang diberikan.
  // A2 = total 100 poin sesuai angka yang diberikan.
  // =====================================================

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

    /*
     * TAMBAHKAN KODE BERIKUTNYA DI SINI.
     *
     * Contoh:
     *
     * ,
     * A3: {
     *   label: "A3",
     *   criteria: {
     *     sikapEtika: 5,
     *     kedisiplinan: 10,
     *     dayaTanggap: 5,
     *     ketepatan: 20,
     *     kesesuaianProsedur: 10,
     *     pengetahuanPemahaman: 0,
     *     akurasi: 10,
     *     ketelitian: 10,
     *     kelengkapan: 0,
     *     kerapian: 0,
     *     kebersihan: 0,
     *     kualitasHasil: 10,
     *     fungsiKegunaan: 0,
     *     keselamatan: 5,
     *     kreativitas: 0,
     *     kekompakan: 0,
     *     kerjaSama: 5,
     *     kecepatanEfisiensiWaktu: 5,
     *     pengelolaanSumberdaya: 5,
     *     komunikasi: 0
     *   }
     * }
     *
     * Angka A3 di atas hanya contoh struktur,
     * BUKAN bobot resmi.
     */
  };

  // =====================================================
  // 4. FUNGSI MENGAMBIL KONFIGURASI
  // =====================================================

  function getCompetition(code) {
    const normalizedCode = String(code || "").toUpperCase();
    const competition = COMPETITIONS[normalizedCode];

    if (!competition) {
      throw new Error(
        "Mata lomba belum dikonfigurasi: " + normalizedCode
      );
    }

    return competition;
  }

  // Hanya mengambil kriteria yang bobotnya lebih dari 0.
  function getActiveCriteria(code) {
    const competition = getCompetition(code);

    return CRITERIA
      .filter(function (item) {
        return Number(competition.criteria[item.key] || 0) > 0;
      })
      .map(function (item) {
        return {
          key: item.key,
          label: item.label,
          entryId: item.entryId,
          maxScore: Number(
            competition.criteria[item.key]
          )
        };
      });
  }

  // Menghitung jumlah bobot maksimal.
  function getTotalMax(code) {
    return getActiveCriteria(code).reduce(
      function (total, item) {
        return total + item.maxScore;
      },
      0
    );
  }

  // =====================================================
  // 5. MEMETAKAN NILAI KE GOOGLE FORMS
  //
  // values berisi nilai aktual dari antarmuka.
  // Kriteria tidak aktif otomatis bernilai 0.
  // Nilai dibatasi antara 0 dan bobot maksimum.
  // =====================================================

  function buildFormPayload(code, teamName, values) {
    const competition = getCompetition(code);
    const inputValues = values || {};

    const payload = {};

    payload["entry." + META_ENTRIES.mataLomba] =
      competition.label;

    payload["entry." + META_ENTRIES.namaRegu] =
      teamName || "";

    CRITERIA.forEach(function (item) {
      const maxScore = Number(
        competition.criteria[item.key] || 0
      );

      let value = 0;

      if (maxScore > 0) {
        value = Number(inputValues[item.key] || 0);

        if (!Number.isFinite(value)) {
          value = 0;
        }

        value = Math.max(
          0,
          Math.min(maxScore, value)
        );
      }

      payload["entry." + item.entryId] = value;
    });

    return payload;
  }

  // Membuat URL berisi data penilaian.
  // Untuk pengiriman resmi, gunakan POST melalui form.
  function buildFormUrl(code, teamName, values) {
    const payload = buildFormPayload(
      code,
      teamName,
      values
    );

    const params = new URLSearchParams(payload);

    return FORM_RESPONSE_URL + "?" + params.toString();
  }

  // =====================================================
  // 6. EKSPOR KONFIGURASI UNTUK ANTARMUKA
  // =====================================================

  const api = {
    FORM_RESPONSE_URL: FORM_RESPONSE_URL,
    META_ENTRIES: META_ENTRIES,
    CRITERIA: CRITERIA,
    COMPETITIONS: COMPETITIONS,

    getCompetition: getCompetition,
    getActiveCriteria: getActiveCriteria,
    getTotalMax: getTotalMax,

    buildFormPayload: buildFormPayload,
    buildFormUrl: buildFormUrl
  };

  // Agar dapat digunakan oleh HTML melalui PenilaianConfig.
  root.PenilaianConfig = api;

  // Dukungan tambahan untuk Node.js.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

})(typeof globalThis !== "undefined" ? globalThis : this);

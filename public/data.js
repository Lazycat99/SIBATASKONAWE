/**
 * ============================================================================
 * SI-BATAS KONAWE — BASIS DATA DOKUMEN & PROGRES TAPAL BATAS WILAYAH (data.js)
 * Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe
 * ============================================================================
 *
 * PANDUAN BAGI STAF TATA PEMERINTAHAN UNTUK MENAMBAHKAN BARIS DATA BARU:
 *
 * 1. MENAMBAH DOKUMEN PRODUK HUKUM (PERBUP) ATAU BERITA ACARA (BA):
 *    Buka array `DATA_DOKUMEN_BATAS` di bawah, lalu salin (copy) salah satu
 *    blok objek `{ ... },` dan tempelkan (paste) di baris paling bawah sebelum
 *    tanda kurung siku penutup `];`.
 *
 *    Pastikan mengisi atribut wajib berikut dengan tanda kutip ("..."):
 *    - id             : Nomor urut unik (contoh: "DOK-017")
 *    - namaDesa       : Nama Desa atau Kelurahan (contoh: "Desa Trimulya")
 *    - kecamatan      : Nama Kecamatan di Kab. Konawe (contoh: "Padangguni")
 *    - jenisDokumen   : Isi dengan "Perbup" (untuk Produk Hukum) atau "BA" (untuk Berita Acara)
 *    - status         : Isi dengan "Final" (sudah sah/definitif) atau "Draft" (On-Going/Dalam Proses)
 *    - nomorDokumen   : Nomor & Tahun Perbup atau Berita Acara
 *    - linkDrive      : Tautan URL Google Drive dokumen PDF/Peta (pastikan akses "Anyone with link")
 *    - tanggalUpdate  : Tanggal pembaruan dokumen (contoh: "14 Oktober 2024")
 *    - koordinatUtama : Titik ikat kartometrik / pilar utama (opsional)
 *    - keterangan     : Ringkasan status atau cakupan segmen batas
 *
 * 2. MENAMBAH PROGRES KEGIATAN PELACAKAN BATAS:
 *    Tambahkan objek baru ke dalam `PROGRES_BATAS_LUAR` (antar-Kabupaten/Kota)
 *    atau `PROGRES_BATAS_DALAM` (antar-Kecamatan/Desa di Kab. Konawe).
 * ============================================================================
 */

const DATA_DOKUMEN_BATAS = [
  // ==========================================================================
  // KECAMATAN PADANGGUNI (Desa Trimulya, Desa Mokaleleo, Desa Aleuti, dll.)
  // ==========================================================================
  {
    id: "DOK-001",
    namaDesa: "Desa Trimulya",
    kecamatan: "Padangguni",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 18 Tahun 2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-trimulya-2023",
    tanggalUpdate: "12 Agustus 2023",
    koordinatUtama: "03°52'14.2\" LS - 122°04'31.8\" BT (PBU-01 Trimulya)",
    keterangan: "Penetapan dan penegasan batas wilayah administrasi Desa Trimulya Kecamatan Padangguni secara kartometrik dan pilar lapangan."
  },
  {
    id: "DOK-002",
    namaDesa: "Desa Mokaleleo",
    kecamatan: "Padangguni",
    jenisDokumen: "Perbup",
    status: "Draft",
    nomorDokumen: "Rancangan Perbup Nomor 04/DRAFT-TAPEM/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-draft-mokaleleo-2025",
    tanggalUpdate: "18 Januari 2025",
    koordinatUtama: "03°50'42.9\" LS - 122°06'19.4\" BT (TK-04 Mokaleleo)",
    keterangan: "Tahap harmonisasi Bagian Hukum Setda Kab. Konawe dan verifikasi peta kerja batas segmen saluran irigasi."
  },
  {
    id: "DOK-003",
    namaDesa: "Desa Trimulya",
    kecamatan: "Padangguni",
    jenisDokumen: "BA",
    status: "Final",
    nomorDokumen: "BA/134.1/TAPEM-PG/VII/2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-trimulya-2023",
    tanggalUpdate: "02 Juli 2023",
    koordinatUtama: "14 Titik Kartometrik (TK-01 s/d TK-14)",
    keterangan: "Berita Acara Kesepakatan Tapal Batas Desa Trimulya dengan Desa Padangguni Utama dan Desa Langgea."
  },
  {
    id: "DOK-004",
    namaDesa: "Desa Mokaleleo",
    kecamatan: "Padangguni",
    jenisDokumen: "BA",
    status: "Draft",
    nomorDokumen: "BA-MED/019/TAPEM-PG/I/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-mokaleleo-2025",
    tanggalUpdate: "09 Januari 2025",
    koordinatUtama: "9 Titik Kartometrik (Koreksi Segmen Utara)",
    keterangan: "Menunggu kelengkapan tanda tangan Kepala Desa berbatasan pada segmen perkebunan rakyat."
  },

  // ==========================================================================
  // KECAMATAN TONGAUNA (Desa Tetehaka, Desa Momea, Kelurahan Sendang Mulya Sari)
  // ==========================================================================
  {
    id: "DOK-005",
    namaDesa: "Desa Tetehaka",
    kecamatan: "Tongauna",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 24 Tahun 2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-tetehaka-2023",
    tanggalUpdate: "21 September 2023",
    koordinatUtama: "03°49'05.1\" LS - 121°58'44.0\" BT (PBU-03 Tetehaka)",
    keterangan: "Penetapan batas definitif Desa Tetehaka Kecamatan Tongauna beserta lampiran peta ortofoto skala 1:5.000."
  },
  {
    id: "DOK-006",
    namaDesa: "Desa Tetehaka",
    kecamatan: "Tongauna",
    jenisDokumen: "BA",
    status: "Final",
    nomorDokumen: "BA/134.2/TAPEM-TG/VIII/2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-tetehaka-2023",
    tanggalUpdate: "15 Agustus 2023",
    koordinatUtama: "11 Titik Kartometrik & 3 Pilar Batas Utama",
    keterangan: "Kesepakatan pelacakan batas lapangan antara Pemerintah Desa Tetehaka, Desa Lalonggowuna, dan Camat Tongauna."
  },
  {
    id: "DOK-007",
    namaDesa: "Kelurahan Puosu",
    kecamatan: "Tongauna",
    jenisDokumen: "Perbup",
    status: "Draft",
    nomorDokumen: "Rancangan Perbup Nomor 09/DRAFT-TAPEM/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-draft-puosu-2025",
    tanggalUpdate: "04 Februari 2025",
    koordinatUtama: "03°48'19.7\" LS - 121°57'12.3\" BT (TK-02 Puosu)",
    keterangan: "Evaluasi Biro Pemerintahan dan Otonomi Daerah Setda Provinsi Sulawesi Tenggara."
  },

  // ==========================================================================
  // KECAMATAN UNAAHA (Kelurahan Tuoy, Kelurahan Arombu, Kelurahan Puunaaha)
  // ==========================================================================
  {
    id: "DOK-008",
    namaDesa: "Kelurahan Tuoy",
    kecamatan: "Unaaha",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 11 Tahun 2022",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-tuoy-2022",
    tanggalUpdate: "19 Mei 2022",
    koordinatUtama: "03°51'22.4\" LS - 122°02'10.5\" BT (PBU-01 Unaaha)",
    keterangan: "Batas administrasi definitif kawasan pusat pemerintahan ibu kota Kabupaten Konawe."
  },
  {
    id: "DOK-009",
    namaDesa: "Kelurahan Arombu",
    kecamatan: "Unaaha",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 12 Tahun 2022",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-arombu-2022",
    tanggalUpdate: "19 Mei 2022",
    koordinatUtama: "03°51'58.0\" LS - 122°01'48.2\" BT (PBU-02 Unaaha)",
    keterangan: "Penegasan batas Kelurahan Arombu terhadap Kelurahan Tumpas dan bantaran Sungai Konaweha."
  },
  {
    id: "DOK-010",
    namaDesa: "Kelurahan Tuoy",
    kecamatan: "Unaaha",
    jenisDokumen: "BA",
    status: "Final",
    nomorDokumen: "BA/134.1/TAPEM-UNH/III/2022",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-tuoy-2022",
    tanggalUpdate: "28 Maret 2022",
    koordinatUtama: "18 Titik Kartometrik Perkotaan Unaaha",
    keterangan: "Berita Acara Kesepakatan Lurah se-Kecamatan Unaaha disaksikan Tim Penegasan Batas Daerah (PPBD) Kab. Konawe."
  },

  // ==========================================================================
  // KECAMATAN UEPAI (Desa Ameroro, Desa Tawarotebota, Desa Rawua)
  // ==========================================================================
  {
    id: "DOK-011",
    namaDesa: "Desa Ameroro",
    kecamatan: "Uepai",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 31 Tahun 2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-ameroro-2023",
    tanggalUpdate: "03 November 2023",
    koordinatUtama: "03°54'11.6\" LS - 122°00'39.1\" BT (PBU-07 Ameroro)",
    keterangan: "Penetapan batas wilayah Desa Ameroro termasuk koridor kawasan strategis Bendungan Ameroro."
  },
  {
    id: "DOK-012",
    namaDesa: "Desa Tawarotebota",
    kecamatan: "Uepai",
    jenisDokumen: "Perbup",
    status: "Draft",
    nomorDokumen: "Rancangan Perbup Nomor 07/DRAFT-TAPEM/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-draft-tawarotebota-2025",
    tanggalUpdate: "27 Januari 2025",
    koordinatUtama: "03°55'02.8\" LS - 121°59'51.0\" BT (TK-06 Uepai)",
    keterangan: "Revisi lampiran daftar koordinat geografis pasca sinkronisasi citra satelit resolusi tinggi BIG."
  },
  {
    id: "DOK-013",
    namaDesa: "Desa Tawarotebota",
    kecamatan: "Uepai",
    jenisDokumen: "BA",
    status: "Final",
    nomorDokumen: "BA/134.3/TAPEM-UEP/XII/2024",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-tawarotebota-2024",
    tanggalUpdate: "11 Desember 2024",
    koordinatUtama: "12 Titik Kartometrik Jalan Poros Kendari-Kolaka",
    keterangan: "Berita Acara pelacakan dan kesepakatan garis batas Desa Tawarotebota dengan Desa Rawua."
  },

  // ==========================================================================
  // KECAMATAN LAMBUYA & WAWOTOBI (Desa Amberi, Desa Waworaha, Kelurahan Wawotobi)
  // ==========================================================================
  {
    id: "DOK-014",
    namaDesa: "Desa Amberi",
    kecamatan: "Lambuya",
    jenisDokumen: "BA",
    status: "Draft",
    nomorDokumen: "BA-MED/022/TAPEM-LBY/II/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-ba-amberi-2025",
    tanggalUpdate: "10 Februari 2025",
    koordinatUtama: "7 Titik Kartometrik (Segmen Persawahan Lambuya)",
    keterangan: "Tahap mediasi penentuan titik ikat batas alam sungai mati antara Desa Amberi dan Desa Waworaha."
  },
  {
    id: "DOK-015",
    namaDesa: "Desa Waworaha",
    kecamatan: "Lambuya",
    jenisDokumen: "Perbup",
    status: "Draft",
    nomorDokumen: "Rancangan Perbup Nomor 11/DRAFT-TAPEM/2025",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-draft-waworaha-2025",
    tanggalUpdate: "14 Februari 2025",
    koordinatUtama: "03°58'40.3\" LS - 122°05'22.7\" BT (TK-03 Lambuya)",
    keterangan: "Penyusunan draf batang tubuh Perbup dan peta kartometrik oleh Tim Teknis Tapem Setda Kab. Konawe."
  },
  {
    id: "DOK-016",
    namaDesa: "Kelurahan Wawotobi",
    kecamatan: "Wawotobi",
    jenisDokumen: "Perbup",
    status: "Final",
    nomorDokumen: "Perbup Konawe Nomor 29 Tahun 2023",
    linkDrive: "https://drive.google.com/drive/folders/1konawe-perbup-wawotobi-2023",
    tanggalUpdate: "25 Oktober 2023",
    koordinatUtama: "03°53'48.5\" LS - 122°05'59.2\" BT (PBU-02 Wawotobi)",
    keterangan: "Penetapan dan penegasan batas wilayah Kelurahan Wawotobi Kecamatan Wawotobi."
  }
];

/**
 * ============================================================================
 * DATA PROGRES KEGIATAN BATAS LUAR DAERAH (ANTAR-KABUPATEN / KOTA)
 * ============================================================================
 */
const PROGRES_BATAS_LUAR = [
  {
    id: "LUAR-01",
    segmen: "Kota Kendari - Kab. Konawe",
    wilayahBersinggungan: "Kec. Sampara & Kec. Morosi (Konawe) — Kec. Puuwatu & Kec. Mandonga (Kota Kendari)",
    persentase: 88,
    tahapanSaatIni: "Identifikasi titik koordinat pilar batas dan sinkronisasi peta kerja",
    deskripsiTahapan: "Pelaksanaan verifikasi lapangan terhadap 24 Pilar Batas Utama (PBU) dan Titik Kartometrik (TK), serta sinkronisasi peta kerja skala 1:10.000 bersama Biro Pemerintahan Setda Prov. Sultra dan Ditjen Bina Adwil Kemendagri.",
    jumlahPilar: "24 PBU / 38 TK",
    targetSelesai: "Triwulan II — 2025",
    statusTeknis: "Sinkronisasi Peta Kerja & Verifikasi Pilar",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-luar-kendari-2025",
    fokusPeta: "Segmen Batas Kota Kendari - Kab. Konawe (Sampara - Puuwatu)"
  },
  {
    id: "LUAR-02",
    segmen: "Kab. Konawe Selatan - Kab. Konawe",
    wilayahBersinggungan: "Kec. Lambuya, Pondidaha & Wonggeduku (Konawe) — Kec. Mowila & Ranomeeto Barat (Konsel)",
    persentase: 95,
    tahapanSaatIni: "Evaluasi akhir draf Permendagri dan validasi daftar koordinat geografis",
    deskripsiTahapan: "Seluruh titik pilar batas pada koridor Sungai Konaweha dan jalur darat telah disepakati melalui Berita Acara Provinsi; saat ini menunggu penetapan nomor registrasi Permendagri.",
    jumlahPilar: "31 PBU / 52 TK",
    targetSelesai: "Triwulan I — 2025",
    statusTeknis: "Tahap Penetapan Permendagri",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-luar-konsel-2025",
    fokusPeta: "Segmen Batas Kab. Konawe Selatan - Kab. Konawe"
  },
  {
    id: "LUAR-03",
    segmen: "Kab. Konawe Utara - Kab. Konawe",
    wilayahBersinggungan: "Kec. Routa, Bondoala & Kapoiala (Konawe) — Kec. Motui & Lasolo Kepulauan (Konut)",
    persentase: 74,
    tahapanSaatIni: "Pelacakan kartometrik segmen punggung bukit dan daerah aliran sungai",
    deskripsiTahapan: "Tim PPBD Kabupaten Konawe dan Kabupaten Konawe Utara sedang melaksanakan ekstraksi koordinat citra tegak resolusi tinggi pada segmen hutan lindung Routa.",
    jumlahPilar: "19 PBU / 44 TK",
    targetSelesai: "Triwulan III — 2025",
    statusTeknis: "Pelacakan Kartometrik & Mediasi Segmen",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-luar-konut-2025",
    fokusPeta: "Segmen Batas Kab. Konawe Utara - Kab. Konawe"
  },
  {
    id: "LUAR-04",
    segmen: "Kab. Kolaka Timur - Kab. Konawe",
    wilayahBersinggungan: "Kec. Asinua & Latoma (Konawe) — Kec. Uluiwoi & Ueesi (Kolaka Timur)",
    persentase: 82,
    tahapanSaatIni: "Pemasangan pilar batas tambahan dan penandatanganan Berita Acara Kesepakatan",
    deskripsiTahapan: "Penyelesaian segmen perbatasan pegunungan Latoma-Uluiwoi melalui kesepakatan titik kartometrik berbasis batas alam punggung pegunungan.",
    jumlahPilar: "16 PBU / 29 TK",
    targetSelesai: "Triwulan II — 2025",
    statusTeknis: "Finalisasi Berita Acara Antar-Daerah",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-luar-koltim-2025",
    fokusPeta: "Segmen Batas Kab. Kolaka Timur - Kab. Konawe"
  }
];

/**
 * ============================================================================
 * DATA PROGRES KEGIATAN BATAS DALAM DAERAH (ANTAR-KECAMATAN / DESA)
 * ============================================================================
 */
const PROGRES_BATAS_DALAM = [
  {
    id: "DALAM-01",
    segmen: "Batas Antar-Desa se-Kecamatan Padangguni",
    kecamatan: "Padangguni",
    cakupanDesa: "Desa Trimulya, Desa Mokaleleo, Desa Padangguni Utama, Desa Aleuti, Desa Langgea",
    persentase: 85,
    tahapanSaatIni: "Verifikasi silang titik kartometrik Desa Mokaleleo dan penyusunan draf Perbup kolektif",
    jumlahTitik: "64 Titik Kartometrik / 8 Pilar",
    targetSelesai: "Maret 2025",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-dalam-padangguni",
    fokusPeta: "Kecamatan Padangguni (Desa Trimulya & Desa Mokaleleo)"
  },
  {
    id: "DALAM-02",
    segmen: "Batas Antar-Desa/Kelurahan se-Kecamatan Tongauna",
    kecamatan: "Tongauna",
    cakupanDesa: "Desa Tetehaka, Kelurahan Puosu, Kelurahan Sendang Mulya Sari, Desa Momea",
    persentase: 92,
    tahapanSaatIni: "Harmonisasi akhir Rancangan Peraturan Bupati pada Bagian Hukum Setda Kab. Konawe",
    jumlahTitik: "58 Titik Kartometrik / 10 Pilar",
    targetSelesai: "Februari 2025",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-dalam-tongauna",
    fokusPeta: "Kecamatan Tongauna (Desa Tetehaka & Kelurahan Puosu)"
  },
  {
    id: "DALAM-03",
    segmen: "Batas Wilayah Administrasi Kecamatan Unaaha & Kecamatan Anggaberi",
    kecamatan: "Unaaha",
    cakupanDesa: "Kelurahan Tuoy, Kelurahan Arombu, Kelurahan Puunaaha, Kelurahan Unaasi",
    persentase: 100,
    tahapanSaatIni: "Penetapan Perbup Definitif dan integrasi poligon ke basis data WebGIS Kabupaten Konawe",
    jumlahTitik: "72 Titik Kartometrik / 14 Pilar",
    targetSelesai: "Selesai (Terintegrasi WebGIS)",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-dalam-unaaha",
    fokusPeta: "Kecamatan Unaaha (Kelurahan Tuoy & Kelurahan Arombu)"
  },
  {
    id: "DALAM-04",
    segmen: "Pelacakan Tapal Batas Desa Kawasan Bendungan Ameroro (Kec. Uepai)",
    kecamatan: "Uepai",
    cakupanDesa: "Desa Ameroro, Desa Tawarotebota, Desa Rawua, Kelurahan Uepai",
    persentase: 78,
    tahapanSaatIni: "Pengukuran RTK-GNSS lapangan dan koreksi garis batas genangan waduk bersama Pemdes",
    jumlahTitik: "49 Titik Kartometrik / 6 Pilar",
    targetSelesai: "April 2025",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-dalam-uepai",
    fokusPeta: "Kecamatan Uepai (Desa Ameroro & Desa Tawarotebota)"
  },
  {
    id: "DALAM-05",
    segmen: "Penegasan Batas Desa Sentra Pertanian Kecamatan Lambuya",
    kecamatan: "Lambuya",
    cakupanDesa: "Desa Amberi, Desa Waworaha, Kelurahan Lambuya, Desa Meraka",
    persentase: 65,
    tahapanSaatIni: "Mediasi lapangan penentuan as saluran primer dan kesepakatan Berita Acara Desa",
    jumlahTitik: "41 Titik Kartometrik / 5 Pilar",
    targetSelesai: "Mei 2025",
    linkDokumen: "https://drive.google.com/drive/folders/1konawe-dalam-lambuya",
    fokusPeta: "Kecamatan Lambuya (Desa Amberi & Desa Waworaha)"
  }
];

// Ekspor ke objek global window agar dapat langsung dibaca oleh index.html
if (typeof window !== "undefined") {
  window.SI_BATAS_DATA = {
    dokumen: DATA_DOKUMEN_BATAS,
    progresLuar: PROGRES_BATAS_LUAR,
    progresDalam: PROGRES_BATAS_DALAM
  };
}

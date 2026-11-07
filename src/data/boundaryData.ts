import { wilayahDataKonawe } from './wilayahDataKonawe';

export { wilayahDataKonawe };

export type JenisDokumen = 'Perbup' | 'BA';
export type StatusDokumen = 'Final' | 'Draft';

export interface WilayahKonawe {
  kode: string;
  kecamatan: string;
  nama_wilayah: string;
  status: 'Kelurahan' | 'Desa' | string;
  keterangan_pembentukan: string;
  link_pembentukan: string[];
  keterangan_batas: string;
  link_batas: string;
}

export interface DokumenBatas {
  id: string;
  kodeWilayah: string;
  namaDesa: string;
  statusWilayah: 'Kelurahan' | 'Desa' | string;
  kecamatan: string;
  jenisDokumen: JenisDokumen;
  status: StatusDokumen;
  nomorDokumen: string;
  linkDrive: string;
  linkPembentukan: string[];
  keteranganPembentukan: string;
  tanggalUpdate: string;
  koordinatUtama: string;
  keterangan: string;
}

export interface ProgresBatasLuar {
  id: string;
  segmen: string;
  wilayahBersinggungan: string;
  persentase: number;
  tahapanSaatIni: string;
  deskripsiTahapan: string;
  jumlahPilar: string;
  targetSelesai: string;
  statusTeknis: string;
  linkDokumen: string;
  fokusPeta: string;
}

export interface ProgresBatasDalam {
  id: string;
  segmen: string;
  kecamatan: string;
  cakupanDesa: string;
  persentase: number;
  tahapanSaatIni: string;
  jumlahTitik: string;
  targetSelesai: string;
  linkDokumen: string;
  fokusPeta: string;
}

export interface DashboardStats {
  totalKecamatan: number;
  totalDesaKelurahan: number;
  totalDesa: number;
  totalKelurahan: number;
  totalPerbupFinal: number;
  totalPerbupDraft: number;
  totalBaFinal: number;
  totalBaDraft: number;
  totalPerdaPembentukan: number;
  totalLinkPembentukan: number;
  totalLinkBatas: number;
  totalDokumen: number;
}

/**
 * Membersihkan awalan "Kecamatan " agar seragam saat ditampilkan atau dibandingkan.
 */
export function formatNamaKecamatan(rawKecamatan: string): string {
  return rawKecamatan.replace(/^Kecamatan\s+/i, '').trim();
}

/**
 * Mengonversi pangkalan data wilayahDataKonawe menjadi daftar DokumenBatas
 * untuk kompatibilitas modul Produk Hukum dan Berita Acara tanpa data dummy.
 */
export function buildDokumenFromWilayah(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe
): DokumenBatas[] {
  const docs: DokumenBatas[] = [];

  for (const item of wilayahList) {
    const kecClean = formatNamaKecamatan(item.kecamatan);
    const fullTitle = `${item.status} ${item.nama_wilayah}`;
    const ketBatas = item.keterangan_batas.trim();
    const ketPerda = item.keterangan_pembentukan.trim();
    const linkBatas = item.link_batas.trim();
    const linkPerda = Array.isArray(item.link_pembentukan)
      ? item.link_pembentukan.filter((u) => u && u.trim().length > 0)
      : [];

    const lower = ketBatas.toLowerCase();
    const isBaOnly = lower.startsWith('ba ') || lower.includes('berita acara');
    const isDraft = lower.includes('draf') || lower.includes('tahap penyusunan');
    const hasPerbupFinal = ketBatas.length > 0 && !isDraft && !isBaOnly;
    const hasBaFinal = ketBatas.length > 0 && !isDraft;

    const matchPerbup = ketBatas.match(/Peraturan Bupati Konawe Nomor\s+\d+\s+Tahun\s+\d{4}/i);
    const nomorRingkasPerbup = matchPerbup
      ? matchPerbup[0].replace(/Peraturan Bupati/i, 'Perbup')
      : ketBatas.length > 0
      ? ketBatas.replace(/:$/, '')
      : 'Belum Terbit Perbup';

    // 1. Rekaman Produk Hukum (Perbup) untuk SELURUH 348 desa/kelurahan tanpa terkecuali
    docs.push({
      id: item.kode,
      kodeWilayah: item.kode,
      namaDesa: fullTitle,
      statusWilayah: item.status,
      kecamatan: kecClean,
      jenisDokumen: 'Perbup',
      status: hasPerbupFinal ? 'Final' : 'Draft',
      nomorDokumen: nomorRingkasPerbup,
      linkDrive: linkBatas,
      linkPembentukan: linkPerda,
      keteranganPembentukan: ketPerda,
      tanggalUpdate: hasPerbupFinal ? 'Arsip Resmi Tapem' : 'Dalam Penyusunan / Inventarisasi',
      koordinatUtama: `Kode Wilayah Kemendagri: ${item.kode}`,
      keterangan:
        ketBatas.length > 0
          ? ketBatas.replace(/:$/, '')
          : ketPerda.length > 0
          ? `Dasar Pembentukan: ${ketPerda}`
          : 'Dokumen Peraturan Bupati tentang batas wilayah belum tersedia.'
    });

    // 2. Rekaman Berita Acara (BA) untuk SELURUH 348 desa/kelurahan tanpa terkecuali
    docs.push({
      id: `${item.kode}-BA`,
      kodeWilayah: item.kode,
      namaDesa: fullTitle,
      statusWilayah: item.status,
      kecamatan: kecClean,
      jenisDokumen: 'BA',
      status: hasBaFinal ? 'Final' : 'Draft',
      nomorDokumen: isBaOnly
        ? ketBatas.replace(/:$/, '')
        : hasBaFinal
        ? `BA Batas ${fullTitle}`
        : isDraft
        ? `Draf BA ${fullTitle}`
        : `Belum Tersedia BA`,
      linkDrive: linkBatas,
      linkPembentukan: linkPerda,
      keteranganPembentukan: ketPerda,
      tanggalUpdate: hasBaFinal ? 'Arsip Pelacakan Tapem' : 'Tahap Inventarisasi',
      koordinatUtama: `Kode Wilayah Kemendagri: ${item.kode}`,
      keterangan: hasBaFinal
        ? `Berita Acara Kesepakatan dan Pelacakan Batas ${fullTitle}, Kecamatan ${kecClean} (${ketBatas.replace(/:$/, '')}).`
        : isDraft
        ? ketBatas.replace(/:$/, '')
        : `Berita Acara kesepakatan batas wilayah ${fullTitle} belum tersedia.`
    });
  }

  return docs;
}

export const INITIAL_DOKUMEN_BATAS: DokumenBatas[] = buildDokumenFromWilayah(wilayahDataKonawe);

/**
 * Menghitung ringkasan statistik otomatis secara dinamis dari array pangkalan data wilayahDataKonawe.
 */
export function calculateDashboardStats(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe,
  dokumenList?: DokumenBatas[]
): DashboardStats {
  // 1. Hitung jumlah kecamatan unik secara dinamis menggunakan map & Set
  const uniqueKecamatan = new Set(
    wilayahList
      .map((item) => formatNamaKecamatan(item.kecamatan).toLowerCase())
      .filter((k) => k.length > 0)
  );

  // 2. Hitung total desa & kelurahan secara dinamis menggunakan filter
  const totalKelurahan = wilayahList.filter(
    (item) => item.status.trim().toLowerCase() === 'kelurahan'
  ).length;
  const totalDesa = wilayahList.filter(
    (item) => item.status.trim().toLowerCase() === 'desa'
  ).length;
  const totalDesaKelurahan = wilayahList.filter(
    (item) => item.nama_wilayah && item.nama_wilayah.trim().length > 0
  ).length;

  // 3. Hitung Perbup Final & Draf dari keterangan_batas di wilayahDataKonawe
  const totalPerbupFinal = wilayahList.filter((item) => {
    const ket = item.keterangan_batas.trim().toLowerCase();
    if (!ket) return false;
    const isDraft = ket.includes('draf') || ket.includes('tahap penyusunan');
    const isBaOnly = ket.startsWith('ba ') || ket.includes('berita acara');
    return !isDraft && !isBaOnly;
  }).length;

  const totalPerbupDraft = wilayahList.filter((item) => {
    const ket = item.keterangan_batas.trim().toLowerCase();
    return ket.includes('draf') || ket.includes('tahap penyusunan');
  }).length;

  // 4. Hitung Berita Acara & Regulasi Pembentukan (UU / PP / Perda)
  const activeDocs = dokumenList ?? buildDokumenFromWilayah(wilayahList);
  const totalBaFinal = activeDocs.filter(
    (d) => d.jenisDokumen === 'BA' && d.status === 'Final'
  ).length;
  const totalBaDraft = activeDocs.filter(
    (d) => d.jenisDokumen === 'BA' && d.status === 'Draft'
  ).length;

  const totalPerdaPembentukan = wilayahList.filter(
    (item) => item.keterangan_pembentukan.trim().length > 0
  ).length;

  const totalLinkPembentukan = wilayahList.filter(
    (item) => Array.isArray(item.link_pembentukan) && item.link_pembentukan.length > 0
  ).length;

  const totalLinkBatas = wilayahList.filter(
    (item) => item.link_batas.trim().length > 0
  ).length;

  return {
    totalKecamatan: uniqueKecamatan.size,
    totalDesaKelurahan,
    totalDesa,
    totalKelurahan,
    totalPerbupFinal,
    totalPerbupDraft,
    totalBaFinal,
    totalBaDraft,
    totalPerdaPembentukan,
    totalLinkPembentukan,
    totalLinkBatas,
    totalDokumen: wilayahList.length
  };
}

/**
 * Mengambil daftar unik Kecamatan yang terurut alfabetis secara dinamis dari wilayahDataKonawe.
 */
export function getUniqueKecamatan(
  sourceList: Array<WilayahKonawe | DokumenBatas> = wilayahDataKonawe
): string[] {
  const set = new Set<string>();
  for (const item of sourceList) {
    const cleaned = formatNamaKecamatan(item.kecamatan);
    if (cleaned) {
      set.add(cleaned);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
}

/**
 * Membuat data Progres Batas Dalam Daerah secara dinamis dari rekapitulasi wilayahDataKonawe per Kecamatan.
 */
export function buildProgresDalamFromWilayah(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe
): ProgresBatasDalam[] {
  const byKec = new Map<string, WilayahKonawe[]>();
  for (const w of wilayahList) {
    const kec = formatNamaKecamatan(w.kecamatan);
    if (!byKec.has(kec)) byKec.set(kec, []);
    byKec.get(kec)!.push(w);
  }

  const featuredKecamatans = [
    'Uepai',
    'Pondidaha',
    'Wonggeduku Barat',
    'Onembute',
    'Anggalomoare',
    'Meluhu',
    'Besulutu',
    'Routa',
    'Tongauna Utara',
    'Lalonggasumeeto',
    'Padangguni',
    'Wawotobi'
  ];

  return featuredKecamatans
    .filter((k) => byKec.has(k))
    .map((kec, idx) => {
      const items = byKec.get(kec)!;
      const withBatas = items.filter((i) => i.keterangan_batas.trim().length > 0);
      const withPerda = items.filter((i) => i.keterangan_pembentukan.trim().length > 0);
      const firstLink =
        withBatas.find((i) => i.link_batas.trim().length > 0)?.link_batas ||
        items.find((i) => i.link_pembentukan.length > 0)?.link_pembentukan[0] ||
        '';

      const sampleNames = items
        .slice(0, 5)
        .map((i) => `${i.status} ${i.nama_wilayah}`)
        .join(', ');

      const ratio = Math.min(
        100,
        Math.max(
          45,
          Math.round(((withBatas.length * 2 + withPerda.length) / (items.length * 2)) * 100)
        )
      );

      return {
        id: `DALAM-${String(idx + 1).padStart(2, '0')}`,
        segmen: `Penegasan & Arsip Batas Wilayah se-Kecamatan ${kec}`,
        kecamatan: kec,
        cakupanDesa: `${items.length} Wilayah (${sampleNames}${items.length > 5 ? ', dst.' : ''})`,
        persentase: ratio,
        tahapanSaatIni:
          withBatas.length > 0
            ? `${withBatas.length} Desa telah memiliki rekaman Perbup/BA Batas Wilayah dan ${withPerda.length} wilayah terdata dasar Perda/UU pembentukan.`
            : `${withPerda.length} wilayah terdata dasar hukum pembentukan; sinkronisasi peta kerja batas desa berlanjut.`,
        jumlahTitik: `${items.length} Wilayah (${withBatas.length} Perbup/BA · ${withPerda.length} Perda)`,
        targetSelesai: 'Pemutakhiran Berkelanjutan',
        linkDokumen: firstLink,
        fokusPeta: `Kecamatan ${kec}`
      };
    });
}

export const INITIAL_PROGRES_LUAR: ProgresBatasLuar[] = [
  {
    id: 'LUAR-01',
    segmen: 'Kota Kendari - Kab. Konawe',
    wilayahBersinggungan:
      'Kec. Sampara, Kec. Soropia & Kec. Lalonggasumeeto (Konawe) — Kota Kendari',
    persentase: 88,
    tahapanSaatIni: 'Identifikasi titik koordinat pilar batas dan sinkronisasi peta kerja',
    deskripsiTahapan:
      'Pelaksanaan verifikasi lapangan terhadap Pilar Batas Utama (PBU) dan Titik Kartometrik (TK), serta sinkronisasi peta kerja bersama Biro Pemerintahan Setda Prov. Sultra.',
    jumlahPilar: 'Koridor Sampara - Lalonggasumeeto - Soropia',
    targetSelesai: 'Pemutakhiran Tapem Konawe',
    statusTeknis: 'Sinkronisasi Peta Kerja & Verifikasi Pilar',
    linkDokumen:
      'https://drive.google.com/file/d/1aHBW5Yk30FVTVsVsHUOs4e3eZaaSZvDU/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kota Kendari - Kab. Konawe'
  },
  {
    id: 'LUAR-02',
    segmen: 'Kab. Konawe Selatan - Kab. Konawe',
    wilayahBersinggungan:
      'Kec. Lambuya, Pondidaha, Wonggeduku & Besulutu (Konawe) — Kab. Konawe Selatan',
    persentase: 95,
    tahapanSaatIni: 'Evaluasi akhir dokumen batas dan validasi daftar koordinat geografis',
    deskripsiTahapan:
      'Koridor batas wilayah Kecamatan Pondidaha, Wonggeduku, Wonggeduku Barat, dan Besulutu telah terdata dalam arsip Perda dan Perbup Kabupaten Konawe.',
    jumlahPilar: 'Koridor Sungai Konaweha & Jalur Darat',
    targetSelesai: 'Terintegrasi Arsip Tapem',
    statusTeknis: 'Validasi Koordinat & Peta Kerja',
    linkDokumen:
      'https://drive.google.com/file/d/1DEFHRtJZ-KykN1FxZJwyqYybbcRNO75R/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kab. Konawe Selatan - Kab. Konawe'
  },
  {
    id: 'LUAR-03',
    segmen: 'Kab. Konawe Utara - Kab. Konawe',
    wilayahBersinggungan:
      'Kec. Routa, Bondoala, Morosi & Kapoiala (Konawe) — Kab. Konawe Utara',
    persentase: 80,
    tahapanSaatIni: 'Pelacakan kartometrik segmen punggung bukit dan daerah aliran sungai',
    deskripsiTahapan:
      'Penegasan batas wilayah administrasi pada koridor Kecamatan Routa (Desa Puuwiwirano, Tanggola, Lalomerui), Bondoala, dan Kapoiala.',
    jumlahPilar: 'Koridor Routa - Bondoala - Kapoiala',
    targetSelesai: 'Pemutakhiran Tapem Konawe',
    statusTeknis: 'Pelacakan Kartometrik & Mediasi Segmen',
    linkDokumen:
      'https://drive.google.com/file/d/1aH6M2iUQdENKQlmfkgfWSKKLxjj05MMZ/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kab. Konawe Utara - Kab. Konawe'
  },
  {
    id: 'LUAR-04',
    segmen: 'Kab. Kolaka Timur - Kab. Konawe',
    wilayahBersinggungan:
      'Kec. Asinua, Latoma, Tongauna & Padangguni (Konawe) — Kab. Kolaka Timur',
    persentase: 84,
    tahapanSaatIni: 'Penyelarasan titik kartometrik berbasis batas alam punggung pegunungan',
    deskripsiTahapan:
      'Verifikasi segmen batas wilayah pada koridor Kecamatan Latoma, Asinua, Tongauna Utara, dan Padangguni.',
    jumlahPilar: 'Koridor Latoma - Asinua - Padangguni',
    targetSelesai: 'Pemutakhiran Tapem Konawe',
    statusTeknis: 'Finalisasi Berita Acara Antar-Daerah',
    linkDokumen:
      'https://drive.google.com/file/d/1nyerdBgZ03falPbAd-1ysLxvZwES6MEw/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kab. Kolaka Timur - Kab. Konawe'
  }
];

export const INITIAL_PROGRES_DALAM: ProgresBatasDalam[] =
  buildProgresDalamFromWilayah(wilayahDataKonawe);

export interface DocumentFilterCriteria {
  jenisDokumen: JenisDokumen;
  searchQuery?: string;
  kecamatan?: string; // 'ALL' atau nama kecamatan
  status?: 'ALL' | StatusDokumen;
}

/**
 * Menyaring daftar dokumen berdasarkan jenisDokumen, kata kunci, kecamatan, dan status.
 */
export function filterDocuments(
  dokumenList: DokumenBatas[],
  criteria: DocumentFilterCriteria
): DokumenBatas[] {
  const query = (criteria.searchQuery ?? '').trim().toLowerCase();
  const kecamatanFilter = (criteria.kecamatan ?? 'ALL').trim();
  const statusFilter = criteria.status ?? 'ALL';

  return dokumenList.filter((doc) => {
    if (doc.jenisDokumen !== criteria.jenisDokumen) {
      return false;
    }

    if (
      kecamatanFilter !== 'ALL' &&
      formatNamaKecamatan(doc.kecamatan).toLowerCase() !==
        formatNamaKecamatan(kecamatanFilter).toLowerCase()
    ) {
      return false;
    }

    if (statusFilter !== 'ALL' && doc.status !== statusFilter) {
      return false;
    }

    if (query.length > 0) {
      const matchDesa = doc.namaDesa.toLowerCase().includes(query);
      const matchKode = (doc.kodeWilayah ?? doc.id).toLowerCase().includes(query);
      const matchNomor = doc.nomorDokumen.toLowerCase().includes(query);
      const matchKecamatan = doc.kecamatan.toLowerCase().includes(query);
      const matchKet = doc.keterangan.toLowerCase().includes(query);
      if (!matchDesa && !matchKode && !matchNomor && !matchKecamatan && !matchKet) {
        return false;
      }
    }

    return true;
  });
}

export type WilayahFilterCategory =
  | 'ALL'
  | 'PERBUP_FINAL'
  | 'PERBUP_DRAFT'
  | 'PERDA_PEMBENTUKAN';

export interface WilayahFilterCriteria {
  searchQuery?: string;
  kecamatan?: string; // 'ALL' atau nama kecamatan
  category?: WilayahFilterCategory;
  statusWilayah?: 'ALL' | 'Kelurahan' | 'Desa';
}

/**
 * Menyaring daftar 348 WilayahKonawe secara langsung berdasarkan pencarian, kecamatan, dan kategori dokumen.
 */
export function filterWilayahKonawe(
  wilayahList: WilayahKonawe[],
  criteria: WilayahFilterCriteria
): WilayahKonawe[] {
  const query = (criteria.searchQuery ?? '').trim().toLowerCase();
  const kecFilter = (criteria.kecamatan ?? 'ALL').trim();
  const category = criteria.category ?? 'ALL';
  const statusWilayah = criteria.statusWilayah ?? 'ALL';

  return wilayahList.filter((item) => {
    if (
      kecFilter !== 'ALL' &&
      formatNamaKecamatan(item.kecamatan).toLowerCase() !==
        formatNamaKecamatan(kecFilter).toLowerCase()
    ) {
      return false;
    }

    if (statusWilayah !== 'ALL' && item.status !== statusWilayah) {
      return false;
    }

    if (category === 'PERBUP_FINAL') {
      const ket = item.keterangan_batas.trim().toLowerCase();
      if (!ket) return false;
      const isDraft = ket.includes('draf') || ket.includes('tahap penyusunan');
      const isBaOnly = ket.startsWith('ba ') || ket.includes('berita acara');
      if (isDraft || isBaOnly) return false;
    } else if (category === 'PERBUP_DRAFT') {
      const ket = item.keterangan_batas.trim().toLowerCase();
      if (!ket.includes('draf') && !ket.includes('tahap penyusunan')) return false;
    } else if (category === 'PERDA_PEMBENTUKAN') {
      if (item.keterangan_pembentukan.trim().length === 0) return false;
    }

    if (query.length > 0) {
      const matchNama = item.nama_wilayah.toLowerCase().includes(query);
      const matchFull = `${item.status} ${item.nama_wilayah}`.toLowerCase().includes(query);
      const matchKode = item.kode.toLowerCase().includes(query);
      const matchKec = item.kecamatan.toLowerCase().includes(query);
      const matchPerbup = item.keterangan_batas.toLowerCase().includes(query);
      const matchPerda = item.keterangan_pembentukan.toLowerCase().includes(query);
      if (
        !matchNama &&
        !matchFull &&
        !matchKode &&
        !matchKec &&
        !matchPerbup &&
        !matchPerda
      ) {
        return false;
      }
    }

    return true;
  });
}

export interface NewDocumentInput {
  kode?: string;
  namaDesa: string;
  statusWilayah?: 'Kelurahan' | 'Desa';
  kecamatan: string;
  jenisDokumen: JenisDokumen;
  status: StatusDokumen;
  nomorDokumen: string;
  linkDrive: string;
  koordinatUtama?: string;
  keterangan?: string;
}

/**
 * Validasi input form penambahan dokumen baru oleh staf.
 */
export function validateNewDocument(
  input: NewDocumentInput
): { valid: true } | { valid: false; error: string } {
  if (!input.namaDesa || input.namaDesa.trim().length < 3) {
    return { valid: false, error: 'Nama Desa / Kelurahan wajib diisi (minimal 3 karakter).' };
  }
  if (!input.kecamatan || input.kecamatan.trim().length < 3) {
    return { valid: false, error: 'Nama Kecamatan wajib dipilih atau diisi.' };
  }
  if (!input.nomorDokumen || input.nomorDokumen.trim().length < 4) {
    return { valid: false, error: 'Nomor / Tahun Dokumen wajib diisi dengan benar.' };
  }
  if (
    input.linkDrive &&
    input.linkDrive.trim().length > 0 &&
    !/^https?:\/\/.+/i.test(input.linkDrive.trim())
  ) {
    return {
      valid: false,
      error: 'Tautan Google Drive wajib menggunakan URL valid (diawali https://) atau dikosongkan.'
    };
  }
  return { valid: true };
}

/**
 * Menghasilkan isi file `data.js` lengkap secara dinamis dari pangkalan data wilayahDataKonawe.
 */
export function generateDataJsSource(
  wilayahList: WilayahKonawe[],
  progresLuar: ProgresBatasLuar[],
  progresDalam: ProgresBatasDalam[]
): string {
  return `/**
 * ============================================================================
 * SI-BATAS KONAWE — PANGKALAN DATA WILAYAH & TAPAL BATAS KABUPATEN KONAWE (data.js)
 * Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe
 * Total Wilayah Definitif: ${wilayahList.length} Wilayah (57 Kelurahan & 291 Desa pada 28 Kecamatan)
 * ============================================================================
 */

const wilayahDataKonawe = ${JSON.stringify(wilayahList, null, 2)};

const PROGRES_BATAS_LUAR = ${JSON.stringify(progresLuar, null, 2)};

const PROGRES_BATAS_DALAM = ${JSON.stringify(progresDalam, null, 2)};

if (typeof window !== "undefined") {
  window.wilayahDataKonawe = wilayahDataKonawe;
  window.SI_BATAS_DATA = {
    wilayah: wilayahDataKonawe,
    progresLuar: PROGRES_BATAS_LUAR,
    progresDalam: PROGRES_BATAS_DALAM
  };
}
`;
}

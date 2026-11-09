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

export interface KronologiBatasItem {
  tanggal: string;
  kegiatan: string;
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
  rangkumanStatus?: string;
  kronologi?: KronologiBatasItem[];
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
      nomorDokumen: hasBaFinal
        ? 'Bundel Kesepakatan & Pelacakan'
        : 'Tahap Pengumpulan Data Form',
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

export interface BoundaryProgressSlice {
  name: 'Final (Sah / Selesai)' | 'Belum Perbup';
  value: number;
  percentage: number;
  color: string;
}

export interface BoundaryProgressSummary {
  totalWilayah: number;
  finalCount: number;
  belumPerbupCount: number;
  finalPercentage: number;
  belumPerbupPercentage: number;
  slices: BoundaryProgressSlice[];
}

/**
 * Menghitung rasio dinamis dari array wilayahDataKonawe yang memiliki status dokumen
 * 'Final (Sah / Selesai)' berbanding dengan total wilayah selain itu ('Belum Perbup')
 * untuk komponen Grafik Progres Penetapan Batas (Doughnut Chart).
 */
export function calculateBoundaryProgressRatio(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe
): BoundaryProgressSummary {
  const totalWilayah = wilayahList.length;
  const finalCount = wilayahList.filter((item) => {
    const ket = item.keterangan_batas.trim().toLowerCase();
    if (!ket) return false;
    const isDraft = ket.includes('draf') || ket.includes('tahap penyusunan');
    const isBaOnly = ket.startsWith('ba ') || ket.includes('berita acara');
    return !isDraft && !isBaOnly;
  }).length;

  const belumPerbupCount = Math.max(0, totalWilayah - finalCount);
  const finalPercentage =
    totalWilayah > 0 ? Number(((finalCount / totalWilayah) * 100).toFixed(1)) : 0;
  const belumPerbupPercentage =
    totalWilayah > 0 ? Number((100 - finalPercentage).toFixed(1)) : 0;

  return {
    totalWilayah,
    finalCount,
    belumPerbupCount,
    finalPercentage,
    belumPerbupPercentage,
    slices: [
      {
        name: 'Final (Sah / Selesai)',
        value: finalCount,
        percentage: finalPercentage,
        color: '#065f46' // emerald-800
      },
      {
        name: 'Belum Perbup',
        value: belumPerbupCount,
        percentage: belumPerbupPercentage,
        color: '#d6d3d1' // stone-300
      }
    ]
  };
}

export interface KecamatanProgressStat {
  kecamatan: string;
  totalWilayah: number;
  finalCount: number;
  percentage: number;
  ratioLabel: string;
}

/**
 * Menghitung persentase penyelesaian Perbup ('Final') untuk setiap kecamatan dari wilayahDataKonawe,
 * mengurutkannya secara descending (tertinggi ke terendah), dan mengambil N kecamatan teratas (default 7).
 */
export function calculateTopKecamatanProgress(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe,
  limit = 7
): KecamatanProgressStat[] {
  const byKecamatan = new Map<string, { total: number; final: number }>();

  for (const item of wilayahList) {
    const kec = formatNamaKecamatan(item.kecamatan);
    if (!kec) continue;

    const current = byKecamatan.get(kec) ?? { total: 0, final: 0 };
    current.total += 1;

    const ket = item.keterangan_batas.trim().toLowerCase();
    if (ket.length > 0) {
      const isDraft = ket.includes('draf') || ket.includes('tahap penyusunan');
      const isBaOnly = ket.startsWith('ba ') || ket.includes('berita acara');
      if (!isDraft && !isBaOnly) {
        current.final += 1;
      }
    }

    byKecamatan.set(kec, current);
  }

  const results: KecamatanProgressStat[] = Array.from(byKecamatan.entries()).map(
    ([kecamatan, counts]) => {
      const percentage =
        counts.total > 0 ? Number(((counts.final / counts.total) * 100).toFixed(1)) : 0;
      return {
        kecamatan,
        totalWilayah: counts.total,
        finalCount: counts.final,
        percentage,
        ratioLabel: `${counts.final}/${counts.total} Desa`
      };
    }
  );

  results.sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    if (b.finalCount !== a.finalCount) return b.finalCount - a.finalCount;
    return a.kecamatan.localeCompare(b.kecamatan, 'id');
  });

  return results.slice(0, Math.max(1, limit));
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
    statusTeknis: 'Executive Summary · Mediasi Kemendagri',
    linkDokumen:
      'https://drive.google.com/file/d/1aHBW5Yk30FVTVsVsHUOs4e3eZaaSZvDU/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kota Kendari - Kab. Konawe',
    rangkumanStatus:
      'Status Segmen Tersisa: Terdapat satu segmen batas yang belum disepakati, yaitu area antara Titik Point 6 (Klaim Kab. Konawe) dan Gerbang Puuwatu / Simpang Abeli Dalam (Klaim Kota Kendari). Sesuai BA Kesepakatan 7 September 2026, penyelesaian dan penarikan garis batas untuk segmen ini telah diserahkan sepenuhnya kepada Kementerian Dalam Negeri Republik Indonesia untuk diputuskan secara definitif.',
    kronologi: [
      { tanggal: '05 Mei 2021', kegiatan: 'Survei Lapangan & Identifikasi Pilar' },
      { tanggal: '23 Sep 2024', kegiatan: 'Rakor Pusat Kemendagri (BA No. 15/BAD II)' },
      { tanggal: '18 Sep 2025', kegiatan: 'Sinkronisasi Pemprov Sultra (BA No. 07/BAD II)' },
      { tanggal: '27 Ags 2026', kegiatan: 'Validasi Kartometrik (Penegasan status Pilar No. 7)' },
      { tanggal: '07 Sep 2026', kegiatan: 'Penandatanganan BA Penyerahan Sengketa ke Kemendagri' },
      { tanggal: '01 Okt 2026', kegiatan: 'Rakor Lanjutan Tata Ruang Kemendagri' }
    ]
  },
  {
    id: 'LUAR-02',
    segmen: 'Kab. Konawe Utara - Kab. Konawe',
    wilayahBersinggungan:
      'Kec. Routa, Bondoala, Morosi & Kapoiala (Konawe) — Kab. Konawe Utara',
    persentase: 80,
    tahapanSaatIni: 'Pelacakan kartometrik segmen punggung bukit dan daerah aliran sungai',
    deskripsiTahapan:
      'Penegasan batas wilayah administrasi pada koridor Kecamatan Routa (Desa Puuwiwirano, Tanggola, Lalomerui), Bondoala, dan Kapoiala.',
    jumlahPilar: 'Koridor Routa - Bondoala - Kapoiala',
    targetSelesai: 'Pemutakhiran Tapem Konawe',
    statusTeknis: 'Executive Summary · Mediasi Kemendagri',
    linkDokumen:
      'https://drive.google.com/file/d/1aH6M2iUQdENKQlmfkgfWSKKLxjj05MMZ/view?usp=sharing',
    fokusPeta: 'Segmen Batas Kab. Konawe Utara - Kab. Konawe',
    rangkumanStatus:
      'Status Sengketa Total: Sampai saat ini belum ada satupun segmen batas yang disetujui antara kedua daerah. Terdapat tumpang tindih area (overlap) yang sangat masif, meliputi area ±67.669 Ha di perbatasan Desa Lalomerui (Kec. Routa) hingga klaim atas 3 desa (Sama Subur, Tobimeita, Banggina) yang secara historis dan UU Pembentukan terbukti berada di wilayah Konawe. Keputusan final kini berada di tangan Kementerian Dalam Negeri.',
    kronologi: [
      {
        tanggal: '17 Sep 2025',
        kegiatan: 'Kesepakatan Pelibatan Tokoh Pemekaran Sejarah (BA No. 05/BAD II).'
      },
      {
        tanggal: '20 Feb 2026',
        kegiatan:
          'Pemaparan Bukti Historis Desa Banggina (Tahun 2004) dan Batas Alam Sungai Wataraki (BA No. 08/BAD II).'
      },
      {
        tanggal: 'Status Saat Ini',
        kegiatan: 'Menunggu Kajian Pusat untuk Penyusunan Rancangan Permendagri.'
      }
    ]
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

/**
 * Mengambil sampel wilayah (default 6, rentang 6-9) dari wilayahDataKonawe
 * yang khusus berstatus dokumen 'Final (Sah / Selesai)' (Perbup Final)
 * untuk ditampilkan pada bagian 'Arsip Batas Definitif Terbaru' di Beranda
 * saat kolom pencarian masih kosong (Progressive Disclosure).
 */
export function getFeaturedFinalWilayah(
  wilayahList: WilayahKonawe[] = wilayahDataKonawe,
  limit = 6
): WilayahKonawe[] {
  const finalWilayah = filterWilayahKonawe(wilayahList, {
    category: 'PERBUP_FINAL'
  });
  return finalWilayah.slice(0, Math.max(1, limit));
}

export const AUTHORIZATION_CODE = 'KONAWE2026';

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
  sandiOtorisasi?: string;
}

/**
 * Validasi input form penambahan dokumen baru oleh staf beserta Sandi Otorisasi.
 */
export function validateNewDocument(
  input: NewDocumentInput
): { valid: true } | { valid: false; error: string } {
  if (input.sandiOtorisasi !== AUTHORIZATION_CODE) {
    return {
      valid: false,
      error: 'Akses Ditolak: Sandi Otorisasi Tidak Valid.'
    };
  }
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

export interface KonaweGeoJsonProperties {
  OBJECTID?: number;
  Name?: string;
  Kec?: string;
  Perbup?: 'YA' | 'TIDAK' | 'PROSES' | string;
  Luas?: number;
  Shape_Leng?: number;
  Shape_Area?: number;
  [key: string]: unknown;
}

export interface FormattedGeoJsonFeatureInfo {
  objectId: number | null;
  namaWilayah: string;
  kecamatan: string;
  statusHukum: string;
  statusKategori: 'YA' | 'PROSES' | 'TIDAK';
  luasHa: string;
  kelilingKm: string;
  keteranganRegulasi: string;
  linkDokumen: string;
}

/**
 * Mengonversi koordinat UTM Zona 51S (EPSG:32751, dalam satuan meter)
 * menjadi koordinat geografis WGS84 [longitude, latitude] (EPSG:4326).
 * Jika koordinat sudah berada dalam rentang derajat WGS84, dikembalikan apa adanya.
 */
export function utm51SToLngLat(xOrLng: number, yOrLat: number): [number, number] {
  if (Math.abs(xOrLng) <= 180 && Math.abs(yOrLat) <= 90) {
    return [xOrLng, yOrLat];
  }

  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const eSq = f * (2 - f);
  const ePrimeSq = eSq / (1 - eSq);
  const k0 = 0.9996;
  const x = xOrLng - 500000.0;
  const y = yOrLat - 10000000.0; // False northing belahan bumi selatan (51S)
  const lon0 = ((51 - 1) * 6 - 180 + 3) * (Math.PI / 180); // Meridian tengah Zona 51 = 123° BT

  const M = y / k0;
  const mu = M / (a * (1 - eSq / 4 - (3 * eSq * eSq) / 64 - (5 * eSq * eSq * eSq) / 256));
  const e1 = (1 - Math.sqrt(1 - eSq)) / (1 + Math.sqrt(1 - eSq));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);

  const N1 = a / Math.sqrt(1 - eSq * sinPhi1 * sinPhi1);
  const T1 = tanPhi1 * tanPhi1;
  const C1 = ePrimeSq * cosPhi1 * cosPhi1;
  const R1 = (a * (1 - eSq)) / Math.pow(1 - eSq * sinPhi1 * sinPhi1, 1.5);
  const D = x / (N1 * k0);

  const latRad =
    phi1 -
    ((N1 * tanPhi1) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ePrimeSq) * Math.pow(D, 4)) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * ePrimeSq - 3 * C1 * C1) *
          Math.pow(D, 6)) /
          720);

  const lonRad =
    lon0 +
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ePrimeSq + 24 * T1 * T1) * Math.pow(D, 5)) /
        120) /
      cosPhi1;

  return [
    Number((lonRad * (180 / Math.PI)).toFixed(6)),
    Number((latRad * (180 / Math.PI)).toFixed(6))
  ];
}

function transformGeoJsonCoords(coords: unknown): unknown {
  if (!Array.isArray(coords)) return coords;
  if (
    coords.length >= 2 &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number'
  ) {
    return utm51SToLngLat(coords[0], coords[1]);
  }
  return coords.map(transformGeoJsonCoords);
}

/**
 * Menormalkan FeatureCollection GeoJSON Kabupaten Konawe:
 * - Menyaring fitur dengan geometri kosong/null
 * - Mengonversi koordinat UTM 51S menjadi WGS84 [lng, lat] agar siap dirender oleh Leaflet
 */
export function normalizeKonaweGeoJson(rawGeoJson: {
  type?: string;
  features?: Array<{
    type?: string;
    properties?: KonaweGeoJsonProperties;
    geometry?: { type?: string; coordinates?: unknown } | null;
  }>;
}) {
  const validFeatures = (rawGeoJson?.features ?? [])
    .filter(
      (f) =>
        Boolean(f?.geometry) &&
        Boolean(f?.geometry?.type) &&
        Array.isArray(f?.geometry?.coordinates) &&
        (f.geometry.coordinates as unknown[]).length > 0
    )
    .map((f) => ({
      type: 'Feature' as const,
      properties: f.properties ?? {},
      geometry: {
        type: f.geometry!.type as string,
        coordinates: transformGeoJsonCoords(f.geometry!.coordinates)
      }
    }));

  return {
    type: 'FeatureCollection' as const,
    features: validFeatures
  };
}

function toTitleCaseWords(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

/**
 * Memformat atribut (properties) dari setiap poligon GeoJSON /batas_konawe.json
 * serta mencocokkannya dengan arsip wilayahDataKonawe apabila tersedia.
 */
export function formatGeoJsonFeatureInfo(
  props: KonaweGeoJsonProperties = {},
  wilayahList: WilayahKonawe[] = wilayahDataKonawe
): FormattedGeoJsonFeatureInfo {
  const rawName = String(props.Name ?? 'Wilayah Tidak Diketahui').trim();
  const rawKec = String(props.Kec ?? 'Kecamatan Tidak Diketahui').trim();
  const rawPerbup = String(props.Perbup ?? 'TIDAK')
    .trim()
    .toUpperCase();

  const namaWilayah = toTitleCaseWords(rawName);
  const kecamatan = toTitleCaseWords(rawKec);

  const statusKategori: 'YA' | 'PROSES' | 'TIDAK' =
    rawPerbup === 'YA' ? 'YA' : rawPerbup === 'PROSES' ? 'PROSES' : 'TIDAK';

  const statusHukum =
    statusKategori === 'YA'
      ? 'Batas Definitif (Perbup Tersedia)'
      : statusKategori === 'PROSES'
      ? 'Dalam Proses Penetapan (Tahap Draf / Mediasi)'
      : 'Batas Indikatif (Belum Terbit Perbup)';

  const luasNum = typeof props.Luas === 'number' && Number.isFinite(props.Luas) ? props.Luas : null;
  const luasHa =
    luasNum !== null
      ? `${luasNum.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} Ha`
      : '-';

  const kelilingNum =
    typeof props.Shape_Leng === 'number' && Number.isFinite(props.Shape_Leng)
      ? props.Shape_Leng / 1000
      : null;
  const kelilingKm =
    kelilingNum !== null
      ? `${kelilingNum.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} km`
      : '-';

  // Cocokkan dengan wilayahDataKonawe berdasarkan nama desa & kecamatan
  const strippedDesaName = rawName.replace(/^(DESA|KELURAHAN)\s+/i, '').trim().toLowerCase();
  const strippedKecName = rawKec.replace(/^KECAMATAN\s+/i, '').trim().toLowerCase();

  const matchedWilayah = wilayahList.find((w) => {
    const wDesa = w.nama_wilayah.trim().toLowerCase();
    const wKec = formatNamaKecamatan(w.kecamatan).toLowerCase();
    return wDesa === strippedDesaName && wKec === strippedKecName;
  });

  const keteranganRegulasi =
    matchedWilayah && matchedWilayah.keterangan_batas.trim().length > 0
      ? matchedWilayah.keterangan_batas.replace(/:$/, '')
      : statusKategori === 'YA'
      ? 'Telah memiliki Peraturan Bupati Konawe tentang Batas Desa/Kelurahan'
      : statusKategori === 'PROSES'
      ? 'Sedang dalam proses pelacakan lapangan & verifikasi teknis Tapem'
      : 'Mengacu pada garis delineasi indikatif sambil menunggu penetapan Perbup definitif';

  const linkDokumen = matchedWilayah?.link_batas?.trim() ?? '';

  return {
    objectId: typeof props.OBJECTID === 'number' ? props.OBJECTID : null,
    namaWilayah,
    kecamatan,
    statusHukum,
    statusKategori,
    luasHa,
    kelilingKm,
    keteranganRegulasi,
    linkDokumen
  };
}

function normalizeLocationToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^(desa|kelurahan|kecamatan|kec\.?)\s+/i, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collapseDoubleLetters(raw: string): string {
  return raw.replace(/([a-z])\1+/g, '$1');
}

/**
 * Mencari daftar fitur GeoJSON dari /batas_konawe.json yang cocok dengan parameter target desa
 * (baik dari URL ?desa=Tobimeita maupun dari tombol 'Lihat di Peta WebGIS' seperti
 * 'Desa Tobimeita, Kecamatan Wonggeduku Barat').
 */
export function findMatchingGeoJsonFeatures<
  T extends { properties?: KonaweGeoJsonProperties | null }
>(features: T[], targetQuery: string | null | undefined): T[] {
  if (!targetQuery || !targetQuery.trim() || !Array.isArray(features) || features.length === 0) {
    return [];
  }

  const parts = targetQuery
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const rawDesaTarget = parts[0] ?? targetQuery.trim();
  const rawKecTarget = parts[1] ?? '';

  const targetDesaNorm = normalizeLocationToken(rawDesaTarget);
  const targetDesaCollapsed = collapseDoubleLetters(targetDesaNorm);
  const targetKecNorm = normalizeLocationToken(rawKecTarget);
  const targetKecCollapsed = collapseDoubleLetters(targetKecNorm);

  if (!targetDesaNorm) return [];

  // 1. Cari kecocokan eksak pada nama desa (properties.Name atau properties.NAMOBJ)
  const exactDesaMatches = features.filter((f) => {
    const props = f.properties ?? {};
    const rawFeatureName = String(props.NAMOBJ ?? props.Name ?? '').trim();
    const featDesaNorm = normalizeLocationToken(rawFeatureName);
    const featDesaCollapsed = collapseDoubleLetters(featDesaNorm);
    return (
      featDesaNorm === targetDesaNorm ||
      (featDesaCollapsed.length >= 4 && featDesaCollapsed === targetDesaCollapsed)
    );
  });

  if (exactDesaMatches.length > 1 && targetKecNorm) {
    const withKecMatch = exactDesaMatches.filter((f) => {
      const rawFeatureKec = String(f.properties?.Kec ?? '').trim();
      const featKecNorm = normalizeLocationToken(rawFeatureKec);
      const featKecCollapsed = collapseDoubleLetters(featKecNorm);
      return (
        featKecNorm === targetKecNorm ||
        featKecCollapsed === targetKecCollapsed ||
        featKecNorm.includes(targetKecNorm) ||
        targetKecNorm.includes(featKecNorm)
      );
    });
    if (withKecMatch.length > 0) {
      return withKecMatch;
    }
  }

  if (exactDesaMatches.length > 0) {
    return exactDesaMatches;
  }

  // 2. Fallback: kecocokan sebagian (contains) pada nama desa atau kecamatan
  return features.filter((f) => {
    const props = f.properties ?? {};
    const rawFeatureName = String(props.NAMOBJ ?? props.Name ?? '').trim();
    const featDesaNorm = normalizeLocationToken(rawFeatureName);
    return (
      featDesaNorm.includes(targetDesaNorm) || targetDesaNorm.includes(featDesaNorm)
    );
  });
}



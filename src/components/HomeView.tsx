import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Search,
  X,
  CheckCircle2,
  Clock,
  Map,
  Compass,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from 'recharts';
import {
  DashboardStats,
  DokumenBatas,
  WilayahKonawe,
  calculateBoundaryProgressRatio,
  calculateTopKecamatanProgress,
  filterWilayahKonawe,
  formatNamaKecamatan,
  getFeaturedFinalWilayah
} from '../data/boundaryData';
import { NavTab } from './Navbar';

interface HomeViewProps {
  stats: DashboardStats;
  wilayahList: WilayahKonawe[];
  recentDocs?: DokumenBatas[];
  onNavigate: (tab: NavTab) => void;
  onSelectDocument?: (doc: DokumenBatas) => void;
  onSelectWilayah: (item: WilayahKonawe) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  wilayahList,
  onNavigate,
  onSelectWilayah
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length >= 1;

  // Hitung rasio dinamis untuk Grafik Progres Penetapan Batas (Doughnut Chart)
  const progressRatio = useMemo(
    () => calculateBoundaryProgressRatio(wilayahList),
    [wilayahList]
  );

  // Hitung Top 7 Kecamatan dengan persentase penyelesaian Perbup tertinggi (Horizontal Bar Chart)
  const topKecamatanProgress = useMemo(
    () => calculateTopKecamatanProgress(wilayahList, 7),
    [wilayahList]
  );

  // Sampel Wilayah Definitif (6 wilayah berstatus 'Final (Sah / Selesai)') untuk State Awal (Kosong)
  const featuredFinalWilayah = useMemo(
    () => getFeaturedFinalWilayah(wilayahList, 6),
    [wilayahList]
  );

  // Live filtering: Saring wilayahDataKonawe saat pengguna mengetik minimal 1 karakter
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return filterWilayahKonawe(wilayahList, {
      searchQuery: trimmedQuery
    });
  }, [wilayahList, trimmedQuery, isSearching]);

  const renderWilayahCard = (item: WilayahKonawe, testId: string) => {
    const ketBatas = item.keterangan_batas.trim();
    const ketPerda = item.keterangan_pembentukan.trim();
    const hasLinkBatas = item.link_batas.trim().length > 0;
    const hasLinkPerda =
      Array.isArray(item.link_pembentukan) && item.link_pembentukan.length > 0;
    const isDraft =
      ketBatas.toLowerCase().includes('draf') ||
      ketBatas.toLowerCase().includes('tahap penyusunan');

    return (
      <article
        key={item.kode}
        data-testid={testId}
        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-5 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span className="font-medium text-slate-700">
              Kecamatan {formatNamaKecamatan(item.kecamatan)}
            </span>
            <span className="font-mono tabular-nums text-slate-700 font-semibold">
              {item.kode}
            </span>
          </div>

          {/* Nama Lengkap Wilayah */}
          <h3 className="text-base font-bold text-slate-900">
            {item.status} {item.nama_wilayah}
          </h3>

          {/* Status Dokumen Perbup */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            {ketBatas ? (
              <div>
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    isDraft ? 'text-amber-800' : 'text-emerald-800'
                  }`}
                >
                  {isDraft ? (
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  )}
                  <span>
                    {isDraft
                      ? 'Status Perbup: Draf (On-Going)'
                      : 'Status Perbup: Final (Sah / Selesai)'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {ketBatas}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Status Perbup: Belum Perbup
                </p>
                {ketPerda && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    Dasar Pembentukan: {ketPerda}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tombol Unduh & Rincian */}
        <div className="mt-5 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectWilayah(item)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Rincian Wilayah
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {hasLinkPerda &&
              item.link_pembentukan.map((url, idx) => (
                <a
                  key={`${item.kode}-beranda-perda-${idx}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>
                    UU/Perda{item.link_pembentukan.length > 1 ? ` #${idx + 1}` : ''}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}

            {hasLinkBatas ? (
              <a
                href={item.link_batas}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Unduh Dokumen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 bg-stone-200 border border-stone-300 rounded-lg cursor-not-allowed whitespace-nowrap"
              >
                Belum Tersedia
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-10 pb-6">
      {/* 1. HERO SECTION (HIJAU TUA KHAS PEMERINTAHAN, 2 KOLOM PADA DESKTOP, PADDING BAWAH UNTUK OVERLAP) */}
      <section
        aria-labelledby="hero-title"
        data-testid="beranda-hero-section"
        className="bg-emerald-950 text-white rounded-2xl border border-emerald-900 overflow-hidden pt-8 sm:pt-12 pb-20 sm:pb-24 px-6 sm:px-10 lg:px-12 relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
          {/* Kolom Kiri: Judul Besar, Subjudul Pemerintah Kabupaten Konawe, Paragraf Pengantar & Aksi */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 tracking-wide">
              <span>Pemerintah Kabupaten Konawe</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-200 font-medium">
                Bagian Tata Pemerintahan Sekretariat Daerah
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              SI-BATAS KONAWE
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/95 leading-relaxed max-w-2xl">
              Sistem Informasi Tapal Batas Wilayah Berbasis Cloud yang menyajikan pangkalan data terpadu produk hukum batas desa/kelurahan, arsip Berita Acara kesepakatan pelacakan lapangan, serta pemetaan spasial interaktif (WebGIS) di seluruh wilayah administrasi Kabupaten Konawe.
            </p>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed max-w-2xl">
              Mengelola secara terpusat <strong className="text-white font-semibold">{stats.totalDesaKelurahan} wilayah definitif ({stats.totalDesa} Desa &amp; {stats.totalKelurahan} Kelurahan)</strong> pada <strong className="text-white font-semibold">{stats.totalKecamatan} Kecamatan</strong> sesuai standar penyelenggaraan penegasan batas daerah.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('produk-hukum')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Direktori Produk Hukum</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('webgis')}
                className="px-5 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 text-white font-medium text-sm rounded-lg border border-emerald-700 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4 text-amber-400" />
                <span>Buka Peta Interaktif WebGIS</span>
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Ilustrasi Vektor Ikonografi Spasial (Peta / GIS) Minimalis Modern */}
          <div className="lg:col-span-5">
            <div
              data-testid="hero-gis-illustration"
              className="bg-emerald-900/60 border border-emerald-800/90 rounded-2xl p-5 sm:p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs font-mono text-emerald-200/90 mb-3">
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                  <Compass className="w-4 h-4" />
                  <span>SPASIAL GIS · KODE 74.02</span>
                </span>
                <span className="tabular-nums">WGS-84 / UTM 51S</span>
              </div>

              {/* Kanvas Spasial: Grid & Garis Kontur Latar Belakang + Peta Resmi Kecamatan Konawe */}
              <div className="relative rounded-xl bg-emerald-950/80 border border-emerald-800/70 py-4 px-3 overflow-hidden min-h-[230px] flex items-center justify-center">
                {/* Latar Belakang Ornamen Grid & Garis Kontur Melengkung Halus */}
                <svg
                  viewBox="0 0 420 230"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="gis-grid"
                      width="28"
                      height="28"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 28 0 L 0 0 0 28"
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.14)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  {/* Grid Geodetik */}
                  <rect width="420" height="230" fill="url(#gis-grid)" />

                  {/* Garis Kontur Topografi Melengkung Halus */}
                  <path
                    d="M -10 185 Q 95 140 210 175 T 430 145"
                    fill="none"
                    stroke="rgba(52, 211, 153, 0.18)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M -10 70 Q 130 25 255 65 T 430 40"
                    fill="none"
                    stroke="rgba(52, 211, 153, 0.16)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Peta Administrasi Kecamatan Konawe */}
                <img
                  src="/Peta_Konawe_Kecamatan.png"
                  alt="Peta Administrasi Kecamatan Konawe"
                  className="w-[85%] h-auto mx-auto object-contain mix-blend-screen filter invert sepia saturate-[500%] hue-rotate-[110deg] opacity-80 hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                />

                {/* Label Koordinat Spasial & Jumlah Poligon */}
                <div className="absolute bottom-2.5 left-3 z-20 px-2.5 py-1 rounded-md bg-emerald-950/85 border border-emerald-400/35 text-[10px] font-mono text-emerald-100 pointer-events-none">
                  03°51&apos;24&quot;LS · 122°03&apos;18&quot;BT
                </div>
                <div className="absolute top-2.5 right-3 z-20 px-2.5 py-0.5 rounded-md bg-emerald-950/85 border border-amber-400/40 text-[10px] font-mono text-amber-200 pointer-events-none">
                  {stats.totalDesaKelurahan} POLIGON DESA
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-emerald-100/80">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Topologi Batas Kecamatan &amp; Desa</span>
                </span>
                <span className="font-mono tabular-nums text-amber-300">
                  {stats.totalKecamatan} Koridor Kecamatan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DASBOR RINGKASAN STATISTIK DENGAN EFEK OVERLAP (-mt-14 sm:-mt-16) */}
      <section
        aria-label="Dasbor Ringkasan Statistik"
        data-testid="beranda-statistik-section"
        className="-mt-14 sm:-mt-16 relative z-10 px-3 sm:px-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Kecamatan Terdata */}
          <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Kecamatan Terdata</p>
              <p
                data-testid="counter-kecamatan"
                className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums mt-2"
              >
                {stats.totalKecamatan}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-gray-100">
              Kecamatan definitif Kabupaten Konawe (Kode 74.02)
            </p>
          </div>

          {/* Card 2: Total Desa / Kelurahan */}
          <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Desa / Kelurahan</p>
              <div className="flex items-baseline gap-2.5 mt-2">
                <p
                  data-testid="counter-desa"
                  className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums"
                >
                  {stats.totalDesaKelurahan}
                </p>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  ({stats.totalDesa} Desa · {stats.totalKelurahan} Kel.)
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-gray-100">
              {stats.totalPerdaPembentukan} wilayah terdata dasar UU/PP/Perda Pembentukan
            </p>
          </div>

          {/* Card 3: Jumlah Perbup Final */}
          <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Jumlah Perbup Final</p>
              <div className="flex items-baseline gap-2.5 mt-2">
                <p
                  data-testid="counter-perbup-final"
                  className="text-3xl sm:text-4xl font-bold text-emerald-800 font-mono tabular-nums"
                >
                  {stats.totalPerbupFinal}
                </p>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  (+{stats.totalPerbupDraft} Draf On-Going)
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-800 font-medium mt-4 pt-3 border-t border-gray-100">
              {stats.totalLinkBatas} Tautan Dokumen Perbup Tersedia di Cloud
            </p>
          </div>

          {/* Card 4: Berita Acara Selesai */}
          <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Berita Acara Selesai</p>
              <div className="flex items-baseline gap-2.5 mt-2">
                <p
                  data-testid="counter-ba-final"
                  className="text-3xl sm:text-4xl font-bold text-amber-700 font-mono tabular-nums"
                >
                  {stats.totalBaFinal}
                </p>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  ({stats.totalLinkPembentukan} Link Perda)
                </span>
              </div>
            </div>
            <p className="text-xs text-amber-800 font-medium mt-4 pt-3 border-t border-gray-100">
              Arsip Kesepakatan Batas &amp; Regulasi Desa/Kelurahan
            </p>
          </div>
        </div>
      </section>

      {/* 3. VISUALISASI DATA KOMPARATIF (2 KOLOM BERDAMPINGAN DI DESKTOP: DOUGHNUT GLOBAL & HORIZONTAL BAR CHART KECAMATAN) */}
      <section
        aria-labelledby="heading-grafik-progres"
        data-testid="beranda-chart-section"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* KOLOM KIRI (TETAP): GRAFIK DONAT PROGRES GLOBAL KABUPATEN BESERTA KARTU LEGENDANYA */}
        <div
          data-testid="beranda-doughnut-panel"
          className="lg:col-span-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-mono font-semibold text-emerald-800 tracking-wider uppercase">
              CAKUPAN GLOBAL KABUPATEN KONAWE
            </p>
            <h2
              id="heading-grafik-progres"
              className="text-xl sm:text-2xl font-bold text-slate-900 mt-1"
            >
              Grafik Progres Penetapan Batas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Proporsi desa/kelurahan berstatus <strong className="text-slate-900">Final (Sah / Selesai)</strong> berbanding <strong className="text-slate-900">Belum Perbup</strong> dari seluruh {progressRatio.totalWilayah} wilayah definitif.
            </p>
          </div>

          {/* Grafik Donat Responsif (Recharts) */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div
              className="w-full h-56 max-w-xs mx-auto relative"
              data-testid="doughnut-chart-container"
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={progressRatio.slices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={3}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {progressRatio.slices.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const numVal = Number(value ?? 0);
                      return [
                        `${numVal} Wilayah (${((numVal / progressRatio.totalWilayah) * 100).toFixed(1)}%)`,
                        String(name ?? '')
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Label Tengah Grafik Donat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-bold font-mono tabular-nums text-emerald-900">
                  {progressRatio.finalPercentage}%
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Perbup Final
                </span>
              </div>
            </div>
          </div>

          {/* Kartu Legenda (Final vs Belum Perbup) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-950">
                  Final (Sah / Selesai)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 shrink-0" aria-hidden="true" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  data-testid="chart-final-count"
                  className="text-2xl font-bold font-mono tabular-nums text-emerald-900"
                >
                  {progressRatio.finalCount}
                </span>
                <span className="text-xs font-mono tabular-nums text-emerald-800 font-semibold">
                  ({progressRatio.finalPercentage}%)
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 mt-0.5">
                Perbup Konawe Definitif
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Belum Perbup
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" aria-hidden="true" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  data-testid="chart-belum-count"
                  className="text-2xl font-bold font-mono tabular-nums text-slate-800"
                >
                  {progressRatio.belumPerbupCount}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600 font-semibold">
                  ({progressRatio.belumPerbupPercentage}%)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tahap Draf / Pelacakan
              </p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (BARU - ANALITIK KECAMATAN): GRAFIK BATANG HORIZONTAL TOP PROGRES KINERJA KECAMATAN */}
        <div
          data-testid="beranda-barchart-panel"
          className="lg:col-span-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <p className="text-xs font-mono font-semibold text-emerald-800 tracking-wider uppercase">
                PERINGKAT KOMPARATIF KECAMATAN (TOP {topKecamatanProgress.length} PERFORMERS)
              </p>
              <h2
                id="heading-top-kecamatan"
                className="text-xl sm:text-2xl font-bold text-slate-900 mt-1"
              >
                Top Progres Kinerja Kecamatan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Persentase penyelesaian Peraturan Bupati (Perbup) batas desa/kelurahan tertinggi per kecamatan (diurutkan dari capaian tertinggi ke terendah).
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-mono font-semibold text-emerald-900 whitespace-nowrap self-start">
              Urutan Descending
            </span>
          </div>

          {/* Horizontal Bar Chart (Recharts) dengan Skema Gradasi Hijau */}
          <div
            className="w-full h-72 sm:h-80 mt-4"
            data-testid="horizontal-barchart-container"
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={topKecamatanProgress}
                layout="vertical"
                margin={{ top: 6, right: 56, left: 12, bottom: 6 }}
              >
                <defs>
                  <linearGradient id="emeraldGradHigh" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="emeraldGradMid" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="emeraldGradSoft" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={true}
                  stroke="#e7e5e4"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}
                  axisLine={{ stroke: '#d6d3d1' }}
                />
                <YAxis
                  type="category"
                  dataKey="kecamatan"
                  width={132}
                  tick={{ fontSize: 12, fill: '#0f172a', fontWeight: 600 }}
                  axisLine={{ stroke: '#d6d3d1' }}
                />
                <Tooltip
                  formatter={(value, _name, item) => {
                    const numVal = Number(value ?? 0);
                    const payload = item?.payload as
                      | { finalCount?: number; totalWilayah?: number }
                      | undefined;
                    const ratioText =
                      payload?.finalCount !== undefined && payload?.totalWilayah !== undefined
                        ? ` (${payload.finalCount} dari ${payload.totalWilayah} Desa/Kelurahan)`
                        : '';
                    return [`${numVal}% Selesai${ratioText}`, 'Capaian Perbup Final'];
                  }}
                  labelFormatter={(label) => `Kecamatan ${String(label ?? '')}`}
                />
                <Bar
                  dataKey="percentage"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                  isAnimationActive={false}
                >
                  {topKecamatanProgress.map((entry, idx) => (
                    <Cell
                      key={entry.kecamatan}
                      fill={
                        idx < 2
                          ? 'url(#emeraldGradHigh)'
                          : idx < 5
                          ? 'url(#emeraldGradMid)'
                          : 'url(#emeraldGradSoft)'
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    formatter={(val: unknown) => `${Number(val ?? 0)}%`}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      fill: '#065f46',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Rumus Analitik: <strong className="text-slate-700">(Desa Berstatus Final ÷ Total Desa Kecamatan) × 100%</strong>
            </span>
            <span className="font-mono tabular-nums text-emerald-800 font-semibold">
              Tertinggi: Kec. {topKecamatanProgress[0]?.kecamatan} ({topKecamatanProgress[0]?.percentage}% · {topKecamatanProgress[0]?.finalCount}/{topKecamatanProgress[0]?.totalWilayah} Desa)
            </span>
          </div>
        </div>
      </section>

      {/* 4. KOLOM PENCARIAN WILAYAH DINAMIS (DI BAWAH KOMPONEN GRAFIK) */}
      <section
        aria-labelledby="heading-pencarian-beranda"
        data-testid="beranda-search-section"
        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="heading-pencarian-beranda" className="text-xl sm:text-2xl font-bold text-slate-900">
            Kolom Pencarian Wilayah
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            Ketik nama Desa, Kelurahan, atau Kecamatan untuk mencari status dokumen Peraturan Bupati (Perbup) dan mengunduh berkasnya secara langsung.
          </p>

          <div className="mt-6 relative">
            <Search className="w-5 h-5 text-emerald-800 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="beranda-search-input"
              data-testid="beranda-search-input"
              type="text"
              role="searchbox"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama Desa, Kelurahan, atau Kecamatan (contoh: Kasumewuho, Unaaha)..."
              aria-label="Kolom Pencarian Wilayah Desa, Kelurahan, atau Kecamatan"
              className="w-full pl-12 pr-12 py-4 bg-stone-50 focus:bg-white rounded-xl border border-stone-300 focus:border-emerald-800 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Bersihkan kata kunci pencarian"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. PENEMUAN BERTAHAP (PROGRESSIVE DISCLOSURE):
          - STATE AWAL (KOSONG): Tampilkan 'Arsip Batas Definitif Terbaru' (6 wilayah berstatus 'Final (Sah / Selesai)')
          - STATE PENCARIAN (AKTIF >= 1 KARAKTER): Sembunyikan bagian Arsip Batas Definitif Terbaru dan render Hasil Pencarian */}
      {!isSearching ? (
        <section
          aria-labelledby="heading-arsip-definitif"
          data-testid="beranda-featured-section"
          className="space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                SAMPEL WILAYAH DEFINITIF · STATUS FINAL (SAH / SELESAI)
              </p>
              <h2
                id="heading-arsip-definitif"
                className="text-xl sm:text-2xl font-bold text-slate-900 mt-1"
              >
                Arsip Batas Definitif Terbaru
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Menampilkan {featuredFinalWilayah.length} sampel wilayah yang telah memiliki Peraturan Bupati (Perbup) batas wilayah definitif. Gunakan kolom pencarian di atas untuk mencari desa/kelurahan lainnya.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('produk-hukum')}
              className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white hover:bg-emerald-50 border border-stone-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <span>Lihat Seluruh {stats.totalDesaKelurahan} Wilayah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredFinalWilayah.map((item) =>
              renderWilayahCard(item, 'beranda-featured-card')
            )}
          </div>
        </section>
      ) : (
        <section
          aria-label="Hasil Pencarian Wilayah"
          data-testid="beranda-search-results"
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <p className="text-sm text-slate-700">
              Ditemukan{' '}
              <strong className="font-mono font-bold text-slate-900 tabular-nums">
                {searchResults.length}
              </strong>{' '}
              wilayah untuk kata kunci{' '}
              <span className="font-semibold text-emerald-900">&ldquo;{trimmedQuery}&rdquo;</span>
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Bersihkan Pencarian
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-8 text-center">
              <p className="text-sm font-bold text-slate-900">
                Tidak ada desa, kelurahan, atau kecamatan yang cocok dengan &ldquo;{trimmedQuery}&rdquo;
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Periksa kembali ejaan nama wilayah atau telusuri direktori lengkap melalui tab Produk Hukum.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((item) =>
                renderWilayahCard(item, 'beranda-wilayah-card')
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

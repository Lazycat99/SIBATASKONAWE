import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  FileText,
  FileCheck2,
  Activity,
  Map,
  Code2,
  ExternalLink,
  Search,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DashboardStats,
  DokumenBatas,
  WilayahKonawe,
  filterWilayahKonawe,
  formatNamaKecamatan
} from '../data/boundaryData';
import { NavTab } from './Navbar';

interface HomeViewProps {
  stats: DashboardStats;
  wilayahList: WilayahKonawe[];
  recentDocs: DokumenBatas[];
  onNavigate: (tab: NavTab) => void;
  onSelectDocument: (doc: DokumenBatas) => void;
  onSelectWilayah: (item: WilayahKonawe) => void;
  onOpenVercelCode: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  wilayahList,
  onNavigate,
  onSelectWilayah,
  onOpenVercelCode
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  // Live filtering: Hanya jalankan pencarian jika kolom pencarian tidak kosong
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return filterWilayahKonawe(wilayahList, {
      searchQuery: trimmedQuery
    });
  }, [wilayahList, trimmedQuery, isSearching]);

  return (
    <div className="space-y-10">
      {/* HERO SECTION (2-Column Split on Desktop with items-stretch) */}
      <section className="bg-emerald-950 text-white rounded-2xl border border-emerald-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-medium tracking-wide mb-4">
                <span>Pemerintah Kabupaten Konawe</span>
                <span aria-hidden="true">·</span>
                <span>Bagian Tata Pemerintahan Setda</span>
                <span aria-hidden="true">·</span>
                <span>Provinsi Sulawesi Tenggara</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                SI-BATAS KONAWE
              </h1>

              <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                Sistem Informasi Tapal Batas Wilayah Berbasis Cloud - Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe.
              </p>

              <p className="mt-3 text-sm text-emerald-200/75 leading-relaxed max-w-2xl">
                Portal pangkalan data terpadu yang memuat <strong className="text-white font-semibold">{stats.totalDesaKelurahan} wilayah definitif ({stats.totalDesa} Desa &amp; {stats.totalKelurahan} Kelurahan)</strong> pada <strong className="text-white font-semibold">{stats.totalKecamatan} Kecamatan</strong> di Kabupaten Konawe beserta dokumen Undang-Undang/Perda pembentukan, Peraturan Bupati batas wilayah, Berita Acara, dan peta spasial WebGIS.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/70 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('produk-hukum')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Telusuri Pangkalan Data Wilayah</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('webgis')}
                className="px-5 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 text-white font-medium text-sm rounded-lg border border-emerald-700 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4 text-amber-400" />
                <span>Peta Interaktif WebGIS</span>
              </button>

              <button
                type="button"
                onClick={onOpenVercelCode}
                className="px-4 py-2.5 bg-transparent hover:bg-emerald-900/60 text-emerald-200 hover:text-white font-medium text-xs rounded-lg border border-emerald-800 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Kode Siap Vercel (data.js &amp; index.html)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-emerald-900">
            <img
              src="/src/assets/images/konawe_aerial_topography_1793753978110.jpg"
              alt="Bentang alam lembah sungai dan hamparan wilayah administrasi Kabupaten Konawe"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/35 to-transparent flex flex-col justify-end p-6">
              <p className="text-xs font-mono text-amber-300 tabular-nums">
                KODE KEMENDAGRI KAB. KONAWE: 74.02 · {stats.totalKecamatan} KECAMATAN · {stats.totalDesaKelurahan} DESA/KELURAHAN
              </p>
              <p className="text-sm font-medium text-white mt-1">
                Koridor Lembah Sungai Konaweha &amp; Kawasan Perkotaan Unaaha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASBOR RINGKASAN STATISTIK (COUNTER CARDS — DIHITUNG DINAMIS DARI WILAYAHDATAKONAWE) */}
      <section aria-labelledby="heading-statistik">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 id="heading-statistik" className="text-xl font-bold text-slate-900">
              Dasbor Ringkasan Statistik Wilayah &amp; Tapal Batas
            </h2>
            <p className="text-sm text-slate-600">
              Rekapitulasi dinamis real-time dari pangkalan data <code className="font-mono text-xs bg-stone-200/70 px-1.5 py-0.5 rounded">wilayahDataKonawe</code> ({stats.totalDesaKelurahan} entitas wilayah definitif).
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Sinkronisasi Data Resmi · Bagian Tapem Setda Kab. Konawe
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Kecamatan Terdata */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Kecamatan Terdata</p>
              <p
                data-testid="counter-kecamatan"
                className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums mt-2"
              >
                {stats.totalKecamatan}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-stone-100">
              Kecamatan definitif se-Kabupaten Konawe (Kode 74.02)
            </p>
          </div>

          {/* Card 2: Total Desa / Kelurahan */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Desa / Kelurahan</p>
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
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-stone-100">
              {stats.totalPerdaPembentukan} wilayah terdata dasar UU/PP/Perda Pembentukan
            </p>
          </div>

          {/* Card 3: Jumlah Perbup Final */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Jumlah Perbup Final</p>
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
            <p className="text-xs text-emerald-800 font-medium mt-4 pt-3 border-t border-stone-100">
              {stats.totalLinkBatas} Tautan Dokumen Perbup Tersedia di Cloud
            </p>
          </div>

          {/* Card 4: Berita Acara & Regulasi */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Berita Acara Selesai</p>
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
            <p className="text-xs text-amber-800 font-medium mt-4 pt-3 border-t border-stone-100">
              Arsip Kesepakatan Batas &amp; Regulasi Desa/Kelurahan
            </p>
          </div>
        </div>
      </section>

      {/* KOLOM PENCARIAN WILAYAH CEPAT & ELEGAN (LIVE FILTERING TEPAT DI BAWAH DASBOR STATISTIK) */}
      <section aria-labelledby="heading-pencarian-beranda" className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
            PENCARIAN CEPAT PANGKALAN DATA WILAYAH
          </p>
          <h2 id="heading-pencarian-beranda" className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Cari Desa, Kelurahan, atau Kecamatan
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Ketik nama Desa/Kelurahan, nama Kecamatan, atau kode wilayah untuk menampilkan kartu informasi batas wilayah dan tautan unduh dokumennya secara instan.
          </p>

          <div className="mt-6 relative">
            <Search className="w-5 h-5 text-emerald-800 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="beranda-search-input"
              data-testid="beranda-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama Desa / Kelurahan atau Kecamatan (contoh: Unaaha, Kasumewuho, Lambuya, Routa)..."
              aria-label="Cari nama Desa, Kelurahan, atau Kecamatan di Kabupaten Konawe"
              className="w-full pl-12 pr-12 py-4 bg-stone-50 focus:bg-white rounded-xl border-2 border-stone-200 focus:border-emerald-800 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs"
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

        {/* HASIL PENCARIAN DINAMIS (HANYA MUNCUL JIKA KOLOM PENCARIAN TIDAK KOSONG) */}
        {isSearching && (
          <div data-testid="beranda-search-results" className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <p className="text-sm text-slate-700">
                Menampilkan{' '}
                <strong className="font-mono font-bold text-slate-900 tabular-nums">
                  {searchResults.length}
                </strong>{' '}
                hasil pencarian untuk kata kunci{' '}
                <span className="font-semibold text-emerald-900">&ldquo;{trimmedQuery}&rdquo;</span>
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Tutup Hasil Pencarian
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-8 text-center">
                <p className="text-sm font-bold text-slate-900">
                  Wilayah tidak ditemukan untuk kata kunci &ldquo;{trimmedQuery}&rdquo;
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Periksa kembali ejaan nama Desa/Kelurahan atau Kecamatan yang Anda cari.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((item) => {
                  const ketBatas = item.keterangan_batas.trim();
                  const ketPerda = item.keterangan_pembentukan.trim();
                  const hasLinkBatas = item.link_batas.trim().length > 0;
                  const hasLinkPerda =
                    Array.isArray(item.link_pembentukan) && item.link_pembentukan.length > 0;
                  const isDraft =
                    ketBatas.toLowerCase().includes('draf') ||
                    ketBatas.toLowerCase().includes('tahap penyusunan');

                  return (
                    <div
                      key={item.kode}
                      data-testid="beranda-wilayah-card"
                      className="bg-stone-50/70 hover:bg-white rounded-xl p-5 border border-stone-200 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-medium text-slate-700">
                            Kecamatan {formatNamaKecamatan(item.kecamatan)}
                          </span>
                          <span className="font-mono tabular-nums text-slate-800 font-semibold">
                            {item.kode}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {item.status} {item.nama_wilayah}
                        </h3>

                        {ketBatas ? (
                          <div className="mt-3">
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
                                {isDraft ? 'Draf Perbup (On-Going)' : 'Perbup / BA Batas (Final)'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                              {ketBatas}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-mono mt-3">
                            Belum Terbit Perbup Batas Wilayah
                          </p>
                        )}

                        {ketPerda && (
                          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-2">
                            <strong className="text-slate-700">Dasar Pembentukan:</strong>{' '}
                            {ketPerda}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectWilayah(item)}
                          className="px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
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
                              <span>Unduh / Buka Dokumen</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3.5 py-2 text-xs font-semibold text-slate-500 bg-stone-200 border border-stone-300 rounded-lg cursor-not-allowed whitespace-nowrap"
                            >
                              Dokumen Belum Tersedia
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* KARTU AKSES CEPAT (QUICK ACCESS CARDS) */}
      <section aria-labelledby="heading-akses-cepat">
        <div className="mb-4">
          <h2 id="heading-akses-cepat" className="text-xl font-bold text-slate-900">
            Akses Cepat Layanan Portal SI-BATAS
          </h2>
          <p className="text-sm text-slate-600">
            Pilih modul layanan untuk mengakses direktori lengkap {stats.totalDesaKelurahan} desa/kelurahan pada halaman Produk Hukum &amp; Berita Acara, progres kegiatan, atau peta interaktif.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            type="button"
            onClick={() => onNavigate('produk-hukum')}
            className="group text-left bg-white hover:bg-emerald-950 hover:text-white rounded-xl p-6 border border-stone-200 hover:border-emerald-900 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 group-hover:bg-emerald-900 text-emerald-900 group-hover:text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-white">
                Produk Hukum ({stats.totalDesaKelurahan} Wilayah)
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Direktori lengkap {stats.totalDesa} Desa &amp; {stats.totalKelurahan} Kelurahan beserta Perbup Batas Wilayah dan UU/Perda Pembentukan.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 group-hover:border-emerald-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-amber-400">
              <span>Buka Produk Hukum</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('berita-acara')}
            className="group text-left bg-white hover:bg-emerald-950 hover:text-white rounded-xl p-6 border border-stone-200 hover:border-emerald-900 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 group-hover:bg-emerald-900 text-amber-900 group-hover:text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-white">
                Berita Acara ({stats.totalDesaKelurahan} Wilayah)
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Arsip kesepakatan pelacakan tapal batas definitif ({stats.totalBaFinal} selesai) dan pantauan berkas mediasi dalam proses.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 group-hover:border-emerald-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-amber-400">
              <span>Buka Berita Acara</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progres')}
            className="group text-left bg-white hover:bg-emerald-950 hover:text-white rounded-xl p-6 border border-stone-200 hover:border-emerald-900 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 group-hover:bg-emerald-900 text-emerald-900 group-hover:text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-white">
                Progres Kegiatan
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Pantauan aktual capaian persentase segmen batas luar daerah (antar-kabupaten/kota) dan {stats.totalKecamatan} kecamatan dalam daerah.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 group-hover:border-emerald-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-amber-400">
              <span>Pantau Progres</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('webgis')}
            className="group text-left bg-white hover:bg-emerald-950 hover:text-white rounded-xl p-6 border border-stone-200 hover:border-emerald-900 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 group-hover:bg-emerald-900 text-amber-900 group-hover:text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-white">
                Peta WebGIS
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Peta interaktif garis batas administrasi tingkat kecamatan (merah) dan tingkat desa/kelurahan (biru).
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 group-hover:border-emerald-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-amber-400">
              <span>Buka Peta Spasial</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

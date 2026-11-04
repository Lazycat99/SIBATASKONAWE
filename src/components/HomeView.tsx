import React from 'react';
import {
  ArrowRight,
  FileText,
  FileCheck2,
  Activity,
  Map,
  Code2,
  ExternalLink
} from 'lucide-react';
import { DashboardStats, DokumenBatas } from '../data/boundaryData';
import { NavTab } from './Navbar';

interface HomeViewProps {
  stats: DashboardStats;
  recentDocs: DokumenBatas[];
  onNavigate: (tab: NavTab) => void;
  onSelectDocument: (doc: DokumenBatas) => void;
  onOpenVercelCode: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  recentDocs,
  onNavigate,
  onSelectDocument,
  onOpenVercelCode
}) => {
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
                Portal repositori terpadu untuk keterbukaan arsip Peraturan Bupati, Berita Acara kesepakatan pelacakan lapangan, pemantauan progres penegasan batas daerah, serta visualisasi spasial WebGIS Kabupaten Konawe.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800/70 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('produk-hukum')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Telusuri Produk Hukum</span>
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
                <span>Kode Siap Vercel (data.js & index.html)</span>
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
                KOORDINAT PUSAT PEMERINTAHAN: 03°51&apos;22.4&quot; LS · 122°02&apos;10.5&quot; BT
              </p>
              <p className="text-sm font-medium text-white mt-1">
                Koridor Lembah Sungai Konaweha & Kawasan Perkotaan Unaaha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASBOR RINGKASAN STATISTIK (COUNTER CARDS — DIHITUNG OTOMATIS DARI DATA.JS) */}
      <section aria-labelledby="heading-statistik">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 id="heading-statistik" className="text-xl font-bold text-slate-900">
              Dasbor Ringkasan Statistik Tapal Batas
            </h2>
            <p className="text-sm text-slate-600">
              Rekapitulasi otomatis berdasarkan basis data aktif <code className="font-mono text-xs bg-stone-200/70 px-1.5 py-0.5 rounded">data.js</code> ({stats.totalDokumen} total rekaman dokumen).
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Sinkronisasi Cloud · Bagian Tapem Setda Kab. Konawe
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              Unaaha · Uepai · Padangguni · Tongauna · Lambuya · Wawotobi
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Desa / Kelurahan</p>
              <p
                data-testid="counter-desa"
                className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums mt-2"
              >
                {stats.totalDesaKelurahan}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-stone-100">
              Satuan wilayah desa & kelurahan dalam basis data
            </p>
          </div>

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
              Peraturan Bupati Definitif Berlaku Sah
            </p>
          </div>

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
                  (+{stats.totalBaDraft} Dalam Proses)
                </span>
              </div>
            </div>
            <p className="text-xs text-amber-800 font-medium mt-4 pt-3 border-t border-stone-100">
              Arsip Kesepakatan Tapal Batas Final
            </p>
          </div>
        </div>
      </section>

      {/* KARTU AKSES CEPAT (QUICK ACCESS CARDS) */}
      <section aria-labelledby="heading-akses-cepat">
        <div className="mb-4">
          <h2 id="heading-akses-cepat" className="text-xl font-bold text-slate-900">
            Akses Cepat Layanan Portal SI-BATAS
          </h2>
          <p className="text-sm text-slate-600">
            Pilih modul layanan untuk mengakses dokumen regulasi, berita acara pelacakan, pantauan kegiatan, atau peta interaktif.
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
                Produk Hukum
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Katalog Peraturan Bupati (Final) serta Rancangan Draf Perbup batas wilayah desa dan kelurahan.
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
                Berita Acara
              </h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-100/85 mt-2 leading-relaxed">
                Arsip kesepakatan pelacakan tapal batas definitif dan pantauan berkas mediasi dalam proses.
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
                Pantauan aktual capaian persentase segmen batas luar daerah (antar-kabupaten/kota) dan dalam daerah.
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

      {/* PEMBARUAN DOKUMEN TERBARU */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Arsip Dokumen & Regulasi Tapal Batas Terkini
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada salah satu dokumen untuk melihat rincian titik koordinat atau mengunduh berkas Google Drive.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('produk-hukum')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              Lihat Semua Produk Hukum →
            </button>
          </div>
        </div>

        <div className="divide-y divide-stone-200">
          {recentDocs.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/80 px-2 rounded-lg transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-slate-700 font-medium">{doc.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>Kecamatan {doc.kecamatan}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      doc.status === 'Final'
                        ? 'text-emerald-800 font-semibold'
                        : 'text-amber-700 font-semibold'
                    }
                  >
                    {doc.jenisDokumen === 'Perbup'
                      ? doc.status === 'Final'
                        ? 'Peraturan Bupati (Final)'
                        : 'Draf Perbup (On-Going)'
                      : doc.status === 'Final'
                      ? 'Berita Acara (FINAL)'
                      : 'Berita Acara (Dalam Proses)'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {doc.namaDesa} — <span className="font-mono font-normal text-slate-700">{doc.nomorDokumen}</span>
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">{doc.keterangan}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectDocument(doc)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Rincian
                </button>
                <a
                  href={doc.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Unduh / Buka</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

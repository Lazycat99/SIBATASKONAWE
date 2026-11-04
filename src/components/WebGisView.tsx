import React from 'react';
import {
  Info,
  AlertTriangle,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react';

interface WebGisViewProps {
  activeMapSegment: string | null;
  onClearMapSegment: () => void;
}

export const WebGisView: React.FC<WebGisViewProps> = ({
  activeMapSegment,
  onClearMapSegment
}) => {
  return (
    <div className="space-y-6">
      {/* HEADER WEBGIS & KOTAK PANDUAN PENGGUNAAN PETA */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              SISTEM INFORMASI GEOGRAFIS TAPAL BATAS DAERAH
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              WebGIS / Peta Interaktif - Visualisasi Spasial Batas Administrasi Kabupaten Konawe
            </h1>
          </div>

          <a
            href="https://www.google.com/maps/d/viewer?mid=1DN2pY2ghIJTvecVBrDwlLl3ZscJxrf4"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-2 transition-colors self-start lg:self-auto whitespace-nowrap shrink-0"
          >
            <span>Buka Peta Layar Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* KOTAK PANDUAN PENGGUNAAN PETA */}
        <div className="mt-6 bg-stone-50 rounded-xl p-5 border border-stone-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-slate-700">
              <h2 className="font-bold text-slate-900">
                Panduan Penggunaan Peta Interaktif:
              </h2>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>
                  Gunakan dua jari (pada layar sentuh/HP) atau gulir/scroll mouse (pada PC) untuk memperbesar dan memperkecil peta.
                </li>
                <li>
                  Klik pada garis batas atau di dalam area wilayah untuk memunculkan kotak informasi detail (nama kecamatan atau desa terkait).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Indikator Fokus Segmen Kegiatan (jika pengguna mengeklik "Peta Kegiatan" dari halaman Progres) */}
        {activeMapSegment && (
          <div className="mt-4 bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm text-emerald-950">
              <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>
                <strong>Fokus Segmen Kegiatan Aktif:</strong> {activeMapSegment} — silakan klik poligon/garis wilayah terkait pada peta di bawah.
              </span>
            </div>
            <button
              type="button"
              onClick={onClearMapSegment}
              aria-label="Hapus fokus segmen peta"
              className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* KOMPONEN PETA RESPONSIF (IFRAME GOOGLE MY MAPS + KREDIT PETA) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200">
        <div className="rounded-xl shadow-lg overflow-hidden bg-stone-100">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1DN2pY2ghIJTvecVBrDwlLl3ZscJxrf4&ehbc=2E312F"
            width="100%"
            height="550"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Peta WebGIS Batas Administrasi Kabupaten Konawe"
          />
        </div>

        <div className="mt-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-800" data-testid="map-credit">
            Map by : Ferry Rante Bawangi - Bagian Tata Pemerintahan Sekretariat Kab. Konawe
          </p>
          <span className="font-mono text-slate-500 tabular-nums">
            Skala Referensi Spasial · Datum WGS 84
          </span>
        </div>
      </div>

      {/* PANEL LEGENDA PETA & KOTAK CATATAN PENTING (WARNING BOX) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel Legenda Peta */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Panel Legenda Peta Spasial
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Keterangan simbol warna garis batas administrasi pada peta interaktif:
            </p>

            <div className="mt-4 space-y-3.5">
              {/* Indikator Bulat Merah */}
              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                <span
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full bg-red-600 shrink-0 shadow-xs"
                />
                <span className="text-sm font-medium text-slate-800">
                  Garis Merah : Batas Administrasi Tingkat Kecamatan
                </span>
              </div>

              {/* Indikator Bulat Biru */}
              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                <span
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full bg-blue-600 shrink-0 shadow-xs"
                />
                <span className="text-sm font-medium text-slate-800">
                  Garis Biru : Batas Administrasi Tingkat Desa / Kelurahan
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-stone-100">
            Data spasial dikelola oleh Tim Teknis Pemetaan Bagian Tata Pemerintahan Setda Kabupaten Konawe.
          </p>
        </div>

        {/* Kotak Catatan Penting (Warning Box) */}
        <div
          role="note"
          data-testid="webgis-warning-box"
          className="lg:col-span-7 bg-amber-50 rounded-xl p-6 border border-amber-300 flex flex-col justify-between text-amber-950"
        >
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h2 className="text-base font-bold text-amber-950">
                Status Hukum Garis Batas Spasial
              </h2>
              <p className="text-sm leading-relaxed">
                <strong>CATATAN PENTING:</strong> Batas administrasi bagi desa-desa yang belum memiliki Peraturan Bupati (Perbup) definitif di dalam peta ini masih berstatus sebagai Batas Indikatif. Garis batas tersebut bersifat sementara dan dapat disesuaikan sewaktu-waktu berdasarkan hasil pelacakan tim lapangan serta kesepakatan batas final berikutnya.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900/90 font-mono">
            <span>ACUAN REGULASI: PERMENDAGRI NO. 45 TAHUN 2016</span>
            <span>PENETAPAN & PENEGASAN BATAS DESA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

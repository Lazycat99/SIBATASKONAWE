import React, { useState, useMemo } from 'react';
import {
  FileText,
  MapPin,
  ExternalLink,
  Compass,
  Layers
} from 'lucide-react';
import {
  ProgresBatasLuar,
  ProgresBatasDalam
} from '../data/boundaryData';

interface ProgressViewProps {
  progresLuar: ProgresBatasLuar[];
  progresDalam: ProgresBatasDalam[];
  onOpenMapWithSegment: (fokusPeta: string) => void;
  onSelectProgressLuar: (item: ProgresBatasLuar) => void;
  onSelectProgressDalam: (item: ProgresBatasDalam) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progresLuar,
  progresDalam,
  onOpenMapWithSegment,
  onSelectProgressLuar,
  onSelectProgressDalam
}) => {
  const [filterKecamatanDalam, setFilterKecamatanDalam] = useState('ALL');

  const avgLuar = useMemo(() => {
    if (progresLuar.length === 0) return 0;
    const sum = progresLuar.reduce((acc, item) => acc + item.persentase, 0);
    return Math.round(sum / progresLuar.length);
  }, [progresLuar]);

  const avgDalam = useMemo(() => {
    if (progresDalam.length === 0) return 0;
    const sum = progresDalam.reduce((acc, item) => acc + item.persentase, 0);
    return Math.round(sum / progresDalam.length);
  }, [progresDalam]);

  const filteredDalam = useMemo(() => {
    if (filterKecamatanDalam === 'ALL') return progresDalam;
    return progresDalam.filter((item) => item.kecamatan === filterKecamatanDalam);
  }, [progresDalam, filterKecamatanDalam]);

  const kecamatanList = useMemo(() => {
    return Array.from(new Set(progresDalam.map((p) => p.kecamatan))).sort();
  }, [progresDalam]);

  return (
    <div className="space-y-10">
      {/* HEADER UTAMA PROGRES KEGIATAN BATAS */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              MONITORING TIM PENEGASAN BATAS DAERAH (PPBD)
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Progres Kegiatan Batas - Pantauan Aktual Pelaksanaan Pelacakan dan Penegasan Tapal Batas Wilayah Kabupaten Konawe
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Pemantauan berkala tahapan identifikasi titik koordinat pilar batas, ekstraksi kartometrik, mediasi kesepakatan lapangan, serta sinkronisasi peta kerja.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <p className="text-xs text-slate-500 font-medium">Rata-rata Batas Luar</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
                {avgLuar}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{progresLuar.length} Segmen Antar-Daerah</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <p className="text-xs text-slate-500 font-medium">Rata-rata Batas Dalam</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1">
                {avgDalam}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{progresDalam.length} Koridor Kecamatan</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEKSI 1: SEGMEN BATAS LUAR DAERAH (ANTAR-KABUPATEN/KOTA) */}
      <section aria-labelledby="heading-batas-luar" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
              <Compass className="w-4 h-4" />
              <span>SEKSI 01 · ANTAR-KABUPATEN / KOTA</span>
            </div>
            <h2 id="heading-batas-luar" className="text-xl font-bold text-slate-900 mt-1">
              Segmen Batas Luar Daerah (Antar-Kabupaten/Kota)
            </h2>
            <p className="text-sm text-slate-600">
              Pelaksanaan penegasan batas daerah Kabupaten Konawe dengan kabupaten/kota tetangga di Provinsi Sulawesi Tenggara.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {progresLuar.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{item.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.statusTeknis}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {item.segmen}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800">
                      {item.persentase}%
                    </span>
                    <p className="text-xs text-slate-500">Capaian Fisik</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden mt-4"
                  role="progressbar"
                  aria-valuenow={item.persentase}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progres ${item.segmen}`}
                >
                  <div
                    className="h-full bg-emerald-800 rounded-full transition-all duration-300"
                    style={{ width: `${item.persentase}%` }}
                  />
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-700">Cakupan Bersinggungan:</strong> {item.wilayahBersinggungan}
                  </p>
                  <p className="text-slate-800 font-medium">
                    Tahapan: {item.tahapanSaatIni}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.deskripsiTahapan}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono tabular-nums">
                  <span>Pilar/Titik: {item.jumlahPilar}</span>
                  <span aria-hidden="true">·</span>
                  <span>Target: {item.targetSelesai}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProgressLuar(item)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Dokumen</span>
                  </button>

                  <a
                    href={item.linkDokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka Google Drive ${item.segmen}`}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenMapWithSegment(item.fokusPeta)}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Peta Kegiatan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI 2: SEGMEN BATAS DALAM DAERAH (ANTAR-KECAMATAN/DESA) */}
      <section aria-labelledby="heading-batas-dalam" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
              <Layers className="w-4 h-4" />
              <span>SEKSI 02 · INTERNAL KABUPATEN KONAWE</span>
            </div>
            <h2 id="heading-batas-dalam" className="text-xl font-bold text-slate-900 mt-1">
              Segmen Batas Dalam Daerah (Antar-Kecamatan/Desa)
            </h2>
            <p className="text-sm text-slate-600">
              Daftar kegiatan pelacakan, verifikasi kartometrik, dan penegasan batas internal antar-kecamatan dan desa/kelurahan yang sedang berjalan.
            </p>
          </div>

          <div className="w-full sm:w-64 shrink-0">
            <label
              htmlFor="filter-kecamatan-progres"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Filter Kecamatan Internal
            </label>
            <select
              id="filter-kecamatan-progres"
              value={filterKecamatanDalam}
              onChange={(e) => setFilterKecamatanDalam(e.target.value)}
              className="w-full px-3.5 py-2 bg-white rounded-lg border border-stone-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700 cursor-pointer"
            >
              <option value="ALL">Semua Kecamatan ({progresDalam.length})</option>
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  Kecamatan {kec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDalam.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{item.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>Kecamatan {item.kecamatan}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {item.segmen}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-2xl font-bold font-mono tabular-nums ${
                        item.persentase === 100 ? 'text-emerald-800' : 'text-amber-700'
                      }`}
                    >
                      {item.persentase}%
                    </span>
                    <p className="text-xs text-slate-500">Progres Internal</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden mt-4"
                  role="progressbar"
                  aria-valuenow={item.persentase}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progres ${item.segmen}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.persentase === 100 ? 'bg-emerald-700' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.persentase}%` }}
                  />
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-700">Cakupan Desa/Kelurahan:</strong> {item.cakupanDesa}
                  </p>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    Tahapan Saat Ini: {item.tahapanSaatIni}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono tabular-nums">
                  <span>Cakupan Titik: {item.jumlahTitik}</span>
                  <span aria-hidden="true">·</span>
                  <span>Target: {item.targetSelesai}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProgressDalam(item)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Dokumen</span>
                  </button>

                  <a
                    href={item.linkDokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka Google Drive ${item.segmen}`}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenMapWithSegment(item.fokusPeta)}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Peta Kegiatan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import {
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

const KRONOLOGI_PONDIDAHA_AMONGGEDO = [
  {
    tanggal: '27 April 2026',
    kegiatan: 'Pengecekan Batas Awal Pondidaha & Penyusunan BA Jembatan Tukambopo'
  },
  {
    tanggal: '28 April 2026',
    kegiatan: 'Verifikasi Tapal Batas Sisi Amonggedo'
  },
  {
    tanggal: '30 April 2026',
    kegiatan: 'Penentuan Lokasi (Penlok) Gabungan'
  },
  {
    tanggal: '05 Mei 2026',
    kegiatan: 'Peninjauan Lapangan Lanjutan (Belum ada mufakat)'
  }
];

const KRONOLOGI_ATODOPI_MATAHORI = [
  {
    tanggal: 'Tahun 2021',
    kegiatan:
      'Pengesahan Batas Definitif Desa Matahori (Perbup No. 84/2021) & Penerbitan SK Hutan Desa (KemenLHK).'
  },
  {
    tanggal: 'Tahun 2025',
    kegiatan:
      'Penandatanganan BA Kesepakatan Batas se-Kec. Padangguni (Ditandatangani oleh Kades Atodopi).'
  },
  {
    tanggal: '25 Februari 2026',
    kegiatan: 'Rapat Klarifikasi Pemkab Konawe dengan Kades Matahori.'
  },
  {
    tanggal: '27 Februari 2026',
    kegiatan: 'Rapat Klarifikasi Pemkab Konawe dengan Kades Atodopi.'
  }
];

const KRONOLOGI_ANDEPOSANDU_BAROWILA = [
  {
    tanggal: '25 Juli 2025',
    kegiatan:
      'Pemanggilan Sidang Finalisasi Batas oleh Sekretaris Daerah Kab. Konawe (Surat No. P-100.2.3_789).'
  },
  {
    tanggal: '28 Juli 2025',
    kegiatan: 'Rapat Mediasi Eksekutif di Kantor Camat Tongauna Utara.'
  },
  {
    tanggal: '28 Juli 2025',
    kegiatan:
      'Penandatanganan BA Kesepakatan Bersama (Disahkan oleh Wakil Bupati, Asisten I, serta Camat dan Kades terkait).'
  }
];

export const ProgressView: React.FC<ProgressViewProps> = ({
  progresLuar
}) => {
  return (
    <div className="space-y-10">
      {/* HEADER UTAMA PROGRES KEGIATAN BATAS */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
            MONITORING TIM PENEGASAN BATAS DAERAH (PPBD)
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Progres Kegiatan Batas - Pantauan Aktual Pelaksanaan Pelacakan dan Penegasan Tapal Batas Wilayah Kabupaten Konawe
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-4xl leading-relaxed">
            Pemantauan berkala tahapan identifikasi titik koordinat pilar batas, ekstraksi kartometrik, mediasi kesepakatan lapangan, serta sinkronisasi peta kerja.
          </p>
          <div className="mt-4 bg-slate-100 px-4 py-2 rounded text-slate-600 text-sm font-medium">
            Pusat informasi ini menyajikan pantauan aktual penyelesaian tapal batas definitif. Fokus saat ini meliputi eskalasi mediasi batas luar daerah di Kementerian Dalam Negeri, serta penyelesaian sengketa batas internal (antar-kecamatan dan desa/kelurahan) di dalam wilayah Kabupaten Konawe.
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
          {progresLuar.map((item) => {
            const hasExecutiveSummary = Boolean(
              item.rangkumanStatus && item.kronologi && item.kronologi.length > 0
            );
            const rawSummary = item.rangkumanStatus ?? '';
            const colonIndex = rawSummary.indexOf(':');
            const summaryPrefix =
              colonIndex !== -1 ? rawSummary.slice(0, colonIndex + 1) : '';
            const summaryBody =
              colonIndex !== -1 ? rawSummary.slice(colonIndex + 1).trim() : rawSummary;

            return (
              <div
                key={item.id}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 flex flex-col justify-between"
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

                    {!hasExecutiveSummary && (
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800">
                          {item.persentase}%
                        </span>
                        <p className="text-xs text-slate-500">Capaian Fisik</p>
                      </div>
                    )}
                  </div>

                  {hasExecutiveSummary ? (
                    <div className="mt-4 space-y-5">
                      {/* Bagian Atas: Rangkuman Status Segmen */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-950 leading-relaxed">
                          {summaryPrefix && (
                            <strong className="font-semibold">{summaryPrefix} </strong>
                          )}
                          {summaryBody}
                        </p>
                      </div>

                      {/* Bagian Bawah: Kronologi Penyelesaian (Vertical Timeline) */}
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                          Kronologi Penyelesaian
                        </p>
                        <ol className="relative border-l-2 border-emerald-700/30 ml-2 pl-5 space-y-3">
                          {item.kronologi?.map((step, idx) => (
                            <li key={`${item.id}-step-${idx}`} className="relative">
                              <span
                                aria-hidden="true"
                                className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white"
                              />
                              <p className="text-slate-700 text-sm leading-snug">
                                <span className="font-semibold text-slate-800">{step.tanggal}:</span>{' '}
                                {step.kegiatan}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <>
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
                          <strong className="text-slate-700">Cakupan Bersinggungan:</strong>{' '}
                          {item.wilayahBersinggungan}
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
                    </>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md text-sm font-medium border border-rose-200 cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span>Dokumen Terbatas (Tahap Mediasi)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEKSI 2: PENEGASAN & SENGKETA BATAS INTERNAL (ANTAR-KECAMATAN DAN DESA) */}
      <section aria-labelledby="heading-batas-dalam" className="space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold">
            <Layers className="w-4 h-4" />
            <span>SEKSI 02 · INTERNAL KABUPATEN KONAWE</span>
          </div>
          <h2 id="heading-batas-dalam" className="text-xl font-bold text-slate-900 mt-1">
            Penegasan &amp; Sengketa Batas Internal (Antar-Kecamatan dan Desa)
          </h2>
          <p className="text-sm text-slate-600">
            Laporan faktual mediasi dan verifikasi lapangan penyelesaian sengketa tapal batas internal antar-kecamatan dan desa/kelurahan di Kabupaten Konawe.
          </p>
        </div>

        {/* Kartu 1: Sengketa Pondidaha - Amonggedo (Full Width) */}
        <div className="w-full transition-all duration-300 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>INTERNAL-01</span>
              <span aria-hidden="true">·</span>
              <span>Laporan Sengketa Faktual · Mediasi Lanjutan</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Kecamatan Pondidaha – Kecamatan Amonggedo
            </h3>

            <div className="mt-4 space-y-5">
              {/* Area Status Sengketa */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-950 leading-relaxed">
                  <strong className="font-semibold">Status Sengketa (Deadlock):</strong>{' '}
                  Terdapat konflik pergeseran tapal batas antara Kec. Pondidaha dan Kec. Amonggedo (Kecamatan Pemekaran sesuai Perda No.6/2005). Secara historis batas alam berada di Kali/Jembatan Tukambopo. Meski telah dilakukan 4 kali verifikasi lapangan, kedua belah pihak tetap kukuh pada klaim masing-masing. Proses penegasan masih tertahan di tahap mediasi lanjutan.
                </p>
              </div>

              {/* Kronologi Mediasi (Vertical Timeline) */}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Kronologi Mediasi
                </p>
                <ol className="relative border-l-2 border-emerald-700/30 ml-2 pl-5 space-y-3">
                  {KRONOLOGI_PONDIDAHA_AMONGGEDO.map((step, idx) => (
                    <li key={`pondidaha-amonggedo-step-${idx}`} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white"
                      />
                      <p className="text-slate-700 text-sm leading-snug">
                        <span className="font-semibold text-slate-800">{step.tanggal}:</span>{' '}
                        {step.kegiatan}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-500 rounded border border-slate-200 text-xs font-medium cursor-not-allowed">
              Menunggu Penjadwalan Mediasi Lanjutan
            </span>
          </div>
        </div>

        {/* Kartu 2: Sengketa Desa Atodopi - Desa Matahori (Kec. Padangguni) */}
        <div className="w-full transition-all duration-300 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>INTERNAL-02</span>
              <span aria-hidden="true">·</span>
              <span>Laporan Sengketa Faktual · Tinjauan Yuridis</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Desa Atodopi – Desa Matahori (Kec. Padangguni)
            </h3>

            <div className="mt-4 space-y-5">
              {/* Kotak Status Sengketa */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-950 leading-relaxed">
                  <strong className="font-semibold">Status Sengketa (Tinjauan Yuridis):</strong>{' '}
                  Muncul klaim peninjauan ulang oleh Desa Atodopi yang menghendaki penarikan garis batas merujuk pada delineasi indikatif Badan Informasi Geospasial (BIG) 2021. Namun, secara hukum ketatanegaraan, batas Desa Matahori telah definitif dan berkekuatan hukum tetap melalui Peraturan Bupati Konawe No. 84 Tahun 2021. Bukti formil menunjukkan bahwa Peta Kerja Kesepakatan serta Berita Acara tahun 2025 telah ditandatangani secara sadar oleh Kepala Desa Atodopi. Pembatalan Peraturan Bupati yang arsip spasialnya telah terintegrasi di tingkat Kementerian Dalam Negeri sangat sulit dilakukan dan berisiko memicu cacat administrasi.
                </p>
              </div>

              {/* Kronologi Penyelesaian (Vertical Timeline dengan titik penanda merah) */}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Kronologi Penyelesaian
                </p>
                <ol className="relative border-l-2 border-red-300 ml-2 pl-5 space-y-3">
                  {KRONOLOGI_ATODOPI_MATAHORI.map((step, idx) => (
                    <li key={`atodopi-matahori-step-${idx}`} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-600 ring-4 ring-white"
                      />
                      <p className="text-slate-700 text-sm leading-snug">
                        <span className="font-semibold text-slate-800">{step.tanggal}:</span>{' '}
                        {step.kegiatan}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-500 rounded border border-slate-200 text-xs font-medium cursor-not-allowed">
              Menunggu Keputusan Final Pemkab Konawe
            </span>
          </div>
        </div>

        {/* Kartu 3: Resolusi Konflik Desa Andeposandu - Desa Barowila (Success Story) */}
        <div className="w-full transition-all duration-300 hover:shadow-lg rounded-xl bg-white shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-mono font-semibold">
              <span>INTERNAL-03</span>
              <span aria-hidden="true">·</span>
              <span>Resolusi Konflik · Mufakat &amp; Definitif</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Desa Andeposandu (Kec. Tongauna) – Desa Barowila (Kec. Tongauna Utara)
            </h3>

            <div className="mt-4 space-y-5">
              {/* Kotak Status Kesepakatan */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-emerald-950 leading-relaxed">
                  <strong className="font-semibold">Status Penyelesaian (Mufakat):</strong>{' '}
                  Sengketa lintas kecamatan ini telah berhasil diselesaikan secara definitif. Berdasarkan Berita Acara Kesepakatan 28 Juli 2025 yang dipimpin oleh Wakil Bupati Konawe, segmen wilayah sengketa secara administratif masuk ke Desa Barowila. Sebagai solusi komprehensif, hak ulayat/lahan garapan warga Andeposandu tetap diakui penuh dan wilayah tersebut diproyeksikan untuk menjadi basis pembentukan wilayah pemekaran Desa Andeposandu Utama.
                </p>
              </div>

              {/* Kronologi Penyelesaian (Vertical Timeline dengan titik penanda hijau bg-emerald-500) */}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Kronologi Penyelesaian
                </p>
                <ol className="relative border-l-2 border-emerald-300 ml-2 pl-5 space-y-3">
                  {KRONOLOGI_ANDEPOSANDU_BAROWILA.map((step, idx) => (
                    <li key={`andeposandu-barowila-step-${idx}`} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"
                      />
                      <p className="text-slate-700 text-sm leading-snug">
                        <span className="font-semibold text-slate-800">{step.tanggal}:</span>{' '}
                        {step.kegiatan}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <span className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 text-xs font-bold">
              Sengketa Selesai &amp; Batas Definitif
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

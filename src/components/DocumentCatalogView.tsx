import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileSearch
} from 'lucide-react';
import {
  DokumenBatas,
  JenisDokumen,
  StatusDokumen,
  filterDocuments,
  getUniqueKecamatan
} from '../data/boundaryData';

interface DocumentCatalogViewProps {
  jenisDokumen: JenisDokumen;
  dokumenList: DokumenBatas[];
  onSelectDocument: (doc: DokumenBatas) => void;
  onOpenAddModal: () => void;
}

export const DocumentCatalogView: React.FC<DocumentCatalogViewProps> = ({
  jenisDokumen,
  dokumenList,
  onSelectDocument,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | StatusDokumen>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const isPerbup = jenisDokumen === 'Perbup';

  const kecamatanOptions = useMemo(() => {
    const base = getUniqueKecamatan(dokumenList);
    const defaults = ['Unaaha', 'Uepai', 'Lambuya', 'Padangguni', 'Tongauna', 'Wawotobi'];
    const merged = Array.from(new Set([...base, ...defaults])).sort((a, b) =>
      a.localeCompare(b, 'id')
    );
    return merged;
  }, [dokumenList]);

  const filteredDocs = useMemo(() => {
    return filterDocuments(dokumenList, {
      jenisDokumen,
      searchQuery,
      kecamatan: selectedKecamatan,
      status: selectedStatus
    });
  }, [dokumenList, jenisDokumen, searchQuery, selectedKecamatan, selectedStatus]);

  const counts = useMemo(() => {
    const allForType = dokumenList.filter((d) => d.jenisDokumen === jenisDokumen);
    const finalCount = allForType.filter((d) => d.status === 'Final').length;
    const draftCount = allForType.filter((d) => d.status === 'Draft').length;
    return {
      all: allForType.length,
      final: finalCount,
      draft: draftCount
    };
  }, [dokumenList, jenisDokumen]);

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedKecamatan('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-6">
      {/* HEADER SEKSI */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              {isPerbup
                ? 'REPOSITORI REGULASI BATAS WILAYAH'
                : 'ARSIP KESEPAKATAN & MEDIASI LAPANGAN'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {isPerbup
                ? 'PRODUK HUKUM - Dokumen Resmi dan Peraturan Bupati tentang Batas Wilayah Kabupaten Konawe'
                : 'BERITA ACARA - Arsip Kesepakatan dan Pelacakan Tapal Batas'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200"
              role="group"
              aria-label="Mode tampilan daftar dokumen"
            >
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Tampilan Tabel"
                className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Tampilan Kartu"
                className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Kartu</span>
              </button>
            </div>
          </div>
        </div>

        {/* FITUR FILTER & PENCARIAN INTERAKTIF */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Kolom Input Pencarian Instan */}
            <div className="md:col-span-7">
              <label
                htmlFor={`search-${jenisDokumen}`}
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Pencarian Instan Desa / Kelurahan atau Nomor {isPerbup ? 'Perbup' : 'Berita Acara'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id={`search-${jenisDokumen}`}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isPerbup
                      ? 'Ketik nama Desa (mis. Trimulya, Mokaleleo) atau nomor Perbup...'
                      : 'Ketik nama Desa (mis. Tetehaka, Amberi) atau nomor BA...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 focus:bg-white rounded-lg border border-stone-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>
            </div>

            {/* 2. Dropdown Filter Kecamatan */}
            <div className="md:col-span-5">
              <label
                htmlFor={`kecamatan-${jenisDokumen}`}
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Filter Kecamatan
              </label>
              <select
                id={`kecamatan-${jenisDokumen}`}
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 focus:bg-white rounded-lg border border-stone-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors cursor-pointer"
              >
                <option value="ALL">Semua Kecamatan</option>
                {kecamatanOptions.map((kec) => (
                  <option key={kec} value={kec}>
                    Kecamatan {kec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Tombol Filter Tab Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs font-semibold text-slate-700">
              Filter Kategori Status Dokumen:
            </span>
            <div
              className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200"
              role="tablist"
              aria-label="Filter Status Dokumen"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedStatus === 'ALL'}
                onClick={() => setSelectedStatus('ALL')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedStatus === 'ALL'
                    ? 'bg-emerald-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({counts.all})
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedStatus === 'Final'}
                onClick={() => setSelectedStatus('Final')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedStatus === 'Final'
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isPerbup
                  ? `Peraturan Bupati (Final) (${counts.final})`
                  : `Berita Acara (FINAL) (${counts.final})`}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedStatus === 'Draft'}
                onClick={() => setSelectedStatus('Draft')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedStatus === 'Draft'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isPerbup
                  ? `Draf Perbup (On-Going) (${counts.draft})`
                  : `Berita Acara (Dalam Proses) (${counts.draft})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KOTAK PERINGATAN (ALERT BANNER) KHUSUS SAAT TAB DRAF / DALAM PROSES DIPILIH */}
      {selectedStatus === 'Draft' && (
        <div
          role="alert"
          data-testid={`draft-alert-${jenisDokumen}`}
          className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950"
        >
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            {isPerbup ? (
              <p>
                <strong className="font-bold">Catatan:</strong> Dokumen draf masih dalam tahap penyusunan, revisi, atau evaluasi provinsi. Belum sah dan tidak dapat dijadikan acuan hukum tetap.
              </p>
            ) : (
              <p>
                <strong className="font-bold">Keterangan Status Dalam Proses:</strong> Draf Berita Acara yang masih dalam tahap mediasi, koreksi titik koordinat, atau menunggu kelengkapan tanda tangan pihak terkait.
              </p>
            )}
          </div>
        </div>
      )}

      {/* DAFTAR DOKUMEN (TABEL MODERN ATAU GRID KARTU) */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-xl mx-auto my-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Dokumen Tidak Ditemukan
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tidak ada {isPerbup ? 'Produk Hukum (Perbup)' : 'Berita Acara'} yang cocok dengan filter pencarian Anda.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              + Tambah Dokumen Baru
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Menampilkan <strong className="font-mono tabular-nums text-slate-900">{filteredDocs.length}</strong> dokumen {isPerbup ? 'Produk Hukum' : 'Berita Acara'}
            </span>
            <span className="font-mono">Klik baris atau tombol untuk rincian & unduh</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-5 whitespace-nowrap">Nama Desa / Kelurahan</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">Kecamatan</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">Kategori Status</th>
                  <th className="py-3.5 px-5 whitespace-nowrap">Nomor / Tahun Dokumen</th>
                  <th className="py-3.5 px-5 text-right whitespace-nowrap">Unduh / Buka Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm">
                {filteredDocs.map((doc) => {
                  const isFinal = doc.status === 'Final';
                  const statusLabel = isPerbup
                    ? isFinal
                      ? 'Peraturan Bupati (Final)'
                      : 'Draf Perbup (On-Going)'
                    : isFinal
                    ? 'Berita Acara (FINAL)'
                    : 'Berita Acara (Dalam Proses)';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-stone-50/90 transition-colors"
                    >
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{doc.namaDesa}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                          {doc.id} · {doc.tanggalUpdate}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-700 font-medium whitespace-nowrap">
                        Kecamatan {doc.kecamatan}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${
                            isFinal ? 'text-emerald-800' : 'text-amber-800'
                          }`}
                        >
                          {isFinal ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span>{statusLabel}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-mono text-xs font-medium text-slate-800 tabular-nums">
                          {doc.nomorDokumen}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-md">
                          {doc.keterangan}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectDocument(doc)}
                            className="px-3 py-2 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Detail
                          </button>
                          <a
                            href={doc.linkDrive}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Unduh / Buka Dokumen</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const isFinal = doc.status === 'Final';
            const statusLabel = isPerbup
              ? isFinal
                ? 'Peraturan Bupati (Final)'
                : 'Draf Perbup (On-Going)'
              : isFinal
              ? 'Berita Acara (FINAL)'
              : 'Berita Acara (Dalam Proses)';

            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <span>Kecamatan {doc.kecamatan}</span>
                    <span className="font-mono tabular-nums">{doc.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{doc.namaDesa}</h3>

                  <p className="font-mono text-xs text-slate-700 mt-1 tabular-nums">
                    {doc.nomorDokumen}
                  </p>

                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isFinal ? 'text-emerald-800' : 'text-amber-800'
                    }`}
                  >
                    {isFinal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>{statusLabel}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {doc.keterangan}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectDocument(doc)}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Rincian Koordinat
                  </button>
                  <a
                    href={doc.linkDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Unduh / Buka Dokumen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

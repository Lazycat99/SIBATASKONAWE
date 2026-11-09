import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Download,
  FileCode2,
  MapPin,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DokumenBatas,
  NewDocumentInput,
  ProgresBatasLuar,
  ProgresBatasDalam,
  WilayahKonawe,
  formatNamaKecamatan
} from '../data/boundaryData';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (input: NewDocumentInput) => void;
  kecamatanSuggestions: string[];
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
  kecamatanSuggestions
}) => {
  const [namaDesa, setNamaDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('Padangguni');
  const [jenisDokumen, setJenisDokumen] = useState<'Perbup' | 'BA'>('Perbup');
  const [status, setStatus] = useState<'Final' | 'Draft'>('Final');
  const [nomorDokumen, setNomorDokumen] = useState('');
  const [linkDrive, setLinkDrive] = useState('https://drive.google.com/drive/folders/');
  const [koordinatUtama, setKoordinatUtama] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Kosongkan kembali kolom sandi setiap kali modal ditutup agar aman
  useEffect(() => {
    if (!isOpen) {
      setAuthPassword('');
      setAuthError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setAuthPassword('');
    setAuthError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authPassword === 'KONAWE2026') {
      const payload: NewDocumentInput = {
        namaDesa: namaDesa.trim() || 'Desa Konawe Baru',
        kecamatan: kecamatan.trim() || 'Padangguni',
        jenisDokumen,
        status,
        nomorDokumen: nomorDokumen.trim() || 'Perbup Konawe Nomor 01 Tahun 2026',
        linkDrive: linkDrive.trim(),
        koordinatUtama,
        keterangan,
        sandiOtorisasi: authPassword
      };

      onAddDocument(payload);
      setNamaDesa('');
      setNomorDokumen('');
      setKoordinatUtama('');
      setKeterangan('');
      setAuthPassword('');
      setAuthError(null);
      onClose();
    } else {
      setAuthError('Akses Ditolak: Sandi Otorisasi Tidak Valid.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-title"
    >
      <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 id="modal-add-title" className="text-lg font-bold text-slate-900">
              Tambah Baris Data Dokumen Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menambahkan rekaman baru ke dalam pangkalan data wilayah Kabupaten Konawe
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            aria-label="Tutup dialog tambah dokumen"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-nama-desa" className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Desa / Kelurahan *
              </label>
              <input
                id="input-nama-desa"
                type="text"
                value={namaDesa}
                onChange={(e) => setNamaDesa(e.target.value)}
                placeholder="Contoh: Desa Trimulya"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="input-kecamatan" className="block text-xs font-semibold text-slate-700 mb-1">
                Kecamatan *
              </label>
              <input
                id="input-kecamatan"
                list="kecamatan-list"
                type="text"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                placeholder="Contoh: Padangguni"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700"
              />
              <datalist id="kecamatan-list">
                {kecamatanSuggestions.map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-jenis" className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Dokumen *
              </label>
              <select
                id="input-jenis"
                value={jenisDokumen}
                onChange={(e) => setJenisDokumen(e.target.value as 'Perbup' | 'BA')}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700"
              >
                <option value="Perbup">Produk Hukum (Perbup)</option>
                <option value="BA">Berita Acara (BA)</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-status" className="block text-xs font-semibold text-slate-700 mb-1">
                Status Dokumen *
              </label>
              <select
                id="input-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Final' | 'Draft')}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700"
              >
                <option value="Final">Final (Sah / Selesai)</option>
                <option value="Draft">Draft (On-Going / Dalam Proses)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-nomor" className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor / Tahun Dokumen *
            </label>
            <input
              id="input-nomor"
              type="text"
              value={nomorDokumen}
              onChange={(e) => setNomorDokumen(e.target.value)}
              placeholder="Contoh: Perbup Konawe Nomor 19 Tahun 2024"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="input-drive" className="block text-xs font-semibold text-slate-700 mb-1">
              Tautan URL Google Drive *
            </label>
            <input
              id="input-drive"
              type="url"
              value={linkDrive}
              onChange={(e) => setLinkDrive(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="input-koordinat" className="block text-xs font-semibold text-slate-700 mb-1">
              Titik Koordinat / Pilar Utama (Opsional)
            </label>
            <input
              id="input-koordinat"
              type="text"
              value={koordinatUtama}
              onChange={(e) => setKoordinatUtama(e.target.value)}
              placeholder='Contoh: 03°52&apos;14.2" LS - 122°04&apos;31.8" BT'
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="input-keterangan" className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan Ringkas (Opsional)
            </label>
            <textarea
              id="input-keterangan"
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Ringkasan cakupan segmen batas atau tahapan evaluasi..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* PROTEKSI KEAMANAN KRITIS: INPUT WAJIB SANDI OTORISASI DI BAGIAN PALING BAWAH */}
          <div className="pt-2 border-t border-stone-200">
            <label
              htmlFor="input-sandi-otorisasi"
              className="block text-xs font-bold text-slate-800 mb-1"
            >
              Sandi Otorisasi *
            </label>
            <input
              id="input-sandi-otorisasi"
              data-testid="input-sandi-otorisasi"
              type="password"
              value={authPassword}
              onChange={(e) => {
                setAuthPassword(e.target.value);
                if (authError) setAuthError(null);
              }}
              placeholder="Masukkan Sandi Otorisasi resmi petugas..."
              className={`w-full px-3.5 py-2 rounded-lg border text-sm font-mono focus:outline-none ${
                authError
                  ? 'border-red-500 bg-red-50/40 focus:border-red-600'
                  : 'border-stone-300 focus:border-emerald-700'
              }`}
            />
            {authError && (
              <p
                role="alert"
                data-testid="auth-password-error"
                className="text-xs font-semibold text-red-600 mt-1.5"
              >
                {authError}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              data-testid="btn-cancel-document"
              onClick={handleCloseModal}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="btn-submit-document"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              Simpan ke Basis Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DocumentDetailModalProps {
  wilayah?: WilayahKonawe | null;
  doc: DokumenBatas | null;
  progresLuar: ProgresBatasLuar | null;
  progresDalam: ProgresBatasDalam | null;
  onClose: () => void;
  onOpenWebGis: (segmentName: string) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  wilayah,
  doc,
  progresLuar,
  progresDalam,
  onClose,
  onOpenWebGis
}) => {
  if (!wilayah && !doc && !progresLuar && !progresDalam) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detail-title"
    >
      <div className="bg-white rounded-2xl border border-stone-200 max-w-xl w-full p-6 sm:p-7 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <p className="text-xs font-mono text-emerald-800 font-semibold">
              {wilayah
                ? `ENTITAS WILAYAH DEFINITIF · ${wilayah.kode}`
                : doc
                ? `ARSIP DOKUMEN · ${doc.id}`
                : progresLuar
                ? `SEGMEN BATAS LUAR DAERAH · ${progresLuar.id}`
                : `SEGMEN BATAS DALAM DAERAH · ${progresDalam?.id}`}
            </p>
            <h2 id="modal-detail-title" className="text-xl font-bold text-slate-900 mt-1">
              {wilayah
                ? `${wilayah.status} ${wilayah.nama_wilayah}, Kec. ${formatNamaKecamatan(wilayah.kecamatan)}`
                : doc
                ? `${doc.namaDesa}, Kec. ${doc.kecamatan}`
                : progresLuar
                ? progresLuar.segmen
                : progresDalam?.segmen}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup rincian dokumen"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {wilayah && (
          <div className="mt-5 space-y-4 text-sm">
            <dl className="divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Kode Wilayah Kemendagri</dt>
                <dd className="font-mono text-xs font-bold text-slate-900">{wilayah.kode}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Status Wilayah</dt>
                <dd className="font-semibold text-emerald-800">{wilayah.status}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Kecamatan</dt>
                <dd className="font-semibold text-slate-900">
                  Kecamatan {formatNamaKecamatan(wilayah.kecamatan)}
                </dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dasar Hukum Pembentukan (UU / PP / Perda)
              </p>
              <p className="text-slate-700 mt-1 leading-relaxed">
                {wilayah.keterangan_pembentukan.trim() || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Keterangan Tapal Batas (Perbup / Berita Acara)
              </p>
              <p className="text-slate-700 mt-1 leading-relaxed">
                {wilayah.keterangan_batas.trim() || '—'}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWebGis(
                    `${wilayah.status} ${wilayah.nama_wilayah}, Kecamatan ${formatNamaKecamatan(
                      wilayah.kecamatan
                    )}`
                  );
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat di Peta WebGIS</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {Array.isArray(wilayah.link_pembentukan) &&
                  wilayah.link_pembentukan.map((url, idx) => (
                    <a
                      key={`${wilayah.kode}-modal-perda-${idx}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>
                        Buka UU/Perda
                        {wilayah.link_pembentukan.length > 1 ? ` #${idx + 1}` : ''}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}

                {wilayah.link_batas.trim().length > 0 ? (
                  <a
                    href={wilayah.link_batas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Unduh / Buka Dokumen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 text-xs font-semibold text-slate-500 bg-stone-200 border border-stone-300 rounded-lg cursor-not-allowed whitespace-nowrap"
                  >
                    Dokumen Belum Tersedia
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {doc && (
          <div className="mt-5 space-y-4 text-sm">
            <dl className="divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Kategori Dokumen</dt>
                <dd className="font-semibold text-slate-900">
                  {doc.jenisDokumen === 'Perbup' ? 'Produk Hukum (Peraturan Bupati)' : 'Berita Acara Kesepakatan (BA)'}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Status Penetapan</dt>
                <dd
                  className={`font-semibold inline-flex items-center gap-1.5 ${
                    doc.status === 'Final' ? 'text-emerald-800' : 'text-amber-800'
                  }`}
                >
                  {doc.status === 'Final' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    {doc.status === 'Final' ? 'Final / Berlaku Definitif' : 'Draft / Dalam Proses Evaluasi'}
                  </span>
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Nomor / Tahun</dt>
                <dd className="font-mono text-xs font-semibold text-slate-900">{doc.nomorDokumen}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Identitas Wilayah</dt>
                <dd className="font-mono text-xs text-slate-800">{doc.koordinatUtama}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Tanggal Pembaruan</dt>
                <dd className="text-slate-800">{doc.tanggalUpdate}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ringkasan Teknis
              </p>
              <p className="text-slate-700 mt-1 leading-relaxed">{doc.keterangan}</p>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWebGis(`${doc.namaDesa}, Kecamatan ${doc.kecamatan}`);
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat di Peta WebGIS</span>
              </button>

              {doc.linkDrive && doc.linkDrive.trim().length > 0 ? (
                <a
                  href={doc.linkDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Unduh / Buka Dokumen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-stone-200 border border-stone-300 rounded-lg cursor-not-allowed whitespace-nowrap"
                >
                  Dokumen Belum Tersedia
                </button>
              )}
            </div>
          </div>
        )}

        {progresLuar && (
          <div className="mt-5 space-y-4 text-sm">
            <dl className="divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Persentase Capaian</dt>
                <dd className="font-mono font-bold text-emerald-800">{progresLuar.persentase}%</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Wilayah Bersinggungan</dt>
                <dd className="text-slate-800 text-right">{progresLuar.wilayahBersinggungan}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Jumlah Pilar & Titik</dt>
                <dd className="font-mono text-xs text-slate-900">{progresLuar.jumlahPilar}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Target Penyelesaian</dt>
                <dd className="font-mono text-xs text-slate-800">{progresLuar.targetSelesai}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tahapan Pelaksanaan Saat Ini
              </p>
              <p className="text-slate-800 font-semibold mt-1">{progresLuar.tahapanSaatIni}</p>
              <p className="text-slate-600 mt-1 leading-relaxed">{progresLuar.deskripsiTahapan}</p>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWebGis(progresLuar.fokusPeta);
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Peta Kegiatan</span>
              </button>

              <a
                href={progresLuar.linkDokumen}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Buka Berkas di Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {progresDalam && (
          <div className="mt-5 space-y-4 text-sm">
            <dl className="divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Kecamatan</dt>
                <dd className="font-semibold text-slate-900">Kecamatan {progresDalam.kecamatan}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Persentase Capaian</dt>
                <dd className="font-mono font-bold text-amber-700">{progresDalam.persentase}%</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Cakupan Desa / Kelurahan</dt>
                <dd className="text-slate-800 text-right">{progresDalam.cakupanDesa}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Jumlah Titik Kartometrik</dt>
                <dd className="font-mono text-xs text-slate-900">{progresDalam.jumlahTitik}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tahapan Pelaksanaan Saat Ini
              </p>
              <p className="text-slate-700 mt-1 leading-relaxed">{progresDalam.tahapanSaatIni}</p>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWebGis(progresDalam.fokusPeta);
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Peta Kegiatan</span>
              </button>

              <a
                href={progresDalam.linkDokumen}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Buka Berkas di Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface VercelCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataJsCode: string;
  indexHtmlCode: string;
}

export const VercelCodeModal: React.FC<VercelCodeModalProps> = ({
  isOpen,
  onClose,
  dataJsCode,
  indexHtmlCode
}) => {
  const [selectedFile, setSelectedFile] = useState<'data.js' | 'index.html'>('data.js');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeCode = selectedFile === 'data.js' ? dataJsCode : indexHtmlCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-vercel-title"
    >
      <div className="bg-white rounded-2xl border border-stone-200 max-w-4xl w-full p-6 shadow-xl flex flex-col max-h-[88vh]">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 font-semibold">
              <FileCode2 className="w-4 h-4" />
              <span>PAKET DEPLOYMENT VERCEL (2 FILE MANDIRI)</span>
            </div>
            <h2 id="modal-vercel-title" className="text-lg font-bold text-slate-900 mt-1">
              Kode Lengkap <code className="font-mono">data.js</code> & <code className="font-mono">index.html</code> Siap Deploy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal kode Vercel"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setSelectedFile('data.js')}
              className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                selectedFile === 'data.js'
                  ? 'bg-emerald-950 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. File data.js
            </button>
            <button
              type="button"
              onClick={() => setSelectedFile('index.html')}
              className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                selectedFile === 'index.html'
                  ? 'bg-emerald-950 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. File index.html (SPA Mandiri)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Berhasil Disalin' : `Salin Kode ${selectedFile}`}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload(selectedFile, activeCode)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh {selectedFile}</span>
            </button>
          </div>
        </div>

        <pre className="mt-4 flex-1 overflow-auto bg-slate-950 text-emerald-100 rounded-xl p-4 text-xs font-mono leading-relaxed border border-slate-800">
          <code>{activeCode}</code>
        </pre>
      </div>
    </div>
  );
};

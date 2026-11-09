/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { MapPin, Mail, Instagram, Download, Users, Server, CheckCircle2, X } from 'lucide-react';
import {
  wilayahDataKonawe,
  INITIAL_PROGRES_LUAR,
  WilayahKonawe,
  DokumenBatas,
  ProgresBatasLuar,
  ProgresBatasDalam,
  NewDocumentInput,
  buildDokumenFromWilayah,
  buildProgresDalamFromWilayah,
  calculateDashboardStats,
  getUniqueKecamatan
} from './data/boundaryData';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DocumentCatalogView } from './components/DocumentCatalogView';
import { ProgressView } from './components/ProgressView';
import { WebGisView } from './components/WebGisView';
import {
  AddDocumentModal,
  DocumentDetailModal
} from './components/Modals';

export default function App() {
  const initialUrlDesa = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const desaParam = params.get('desa');
    return desaParam && desaParam.trim().length > 0 ? desaParam.trim() : null;
  }, []);

  const [activeTab, setActiveTab] = useState<NavTab>(() =>
    initialUrlDesa ? 'webgis' : 'beranda'
  );
  const [wilayahList, setWilayahList] = useState<WilayahKonawe[]>(wilayahDataKonawe);
  const [progresLuar] = useState<ProgresBatasLuar[]>(INITIAL_PROGRES_LUAR);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedWilayah, setSelectedWilayah] = useState<WilayahKonawe | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DokumenBatas | null>(null);
  const [selectedProgresLuar, setSelectedProgresLuar] = useState<ProgresBatasLuar | null>(null);
  const [selectedProgresDalam, setSelectedProgresDalam] = useState<ProgresBatasDalam | null>(null);
  const [activeMapSegment, setActiveMapSegment] = useState<string | null>(initialUrlDesa);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const dokumenList = useMemo(() => buildDokumenFromWilayah(wilayahList), [wilayahList]);
  const progresDalam = useMemo(() => buildProgresDalamFromWilayah(wilayahList), [wilayahList]);
  const stats = useMemo(
    () => calculateDashboardStats(wilayahList, dokumenList),
    [wilayahList, dokumenList]
  );
  const kecamatanSuggestions = useMemo(() => getUniqueKecamatan(wilayahList), [wilayahList]);

  const handleAddDocument = (input: NewDocumentInput) => {
    const rawName = input.namaDesa.trim();
    const isKelurahan =
      input.statusWilayah === 'Kelurahan' || /^kelurahan\b/i.test(rawName);
    const cleanName = rawName.replace(/^(desa|kelurahan)\s+/i, '').trim();
    const cleanKec = input.kecamatan.replace(/^kecamatan\s+/i, '').trim();

    const nextSeq = String(wilayahList.length + 1).padStart(4, '0');
    const newWilayah: WilayahKonawe = {
      kode: input.kode?.trim() || `74.02.99.${isKelurahan ? '1' : '2'}${nextSeq.slice(1)}`,
      kecamatan: `Kecamatan ${cleanKec}`,
      nama_wilayah: cleanName,
      status: isKelurahan ? 'Kelurahan' : 'Desa',
      keterangan_pembentukan: input.keterangan?.trim() || '',
      link_pembentukan: [],
      keterangan_batas:
        input.status === 'Draft'
          ? `Tahap Penyusunan Draf ${input.nomorDokumen.trim()}`
          : input.nomorDokumen.trim(),
      link_batas: input.linkDrive.trim()
    };

    setWilayahList((prev) => [newWilayah, ...prev]);
    setToastMessage('Data berhasil ditambahkan.');
  };

  const handleOpenMapWithSegment = (fokusPeta: string) => {
    setActiveMapSegment(fokusPeta);
    setActiveTab('webgis');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('desa', fokusPeta);
      window.history.replaceState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearMapSegment = () => {
    setActiveMapSegment(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('desa');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleFooterNav = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900">
      {/* STICKY TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* NOTIFIKASI TOAST/ALERT HIJAU SAAT DATA BERHASIL DITAMBAHKAN */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          data-testid="toast-notification"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3.5 rounded-xl shadow-lg flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup notifikasi"
            className="ml-2 p-1 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN SPA CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'beranda' && (
          <HomeView
            stats={stats}
            wilayahList={wilayahList}
            recentDocs={dokumenList}
            onNavigate={setActiveTab}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onSelectWilayah={(item) => setSelectedWilayah(item)}
          />
        )}

        {activeTab === 'produk-hukum' && (
          <DocumentCatalogView
            key="produk-hukum"
            jenisDokumen="Perbup"
            wilayahList={wilayahList}
            dokumenList={dokumenList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onSelectWilayah={(item) => setSelectedWilayah(item)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'berita-acara' && (
          <DocumentCatalogView
            key="berita-acara"
            jenisDokumen="BA"
            wilayahList={wilayahList}
            dokumenList={dokumenList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onSelectWilayah={(item) => setSelectedWilayah(item)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'progres' && (
          <ProgressView
            progresLuar={progresLuar}
            progresDalam={progresDalam}
            onOpenMapWithSegment={handleOpenMapWithSegment}
            onSelectProgressLuar={(item) => setSelectedProgresLuar(item)}
            onSelectProgressDalam={(item) => setSelectedProgresDalam(item)}
          />
        )}

        {activeTab === 'webgis' && (
          <WebGisView
            activeMapSegment={activeMapSegment}
            onClearMapSegment={handleClearMapSegment}
          />
        )}
      </main>

      {/* BLOK 1: LIVE ANALITIK PORTAL */}
      <section
        aria-label="Live Analitik Portal"
        data-testid="live-analytics-section"
        className="bg-gradient-to-b from-white to-slate-100 border-t border-slate-200/80 py-10 mt-12"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-slate-200">
            {/* Indikator 1: Status Server */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                <Server className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Status Server</span>
              </div>
              <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-base font-extrabold tracking-widest text-emerald-800 font-mono">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Sinkronisasi Pangkalan Data Cloud Aktif
              </p>
            </div>

            {/* Indikator 2: Total Unduhan Dokumen */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <Download className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Total Unduhan Dokumen</span>
              </div>
              <div
                className="inline-flex items-center gap-1 bg-slate-900 text-white px-3.5 py-1.5 rounded-lg shadow-inner border border-slate-700 font-mono text-2xl sm:text-3xl font-black tracking-widest tabular-nums"
                aria-label="1.482 unduhan dokumen"
              >
                <span>0</span>
                <span>1</span>
                <span className="text-emerald-400">.</span>
                <span>4</span>
                <span>8</span>
                <span>2</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Arsip Perbup &amp; Berita Acara Diunduh
              </p>
            </div>

            {/* Indikator 3: Pengunjung Aktif */}
            <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <Users className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                <span>Pengunjung Aktif</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                  28
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Sesi Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Akses Publik &amp; Aparatur Desa/Kecamatan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOK 2: MEGA FOOTER RESMI PEMERINTAHAN */}
      <footer
        data-testid="mega-footer"
        className="bg-emerald-950 text-white border-t border-emerald-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {/* Kolom Kiri: Identitas Pemerintah Kabupaten Konawe */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/Lambang_Kabupaten_Konawe.png"
                  alt="Lambang Kabupaten Konawe"
                  className="h-14 w-auto object-contain shrink-0"
                />
                <div>
                  <p className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-snug">
                    PEMERINTAH KABUPATEN KONAWE
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mt-0.5">
                    Sultra, Indonesia
                  </p>
                </div>
              </div>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                SI-BATAS mewujudkan visi integrasi satu data tapal batas wilayah administrasi kecamatan, desa, dan kelurahan secara transparan, akuntabel, dan berbasis geospasial guna mendukung kepastian hukum tata pemerintahan di Kabupaten Konawe.
              </p>
            </div>

            {/* Kolom Tengah: Tautan Cepat */}
            <div className="md:pl-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-4">
                Tautan Cepat
              </h2>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => handleFooterNav('beranda')}
                    className="text-emerald-100 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                  >
                    Beranda
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleFooterNav('webgis')}
                    className="text-emerald-100 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                  >
                    WebGIS
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleFooterNav('produk-hukum')}
                    className="text-emerald-100 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                  >
                    Produk Hukum
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleFooterNav('berita-acara')}
                    className="text-emerald-100 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                  >
                    Regulasi Batas
                  </button>
                </li>
              </ul>
            </div>

            {/* Kolom Kanan: Hubungi Kami */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-4">
                Hubungi Kami
              </h2>
              <ul className="space-y-3.5 text-sm text-emerald-100/90">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">
                    Bagian Tata Pemerintahan Setda Kab. Konawe,
                    <br />
                    Jln. Inolobunggadue I, Kompleks Perkantoran Pemerintah Daerah Kabupaten Konawe,
                    <br />
                    Kel. Inolobunggadue, Kec. Unaaha, Sulawesi Tenggara.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:tapemkonawe@gmail.com"
                    className="hover:text-yellow-400 transition-colors duration-200"
                  >
                    tapemkonawe@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                  <a
                    href="https://instagram.com/tapem_kabkonawe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-400 transition-colors duration-200"
                  >
                    @tapem_kabkonawe
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Baris Paling Bawah */}
          <div className="border-t border-emerald-700/50 mt-10 pt-6 text-center">
            <p className="text-xs text-emerald-100/80">
              © 2026 Bagian Tata Pemerintahan Setda Kabupaten Konawe. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDocument={handleAddDocument}
        kecamatanSuggestions={kecamatanSuggestions}
      />

      <DocumentDetailModal
        wilayah={selectedWilayah}
        doc={selectedDoc}
        progresLuar={selectedProgresLuar}
        progresDalam={selectedProgresDalam}
        onClose={() => {
          setSelectedWilayah(null);
          setSelectedDoc(null);
          setSelectedProgresLuar(null);
          setSelectedProgresDalam(null);
        }}
        onOpenWebGis={handleOpenMapWithSegment}
      />
    </div>
  );
}

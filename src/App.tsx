/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
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
  getUniqueKecamatan,
  generateDataJsSource
} from './data/boundaryData';
import { generateStandaloneIndexHtml } from './data/standaloneTemplate';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DocumentCatalogView } from './components/DocumentCatalogView';
import { ProgressView } from './components/ProgressView';
import { WebGisView } from './components/WebGisView';
import {
  AddDocumentModal,
  DocumentDetailModal,
  VercelCodeModal
} from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [wilayahList, setWilayahList] = useState<WilayahKonawe[]>(wilayahDataKonawe);
  const [progresLuar] = useState<ProgresBatasLuar[]>(INITIAL_PROGRES_LUAR);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  const [selectedWilayah, setSelectedWilayah] = useState<WilayahKonawe | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DokumenBatas | null>(null);
  const [selectedProgresLuar, setSelectedProgresLuar] = useState<ProgresBatasLuar | null>(null);
  const [selectedProgresDalam, setSelectedProgresDalam] = useState<ProgresBatasDalam | null>(null);
  const [activeMapSegment, setActiveMapSegment] = useState<string | null>(null);

  const dokumenList = useMemo(() => buildDokumenFromWilayah(wilayahList), [wilayahList]);
  const progresDalam = useMemo(() => buildProgresDalamFromWilayah(wilayahList), [wilayahList]);
  const stats = useMemo(
    () => calculateDashboardStats(wilayahList, dokumenList),
    [wilayahList, dokumenList]
  );
  const kecamatanSuggestions = useMemo(() => getUniqueKecamatan(wilayahList), [wilayahList]);

  const dataJsCode = useMemo(
    () => generateDataJsSource(wilayahList, progresLuar, progresDalam),
    [wilayahList, progresLuar, progresDalam]
  );
  const standaloneHtmlCode = useMemo(() => generateStandaloneIndexHtml(), []);

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
  };

  const handleOpenMapWithSegment = (fokusPeta: string) => {
    setActiveMapSegment(fokusPeta);
    setActiveTab('webgis');
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
            onOpenVercelCode={() => setIsVercelModalOpen(true)}
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
            onClearMapSegment={() => setActiveMapSegment(null)}
          />
        )}
      </main>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 text-sm">
              SI-BATAS KONAWE — Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe
            </p>
            <p>
              Kompleks Perkantoran Pemerintah Daerah Kabupaten Konawe, Kelurahan Tuoy, Kecamatan Unaaha, Provinsi Sulawesi Tenggara.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsVercelModalOpen(true)}
              className="text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer"
            >
              Unduh Paket Kode (data.js &amp; index.html)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('webgis')}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Peta Interaktif WebGIS
            </button>
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

      <VercelCodeModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
        dataJsCode={dataJsCode}
        indexHtmlCode={standaloneHtmlCode}
      />
    </div>
  );
}

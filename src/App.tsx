/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import {
  INITIAL_DOKUMEN_BATAS,
  INITIAL_PROGRES_LUAR,
  INITIAL_PROGRES_DALAM,
  DokumenBatas,
  ProgresBatasLuar,
  ProgresBatasDalam,
  NewDocumentInput,
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
  const [dokumenList, setDokumenList] = useState<DokumenBatas[]>(INITIAL_DOKUMEN_BATAS);
  const [progresLuar] = useState<ProgresBatasLuar[]>(INITIAL_PROGRES_LUAR);
  const [progresDalam] = useState<ProgresBatasDalam[]>(INITIAL_PROGRES_DALAM);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState<DokumenBatas | null>(null);
  const [selectedProgresLuar, setSelectedProgresLuar] = useState<ProgresBatasLuar | null>(null);
  const [selectedProgresDalam, setSelectedProgresDalam] = useState<ProgresBatasDalam | null>(null);
  const [activeMapSegment, setActiveMapSegment] = useState<string | null>(null);

  const stats = useMemo(() => calculateDashboardStats(dokumenList), [dokumenList]);
  const kecamatanSuggestions = useMemo(() => getUniqueKecamatan(dokumenList), [dokumenList]);

  const dataJsCode = useMemo(
    () => generateDataJsSource(dokumenList, progresLuar, progresDalam),
    [dokumenList, progresLuar, progresDalam]
  );
  const standaloneHtmlCode = useMemo(() => generateStandaloneIndexHtml(), []);

  const handleAddDocument = (input: NewDocumentInput) => {
    const nextNumber = dokumenList.length + 1;
    const formattedId = `DOK-${String(nextNumber).padStart(3, '0')}`;
    const newDoc: DokumenBatas = {
      id: formattedId,
      namaDesa: input.namaDesa.trim(),
      kecamatan: input.kecamatan.trim(),
      jenisDokumen: input.jenisDokumen,
      status: input.status,
      nomorDokumen: input.nomorDokumen.trim(),
      linkDrive: input.linkDrive.trim(),
      tanggalUpdate: 'Baru Ditambahkan',
      koordinatUtama:
        input.koordinatUtama && input.koordinatUtama.trim().length > 0
          ? input.koordinatUtama.trim()
          : 'Titik Kartometrik Terdata di Peta Kerja',
      keterangan:
        input.keterangan && input.keterangan.trim().length > 0
          ? input.keterangan.trim()
          : `Arsip ${input.jenisDokumen} wilayah ${input.namaDesa.trim()} Kecamatan ${input.kecamatan.trim()}.`
    };

    setDokumenList((prev) => [newDoc, ...prev]);
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
            recentDocs={dokumenList}
            onNavigate={setActiveTab}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onOpenVercelCode={() => setIsVercelModalOpen(true)}
          />
        )}

        {activeTab === 'produk-hukum' && (
          <DocumentCatalogView
            key="produk-hukum"
            jenisDokumen="Perbup"
            dokumenList={dokumenList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'berita-acara' && (
          <DocumentCatalogView
            key="berita-acara"
            jenisDokumen="BA"
            dokumenList={dokumenList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
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
              Unduh Paket Kode (data.js & index.html)
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
        doc={selectedDoc}
        progresLuar={selectedProgresLuar}
        progresDalam={selectedProgresDalam}
        onClose={() => {
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

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type NavTab = 'beranda' | 'produk-hukum' | 'berita-acara' | 'progres' | 'webgis';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'produk-hukum', label: 'Produk Hukum' },
  { id: 'berita-acara', label: 'Berita Acara' },
  { id: 'progres', label: 'Progres Kegiatan' },
  { id: 'webgis', label: 'WebGIS' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-800 border-b border-slate-200 shadow-sm">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/Lambang_Kabupaten_Konawe.png" alt="Pemkab Konawe" className="h-10 w-auto object-contain" />
          <div className="h-8 w-px bg-emerald-700/50 mx-2"></div>
          <img src="/Logo_SIBATAS_Murni.png" alt="SI-BATAS Konawe" className="h-10 w-auto object-contain" />
        </div>

        {/* Zone 2: 5 concise single-line nav links — rigid, fast, zero entrance animation */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-slate-800"
          aria-label="Navigasi Utama"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`h-16 inline-flex items-center border-b-2 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-emerald-700 ${
                  isActive
                    ? 'border-emerald-700 text-slate-800 font-semibold'
                    : 'border-transparent text-slate-800 hover:text-emerald-700 hover:border-emerald-600/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (+ mobile menu trigger on small screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            + Tambah Data
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-md text-slate-800 hover:text-emerald-700 hover:bg-slate-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navigasi Seluler"
          className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 text-slate-800"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-slate-800 font-semibold border-l-2 border-emerald-700'
                    : 'text-slate-800 hover:bg-slate-100 hover:text-emerald-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

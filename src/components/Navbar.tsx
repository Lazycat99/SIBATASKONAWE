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
    <header className="sticky top-0 z-40 bg-emerald-950 text-white border-b border-emerald-900 shadow-sm">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Dual Official Logos side-by-side */}
        <div className="flex items-center gap-3">
          <img src="/Lambang_Kabupaten_Konawe.png" alt="Pemkab Konawe" className="h-10 w-auto" />
          <div className="h-8 w-px bg-emerald-700/50"></div>
          <img src="/Logo_SIBATAS_Murni.png" alt="SI-BATAS Konawe" className="h-10 w-auto" />
        </div>

        {/* Zone 2: 5 concise single-line nav links — rigid, fast, zero entrance animation */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide"
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
                className={`h-16 inline-flex items-center border-b-2 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-yellow-400 ${
                  isActive
                    ? 'border-yellow-400 text-yellow-400 font-semibold'
                    : 'border-transparent text-slate-100 hover:text-yellow-400 hover:border-yellow-400/50'
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
            className="px-4 py-2 text-xs font-semibold text-emerald-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
          >
            + Tambah Data
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-md text-slate-100 hover:text-yellow-400 hover:bg-emerald-900 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navigasi Seluler"
          className="md:hidden bg-emerald-950 border-t border-emerald-900 px-4 pt-2 pb-4 space-y-1"
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
                    ? 'bg-emerald-900/90 text-yellow-400 font-semibold border-l-2 border-yellow-400'
                    : 'text-slate-100 hover:bg-emerald-900/60 hover:text-yellow-400'
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

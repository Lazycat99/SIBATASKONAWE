/**
 * Menghasilkan kode utuh `index.html` mandiri (mencakup HTML5, Tailwind CSS via CDN,
 * Lucide Icons via CDN, dan logika JavaScript SPA & Filter Pencarian yang membaca `data.js`)
 * siap di-deploy langsung ke Vercel bersama file `data.js`.
 */
export function generateStandaloneIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SI-BATAS KONAWE — Sistem Informasi Tapal Batas Wilayah Berbasis Cloud</title>
  <meta name="description" content="Sistem Informasi Tapal Batas Wilayah Berbasis Cloud - Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="./data.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    };
  </script>
  <style>
    .tabular-nums { font-variant-numeric: tabular-nums; }
    .tab-section { display: none; }
    .tab-section.active { display: block; }
  </style>
</head>
<body class="bg-stone-50 text-slate-900 font-sans antialiased selection:bg-emerald-800 selection:text-white min-h-screen flex flex-col">

  <!-- STICKY NAVBAR (3-Zone Top Bar Contract) -->
  <header class="sticky top-0 z-40 bg-emerald-950 text-white border-b border-emerald-900/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
      <a href="#beranda" onclick="switchTab('beranda'); return false;" class="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
        SI-BATAS KONAWE
      </a>

      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-emerald-100/80" aria-label="Navigasi Utama">
        <button onclick="switchTab('beranda')" data-nav="beranda" class="nav-link py-1 border-b-2 border-amber-400 text-white whitespace-nowrap shrink-0 transition-colors">Beranda</button>
        <button onclick="switchTab('produk-hukum')" data-nav="produk-hukum" class="nav-link py-1 border-b-2 border-transparent hover:text-white whitespace-nowrap shrink-0 transition-colors">Produk Hukum</button>
        <button onclick="switchTab('berita-acara')" data-nav="berita-acara" class="nav-link py-1 border-b-2 border-transparent hover:text-white whitespace-nowrap shrink-0 transition-colors">Berita Acara</button>
        <button onclick="switchTab('progres')" data-nav="progres" class="nav-link py-1 border-b-2 border-transparent hover:text-white whitespace-nowrap shrink-0 transition-colors">Progres Kegiatan</button>
        <button onclick="switchTab('webgis')" data-nav="webgis" class="nav-link py-1 border-b-2 border-transparent hover:text-white whitespace-nowrap shrink-0 transition-colors">WebGIS</button>
      </nav>

      <div class="flex items-center gap-3 shrink-0">
        <button onclick="switchTab('webgis')" class="px-4 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0">
          Buka Peta WebGIS
        </button>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- A. BERANDA -->
    <section id="tab-beranda" class="tab-section active space-y-10">
      <div class="bg-emerald-950 text-white rounded-2xl p-8 lg:p-12 border border-emerald-900">
        <p class="text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">Pemerintah Kabupaten Konawe · Provinsi Sulawesi Tenggara</p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">SI-BATAS KONAWE</h1>
        <p class="text-base sm:text-lg text-emerald-100/90 max-w-3xl leading-relaxed mb-8">
          Sistem Informasi Tapal Batas Wilayah Berbasis Cloud - Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Konawe.
        </p>
        <div class="flex flex-wrap gap-3">
          <button onclick="switchTab('produk-hukum')" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-sm rounded-lg transition-colors">
            Telusuri Produk Hukum
          </button>
          <button onclick="switchTab('webgis')" class="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-medium text-sm rounded-lg border border-emerald-700 transition-colors">
            Eksplorasi Peta Interaktif
          </button>
        </div>
      </div>

      <!-- Counter Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-xl p-6 border border-stone-200">
          <p class="text-xs text-slate-500 font-medium">Total Kecamatan Terdata</p>
          <p id="stat-kecamatan" class="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">0</p>
          <p class="text-xs text-slate-500 mt-2">Wilayah Administrasi Kecamatan</p>
        </div>
        <div class="bg-white rounded-xl p-6 border border-stone-200">
          <p class="text-xs text-slate-500 font-medium">Total Desa / Kelurahan</p>
          <p id="stat-desa" class="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">0</p>
          <p class="text-xs text-slate-500 mt-2">Arsip Dokumen Batas Wilayah</p>
        </div>
        <div class="bg-white rounded-xl p-6 border border-stone-200">
          <p class="text-xs text-slate-500 font-medium">Peraturan Bupati (Final)</p>
          <p id="stat-perbup-final" class="text-3xl font-bold text-emerald-800 font-mono tabular-nums mt-2">0</p>
          <p class="text-xs text-slate-500 mt-2">Produk Hukum Definitif</p>
        </div>
        <div class="bg-white rounded-xl p-6 border border-stone-200">
          <p class="text-xs text-slate-500 font-medium">Berita Acara Selesai</p>
          <p id="stat-ba-final" class="text-3xl font-bold text-amber-700 font-mono tabular-nums mt-2">0</p>
          <p class="text-xs text-slate-500 mt-2">Kesepakatan Tapal Batas Final</p>
        </div>
      </div>

      <!-- Kolom Pencarian Wilayah di Beranda (Live Filtering) -->
      <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">PENCARIAN CEPAT PANGKALAN DATA WILAYAH</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Cari Desa, Kelurahan, atau Kecamatan</h2>
          <p class="text-sm text-slate-600 mt-2">Ketik nama Desa/Kelurahan atau Kecamatan untuk menampilkan kartu wilayah dan tombol unduh dokumennya secara dinamis.</p>
          <div class="mt-6">
            <input id="search-beranda" type="search" oninput="renderBerandaSearch()" placeholder="Ketik nama Desa / Kelurahan atau Kecamatan (contoh: Unaaha, Kasumewuho, Lambuya)..." class="w-full px-5 py-4 bg-stone-50 focus:bg-white rounded-xl border-2 border-stone-200 focus:border-emerald-800 text-base text-slate-900 focus:outline-none transition-colors" />
          </div>
        </div>
        <div id="beranda-search-container" class="hidden mt-8 pt-6 border-t border-stone-200">
          <div id="beranda-search-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div>
        <h2 class="text-xl font-bold text-slate-900 mb-4">Akses Cepat Layanan Informasi Batas</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button onclick="switchTab('produk-hukum')" class="text-left bg-white hover:bg-emerald-50/40 p-6 rounded-xl border border-stone-200 hover:border-emerald-700 transition-all group">
            <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-900">Produk Hukum</h3>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">Unduh Peraturan Bupati definitif dan pantau draf rancangan batas desa/kelurahan.</p>
          </button>
          <button onclick="switchTab('berita-acara')" class="text-left bg-white hover:bg-emerald-50/40 p-6 rounded-xl border border-stone-200 hover:border-emerald-700 transition-all group">
            <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-900">Berita Acara</h3>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">Arsip Berita Acara kesepakatan pelacakan tapal batas dan mediasi titik koordinat.</p>
          </button>
          <button onclick="switchTab('progres')" class="text-left bg-white hover:bg-emerald-50/40 p-6 rounded-xl border border-stone-200 hover:border-emerald-700 transition-all group">
            <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-900">Progres Kegiatan</h3>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">Pantauan persentase pelacakan batas luar daerah (antar-kabupaten/kota) dan dalam daerah.</p>
          </button>
          <button onclick="switchTab('webgis')" class="text-left bg-white hover:bg-emerald-50/40 p-6 rounded-xl border border-stone-200 hover:border-emerald-700 transition-all group">
            <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-900">Peta WebGIS</h3>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">Visualisasi spasial interaktif garis batas administrasi tingkat kecamatan dan desa.</p>
          </button>
        </div>
      </div>
    </section>

    <!-- B. PRODUK HUKUM -->
    <section id="tab-produk-hukum" class="tab-section space-y-6">
      <div class="bg-white rounded-xl p-6 border border-stone-200">
        <h1 class="text-2xl font-bold text-slate-900">PRODUK HUKUM - Dokumen Resmi dan Peraturan Bupati tentang Batas Wilayah Kabupaten Konawe</h1>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input id="search-perbup" type="text" oninput="renderPerbup()" placeholder="Cari nama Desa/Kelurahan atau nomor Perbup..." class="px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700" />
          <select id="kecamatan-perbup" onchange="renderPerbup()" class="px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700">
            <option value="ALL">Semua Kecamatan</option>
          </select>
          <div class="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button onclick="setPerbupStatus('ALL')" id="btn-perbup-ALL" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap">Semua</button>
            <button onclick="setPerbupStatus('Final')" id="btn-perbup-Final" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md text-slate-600 whitespace-nowrap">Peraturan Bupati (Final)</button>
            <button onclick="setPerbupStatus('Draft')" id="btn-perbup-Draft" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md text-slate-600 whitespace-nowrap">Draf Perbup (On-Going)</button>
          </div>
        </div>
      </div>

      <div id="alert-perbup-draft" class="hidden bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-amber-900">
        <strong>Catatan:</strong> Dokumen draf masih dalam tahap penyusunan, revisi, atau evaluasi provinsi. Belum sah dan tidak dapat dijadikan acuan hukum tetap.
      </div>

      <div class="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-slate-600">
              <th class="py-3.5 px-4">Nama Desa / Kelurahan</th>
              <th class="py-3.5 px-4">Kecamatan</th>
              <th class="py-3.5 px-4">Kategori Status</th>
              <th class="py-3.5 px-4">Nomor / Tahun Dokumen</th>
              <th class="py-3.5 px-4 text-right">Aksi Dokumen</th>
            </tr>
          </thead>
          <tbody id="tbody-perbup" class="divide-y divide-stone-200 text-sm"></tbody>
        </table>
      </div>
    </section>

    <!-- C. BERITA ACARA -->
    <section id="tab-berita-acara" class="tab-section space-y-6">
      <div class="bg-white rounded-xl p-6 border border-stone-200">
        <h1 class="text-2xl font-bold text-slate-900">BERITA ACARA - Arsip Kesepakatan dan Pelacakan Tapal Batas</h1>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input id="search-ba" type="text" oninput="renderBa()" placeholder="Cari nama Desa/Kelurahan atau nomor Berita Acara..." class="px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700" />
          <select id="kecamatan-ba" onchange="renderBa()" class="px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-emerald-700">
            <option value="ALL">Semua Kecamatan</option>
          </select>
          <div class="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button onclick="setBaStatus('ALL')" id="btn-ba-ALL" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap">Semua</button>
            <button onclick="setBaStatus('Final')" id="btn-ba-Final" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md text-slate-600 whitespace-nowrap">Berita Acara (FINAL)</button>
            <button onclick="setBaStatus('Draft')" id="btn-ba-Draft" class="flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-md text-slate-600 whitespace-nowrap">Berita Acara (Dalam Proses)</button>
          </div>
        </div>
      </div>

      <div id="alert-ba-draft" class="hidden bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-amber-900">
        Draf Berita Acara yang masih dalam tahap mediasi, koreksi titik koordinat, atau menunggu kelengkapan tanda tangan pihak terkait.
      </div>

      <div class="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-slate-600">
              <th class="py-3.5 px-4">Nama Desa / Kelurahan</th>
              <th class="py-3.5 px-4">Kecamatan</th>
              <th class="py-3.5 px-4">Kategori Status</th>
              <th class="py-3.5 px-4">Nomor / Tahun Dokumen</th>
              <th class="py-3.5 px-4 text-right">Aksi Dokumen</th>
            </tr>
          </thead>
          <tbody id="tbody-ba" class="divide-y divide-stone-200 text-sm"></tbody>
        </table>
      </div>
    </section>

    <!-- D. PROGRES KEGIATAN BATAS -->
    <section id="tab-progres" class="tab-section space-y-8">
      <div class="bg-white rounded-xl p-6 border border-stone-200">
        <h1 class="text-2xl font-bold text-slate-900">Progres Kegiatan Batas - Pantauan Aktual Pelaksanaan Pelacakan dan Penegasan Tapal Batas Wilayah Kabupaten Konawe</h1>
      </div>

      <div>
        <h2 class="text-lg font-bold text-slate-900 mb-4">1. Segmen Batas Luar Daerah (Antar-Kabupaten/Kota)</h2>
        <div id="grid-progres-luar" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>
      </div>

      <div>
        <h2 class="text-lg font-bold text-slate-900 mb-4">2. Segmen Batas Dalam Daerah (Antar-Kecamatan/Desa)</h2>
        <div id="grid-progres-dalam" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>
      </div>
    </section>

    <!-- E. WEBGIS / PETA INTERAKTIF -->
    <section id="tab-webgis" class="tab-section space-y-6">
      <div class="bg-white rounded-xl p-6 border border-stone-200">
        <h1 class="text-2xl font-bold text-slate-900">WebGIS / Peta Interaktif - Visualisasi Spasial Batas Administrasi Kabupaten Konawe</h1>
        <div class="mt-4 bg-stone-50 rounded-xl p-4 border border-stone-200 text-sm text-slate-700 space-y-1.5">
          <p class="font-semibold text-slate-900">Panduan Penggunaan Peta:</p>
          <p>• Gunakan dua jari (pada layar sentuh/HP) atau gulir/scroll mouse (pada PC) untuk memperbesar dan memperkecil peta.</p>
          <p>• Klik pada garis batas atau di dalam area wilayah untuk memunculkan kotak informasi detail (nama kecamatan atau desa terkait).</p>
        </div>
      </div>

      <div class="bg-white rounded-xl p-3 border border-stone-200 shadow-lg">
        <div class="rounded-xl overflow-hidden shadow-lg">
          <iframe src="https://www.google.com/maps/d/embed?mid=1DN2pY2ghIJTvecVBrDwlLl3ZscJxrf4&ehbc=2E312F" width="100%" height="550" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <p class="text-xs font-medium text-slate-600 mt-3 px-2">Map by : Ferry Rante Bawangi - Bagian Tata Pemerintahan Sekretariat Kab. Konawe</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="bg-white rounded-xl p-5 border border-stone-200 space-y-3">
          <h2 class="text-base font-bold text-slate-900">Legenda Peta</h2>
          <div class="flex items-center gap-3 text-sm text-slate-700">
            <span class="w-3.5 h-3.5 rounded-full bg-red-600 inline-block shrink-0"></span>
            <span>Garis Merah : Batas Administrasi Tingkat Kecamatan</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-700">
            <span class="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block shrink-0"></span>
            <span>Garis Biru : Batas Administrasi Tingkat Desa / Kelurahan</span>
          </div>
        </div>

        <div class="bg-amber-50 rounded-xl p-5 border border-amber-300 text-sm text-amber-950 leading-relaxed">
          <strong>CATATAN PENTING:</strong> Batas administrasi bagi desa-desa yang belum memiliki Peraturan Bupati (Perbup) definitif di dalam peta ini masih berstatus sebagai Batas Indikatif. Garis batas tersebut bersifat sementara dan dapat disesuaikan sewaktu-waktu berdasarkan hasil pelacakan tim lapangan serta kesepakatan batas final berikutnya.
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-white border-t border-stone-200 py-6 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
      <span>© Pemerintah Kabupaten Konawe · Bagian Tata Pemerintahan Sekretariat Daerah</span>
      <span>SI-BATAS KONAWE — Sistem Informasi Tapal Batas Wilayah Berbasis Cloud</span>
    </div>
  </footer>

  <script>
    let currentPerbupStatus = 'ALL';
    let currentBaStatus = 'ALL';

    function cleanKecamatan(raw) {
      return String(raw || '').replace(/^Kecamatan\\s+/i, '').trim();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-section').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initPortal() {
      const store = window.SI_BATAS_DATA || { wilayah: window.wilayahDataKonawe || [], progresLuar: [], progresDalam: [] };
      const wilayah = store.wilayah || window.wilayahDataKonawe || [];

      // Hitung Statistik Otomatis secara Dinamis dari wilayahDataKonawe (348 Desa/Kelurahan, 28 Kecamatan)
      const kecSet = new Set(wilayah.map(w => cleanKecamatan(w.kecamatan).toLowerCase()).filter(Boolean));
      const perbupFinal = wilayah.filter(w => {
        const ket = (w.keterangan_batas || '').trim().toLowerCase();
        return ket.length > 0 && !ket.includes('draf') && !ket.includes('tahap penyusunan') && !ket.startsWith('ba ') && !ket.includes('berita acara');
      }).length;
      const baFinal = wilayah.filter(w => {
        const ket = (w.keterangan_batas || '').trim().toLowerCase();
        return ket.length > 0 && !ket.includes('draf') && !ket.includes('tahap penyusunan');
      }).length;

      document.getElementById('stat-kecamatan').textContent = kecSet.size;
      document.getElementById('stat-desa').textContent = wilayah.length;
      document.getElementById('stat-perbup-final').textContent = perbupFinal;
      document.getElementById('stat-ba-final').textContent = baFinal;

      // Isi Dropdown Kecamatan
      const uniqueKecNames = Array.from(new Set(wilayah.map(w => cleanKecamatan(w.kecamatan)).filter(Boolean))).sort();
      ['kecamatan-perbup', 'kecamatan-ba'].forEach(selectId => {
        const sel = document.getElementById(selectId);
        uniqueKecNames.forEach(k => {
          const opt = document.createElement('option');
          opt.value = k;
          opt.textContent = 'Kecamatan ' + k;
          sel.appendChild(opt);
        });
      });

      renderPerbup();
      renderBa();
      renderProgres();
    }

    function setPerbupStatus(status) {
      currentPerbupStatus = status;
      document.getElementById('alert-perbup-draft').classList.toggle('hidden', status !== 'Draft');
      renderPerbup();
    }

    function setBaStatus(status) {
      currentBaStatus = status;
      document.getElementById('alert-ba-draft').classList.toggle('hidden', status !== 'Draft');
      renderBa();
    }

    function renderBerandaSearch() {
      const wilayah = (window.SI_BATAS_DATA && window.SI_BATAS_DATA.wilayah) || window.wilayahDataKonawe || [];
      const q = (document.getElementById('search-beranda').value || '').trim().toLowerCase();
      const container = document.getElementById('beranda-search-container');
      const grid = document.getElementById('beranda-search-grid');

      if (!q) {
        container.classList.add('hidden');
        grid.innerHTML = '';
        return;
      }

      const filtered = wilayah.filter(w => {
        const kecClean = cleanKecamatan(w.kecamatan).toLowerCase();
        const full = (w.status + ' ' + w.nama_wilayah).toLowerCase();
        return full.includes(q) || kecClean.includes(q) || w.kode.toLowerCase().includes(q) || (w.keterangan_batas || '').toLowerCase().includes(q);
      });

      container.classList.remove('hidden');
      grid.innerHTML = filtered.map(w => {
        const kecClean = cleanKecamatan(w.kecamatan);
        const ket = (w.keterangan_batas || '').trim();
        const hasLink = Boolean(w.link_batas && w.link_batas.trim().length > 0);
        return \`
        <div class="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Kecamatan \${kecClean}</span>
              <span class="font-mono font-semibold text-slate-800">\${w.kode}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900">\${w.status} \${w.nama_wilayah}</h3>
            <p class="text-xs text-slate-600 mt-2">\${ket || w.keterangan_pembentukan || 'Belum Terbit Perbup Batas Wilayah'}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-200 flex justify-end">
            \${hasLink
              ? \`<a href="\${w.link_batas}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg">Unduh / Buka Dokumen</a>\`
              : \`<button type="button" disabled class="px-3.5 py-2 bg-stone-200 text-slate-500 border border-stone-300 text-xs font-semibold rounded-lg cursor-not-allowed">Dokumen Belum Tersedia</button>\`
            }
          </div>
        </div>\`;
      }).join('');
    }

    function renderPerbup() {
      const wilayah = (window.SI_BATAS_DATA && window.SI_BATAS_DATA.wilayah) || window.wilayahDataKonawe || [];
      const q = (document.getElementById('search-perbup').value || '').toLowerCase();
      const kec = document.getElementById('kecamatan-perbup').value;

      const filtered = wilayah.filter(w => {
        const kecClean = cleanKecamatan(w.kecamatan);
        const ket = (w.keterangan_batas || '').trim();
        const lower = ket.toLowerCase();
        const isDraft = lower.includes('draf') || lower.includes('tahap penyusunan');
        const isBaOnly = lower.startsWith('ba ') || lower.includes('berita acara');
        const isFinal = ket.length > 0 && !isDraft && !isBaOnly;

        if (kec !== 'ALL' && kecClean !== kec) return false;
        if (currentPerbupStatus === 'Final' && !isFinal) return false;
        if (currentPerbupStatus === 'Draft' && !isDraft) return false;
        if (q && !w.nama_wilayah.toLowerCase().includes(q) && !w.kode.toLowerCase().includes(q) && !ket.toLowerCase().includes(q)) return false;
        return true;
      });

      const tbody = document.getElementById('tbody-perbup');
      tbody.innerHTML = filtered.map(w => {
        const kecClean = cleanKecamatan(w.kecamatan);
        const ket = (w.keterangan_batas || '').trim();
        const hasLink = Boolean(w.link_batas && w.link_batas.trim().length > 0);
        const isDraft = ket.toLowerCase().includes('draf') || ket.toLowerCase().includes('tahap penyusunan');
        return \`
        <tr class="hover:bg-stone-50">
          <td class="py-3.5 px-4 font-semibold text-slate-900">\${w.status} \${w.nama_wilayah} <span class="block text-xs font-mono text-slate-500">\${w.kode}</span></td>
          <td class="py-3.5 px-4 text-slate-600">Kec. \${kecClean}</td>
          <td class="py-3.5 px-4">
            <span class="\${ket ? (isDraft ? 'text-amber-700 font-semibold' : 'text-emerald-800 font-semibold') : 'text-slate-500'}">
              \${ket ? (isDraft ? 'Draf Perbup (On-Going)' : 'Peraturan Bupati (Final)') : 'Belum Terbit Perbup'}
            </span>
          </td>
          <td class="py-3.5 px-4 font-mono text-xs text-slate-700">\${ket || w.keterangan_pembentukan || '—'}</td>
          <td class="py-3.5 px-4 text-right">
            \${hasLink
              ? \`<a href="\${w.link_batas}" target="_blank" rel="noopener noreferrer" class="inline-block px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg">Unduh / Buka Dokumen</a>\`
              : \`<button type="button" disabled class="inline-block px-3.5 py-2 bg-stone-200 text-slate-500 border border-stone-300 text-xs font-semibold rounded-lg cursor-not-allowed">Dokumen Belum Tersedia</button>\`
            }
          </td>
        </tr>\`;
      }).join('');
    }

    function renderBa() {
      const wilayah = (window.SI_BATAS_DATA && window.SI_BATAS_DATA.wilayah) || window.wilayahDataKonawe || [];
      const q = (document.getElementById('search-ba').value || '').toLowerCase();
      const kec = document.getElementById('kecamatan-ba').value;

      const filtered = wilayah.filter(w => {
        const kecClean = cleanKecamatan(w.kecamatan);
        const ket = (w.keterangan_batas || '').trim();
        const lower = ket.toLowerCase();
        const isDraft = lower.includes('draf') || lower.includes('tahap penyusunan');
        const isFinal = ket.length > 0 && !isDraft;

        if (kec !== 'ALL' && kecClean !== kec) return false;
        if (currentBaStatus === 'Final' && !isFinal) return false;
        if (currentBaStatus === 'Draft' && isFinal) return false;
        if (q && !w.nama_wilayah.toLowerCase().includes(q) && !w.kode.toLowerCase().includes(q) && !ket.toLowerCase().includes(q)) return false;
        return true;
      });

      const tbody = document.getElementById('tbody-ba');
      tbody.innerHTML = filtered.map(w => {
        const kecClean = cleanKecamatan(w.kecamatan);
        const ket = (w.keterangan_batas || '').trim();
        const hasLink = Boolean(w.link_batas && w.link_batas.trim().length > 0);
        const isDraft = ket.toLowerCase().includes('draf') || ket.toLowerCase().includes('tahap penyusunan');
        const isFinal = ket.length > 0 && !isDraft;
        return \`
        <tr class="hover:bg-stone-50">
          <td class="py-3.5 px-4 font-semibold text-slate-900">\${w.status} \${w.nama_wilayah} <span class="block text-xs font-mono text-slate-500">\${w.kode}</span></td>
          <td class="py-3.5 px-4 text-slate-600">Kec. \${kecClean}</td>
          <td class="py-3.5 px-4">
            <span class="\${isFinal ? 'text-emerald-800 font-semibold' : 'text-amber-700 font-semibold'}">
              \${isFinal ? 'Berita Acara (FINAL)' : 'Berita Acara (Dalam Proses)'}
            </span>
          </td>
          <td class="py-3.5 px-4 font-mono text-xs text-slate-700">\${ket || 'Belum Tersedia BA'}</td>
          <td class="py-3.5 px-4 text-right">
            \${hasLink
              ? \`<a href="\${w.link_batas}" target="_blank" rel="noopener noreferrer" class="inline-block px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg">Unduh / Buka Dokumen</a>\`
              : \`<button type="button" disabled class="inline-block px-3.5 py-2 bg-stone-200 text-slate-500 border border-stone-300 text-xs font-semibold rounded-lg cursor-not-allowed">Dokumen Belum Tersedia</button>\`
            }
          </td>
        </tr>\`;
      }).join('');
    }

    function renderProgres() {
      const store = window.SI_BATAS_DATA || { progresLuar: [], progresDalam: [] };
      document.getElementById('grid-progres-luar').innerHTML = store.progresLuar.map(item => \`
        <div class="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-4">
              <h3 class="text-base font-bold text-slate-900">\${item.segmen}</h3>
              <span class="font-mono font-bold text-emerald-800 tabular-nums">\${item.persentase}%</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">\${item.wilayahBersinggungan}</p>
            <div class="w-full bg-stone-200 h-2 rounded-full mt-3 overflow-hidden">
              <div class="bg-emerald-700 h-full rounded-full" style="width: \${item.persentase}%"></div>
            </div>
            <p class="text-sm text-slate-700 mt-3">\${item.deskripsiTahapan}</p>
          </div>
          <div class="flex items-center gap-3 mt-5 pt-4 border-t border-stone-100">
            <a href="\${item.linkDokumen}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-emerald-900 text-white text-xs font-medium rounded-lg">Lihat Dokumen</a>
            <button onclick="switchTab('webgis')" class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-medium rounded-lg">Peta Kegiatan</button>
          </div>
        </div>
      \`).join('');

      document.getElementById('grid-progres-dalam').innerHTML = store.progresDalam.map(item => \`
        <div class="bg-white rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-4">
              <h3 class="text-base font-bold text-slate-900">\${item.segmen}</h3>
              <span class="font-mono font-bold text-emerald-800 tabular-nums">\${item.persentase}%</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Kec. \${item.kecamatan} · \${item.cakupanDesa}</p>
            <div class="w-full bg-stone-200 h-2 rounded-full mt-3 overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full" style="width: \${item.persentase}%"></div>
            </div>
            <p class="text-sm text-slate-700 mt-3">\${item.tahapanSaatIni}</p>
          </div>
          <div class="flex items-center gap-3 mt-5 pt-4 border-t border-stone-100">
            <a href="\${item.linkDokumen}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-emerald-900 text-white text-xs font-medium rounded-lg">Lihat Dokumen</a>
            <button onclick="switchTab('webgis')" class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-medium rounded-lg">Peta Kegiatan</button>
          </div>
        </div>
      \`).join('');
    }

    window.addEventListener('DOMContentLoaded', initPortal);
  </script>
</body>
</html>`;
}

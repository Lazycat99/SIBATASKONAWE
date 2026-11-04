import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_DOKUMEN_BATAS,
  INITIAL_PROGRES_LUAR,
  INITIAL_PROGRES_DALAM,
  calculateDashboardStats,
  filterDocuments,
  getUniqueKecamatan,
  validateNewDocument,
  generateDataJsSource
} from './boundaryData';

test('calculateDashboardStats computes accurate counts from INITIAL_DOKUMEN_BATAS', () => {
  const stats = calculateDashboardStats(INITIAL_DOKUMEN_BATAS);
  assert.equal(stats.totalKecamatan, 6); // Padangguni, Tongauna, Unaaha, Uepai, Lambuya, Wawotobi
  assert.equal(stats.totalDesaKelurahan, 11);
  assert.equal(stats.totalPerbupFinal, 6);
  assert.equal(stats.totalPerbupDraft, 4);
  assert.equal(stats.totalBaFinal, 4);
  assert.equal(stats.totalBaDraft, 2);
  assert.equal(stats.totalDokumen, 16);
});

test('filterDocuments filters Produk Hukum (Perbup) by kecamatan, status, and search query', () => {
  const allPerbup = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'Perbup'
  });
  assert.equal(allPerbup.length, 10);

  const finalPerbup = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'Perbup',
    status: 'Final'
  });
  assert.equal(finalPerbup.length, 6);

  const draftPerbupPadangguni = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'Perbup',
    kecamatan: 'Padangguni',
    status: 'Draft'
  });
  assert.equal(draftPerbupPadangguni.length, 1);
  assert.equal(draftPerbupPadangguni[0].namaDesa, 'Desa Mokaleleo');

  const searchTrimulya = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'Perbup',
    searchQuery: 'trimulya'
  });
  assert.equal(searchTrimulya.length, 1);
  assert.equal(searchTrimulya[0].id, 'DOK-001');
});

test('filterDocuments filters Berita Acara (BA) by status and search query', () => {
  const allBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA'
  });
  assert.equal(allBa.length, 6);

  const draftBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA',
    status: 'Draft'
  });
  assert.equal(draftBa.length, 2);

  const tetehakaBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA',
    searchQuery: 'Tetehaka'
  });
  assert.equal(tetehakaBa.length, 1);
  assert.equal(tetehakaBa[0].kecamatan, 'Tongauna');
});

test('getUniqueKecamatan returns sorted list of unique kecamatan names', () => {
  const list = getUniqueKecamatan(INITIAL_DOKUMEN_BATAS);
  assert.deepEqual(list, ['Lambuya', 'Padangguni', 'Tongauna', 'Uepai', 'Unaaha', 'Wawotobi']);
});

test('validateNewDocument rejects invalid inputs and accepts valid document payload', () => {
  const emptyDesa = validateNewDocument({
    namaDesa: 'A',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/file/d/123'
  });
  assert.equal(emptyDesa.valid, false);

  const badUrl = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'drive.google.com/tanpa-https'
  });
  assert.equal(badUrl.valid, false);

  const validDoc = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/drive/folders/1valid'
  });
  assert.equal(validDoc.valid, true);
});

test('generateDataJsSource generates valid JS code containing DATA_DOKUMEN_BATAS', () => {
  const code = generateDataJsSource(
    INITIAL_DOKUMEN_BATAS,
    INITIAL_PROGRES_LUAR,
    INITIAL_PROGRES_DALAM
  );
  assert.ok(code.includes('const DATA_DOKUMEN_BATAS ='));
  assert.ok(code.includes('Desa Trimulya'));
  assert.ok(code.includes('Kota Kendari - Kab. Konawe'));
});

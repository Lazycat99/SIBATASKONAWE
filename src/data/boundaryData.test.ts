import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wilayahDataKonawe,
  INITIAL_DOKUMEN_BATAS,
  INITIAL_PROGRES_LUAR,
  INITIAL_PROGRES_DALAM,
  calculateDashboardStats,
  filterDocuments,
  filterWilayahKonawe,
  getUniqueKecamatan,
  validateNewDocument,
  generateDataJsSource
} from './boundaryData';

test('calculateDashboardStats computes accurate dynamic counts from wilayahDataKonawe', () => {
  const stats = calculateDashboardStats(wilayahDataKonawe);
  assert.equal(stats.totalKecamatan, 28);
  assert.equal(stats.totalDesaKelurahan, 348);
  assert.equal(stats.totalDesa, 291);
  assert.equal(stats.totalKelurahan, 57);
  assert.equal(stats.totalPerbupFinal, 52);
  assert.equal(stats.totalPerbupDraft, 2);
  assert.equal(stats.totalPerdaPembentukan, 287);
  assert.equal(stats.totalLinkPembentukan, 231);
  assert.equal(stats.totalLinkBatas, 50);
});

test('filterWilayahKonawe filters 348 WilayahKonawe records by kecamatan, category, and search query', () => {
  const all = filterWilayahKonawe(wilayahDataKonawe, {});
  assert.equal(all.length, 348);

  const finalPerbup = filterWilayahKonawe(wilayahDataKonawe, {
    category: 'PERBUP_FINAL'
  });
  assert.equal(finalPerbup.length, 52);

  const draftPerbup = filterWilayahKonawe(wilayahDataKonawe, {
    category: 'PERBUP_DRAFT'
  });
  assert.equal(draftPerbup.length, 2);

  const unaahaOnly = filterWilayahKonawe(wilayahDataKonawe, {
    kecamatan: 'Unaaha'
  });
  assert.equal(unaahaOnly.length, 12);

  const searchKasumewuho = filterWilayahKonawe(wilayahDataKonawe, {
    searchQuery: 'Kasumewuho'
  });
  assert.equal(searchKasumewuho.length, 1);
  assert.equal(searchKasumewuho[0].kode, '74.02.03.2031');
});

test('filterDocuments maps all 348 villages for both Perbup and Berita Acara (BA) without exception', () => {
  const allPerbup = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'Perbup'
  });
  assert.equal(allPerbup.length, 348);

  const allBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA'
  });
  assert.equal(allBa.length, 348);

  const finalBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA',
    status: 'Final'
  });
  assert.equal(finalBa.length, 52);

  const nambeaboruBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA',
    searchQuery: 'Nambeaboru'
  });
  assert.equal(nambeaboruBa.length, 1);
  assert.ok(nambeaboruBa[0].linkDrive.startsWith('https://drive.google.com/'));

  const lambuyaBa = filterDocuments(INITIAL_DOKUMEN_BATAS, {
    jenisDokumen: 'BA',
    searchQuery: '74.02.01.1001'
  });
  assert.equal(lambuyaBa.length, 1);
  assert.equal(lambuyaBa[0].linkDrive, '');
});

test('getUniqueKecamatan returns all 28 sorted unique kecamatan names from wilayahDataKonawe', () => {
  const list = getUniqueKecamatan(wilayahDataKonawe);
  assert.equal(list.length, 28);
  assert.ok(list.includes('Unaaha'));
  assert.ok(list.includes('Lambuya'));
  assert.ok(list.includes('Lalonggasumeeto'));
  assert.ok(list.includes('Tongauna Utara'));
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

test('generateDataJsSource generates valid JS code containing wilayahDataKonawe', () => {
  const code = generateDataJsSource(
    wilayahDataKonawe,
    INITIAL_PROGRES_LUAR,
    INITIAL_PROGRES_DALAM
  );
  assert.ok(code.includes('const wilayahDataKonawe ='));
  assert.ok(code.includes('74.02.01.1001'));
  assert.ok(code.includes('Kota Kendari - Kab. Konawe'));
});

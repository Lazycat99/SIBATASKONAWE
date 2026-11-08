import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wilayahDataKonawe,
  INITIAL_DOKUMEN_BATAS,
  INITIAL_PROGRES_LUAR,
  INITIAL_PROGRES_DALAM,
  AUTHORIZATION_CODE,
  calculateDashboardStats,
  calculateBoundaryProgressRatio,
  calculateTopKecamatanProgress,
  filterDocuments,
  filterWilayahKonawe,
  getFeaturedFinalWilayah,
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

test('calculateBoundaryProgressRatio computes accurate doughnut chart slices from wilayahDataKonawe', () => {
  const ratio = calculateBoundaryProgressRatio(wilayahDataKonawe);
  assert.equal(ratio.totalWilayah, 348);
  assert.equal(ratio.finalCount, 52);
  assert.equal(ratio.belumPerbupCount, 296);
  assert.equal(ratio.slices.length, 2);
  assert.equal(ratio.slices[0].name, 'Final (Sah / Selesai)');
  assert.equal(ratio.slices[0].value, 52);
  assert.equal(ratio.slices[1].name, 'Belum Perbup');
  assert.equal(ratio.slices[1].value, 296);
});

test('calculateTopKecamatanProgress computes descending Perbup completion percentages for top kecamatans', () => {
  const top7 = calculateTopKecamatanProgress(wilayahDataKonawe, 7);
  assert.equal(top7.length, 7);
  for (let i = 1; i < top7.length; i++) {
    assert.ok(
      top7[i - 1].percentage >= top7[i].percentage,
      `Expected descending order at index ${i}`
    );
  }
  assert.ok(top7[0].percentage > 0);
  assert.ok(top7[0].finalCount > 0);
});

test('getFeaturedFinalWilayah returns 6 to 9 Final Perbup records for progressive disclosure on Beranda', () => {
  const sample6 = getFeaturedFinalWilayah(wilayahDataKonawe, 6);
  assert.equal(sample6.length, 6);
  for (const item of sample6) {
    assert.ok(item.keterangan_batas.trim().length > 0);
    assert.ok(!item.keterangan_batas.toLowerCase().includes('draf'));
  }

  const sample9 = getFeaturedFinalWilayah(wilayahDataKonawe, 9);
  assert.equal(sample9.length, 9);
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

test('validateNewDocument rejects invalid inputs or wrong Sandi Otorisasi and accepts valid document payload with TAPEM2026', () => {
  const wrongSandi = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/drive/folders/1valid',
    sandiOtorisasi: 'SALAH123'
  });
  assert.equal(wrongSandi.valid, false);
  if (!wrongSandi.valid) {
    assert.ok(wrongSandi.error.includes('Sandi Salah'));
  }

  const emptyDesa = validateNewDocument({
    namaDesa: 'A',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/file/d/123',
    sandiOtorisasi: AUTHORIZATION_CODE
  });
  assert.equal(emptyDesa.valid, false);

  const badUrl = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'drive.google.com/tanpa-https',
    sandiOtorisasi: AUTHORIZATION_CODE
  });
  assert.equal(badUrl.valid, false);

  const validDoc = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/drive/folders/1valid',
    sandiOtorisasi: AUTHORIZATION_CODE
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

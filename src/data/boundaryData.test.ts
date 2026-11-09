import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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
  generateDataJsSource,
  utm51SToLngLat,
  normalizeKonaweGeoJson,
  formatGeoJsonFeatureInfo,
  findMatchingGeoJsonFeatures
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

test('validateNewDocument rejects invalid inputs or wrong Sandi Otorisasi and accepts valid document payload with KONAWE2026', () => {
  assert.equal(AUTHORIZATION_CODE, 'KONAWE2026');

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
    assert.equal(wrongSandi.error, 'Akses Ditolak: Sandi Otorisasi Tidak Valid.');
  }

  const emptySandi = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/drive/folders/1valid',
    sandiOtorisasi: ''
  });
  assert.equal(emptySandi.valid, false);
  if (!emptySandi.valid) {
    assert.equal(emptySandi.error, 'Akses Ditolak: Sandi Otorisasi Tidak Valid.');
  }

  const emptyDesa = validateNewDocument({
    namaDesa: 'A',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/file/d/123',
    sandiOtorisasi: 'KONAWE2026'
  });
  assert.equal(emptyDesa.valid, false);

  const badUrl = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'drive.google.com/tanpa-https',
    sandiOtorisasi: 'KONAWE2026'
  });
  assert.equal(badUrl.valid, false);

  const validDoc = validateNewDocument({
    namaDesa: 'Desa Wawonggole',
    kecamatan: 'Unaaha',
    jenisDokumen: 'Perbup',
    status: 'Final',
    nomorDokumen: 'Perbup Nomor 1 Tahun 2025',
    linkDrive: 'https://drive.google.com/drive/folders/1valid',
    sandiOtorisasi: 'KONAWE2026'
  });
  assert.equal(validDoc.valid, true);
});

test('generateDataJsSource generates valid JS code containing wilayahDataKonawe and 2 outer boundary segments', () => {
  assert.equal(INITIAL_PROGRES_LUAR.length, 2);
  assert.equal(INITIAL_PROGRES_LUAR[0].segmen, 'Kota Kendari - Kab. Konawe');
  assert.equal(INITIAL_PROGRES_LUAR[1].segmen, 'Kab. Konawe Utara - Kab. Konawe');

  const code = generateDataJsSource(
    wilayahDataKonawe,
    INITIAL_PROGRES_LUAR,
    INITIAL_PROGRES_DALAM
  );
  assert.ok(code.includes('const wilayahDataKonawe ='));
  assert.ok(code.includes('74.02.01.1001'));
  assert.ok(code.includes('Kota Kendari - Kab. Konawe'));
  assert.ok(!code.includes('Kab. Konawe Selatan - Kab. Konawe'));
  assert.ok(!code.includes('Kab. Kolaka Timur - Kab. Konawe'));
});

test('normalizeKonaweGeoJson converts UTM 51S coordinates from public/batas_konawe.json into valid WGS84 polygons', () => {
  const raw = JSON.parse(fs.readFileSync('public/batas_konawe.json', 'utf8'));
  const normalized = normalizeKonaweGeoJson(raw);

  assert.equal(normalized.type, 'FeatureCollection');
  assert.equal(normalized.features.length, 367);

  const firstCoord = (normalized.features[0].geometry.coordinates as number[][][])[0][0];
  assert.ok(firstCoord[0] > 121 && firstCoord[0] < 123.5, `Expected WGS84 longitude in Konawe, got ${firstCoord[0]}`);
  assert.ok(firstCoord[1] > -4.5 && firstCoord[1] < -2.5, `Expected WGS84 latitude in Konawe, got ${firstCoord[1]}`);

  // Idempotent when already in WGS84
  const [lng2, lat2] = utm51SToLngLat(firstCoord[0], firstCoord[1]);
  assert.equal(lng2, firstCoord[0]);
  assert.equal(lat2, firstCoord[1]);

  const formatted = formatGeoJsonFeatureInfo(normalized.features[0].properties);
  assert.equal(formatted.namaWilayah, 'Desa Mekar');
  assert.equal(formatted.kecamatan, 'Kecamatan Soropia');
  assert.equal(formatted.statusKategori, 'TIDAK');

  const tobimeitaByFullLabel = findMatchingGeoJsonFeatures(
    normalized.features,
    'Desa Tobimeita, Kecamatan Wonggeduku Barat'
  );
  assert.equal(tobimeitaByFullLabel.length, 1);
  assert.equal(tobimeitaByFullLabel[0].properties.Name, 'DESA TOBIMEITA');

  const tobimeitaByShortParam = findMatchingGeoJsonFeatures(
    normalized.features,
    'Tobimeita'
  );
  assert.equal(tobimeitaByShortParam.length, 1);
  assert.equal(tobimeitaByShortParam[0].properties.OBJECTID, 253);

  const kasumewuhoMatch = findMatchingGeoJsonFeatures(
    normalized.features,
    'Desa Kasumewuho, Kecamatan Wawotobi'
  );
  assert.equal(kasumewuhoMatch.length, 1);
  assert.equal(kasumewuhoMatch[0].properties.Name, 'DESA KASUMEWUHO');
});



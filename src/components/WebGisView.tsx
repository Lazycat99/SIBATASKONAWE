import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON as LeafletGeoJSON,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import {
  Info,
  AlertTriangle,
  MapPin,
  X,
  Layers,
  Waypoints,
  GitBranch,
  Scale,
  ShieldAlert,
  RotateCcw,
  Compass,
  CheckCircle2,
  ChevronDown,
  Globe,
  Map as MapIcon,
  Smartphone
} from 'lucide-react';
import {
  normalizeKonaweGeoJson,
  formatGeoJsonFeatureInfo,
  findMatchingGeoJsonFeatures,
  type KonaweGeoJsonProperties,
  type FormattedGeoJsonFeatureInfo
} from '../data/boundaryData';

interface WebGisViewProps {
  activeMapSegment: string | null;
  onClearMapSegment: () => void;
}

const KONAWE_DEFAULT_CENTER: [number, number] = [-3.58, 122.05];
const KONAWE_DEFAULT_ZOOM = 9;

const BASE_POLYGON_STYLE: L.PathOptions = {
  color: '#047857', // emerald-700
  weight: 2,
  opacity: 0.95,
  fillColor: '#10b981', // emerald-500
  fillOpacity: 0.2
};

// Pembatas luar (outline) putih tipis tambahan saat mode Citra Satelit aktif agar garis #047857 tidak tenggelam di atas hutan/laut gelap
const SATELLITE_OUTER_OUTLINE_STYLE: L.PathOptions = {
  color: '#ffffff',
  weight: 3.5, // menampilkan halo putih tipis ~1px di sisi luar garis #047857 (2px)
  opacity: 0.9,
  fillOpacity: 0,
  interactive: false
};

const HOVER_POLYGON_STYLE: L.PathOptions = {
  color: '#065f46', // emerald-800
  weight: 3,
  opacity: 1,
  fillColor: '#10b981',
  fillOpacity: 0.42
};

const TARGET_HIGHLIGHT_STYLE: L.PathOptions = {
  fillColor: '#fbbf24', // amber-400 kuning terang
  fillOpacity: 0.7,
  color: '#ef4444', // red-500 merah tebal
  weight: 3,
  opacity: 1
};

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPopupHtml(info: FormattedGeoJsonFeatureInfo): string {
  const badgeStyle =
    info.statusKategori === 'YA'
      ? 'background:#d1fae5;color:#065f46;border:1px solid #a7f3d0;'
      : info.statusKategori === 'PROSES'
      ? 'background:#ffedd5;color:#9a3412;border:1px solid #fed7aa;'
      : 'background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;';

  const linkButtonHtml = info.linkDokumen
    ? `<a href="${escapeHtml(
        info.linkDokumen
      )}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;width:100%;margin-top:10px;padding:7px 12px;background:#047857;color:#ffffff;font-size:12px;font-weight:600;border-radius:6px;text-decoration:none;">Buka Dokumen Perbup &rarr;</a>`
    : '';

  return `
    <div style="font-family:'Plus Jakarta Sans',sans-serif;color:#0f172a;">
      <div style="background:#064e3b;color:#ffffff;padding:12px 14px;">
        <div style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:0.08em;color:#6ee7b7;font-weight:600;">
          ${escapeHtml(info.kecamatan)}
        </div>
        <div style="font-size:15px;font-weight:700;margin-top:2px;line-height:1.25;">
          ${escapeHtml(info.namaWilayah)}
        </div>
      </div>
      <div style="padding:12px 14px;background:#ffffff;font-size:12px;">
        <div style="margin-bottom:10px;">
          <span style="display:inline-block;padding:3px 9px;border-radius:9999px;font-size:11px;font-weight:600;${badgeStyle}">
            ${escapeHtml(info.statusHukum)}
          </span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;">
          <div>
            <div style="font-size:10px;color:#64748b;text-transform:uppercase;">Luas Spasial</div>
            <div style="font-size:12px;font-weight:700;color:#1e293b;margin-top:1px;">${escapeHtml(
              info.luasHa
            )}</div>
          </div>
          <div>
            <div style="font-size:10px;color:#64748b;text-transform:uppercase;">Keliling Poligon</div>
            <div style="font-size:12px;font-weight:700;color:#1e293b;margin-top:1px;">${escapeHtml(
              info.kelilingKm
            )}</div>
          </div>
        </div>
        <div style="font-size:11px;color:#475569;line-height:1.45;">
          ${escapeHtml(info.keteranganRegulasi)}
        </div>
        ${linkButtonHtml}
      </div>
    </div>
  `;
}

interface MapControllerProps {
  targetDesa: string | null;
  matchedFeatures: Array<Feature<Geometry, KonaweGeoJsonProperties>>;
  geoJsonData: FeatureCollection | null;
  resetCounter: number;
}

const MapController: React.FC<MapControllerProps> = ({
  targetDesa,
  matchedFeatures,
  geoJsonData,
  resetCounter
}) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData || geoJsonData.features.length === 0) return;

    // Jika ada target desa yang cocok, lakukan flyToBounds tepat ke poligon desa tersebut
    if (targetDesa && matchedFeatures.length > 0) {
      try {
        const targetCollection: FeatureCollection = {
          type: 'FeatureCollection',
          features: matchedFeatures
        };
        const targetLayer = L.geoJSON(targetCollection);
        const bounds = targetLayer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 14 });
          return;
        }
      } catch {
        // Fallback ke cakupan umum bila gagal menghitung bounds
      }
    }

    // Jika tidak ada target desa, sesuaikan cakupan ke seluruh poligon yang tampil
    try {
      const layer = L.geoJSON(geoJsonData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
      }
    } catch {
      map.setView(KONAWE_DEFAULT_CENTER, KONAWE_DEFAULT_ZOOM);
    }
  }, [targetDesa, matchedFeatures, geoJsonData, resetCounter, map]);

  return null;
};

export const WebGisView: React.FC<WebGisViewProps> = ({
  activeMapSegment,
  onClearMapSegment
}) => {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('ALL');
  const [baseMap, setBaseMap] = useState<'osm' | 'satellite'>('osm');
  const [isBaseMapMenuOpen, setIsBaseMapMenuOpen] = useState<boolean>(false);
  const [resetCounter, setResetCounter] = useState<number>(0);
  const [selectedFeatureInfo, setSelectedFeatureInfo] =
    useState<FormattedGeoJsonFeatureInfo | null>(null);

  // Tangkap parameter desa dari prop activeMapSegment ATAU URL Query (?desa=...)
  const effectiveTargetDesa = useMemo(() => {
    if (activeMapSegment && activeMapSegment.trim().length > 0) {
      return activeMapSegment.trim();
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const desaParam = params.get('desa');
      if (desaParam && desaParam.trim().length > 0) {
        return desaParam.trim();
      }
    }
    return null;
  }, [activeMapSegment]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    fetch('/batas_konawe.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Gagal memuat data spasial (${res.status})`);
        }
        return res.json();
      })
      .then((raw) => {
        if (!isMounted) return;
        const normalized = normalizeKonaweGeoJson(raw) as unknown as FeatureCollection;
        setGeoJsonData(normalized);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Gagal memuat fail GeoJSON /batas_konawe.json'
        );
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Cari fitur poligon yang cocok dengan parameter target desa
  const matchedTargetFeatures = useMemo(() => {
    if (!geoJsonData || !effectiveTargetDesa) return [];
    return findMatchingGeoJsonFeatures(
      geoJsonData.features as Array<Feature<Geometry, KonaweGeoJsonProperties>>,
      effectiveTargetDesa
    );
  }, [geoJsonData, effectiveTargetDesa]);

  const matchedObjectIds = useMemo(() => {
    const ids = new Set<number | string>();
    for (const f of matchedTargetFeatures) {
      const id = f.properties?.OBJECTID ?? f.properties?.Name;
      if (id !== undefined) ids.add(id);
    }
    return ids;
  }, [matchedTargetFeatures]);

  // Saat target desa berubah dan ditemukan, perbarui informasi poligon terpilih & pastikan filter kecamatan menampilkan semua
  useEffect(() => {
    if (matchedTargetFeatures.length > 0) {
      setSelectedKecamatan('ALL');
      setSelectedFeatureInfo(
        formatGeoJsonFeatureInfo(matchedTargetFeatures[0].properties ?? {})
      );
    }
  }, [matchedTargetFeatures]);

  const kecamatanOptions = useMemo(() => {
    if (!geoJsonData) return [];
    const set = new Set<string>();
    for (const f of geoJsonData.features) {
      const kec = String((f.properties as KonaweGeoJsonProperties)?.Kec ?? '').trim();
      if (kec) set.add(kec);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [geoJsonData]);

  const filteredGeoJson = useMemo<FeatureCollection | null>(() => {
    if (!geoJsonData) return null;
    if (selectedKecamatan === 'ALL') return geoJsonData;
    return {
      type: 'FeatureCollection',
      features: geoJsonData.features.filter(
        (f) =>
          String((f.properties as KonaweGeoJsonProperties)?.Kec ?? '').trim() ===
          selectedKecamatan
      )
    };
  }, [geoJsonData, selectedKecamatan]);

  const geoJsonKey = useMemo(() => {
    return `${selectedKecamatan}-${filteredGeoJson?.features.length ?? 0}-${
      effectiveTargetDesa ?? 'none'
    }-${baseMap}-${resetCounter}`;
  }, [selectedKecamatan, filteredGeoJson, effectiveTargetDesa, baseMap, resetCounter]);

  const isFeatureHighlighted = (
    feature?: Feature<Geometry, KonaweGeoJsonProperties>
  ): boolean => {
    if (!feature || matchedObjectIds.size === 0) return false;
    const id = feature.properties?.OBJECTID ?? feature.properties?.Name;
    return id !== undefined && matchedObjectIds.has(id);
  };

  const getPolygonStyle = (
    feature?: Feature<Geometry, KonaweGeoJsonProperties>
  ): L.PathOptions => {
    if (isFeatureHighlighted(feature)) {
      return TARGET_HIGHLIGHT_STYLE;
    }
    return BASE_POLYGON_STYLE;
  };

  const handleEachFeature = (
    feature: Feature<Geometry, KonaweGeoJsonProperties>,
    layer: L.Layer
  ) => {
    const info = formatGeoJsonFeatureInfo(feature.properties ?? {});
    const isTarget = isFeatureHighlighted(feature);

    if (layer instanceof L.Path) {
      layer.bindTooltip(
        `${escapeHtml(info.namaWilayah)} · ${escapeHtml(info.kecamatan)}`,
        {
          sticky: true,
          direction: 'top',
          className: 'sibatas-tooltip'
        }
      );

      layer.bindPopup(buildPopupHtml(info), {
        className: 'sibatas-popup',
        maxWidth: 320
      });

      if (isTarget) {
        setTimeout(() => {
          try {
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          } catch {
            // ignore
          }
        }, 50);
      }

      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path;
          target.setStyle(isTarget ? TARGET_HIGHLIGHT_STYLE : HOVER_POLYGON_STYLE);
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            target.bringToFront();
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path;
          target.setStyle(isTarget ? TARGET_HIGHLIGHT_STYLE : BASE_POLYGON_STYLE);
        },
        click: () => {
          setSelectedFeatureInfo(info);
        }
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER WEBGIS & KONTROL FILTER SPASIAL */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              SISTEM INFORMASI GEOGRAFIS TAPAL BATAS DAERAH (LEAFLET ENGINE)
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              WebGIS / Peta Interaktif - Visualisasi Spasial Batas Administrasi Kabupaten Konawe
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <label htmlFor="webgis-kecamatan-filter" className="sr-only">
              Filter Kecamatan Peta Spasial
            </label>
            <select
              id="webgis-kecamatan-filter"
              aria-label="Filter Kecamatan Peta Spasial"
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="ALL">
                Seluruh Kab. Konawe ({geoJsonData?.features.length ?? 367} Poligon)
              </option>
              {kecamatanOptions.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>

            {/* Tombol Dropdown Menu Pengalih Peta Dasar (Base Map Switcher) */}
            <div className="relative">
              <button
                type="button"
                data-testid="basemap-dropdown-btn"
                aria-haspopup="menu"
                aria-expanded={isBaseMapMenuOpen}
                onClick={() => setIsBaseMapMenuOpen((prev) => !prev)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  Base Map:{' '}
                  {baseMap === 'osm'
                    ? 'Peta Administratif (OSM)'
                    : 'Citra Satelit (Google Earth)'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                    isBaseMapMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isBaseMapMenuOpen && (
                <div
                  role="menu"
                  aria-label="Pilihan Peta Dasar"
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setBaseMap('osm');
                      setIsBaseMapMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      baseMap === 'osm'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <MapIcon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Peta Administratif (OSM)</span>
                    </span>
                    {baseMap === 'osm' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setBaseMap('satellite');
                      setIsBaseMapMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      baseMap === 'satellite'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Citra Satelit (Google Earth)</span>
                    </span>
                    {baseMap === 'satellite' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedKecamatan('ALL');
                setSelectedFeatureInfo(null);
                onClearMapSegment();
                setResetCounter((c) => c + 1);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sorotan Konawe</span>
            </button>
          </div>
        </div>

        {/* Indikator Fokus Target Desa / Segmen Kegiatan */}
        {effectiveTargetDesa && (
          <div
            data-testid="active-target-banner"
            className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5 text-sm text-amber-950">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>Sorotan Poligon Target Aktif:</strong> {effectiveTargetDesa}{' '}
                {matchedTargetFeatures.length > 0 ? (
                  <span className="inline-flex items-center ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-400">
                    Fly-To &amp; Highlight Aktif ({matchedTargetFeatures[0].properties?.Name})
                  </span>
                ) : (
                  <span className="text-xs text-amber-800">
                    — mencari poligon wilayah pada peta...
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={onClearMapSegment}
              aria-label="Hapus fokus segmen peta"
              className="p-1.5 text-amber-900 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* PANEL PETUNJUK RAMPING (ALERT/BANNER DI ATAS PETA) */}
      <div
        role="region"
        aria-label="Panduan Penggunaan Peta Interaktif"
        className="bg-blue-50 text-blue-800 border border-blue-200/80 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xs"
      >
        <Info className="w-4 h-4 text-blue-700 shrink-0" />
        <p className="text-xs sm:text-sm leading-snug">
          <span className="font-bold">Panduan Penggunaan Peta Interaktif:</span>{' '}
          Arahkan kursor (hover) ke poligon desa/kelurahan untuk menyalakan batas wilayah, atau klik poligon untuk membuka Popup detail atribut spasial (Nama Desa, Kecamatan, Luas Ha, &amp; Status Hukum Perbup).
        </p>
      </div>

      {/* WADAH PETA UTAMA (REACT-LEAFLET + GEOJSON /batas_konawe.json) */}
      <div className="space-y-2.5">
        <div
          data-testid="webgis-map-container"
          className={`relative w-full h-[600px] min-h-[70vh] rounded-xl shadow-lg overflow-hidden bg-slate-100 border border-slate-200 ${
            baseMap === 'osm' ? 'sibatas-map-minimal' : ''
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-slate-50/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-slate-700">
              <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold">
                Memuat 367 Poligon Spasial Kabupaten Konawe (/batas_konawe.json)...
              </p>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 z-20 bg-red-50 flex flex-col items-center justify-center p-6 text-center text-red-800">
              <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-sm font-bold">Gagal Memuat Peta Spasial</p>
              <p className="text-xs mt-1">{loadError}</p>
            </div>
          )}

          <MapContainer
            center={KONAWE_DEFAULT_CENTER}
            zoom={KONAWE_DEFAULT_ZOOM}
            maxZoom={20}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            {baseMap === 'osm' ? (
              <TileLayer
                key="tile-osm-admin"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            ) : (
              <TileLayer
                key="tile-google-satellite-hybrid"
                attribution="&copy; Google Earth / Citra Satelit Hybrid"
                url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                maxZoom={20}
              />
            )}

            {filteredGeoJson && (
              <>
                {/* Outline putih tipis tambahan khusus saat mode Citra Satelit aktif agar garis hijau #047857 kontras di atas hutan/laut gelap */}
                {baseMap === 'satellite' && (
                  <LeafletGeoJSON
                    key={`${geoJsonKey}-sat-outline`}
                    data={filteredGeoJson}
                    style={() => SATELLITE_OUTER_OUTLINE_STYLE}
                    interactive={false}
                  />
                )}

                <LeafletGeoJSON
                  key={geoJsonKey}
                  data={filteredGeoJson}
                  style={getPolygonStyle}
                  onEachFeature={handleEachFeature}
                />
                <MapController
                  targetDesa={effectiveTargetDesa}
                  matchedFeatures={matchedTargetFeatures}
                  geoJsonData={filteredGeoJson}
                  resetCounter={resetCounter}
                />
              </>
            )}
          </MapContainer>

          {/* Badge Overlay Jumlah Poligon Aktif di Sudut Kanan Atas Peta */}
          {filteredGeoJson && (
            <div
              data-testid="geojson-feature-badge"
              className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-xs border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700 pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
              <span>
                {filteredGeoJson.features.length} Poligon Aktif ·{' '}
                {baseMap === 'osm' ? 'Peta Administratif' : 'Citra Satelit'}
              </span>
            </div>
          )}
        </div>

        {/* Bar Kredit & Indikator Poligon Terpilih */}
        <div className="px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-700" data-testid="map-credit">
            Sumber Data Spasial: Pangkalan Data Spasial Geodatabase SI-BATAS — Bagian Tata Pemerintahan Sekretariat Kab. Konawe
          </p>
          <span className="font-mono text-slate-500 tabular-nums">
            {selectedFeatureInfo
              ? `Terpilih: ${selectedFeatureInfo.namaWilayah} (${selectedFeatureInfo.kecamatan}) · Luas ${selectedFeatureInfo.luasHa}`
              : `Proyeksi: WGS 84 (UTM Zona 51S) · Base: ${
                  baseMap === 'osm'
                    ? 'Peta Administratif (OSM)'
                    : 'Citra Satelit (Google Hybrid)'
                }`}
          </span>
        </div>
      </div>

      {/* WADAH INTEGRASI MOBILITAS (ANTARA KONTAINER PETA LEAFLET DAN PANEL LEGENDA & STATUS HUKUM) */}
      <div
        data-testid="mobility-integration-banner"
        className="w-full bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl shadow-md p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="space-y-1.5 max-w-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-yellow-400 shrink-0" />
            <span>Navigasi Lapangan via Smartphone</span>
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Integrasikan garis batas administratif Kabupaten Konawe langsung ke dalam aplikasi Google Maps di ponsel Anda untuk pelacakan posisi (GPS) secara langsung di lapangan.
          </p>
        </div>

        <a
          href="https://www.google.com/maps/d/viewer?mid=1DN2pY2ghIJTvecVBrDwlLl3ZscJxrf4"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="btn-open-google-maps-app"
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full px-5 py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm self-start md:self-auto whitespace-nowrap shrink-0"
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span>Buka di Aplikasi Google Maps</span>
        </a>
      </div>

      {/* PANEL BAWAH: CONTROL DECK (LEGENDA & STATUS HUKUM - GRID 2 KOLOM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Control Deck 1: Panel Legenda Peta Spasial */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                <h2 className="text-sm uppercase text-slate-700 tracking-wide font-bold">
                  PANEL LEGENDA PETA SPASIAL
                </h2>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                VECTOR SYMBOLOGY
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Keterangan simbologi vektor GeoJSON dan interaktivitas poligon batas wilayah Kabupaten Konawe:
            </p>

            <div className="mt-4 space-y-3">
              {/* Item Legenda 1: Garis Batas Poligon Hijau Zamrud */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Waypoints className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-4 h-3 rounded-xs border-2 border-emerald-700 bg-emerald-500/20 shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Garis Zamrud (#047857 · 2px) : Batas Poligon Desa / Kelurahan &amp; Kecamatan
                  </span>
                </div>
              </div>

              {/* Item Legenda 2: Sorotan Interaktif (Hover & Popup) */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-300 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-emerald-800" />
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-4 h-3 rounded-xs border-2 border-emerald-800 bg-emerald-500/45 shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Area Hijau Menyala (Hover 40% &amp; Klik) : Sorotan Aktif &amp; Popup Atribut Spasial
                  </span>
                </div>
              </div>

              {/* Item Legenda 3: Indikator Status Hukum di dalam Popup */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm font-medium text-slate-800">
                    Atribut Popup : Menampilkan Nama Wilayah, Kecamatan, Luas (Ha), &amp; Status Perbup
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200/80 font-mono">
            Data spasial dikelola oleh Tim Teknis Pemetaan Bagian Tata Pemerintahan Setda Kabupaten Konawe.
          </p>
        </div>

        {/* Control Deck 2: Status Hukum Garis Batas Spasial */}
        <div
          role="note"
          data-testid="webgis-warning-box"
          className="bg-slate-50 rounded-xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                <h2 className="text-sm uppercase text-slate-700 tracking-wide font-bold">
                  STATUS HUKUM GARIS BATAS SPASIAL
                </h2>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                LEGAL DISCLAIMER
              </span>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900">CATATAN PENTING:</strong> Batas administrasi bagi desa-desa yang belum memiliki Peraturan Bupati (Perbup) definitif di dalam peta ini masih berstatus sebagai <span className="font-semibold text-amber-800">Batas Indikatif</span>. Garis batas tersebut bersifat sementara dan dapat disesuaikan sewaktu-waktu berdasarkan hasil pelacakan tim lapangan serta kesepakatan batas final berikutnya.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-mono">
            <span className="inline-flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              ACUAN REGULASI: PERMENDAGRI NO. 45 TAHUN 2016
            </span>
            <span className="text-slate-500">PENETAPAN &amp; PENEGASAN BATAS DESA</span>
          </div>
        </div>
      </div>
    </div>
  );
};



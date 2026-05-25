import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ParcelCollection, ParcelProperties, Tier } from '../types/parcel';

export type ViewMode = 'tier' | 'zoning';

/** Compute [lng, lat] centroid from a GeoJSON Polygon or MultiPolygon geometry. */
function computeCentroid(geometry: GeoJSON.Geometry): [number, number] {
  let totalLng = 0, totalLat = 0, count = 0;
  const processRing = (ring: number[][]) => {
    for (const coord of ring) {
      totalLng += coord[0];
      totalLat += coord[1];
      count++;
    }
  };
  if (geometry.type === 'Polygon') {
    processRing((geometry as GeoJSON.Polygon).coordinates[0]);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of (geometry as GeoJSON.MultiPolygon).coordinates) {
      processRing(polygon[0]);
    }
  }
  return count > 0 ? [totalLng / count, totalLat / count] : [0, 0];
}

interface MapProps {
  parcels: ParcelCollection | null;
  selectedParcelId: string | null;
  onParcelClick: (parcel: ParcelProperties) => void;
  viewMode: ViewMode;
  focusParcelId?: string | null;
}

const TIER_COLORS: Record<Tier | 'none', string> = {
  1: '#22c55e',
  2: '#eab308',
  3: '#f97316',
  4: '#ef4444',
  none: '#444',
};

function getTierColor(tier: Tier | null): string {
  return tier ? (TIER_COLORS[tier] ?? TIER_COLORS['none']) : TIER_COLORS['none'];
}

const ZONING_PALETTE = [
  '#4e9af1', '#f1c94e', '#4ef17a', '#f14e9a',
  '#b44ef1', '#f1874e', '#4ef1e8', '#e8f14e',
  '#f14e4e', '#4eb4f1',
];

const zoningColorCache: Record<string, string> = {};

export function getZoningColor(code: string | null | undefined): string {
  if (!code) return '#444';
  if (zoningColorCache[code]) return zoningColorCache[code];
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i);
    hash |= 0;
  }
  const color = ZONING_PALETTE[Math.abs(hash) % ZONING_PALETTE.length];
  zoningColorCache[code] = color;
  return color;
}

function getParcelColor(props: ParcelProperties, viewMode: ViewMode): string {
  if (viewMode === 'zoning') return getZoningColor(props.zoning_code);
  return getTierColor(props.tier);
}

function parcelStyle(
  props: ParcelProperties,
  isSelected: boolean,
  viewMode: ViewMode,
): L.PathOptions {
  const color = getParcelColor(props, viewMode);
  return {
    fillColor: color,
    color: isSelected ? '#ffffff' : '#111',
    weight: isSelected ? 2.5 : 0.4,
    fillOpacity: isSelected ? 0.95 : 0.72,
  };
}

function buildLegendHtml(viewMode: ViewMode, parcels: ParcelCollection | null): string {
  const wrap = (rows: string) => `
    <div style="background:#141414;padding:10px 14px;border-radius:6px;border:1px solid #2a2a2a;
                font-size:11px;color:#bbb;line-height:1.9;min-width:170px">
      ${rows}
    </div>`;

  const swatch = (color: string, label: string) =>
    `<div style="display:flex;align-items:center;gap:8px">
       <span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${color};flex-shrink:0"></span>
       ${label}
     </div>`;

  if (viewMode === 'tier') {
    return wrap(`
      <div style="font-weight:700;margin-bottom:4px;color:#666;letter-spacing:1px;font-size:9px">FEASIBILITY TIER</div>
      ${swatch(TIER_COLORS[1], '<b style="color:#eee">Tier 1</b> &nbsp;≥85 · Outreach ready')}
      ${swatch(TIER_COLORS[2], '<b style="color:#eee">Tier 2</b> &nbsp;65–84 · Possible')}
      ${swatch(TIER_COLORS[3], '<b style="color:#eee">Tier 3</b> &nbsp;40–64 · Conditional')}
      ${swatch(TIER_COLORS[4], '<b style="color:#eee">Tier 4</b> &nbsp;<40 · Blocked')}
      ${swatch(TIER_COLORS['none'], 'Unscored')}
    `);
  }

  const zones: Record<string, string> = {};
  if (parcels) {
    for (const f of parcels.features) {
      const code = (f.properties as ParcelProperties).zoning_code;
      if (code && !zones[code]) zones[code] = getZoningColor(code);
    }
  }
  const zoneRows = Object.entries(zones)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, color]) => swatch(color, code))
    .join('');

  return wrap(`
    <div style="font-weight:700;margin-bottom:4px;color:#666;letter-spacing:1px;font-size:9px">ZONING DISTRICT</div>
    ${zoneRows || '<div style="color:#555">No data</div>'}
  `);
}

export const Map: React.FC<MapProps> = ({
  parcels,
  selectedParcelId,
  onParcelClick,
  viewMode,
  focusParcelId,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const legendRef = useRef<L.Control | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemap, setBasemap] = useState<'satellite' | 'dark'>('dark');

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    if (basemap === 'satellite') {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA', maxZoom: 20 }
      ).addTo(map);
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20, opacity: 0.8 }
      ).addTo(map);
    } else {
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);
    }
  }, [basemap]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [42.48, -71.43],
      zoom: 13,
      zoomControl: true,
    });

    if (basemap === 'satellite') {
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA', maxZoom: 20 }
      );
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20, opacity: 0.8 }
      );
      satelliteLayer.addTo(map);
      labelsLayer.addTo(map);
      tileLayerRef.current = satelliteLayer;
    } else {
      const darkLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      );
      darkLayer.addTo(map);
      tileLayerRef.current = darkLayer;
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (layerRef.current) {
      layerRef.current.remove();
      layerRef.current = null;
    }

    if (legendRef.current) {
      legendRef.current.remove();
      legendRef.current = null;
    }

    const legend = new L.Control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div');
      div.innerHTML = buildLegendHtml(viewMode, parcels);
      return div;
    };
    legend.addTo(mapRef.current);
    legendRef.current = legend;

    if (!parcels || parcels.features.length === 0) return;

    const geoLayer = L.geoJSON(parcels as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const props = feature?.properties as ParcelProperties;
        return parcelStyle(props, props.parcel_id === selectedParcelId, viewMode);
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as ParcelProperties;
        layer.on('click', () => {
          const centroid = computeCentroid(feature.geometry as GeoJSON.Geometry);
          onParcelClick({ ...props, _centroid_lng: centroid[0], _centroid_lat: centroid[1] } as ParcelProperties);
        });
        layer.bindTooltip(
          `<strong>${props.address || props.parcel_id}</strong><br/>
           Zone: <strong>${props.zoning_code ?? '—'}</strong> &nbsp;·&nbsp;
           Tier ${props.tier ?? '?'} &nbsp;·&nbsp; Score: ${props.score?.toFixed(0) ?? '—'}<br/>
           ${props.lot_area_sqft ? (props.lot_area_sqft / 43560).toFixed(2) + ' ac' : ''}`,
          { sticky: true, className: 'plinth-tooltip' }
        );
      },
    });

    geoLayer.addTo(mapRef.current);
    layerRef.current = geoLayer;

    try {
      const bounds = geoLayer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (_) {}

  }, [parcels, selectedParcelId, onParcelClick, viewMode]);

  useEffect(() => {
    if (!focusParcelId || !mapRef.current || !layerRef.current) return;

    layerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      if (feature?.properties?.parcel_id === focusParcelId) {
        try {
          const bounds = layer.getBounds?.();
          if (bounds?.isValid()) {
            mapRef.current!.flyToBounds(bounds, { padding: [100, 100], maxZoom: 18, duration: 1 });
          }
        } catch (_) {}
      }
    });
  }, [focusParcelId, parcels]);

  return (
    <>
      <style>{`
        .plinth-tooltip {
          background: #141414 !important;
          border: 1px solid #333 !important;
          color: #e0e0e0 !important;
          font-size: 12px !important;
          padding: 6px 10px !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.6) !important;
        }
        .plinth-tooltip::before { display: none !important; }
        .leaflet-control-zoom a {
          background: #1a1a1a !important;
          color: #ccc !important;
          border-color: #333 !important;
        }
        .leaflet-control-zoom a:hover { background: #2a2a2a !important; }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: #555 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #666 !important; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute',
        bottom: 28,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid #333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        <button
          onClick={() => setBasemap('satellite')}
          style={{
            background: basemap === 'satellite' ? '#5de0a0' : '#1a1a1a',
            color: basemap === 'satellite' ? '#000' : '#aaa',
            border: 'none',
            padding: '5px 11px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          🛰 Satellite
        </button>
        <button
          onClick={() => setBasemap('dark')}
          style={{
            background: basemap === 'dark' ? '#5de0a0' : '#1a1a1a',
            color: basemap === 'dark' ? '#000' : '#aaa',
            border: 'none',
            borderLeft: '1px solid #333',
            padding: '5px 11px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          🌑 Dark
        </button>
      </div>
    </>
  );
};

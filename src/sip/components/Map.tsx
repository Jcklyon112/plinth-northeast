import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapboxDarkTileLayerConfig } from '../api/mapbox';
import type { ParcelCollection, ParcelProperties } from '../types/parcel';

const PARCEL_FILL = '#5de0a0';

function computeCentroid(geometry: GeoJSON.Geometry): [number, number] {
  let totalLng = 0;
  let totalLat = 0;
  let count = 0;
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
  selectedAddress: string | null;
  onParcelClick: (parcel: ParcelProperties) => void;
  focusAddress?: string | null;
}

const CARTO_DARK_TILE = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  options: {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  },
} as const;

function createDarkBasemapLayer(map: L.Map): L.TileLayer {
  const mapbox = mapboxDarkTileLayerConfig();
  const config = mapbox ?? CARTO_DARK_TILE;
  return L.tileLayer(config.url, config.options).addTo(map);
}

export const Map: React.FC<MapProps> = ({
  parcels,
  selectedAddress,
  onParcelClick,
  focusAddress,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
        { attribution: 'Tiles © Esri', maxZoom: 20 },
      ).addTo(map);
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20, opacity: 0.8 },
      ).addTo(map);
    } else {
      createDarkBasemapLayer(map);
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
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri', maxZoom: 20 },
      ).addTo(map);
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20, opacity: 0.8 },
      ).addTo(map);
    } else {
      createDarkBasemapLayer(map);
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

    if (!parcels || parcels.features.length === 0) return;

    const geoLayer = L.geoJSON(parcels as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const props = feature?.properties as ParcelProperties;
        const selected = selectedAddress != null && props.address === selectedAddress;
        return {
          fillColor: PARCEL_FILL,
          color: selected ? '#ffffff' : '#111',
          weight: selected ? 2.5 : 0.4,
          fillOpacity: selected ? 0.95 : 0.72,
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as ParcelProperties;
        layer.on('click', () => {
          const centroid = computeCentroid(feature.geometry as GeoJSON.Geometry);
          onParcelClick({
            ...props,
            _centroid_lng: centroid[0],
            _centroid_lat: centroid[1],
          } as ParcelProperties);
        });
        const acres = props.lot_area_sqft
          ? `${(props.lot_area_sqft / 43560).toFixed(2)} ac`
          : '';
        layer.bindTooltip(
          `<strong>${props.address || 'Parcel'}</strong>${acres ? `<br/>${acres}` : ''}`,
          { sticky: true, className: 'plinth-tooltip' },
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
    } catch {
      /* empty */
    }
  }, [parcels, selectedAddress, onParcelClick]);

  useEffect(() => {
    if (!focusAddress || !mapRef.current || !layerRef.current) return;

    layerRef.current.eachLayer((layer: L.Layer) => {
      const feature = (layer as L.GeoJSON & { feature?: GeoJSON.Feature }).feature;
      if (feature?.properties?.address === focusAddress) {
        try {
          const bounds = (layer as L.Polygon).getBounds?.();
          if (bounds?.isValid()) {
            mapRef.current!.flyToBounds(bounds, { padding: [100, 100], maxZoom: 18, duration: 1 });
          }
        } catch {
          /* empty */
        }
      }
    });
  }, [focusAddress, parcels]);

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
        }
        .plinth-tooltip::before { display: none !important; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 10,
          zIndex: 1000,
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid #333',
        }}
      >
        <button
          type="button"
          onClick={() => setBasemap('satellite')}
          style={{
            background: basemap === 'satellite' ? '#5de0a0' : '#1a1a1a',
            color: basemap === 'satellite' ? '#000' : '#aaa',
            border: 'none',
            padding: '5px 11px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Satellite
        </button>
        <button
          type="button"
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
          }}
        >
          Dark
        </button>
      </div>
    </>
  );
};

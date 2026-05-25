import React, { useState, useCallback } from 'react';
import { Map } from './components/Map';
import type { ViewMode } from './components/Map';
import { FilterBar } from './components/FilterBar';
import { ParcelDetailPanel } from './components/ParcelDetailPanel';
import { ScanSearchBar } from './components/ScanSearchBar';
import { exportCsvUrl } from './api/client';
import type { ParcelCollection, ParcelProperties, FilterState } from './types/parcel';

const DEFAULT_MUNICIPALITY = 'ma_acton';

/** Embedded SIP parcel map + search (from standalone frontend App). */
export default function SipMapApp() {
  const [municipalityId, setMunicipalityId] = useState(DEFAULT_MUNICIPALITY);
  const [parcels, setParcels] = useState<ParcelCollection | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<ParcelProperties | null>(null);
  const [selectedGeometry, setSelectedGeometry] = useState<GeoJSON.Geometry | null>(null);
  const [filters, setFilters] = useState<FilterState>({ tier: null, minScore: null, zoningCode: null });
  const [viewMode, setViewMode] = useState<ViewMode>('tier');
  const [focusParcelId, setFocusParcelId] = useState<string | null>(null);

  const handleParcelClick = useCallback((parcel: ParcelProperties) => {
    setSelectedParcel(parcel);
    const feature = parcels?.features.find(
      f => f.properties.parcel_id === parcel.parcel_id
        && f.properties.municipality_id === parcel.municipality_id
    );
    setSelectedGeometry(feature?.geometry ?? null);
  }, [parcels]);

  const handleExport = () => {
    window.open(exportCsvUrl(municipalityId, filters), '_blank');
  };

  const handleScanComplete = useCallback((newMuniId: string, _newMuniName: string) => {
    setMunicipalityId(newMuniId);
    setSelectedParcel(null);
    setSelectedGeometry(null);
    setParcels(null);
  }, []);

  return (
    <div style={styles.app}>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onExport={handleExport}
        parcelCount={parcels?.features.length ?? 0}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ScanSearchBar
        onScanComplete={handleScanComplete}
        onParcelFound={(parcel, muniId, geom) => {
          if (muniId && muniId !== municipalityId) {
            setMunicipalityId(muniId);
          }
          setSelectedParcel(parcel);
          setSelectedGeometry(geom);
          setFocusParcelId(parcel.parcel_id);
          if (geom) {
            setParcels({
              type: 'FeatureCollection',
              features: [{ type: 'Feature', geometry: geom, properties: parcel }],
              total: 1,
            });
          }
        }}
      />

      <div style={styles.body}>
        <div style={styles.mapContainer}>
          <Map
            parcels={parcels}
            selectedParcelId={selectedParcel?.parcel_id ?? null}
            onParcelClick={handleParcelClick}
            viewMode={viewMode}
            focusParcelId={focusParcelId}
          />
        </div>

        {selectedParcel && (
          <ParcelDetailPanel
            parcel={selectedParcel}
            onClose={() => {
              setSelectedParcel(null);
              setSelectedGeometry(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0a0a',
  },
  body: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 0,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
};

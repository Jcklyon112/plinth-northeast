import React, { useState, useCallback } from 'react';
import { Map } from './components/Map';
import { MapHeader } from './components/MapHeader';
import { ParcelDetailPanel } from './components/ParcelDetailPanel';
import { ScanSearchBar } from './components/ScanSearchBar';
import type { ParcelCollection, ParcelProperties } from './types/parcel';

/** Embedded SIP parcel map + address search. */
export default function SipMapApp() {
  const [parcels, setParcels] = useState<ParcelCollection | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<ParcelProperties | null>(null);
  const [focusAddress, setFocusAddress] = useState<string | null>(null);

  const handleParcelClick = useCallback((parcel: ParcelProperties) => {
    setSelectedParcel(parcel);
  }, []);

  return (
    <div style={styles.app}>
      <MapHeader parcelCount={parcels?.features.length ?? 0} />

      <ScanSearchBar
        onParcelFound={(parcel, geometry) => {
          setSelectedParcel(parcel);
          setFocusAddress(parcel.address ?? null);
          if (geometry) {
            setParcels({
              type: 'FeatureCollection',
              features: [{ type: 'Feature', geometry, properties: parcel }],
              total: 1,
            });
          }
        }}
      />

      <div style={styles.body}>
        <div style={styles.mapContainer}>
          <Map
            parcels={parcels}
            selectedAddress={selectedParcel?.address ?? null}
            onParcelClick={handleParcelClick}
            focusAddress={focusAddress}
          />
        </div>

        {selectedParcel && (
          <ParcelDetailPanel
            parcel={selectedParcel}
            onClose={() => setSelectedParcel(null)}
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

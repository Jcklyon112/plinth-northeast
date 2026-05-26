import React from 'react';
import type { ParcelProperties } from '../types/parcel';
import { getUseDisplay } from '../utils/useCodeLabels';

interface Props {
  parcel: ParcelProperties;
  onClose: () => void;
}

export const ParcelDetailPanel: React.FC<Props> = ({ parcel, onClose }) => {
  const lat = (parcel as ParcelProperties & { _centroid_lat?: number })._centroid_lat;
  const lng = (parcel as ParcelProperties & { _centroid_lng?: number })._centroid_lng;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.address}>{parcel.address || 'No address'}</div>
        <button type="button" style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div style={styles.meta}>
        <MetaRow
          label="Zoning"
          value={parcel.zoning_district_label || getUseDisplay(parcel.zoning_code) || '—'}
        />
        <MetaRow
          label="Lot area"
          value={
            parcel.lot_area_sqft
              ? `${parcel.lot_area_sqft.toLocaleString()} sqft`
              : '—'
          }
        />
      </div>

      {lat != null && lng != null && (
        <div style={styles.actions}>
          <button
            type="button"
            style={styles.view3dBtn}
            onClick={() =>
              window.open(`https://earth.google.com/web/@${lat},${lng},80a,200d,0h,60t`, '_blank')
            }
          >
            View parcel in 3D
          </button>
        </div>
      )}
    </div>
  );
};

const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.metaRow}>
    <span style={styles.metaLabel}>{label}</span>
    <span style={styles.metaValue}>{value}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 320,
    height: '100%',
    background: '#1a1a1a',
    borderLeft: '1px solid #333',
    overflowY: 'auto',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '16px 16px 8px',
    borderBottom: '1px solid #333',
    gap: 8,
  },
  address: { fontWeight: 600, fontSize: 14, lineHeight: 1.3, flex: 1 },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: 16,
    cursor: 'pointer',
    padding: 4,
    flexShrink: 0,
  },
  meta: { padding: '12px 16px', borderBottom: '1px solid #222' },
  metaRow: { display: 'flex', justifyContent: 'space-between', padding: '3px 0' },
  metaLabel: { color: '#888', fontSize: 12 },
  metaValue: { fontSize: 12, textAlign: 'right', maxWidth: 200 },
  actions: { padding: '16px' },
  view3dBtn: {
    width: '100%',
    background: '#0d1f2d',
    border: '1px solid #3a7bd5',
    color: '#6eaaff',
    fontSize: 12,
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

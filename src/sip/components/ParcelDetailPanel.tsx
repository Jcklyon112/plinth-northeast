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

      {parcel.placement === null && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Plinth model fit</div>
          <p style={styles.rentUnavailable}>
            No model footprint fits with required setbacks on this parcel.
          </p>
        </div>
      )}

      {parcel.placement && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Plinth model fit</div>
          <MetaRow label="Model" value={parcel.placement.model_name} />
          <MetaRow label="Unit" value={parcel.placement.model_description} />
          <MetaRow label="Footprint" value={parcel.placement.footprint_label} />
          <MetaRow label="Size" value={`${parcel.placement.sqft.toLocaleString()} sqft`} />
          <p style={styles.setbackNote}>
            Placed with {parcel.placement.setbacks_ft?.building ?? 10}&apos; setback from the main
            building ({parcel.placement.setbacks_ft?.between_models ?? 15}&apos; between units).
          </p>
        </div>
      )}

      {parcel.rent && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Estimated rental revenue</div>
          {parcel.rent.status === 'ok' && parcel.rent.monthly_rent_usd != null ? (
            <>
              <div style={styles.rentValue}>
                ${parcel.rent.monthly_rent_usd.toLocaleString()}
                <span style={styles.rentPer}>/mo</span>
              </div>
              {parcel.rent.rent_range_low_usd != null && parcel.rent.rent_range_high_usd != null && (
                <p style={styles.rentRange}>
                  Range: ${parcel.rent.rent_range_low_usd.toLocaleString()} – $
                  {parcel.rent.rent_range_high_usd.toLocaleString()}/mo
                </p>
              )}
              <p style={styles.rentSource}>
                RentCast estimate for {parcel.rent.bedrooms ?? '—'} bed ·{' '}
                {parcel.rent.bathrooms ?? '—'} bath · {parcel.rent.square_footage ?? '—'} sqft
              </p>
            </>
          ) : (
            <p style={styles.rentUnavailable}>
              {parcel.rent.message || 'Rent estimate unavailable'}
            </p>
          )}
        </div>
      )}

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
  section: { padding: '12px 16px', borderBottom: '1px solid #222' },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#5de0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 8,
  },
  setbackNote: { fontSize: 11, color: '#666', margin: '8px 0 0', lineHeight: 1.4 },
  rentValue: { fontSize: 28, fontWeight: 700, color: '#e8e8e8' },
  rentPer: { fontSize: 14, fontWeight: 400, color: '#888', marginLeft: 4 },
  rentRange: { fontSize: 12, color: '#888', margin: '6px 0 0' },
  rentSource: { fontSize: 11, color: '#666', margin: '8px 0 0', lineHeight: 1.4 },
  rentUnavailable: { fontSize: 12, color: '#d53a3a', margin: 0 },
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

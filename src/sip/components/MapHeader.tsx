import React from 'react';

interface MapHeaderProps {
  parcelCount: number;
}

export const MapHeader: React.FC<MapHeaderProps> = ({ parcelCount }) => (
  <div style={styles.bar}>
    <div style={styles.logo}>PLINTH SIP</div>
    <div style={styles.count}>
      {parcelCount > 0 ? `${parcelCount.toLocaleString()} parcel` : 'Search for an address'}
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '10px 20px',
    background: '#111',
    borderBottom: '1px solid #222',
    flexShrink: 0,
  },
  logo: {
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 2,
    color: '#5de0a0',
  },
  count: {
    marginLeft: 'auto',
    color: '#555',
    fontSize: 12,
  },
};

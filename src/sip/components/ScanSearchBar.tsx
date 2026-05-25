import React, { useState, useRef, useEffect, useCallback } from 'react';
import { startAutoScan, getScanStatus, searchParcel } from '../api/client';
import type { AutoScanResult, ScanRunStatus, ParcelSearchResult } from '../api/client';
import type { ParcelProperties } from '../types/parcel';
import {
  fetchAddressSuggestions,
  hasMapboxToken,
  type MapboxSuggestion,
} from '../api/mapbox';

interface Props {
  onScanComplete: (municipalityId: string, municipalityName: string) => void;
  onParcelFound?: (
    parcel: ParcelProperties,
    municipalityId: string,
    geometry: GeoJSON.Geometry | null,
  ) => void;
}

const STATUS_LABELS: Record<string, string> = {
  queued: 'Queued...',
  fetching: 'Fetching parcels from GIS...',
  configuring: 'Generating municipality config...',
  loading_config: 'Loading config into database...',
  ingesting: 'Ingesting parcels into database...',
  scoring: 'Running rules engine & scoring...',
  complete: 'Scan complete!',
  failed: 'Scan failed',
};

const STATUS_PROGRESS: Record<string, number> = {
  queued: 5,
  fetching: 20,
  configuring: 45,
  loading_config: 55,
  ingesting: 65,
  scoring: 80,
  complete: 100,
  failed: 100,
};

function looksLikeZip(q: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(q.trim());
}

function looksLikeAddress(q: string): boolean {
  return /^\d+\s+\w/.test(q.trim());
}

export function ScanSearchBar({ onScanComplete, onParcelFound }: Props) {
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scanResult, setScanResult] = useState<AutoScanResult | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanRunStatus | null>(null);
  const [searchResult, setSearchResult] = useState<ParcelSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offerScan, setOfferScan] = useState<{
    municipalityId: string;
    municipalityName: string;
    state: string;
  } | null>(null);

  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const pollRef = useRef<number | null>(null);
  const debounceRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const loadSuggestions = useCallback(async (keyword: string) => {
    if (!hasMapboxToken()) {
      setSuggestions([]);
      setSuggestOpen(true);
      setSuggestLoading(false);
      return;
    }
    setSuggestLoading(true);
    try {
      const items = await fetchAddressSuggestions(keyword);
      setSuggestions(items);
      setSuggestOpen(true);
      setHighlightIdx(-1);
    } catch {
      setSuggestions([]);
      setSuggestOpen(true);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSearchResult(null);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setSuggestOpen(false);
      setSuggestLoading(false);
      return;
    }

    setSuggestOpen(true);
    setSuggestLoading(true);

    debounceRef.current = window.setTimeout(() => {
      loadSuggestions(trimmed);
    }, 300);
  };

  const applySearchResult = (result: ParcelSearchResult) => {
    setSearchResult(result);

    if (result.status === 'found' && result.parcel && onParcelFound) {
      onParcelFound(
        result.parcel,
        result.parcel.municipality_id,
        result.geometry ?? null,
      );
      setQuery('');
      setSuggestions([]);
      setSuggestOpen(false);
    } else if (result.status === 'no_match') {
      setError(result.message || 'No parcel found at this location.');
    }
  };

  const runParcelSearch = async (
    address: string,
    coords: { lat: number; lon: number },
    hints?: { state_code?: string; county?: string; city?: string },
  ) => {
    setSearching(true);
    setError(null);
    setSearchResult(null);
    setOfferScan(null);
    setSuggestOpen(false);

    try {
      const result = await searchParcel(address, coords, hints);
      applySearchResult(result);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      const msg = e?.response?.data?.detail || e?.message || 'Search failed';
      setError(msg);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSuggestion = (item: MapboxSuggestion) => {
    setQuery(item.placeName);
    setSuggestions([]);
    setSuggestOpen(false);
    runParcelSearch(
      item.placeName,
      { lat: item.lat, lon: item.lon },
      { state_code: item.stateCode, county: item.countyName, city: item.city },
    );
  };

  const startScan = async (q: string) => {
    setScanning(true);
    setError(null);
    setScanResult(null);
    setScanStatus(null);
    setSearchResult(null);
    setOfferScan(null);
    setSuggestOpen(false);

    try {
      const result = await startAutoScan(q);
      setScanResult(result);

      pollRef.current = window.setInterval(async () => {
        try {
          const status = await getScanStatus(result.scan_run_id);
          setScanStatus(status);

          if (status.status === 'complete') {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            setScanning(false);
            setTimeout(() => {
              onScanComplete(result.municipality_id, result.municipality_name);
              setScanResult(null);
              setScanStatus(null);
              setQuery('');
            }, 1500);
          } else if (status.status === 'failed') {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            setScanning(false);
            setError(`Scan failed: ${status.error_log || 'Unknown error'}`);
          }
        } catch {
          // ignore poll errors
        }
      }, 2500);
    } catch (err: unknown) {
      setScanning(false);
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      const msg = e?.response?.data?.detail || e?.message || 'Failed to start scan';
      setError(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || scanning || searching) return;

    if (highlightIdx >= 0 && suggestions[highlightIdx]) {
      handleSelectSuggestion(suggestions[highlightIdx]);
      return;
    }

    if (looksLikeAddress(q)) {
      setError('Select an address from the dropdown suggestions.');
      return;
    }

    await startScan(q);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setSuggestOpen(false);
    }
  };

  const handleOfferAccept = () => {
    if (offerScan) {
      setOfferScan(null);
      startScan(`${offerScan.municipalityName}, ${offerScan.state}`);
    }
  };

  const currentStatus = scanStatus?.status || (scanning ? 'queued' : null);
  const statusLabel = currentStatus ? STATUS_LABELS[currentStatus] || currentStatus : null;
  const progress = currentStatus ? STATUS_PROGRESS[currentStatus] || 5 : 0;
  const isComplete = currentStatus === 'complete';
  const isFailed = currentStatus === 'failed';

  const showSuggestDropdown = query.trim().length >= 3;
  const showSuggestHint = showSuggestDropdown && !hasMapboxToken();

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputRow} ref={wrapperRef}>
          <span style={styles.icon}>&#x1F50D;</span>
          <div style={styles.inputWrap}>
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.trim().length >= 3) setSuggestOpen(true);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder='Search address, zip code, or town — try "11963" or "14 Main St, Southampton NY"'
              style={styles.input}
              disabled={scanning || searching}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={suggestOpen}
            />
            {suggestOpen && showSuggestDropdown && (
              <ul style={styles.dropdown} role="listbox">
                {suggestLoading && (
                  <li style={styles.dropdownMeta}>Loading addresses…</li>
                )}
                {!suggestLoading && !hasMapboxToken() && (
                  <li style={styles.dropdownMeta}>
                    Set VITE_MAPBOX_ACCESS_TOKEN in plinth-northeast/.env
                  </li>
                )}
                {!suggestLoading &&
                  hasMapboxToken() &&
                  suggestions.length === 0 && (
                    <li style={styles.dropdownMeta}>No addresses found</li>
                  )}
                {!suggestLoading &&
                  suggestions.map((item, idx) => (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={idx === highlightIdx}
                      style={{
                        ...styles.dropdownItem,
                        ...(idx === highlightIdx ? styles.dropdownItemActive : {}),
                      }}
                      onMouseEnter={() => setHighlightIdx(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(item);
                      }}
                    >
                      {item.placeName}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(scanning || searching ? styles.buttonDisabled : {}),
            }}
            disabled={scanning || searching || !query.trim()}
          >
            {scanning ? 'Scanning...' : searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {showSuggestHint && (
          <div style={styles.hintRow}>
            Set <code style={styles.code}>VITE_MAPBOX_ACCESS_TOKEN</code> in{' '}
            <code style={styles.code}>plinth-northeast/.env</code> for address suggestions.
          </div>
        )}

        {scanning && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: isComplete ? '#22c55e' : isFailed ? '#ef4444' : '#5de0a0',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusLabel,
                  color: isComplete ? '#22c55e' : isFailed ? '#ef4444' : '#5de0a0',
                }}
              >
                {isComplete ? 'OK ' : isFailed ? 'X ' : ''}
                {statusLabel}
              </span>
              {scanResult && (
                <span style={styles.muniLabel}>
                  {scanResult.municipality_name}, {scanResult.state}
                </span>
              )}
            </div>
          </div>
        )}

        {offerScan && !scanning && (
          <div style={styles.offerRow}>
            <span style={styles.offerText}>
              {offerScan.municipalityName}, {offerScan.state} not yet scanned.
            </span>
            <button type="button" style={styles.offerBtn} onClick={handleOfferAccept}>
              Scan it now
            </button>
            <button type="button" style={styles.dismissBtn} onClick={() => setOfferScan(null)}>
              x
            </button>
          </div>
        )}

        {searchResult?.status === 'found' && !scanning && (
          <div style={styles.foundRow}>
            <span style={styles.foundText}>
              Found: {searchResult.parcel?.address || searchResult.parcel?.parcel_id} —
              Tier {searchResult.parcel?.tier ?? '?'}, Score{' '}
              {searchResult.parcel?.score?.toFixed(0) ?? '?'}
            </span>
            <button type="button" style={styles.dismissBtn} onClick={() => setSearchResult(null)}>
              x
            </button>
          </div>
        )}

        {error && !scanning && (
          <div style={styles.errorRow}>
            <span style={styles.errorText}>X {error}</span>
            <button type="button" style={styles.dismissBtn} onClick={() => setError(null)}>
              x
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: '#0e0e0e',
    borderBottom: '1px solid #1e1e1e',
    padding: '8px 20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '6px 12px',
    position: 'relative',
  },
  inputWrap: {
    flex: 1,
    position: 'relative',
    minWidth: 0,
  },
  icon: {
    fontSize: 14,
    color: '#555',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e0e0e0',
    fontSize: 13,
    fontFamily: 'inherit',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    margin: '4px 0 0',
    padding: 0,
    listStyle: 'none',
    background: '#141414',
    border: '1px solid #333',
    borderRadius: 6,
    maxHeight: 240,
    overflowY: 'auto',
    zIndex: 2000,
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  dropdownItem: {
    padding: '8px 12px',
    fontSize: 12,
    color: '#ccc',
    cursor: 'pointer',
    borderBottom: '1px solid #222',
  },
  dropdownItemActive: {
    background: '#1e2e24',
    color: '#5de0a0',
  },
  dropdownMeta: {
    padding: '8px 12px',
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    background: '#5de0a0',
    color: '#000',
    border: 'none',
    borderRadius: 4,
    padding: '4px 14px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    letterSpacing: '0.02em',
  },
  buttonDisabled: {
    background: '#2a4a3a',
    color: '#555',
    cursor: 'not-allowed',
  },
  hintRow: {
    fontSize: 11,
    color: '#666',
    paddingLeft: 4,
  },
  code: {
    fontFamily: 'monospace',
    color: '#888',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  progressBg: {
    height: 3,
    background: '#222',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  muniLabel: {
    fontSize: 11,
    color: '#555',
  },
  offerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#1a1a0e',
    border: '1px solid #3a3a1a',
    borderRadius: 4,
    padding: '6px 10px',
  },
  offerText: {
    fontSize: 12,
    color: '#eab308',
    flex: 1,
  },
  offerBtn: {
    background: '#eab308',
    color: '#000',
    border: 'none',
    borderRadius: 4,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
  foundRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0a1e0a',
    border: '1px solid #1a3a1a',
    borderRadius: 4,
    padding: '4px 10px',
  },
  foundText: {
    fontSize: 12,
    color: '#22c55e',
  },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e0a0a',
    border: '1px solid #3a1a1a',
    borderRadius: 4,
    padding: '4px 10px',
  },
  errorText: {
    fontSize: 12,
    color: '#e05c5c',
  },
  dismissBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: 16,
    padding: '0 4px',
    lineHeight: 1,
  },
};

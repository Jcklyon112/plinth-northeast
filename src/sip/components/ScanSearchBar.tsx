import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchParcel } from '../api/client';
import type { ParcelSearchResult } from '../api/client';
import type { ParcelProperties } from '../types/parcel';
import {
  fetchAddressSuggestions,
  hasMapboxToken,
  type MapboxSuggestion,
} from '../api/mapbox';

interface Props {
  onParcelFound?: (
    parcel: ParcelProperties,
    geometry: GeoJSON.Geometry | null,
  ) => void;
}

export function ScanSearchBar({ onParcelFound }: Props) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ParcelSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const debounceRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
    debounceRef.current = window.setTimeout(() => loadSuggestions(trimmed), 300);
  };

  const applySearchResult = (result: ParcelSearchResult) => {
    setSearchResult(result);

    if (result.status === 'found' && result.parcel && onParcelFound) {
      onParcelFound(result.parcel, result.geometry ?? null);
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
    setSuggestOpen(false);

    try {
      const result = await searchParcel(address, coords, hints);
      applySearchResult(result);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      setError(e?.response?.data?.detail || e?.message || 'Search failed');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlightIdx >= 0 && suggestions[highlightIdx]) {
      handleSelectSuggestion(suggestions[highlightIdx]);
      return;
    }
    setError('Select an address from the dropdown suggestions.');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setSuggestOpen(false);
    }
  };

  const showSuggestDropdown = query.trim().length >= 3;

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputRow} ref={wrapperRef}>
          <span style={styles.icon}>&#x1F50D;</span>
          <div style={styles.inputWrap}>
            <input
              type="text"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.trim().length >= 3) setSuggestOpen(true);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder='Search address — e.g. "14 Main St, Southampton NY"'
              style={styles.input}
              disabled={searching}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={suggestOpen}
            />
            {suggestOpen && showSuggestDropdown && (
              <ul style={styles.dropdown} role="listbox">
                {suggestLoading && <li style={styles.dropdownMeta}>Loading addresses…</li>}
                {!suggestLoading && !hasMapboxToken() && (
                  <li style={styles.dropdownMeta}>
                    Set VITE_MAPBOX_ACCESS_TOKEN in plinth-northeast/.env
                  </li>
                )}
                {!suggestLoading && hasMapboxToken() && suggestions.length === 0 && (
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
                      onMouseDown={ev => {
                        ev.preventDefault();
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
              ...(searching ? styles.buttonDisabled : {}),
            }}
            disabled={searching || !query.trim()}
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>

        {searchResult?.status === 'found' && (
          <div style={styles.foundRow}>
            <span style={styles.foundText}>
              Found: {searchResult.parcel?.address}
              {searchResult.parcel?.lot_area_sqft
                ? ` · ${searchResult.parcel.lot_area_sqft.toLocaleString()} sqft`
                : ''}
            </span>
            <button type="button" style={styles.dismissBtn} onClick={() => setSearchResult(null)}>
              ×
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorRow}>
            <span style={styles.errorText}>{error}</span>
            <button type="button" style={styles.dismissBtn} onClick={() => setError(null)}>
              ×
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
  form: { display: 'flex', flexDirection: 'column', gap: 6 },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    padding: '6px 12px',
  },
  inputWrap: { flex: 1, position: 'relative', minWidth: 0 },
  icon: { fontSize: 14, color: '#555', flexShrink: 0 },
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
  },
  dropdownItem: {
    padding: '8px 12px',
    fontSize: 12,
    color: '#ccc',
    cursor: 'pointer',
    borderBottom: '1px solid #222',
  },
  dropdownItemActive: { background: '#1e2e24', color: '#5de0a0' },
  dropdownMeta: { padding: '8px 12px', fontSize: 11, color: '#666', fontStyle: 'italic' },
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
  },
  buttonDisabled: { background: '#2a4a3a', color: '#555', cursor: 'not-allowed' },
  foundRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0a1e0a',
    border: '1px solid #1a3a1a',
    borderRadius: 4,
    padding: '4px 10px',
  },
  foundText: { fontSize: 12, color: '#22c55e' },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e0a0a',
    border: '1px solid #3a1a1a',
    borderRadius: 4,
    padding: '4px 10px',
  },
  errorText: { fontSize: 12, color: '#e05c5c' },
  dismissBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: 16,
    padding: '0 4px',
  },
};

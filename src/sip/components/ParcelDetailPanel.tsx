import React, { useEffect, useState } from 'react';
import type { ParcelProperties, ParcelDetail, RuleResultDetail } from '../types/parcel';
import { fetchParcelDetail, updateAnalystRecord } from '../api/client';
import { getUseDisplay } from '../utils/useCodeLabels';
import { ProFormaPanel } from './ProFormaPanel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function downloadParcelPdf(parcel: ParcelProperties, detail: ParcelDetail | null): Promise<void> {
  const payload = {
    ...parcel,
    rule_results: detail?.rule_results ?? parcel.rule_results ?? [],
    template_fits: parcel.template_fits ?? [],
  };
  const res = await fetch(`${API_BASE}/reports/parcel-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(err);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plinth_report_${parcel.parcel_id || 'parcel'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface Props {
  parcel: ParcelProperties;
  onClose: () => void;
}

const RESULT_COLOR: Record<string, string> = {
  pass: '#7fd9a8',
  conditional: '#f5c842',
  fail: '#e05c5c',
  unknown: '#888',
};

const TIER_COLOR: Record<number, string> = {
  1: '#7fd9a8',
  2: '#f5c842',
  3: '#f0a050',
  4: '#e05c5c',
};

export const ParcelDetailPanel: React.FC<Props> = ({ parcel, onClose }) => {
  const [detail, setDetail] = useState<ParcelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showProForma, setShowProForma] = useState(false);

  useEffect(() => {
    const isLiveLookupParcel = (parcel.municipality_id || '').endsWith('_coord');
    if (isLiveLookupParcel) {
      setDetail({
        parcel,
        rule_results: parcel.rule_results ?? [],
        analyst: null,
      });
      setNotes('');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchParcelDetail(parcel.municipality_id, parcel.parcel_id)
      .then(d => {
        setDetail(d);
        setNotes(d.analyst?.notes || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [parcel.parcel_id, parcel.municipality_id]);

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateAnalystRecord(parcel.municipality_id, parcel.parcel_id, { notes });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.address}>{parcel.address || 'No address'}</div>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div style={styles.meta}>
        <MetaRow label="Parcel ID" value={parcel.parcel_id} />
        <MetaRow label="Owner" value={parcel.owner_name || '—'} />
        <MetaRow
          label="Zoning"
          value={parcel.zoning_district_label || getUseDisplay(parcel.zoning_code)}
        />
        <MetaRow label="Lot Area" value={parcel.lot_area_sqft ? `${parcel.lot_area_sqft.toLocaleString()} sqft` : '—'} />
        <MetaRow label="Structures" value={parcel.existing_structure_count != null ? String(parcel.existing_structure_count) : '—'} />
      </div>

      {parcel.tier && (
        <div style={{ ...styles.tierBadge, background: TIER_COLOR[parcel.tier] }}>
          Tier {parcel.tier} &nbsp;·&nbsp; Score: {parcel.score?.toFixed(1) ?? '—'}
          &nbsp;·&nbsp; Confidence: {parcel.confidence != null ? `${(parcel.confidence * 100).toFixed(0)}%` : '—'}
        </div>
      )}

      {parcel.blockers && parcel.blockers.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Blockers</div>
          {parcel.blockers.map((b, i) => (
            <div key={i} style={styles.blocker}>⚠ {b.explanation}</div>
          ))}
        </div>
      )}

      {parcel.score_breakdown && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Score Breakdown</div>
          {Object.entries(parcel.score_breakdown).map(([cat, val]) => (
            <ScoreRow key={cat} category={cat} score={val.score} weight={val.weight} />
          ))}
        </div>
      )}

      {loading && <div style={styles.loading}>Loading rule results...</div>}

      {detail && (
        <>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Rule Results</div>
            {detail.rule_results.map(r => (
              <RuleRow key={r.rule_id} rule={r} />
            ))}
          </div>

          {parcel.template_fits && parcel.template_fits.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Template Fit</div>
              {parcel.template_fits.map(t => (
                <div key={t.template_id} style={styles.templateRow}>
                  <span style={{ color: t.fit_status === 'fits' ? '#7fd9a8' : t.fit_status === 'does_not_fit' ? '#e05c5c' : '#888' }}>
                    {t.fit_status === 'fits' ? '✓' : t.fit_status === 'does_not_fit' ? '✗' : '?'}
                  </span>
                  &nbsp;{t.template_name} ({t.footprint_area_sqft} sqft)
                  {t.notes && <span style={styles.templateNote}> — {t.notes}</span>}
                </div>
              ))}
            </div>
          )}

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Analyst Notes</div>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
            />
            <button style={styles.saveBtn} onClick={saveNotes} disabled={saving}>
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </>
      )}

      {(() => {
        const lat = (parcel as ParcelProperties & { _centroid_lat?: number })._centroid_lat;
        const lng = (parcel as ParcelProperties & { _centroid_lng?: number })._centroid_lng;
        if (!lat || !lng) return null;
        const earthUrl = `https://earth.google.com/web/@${lat},${lng},80a,200d,0h,60t`;
        return (
          <div style={{ padding: '10px 16px 0', borderTop: '1px solid #2a2a2a' }}>
            <button
              style={styles.view3dBtn}
              onClick={() => window.open(earthUrl, '_blank')}
            >
              🌐&nbsp; View Parcel in 3D
            </button>
            <div style={{ fontSize: 10, color: '#444', textAlign: 'center', marginTop: 5 }}>
              Opens Google Earth — tilt to explore the site in 3D
            </div>
          </div>
        );
      })()}

      {parcel.score != null && (
        <div style={styles.pfSection}>
          <button
            style={styles.pfBtn}
            onClick={() => setShowProForma(true)}
          >
            ▦&nbsp; Run Financial Pro Forma
          </button>
          <div style={styles.pdfHint}>
            Institutional-quality ADU rental investment memo with sources &amp; uses, 10-yr cash flow,
            IRR, and sensitivity heatmap.
          </div>
        </div>
      )}

      <div style={styles.pdfSection}>
        {pdfError && (
          <div style={styles.pdfError}>{pdfError}</div>
        )}
        <button
          style={{
            ...styles.pdfBtn,
            opacity: pdfLoading ? 0.6 : 1,
            cursor: pdfLoading ? 'not-allowed' : 'pointer',
          }}
          disabled={pdfLoading}
          onClick={async () => {
            setPdfLoading(true);
            setPdfError(null);
            try {
              await downloadParcelPdf(parcel, detail);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'PDF generation failed';
              setPdfError(message);
            } finally {
              setPdfLoading(false);
            }
          }}
        >
          {pdfLoading ? '⏳  Generating report...' : '↓  Download Feasibility Report'}
        </button>
        <div style={styles.pdfHint}>Full PDF with rule breakdown, score analysis & outreach intelligence</div>
      </div>

      {showProForma && (
        <ProFormaPanel
          parcel={{ ...parcel, rule_results: detail?.rule_results ?? parcel.rule_results ?? null }}
          onClose={() => setShowProForma(false)}
        />
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

const ScoreRow = ({ category, score, weight }: { category: string; score: number; weight: number }) => {
  const color = score >= 75 ? '#7fd9a8' : score >= 50 ? '#f5c842' : '#e05c5c';
  const barWidth = `${score}%`;
  const label = category.replace(/_/g, ' ');
  return (
    <div style={styles.scoreRow}>
      <div style={styles.scoreLabel}>{label}</div>
      <div style={styles.scoreBarBg}>
        <div style={{ ...styles.scoreBar, width: barWidth, background: color }} />
      </div>
      <div style={{ ...styles.scoreValue, color }}>{score.toFixed(0)}</div>
      <div style={styles.scoreWeight}>{(weight * 100).toFixed(0)}%</div>
    </div>
  );
};

const RuleRow = ({ rule }: { rule: RuleResultDetail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.ruleRow}>
      <div style={styles.ruleHeader} onClick={() => setOpen(o => !o)}>
        <span style={{ ...styles.resultDot, background: RESULT_COLOR[rule.result] }} />
        <span style={styles.ruleId}>{rule.rule_id.replace(/_/g, ' ')}</span>
        <span style={{ ...styles.resultBadge, color: RESULT_COLOR[rule.result] }}>
          {rule.result}
        </span>
        <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={styles.ruleDetail}>
          <p>{rule.explanation}</p>
          {rule.confidence != null && (
            <p style={styles.confidence}>Confidence: {(rule.confidence * 100).toFixed(0)}%</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 380,
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
  metaValue: { fontSize: 12, textAlign: 'right', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' },
  tierBadge: {
    margin: '12px 16px',
    padding: '6px 12px',
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  section: { padding: '12px 16px', borderBottom: '1px solid #222' },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  blocker: { fontSize: 12, color: '#e05c5c', marginBottom: 4, lineHeight: 1.4 },
  scoreRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  scoreLabel: { fontSize: 11, color: '#aaa', width: 140, textTransform: 'capitalize' },
  scoreBarBg: { flex: 1, height: 6, background: '#333', borderRadius: 3, overflow: 'hidden' },
  scoreBar: { height: '100%', borderRadius: 3, transition: 'width 0.3s' },
  scoreValue: { fontSize: 11, fontWeight: 700, width: 28, textAlign: 'right' },
  scoreWeight: { fontSize: 10, color: '#555', width: 28, textAlign: 'right' },
  ruleRow: { marginBottom: 6, border: '1px solid #2a2a2a', borderRadius: 4, overflow: 'hidden' },
  ruleHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', cursor: 'pointer', background: '#222' },
  resultDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  ruleId: { flex: 1, fontSize: 12, textTransform: 'capitalize' },
  resultBadge: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' },
  chevron: { fontSize: 10, color: '#555' },
  ruleDetail: { padding: '8px 10px', background: '#1e1e1e', fontSize: 11, color: '#aaa', lineHeight: 1.5 },
  confidence: { marginTop: 4, color: '#666' },
  templateRow: { fontSize: 12, marginBottom: 4, color: '#ccc' },
  templateNote: { color: '#777' },
  textarea: {
    width: '100%',
    background: '#222',
    border: '1px solid #444',
    color: '#e8e8e8',
    padding: 8,
    borderRadius: 4,
    fontSize: 12,
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  saveBtn: {
    marginTop: 8,
    background: '#7fd9a8',
    color: '#000',
    border: 'none',
    padding: '5px 14px',
    borderRadius: 4,
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
  },
  loading: { padding: 16, color: '#666', fontSize: 12 },
  view3dBtn: {
    width: '100%',
    background: '#0d1f2d',
    border: '1px solid #3a7bd5',
    color: '#6eaaff',
    fontSize: 12,
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: 5,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    textAlign: 'center' as const,
    marginBottom: 2,
  },
  pdfSection: {
    padding: '14px 16px 20px',
    borderTop: '1px solid #2a2a2a',
    marginTop: 'auto',
  },
  pfSection: {
    padding: '14px 16px 6px',
    borderTop: '1px solid #2a2a2a',
  },
  pfBtn: {
    width: '100%',
    background: '#1a1208',
    border: '1px solid #d6a960',
    color: '#f5c842',
    fontSize: 12,
    fontWeight: 700,
    padding: '11px 14px',
    borderRadius: 5,
    letterSpacing: '0.05em',
    textAlign: 'center' as const,
    cursor: 'pointer',
  },
  pdfBtn: {
    width: '100%',
    background: '#0d2a1a',
    border: '1px solid #5de0a0',
    color: '#5de0a0',
    fontSize: 12,
    fontWeight: 700,
    padding: '11px 14px',
    borderRadius: 5,
    letterSpacing: '0.05em',
    textAlign: 'center' as const,
    transition: 'background 0.15s',
  },
  pdfError: {
    color: '#e05d5d',
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  },
  pdfHint: {
    marginTop: 6,
    fontSize: 10,
    color: '#444',
    textAlign: 'center' as const,
    lineHeight: 1.4,
  },
};

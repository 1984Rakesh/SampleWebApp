import React, { useEffect, useId } from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open = true, onClose, title, subtitle, children, actions, maxWidth = 540, contained = false, style }) {
  const tid = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 1300, background: 'var(--backdrop)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div role="dialog" aria-modal="true" aria-labelledby={tid}
        style={{ width: '100%', maxWidth, maxHeight: 'calc(100% - 48px)', overflow: 'auto', background: 'var(--bg-paper)', border: '1px solid var(--border-dialog)',
          borderRadius: 'var(--radius-dialog)', padding: 'var(--dialog-pad)', boxShadow: 'var(--shadow-dialog)', color: 'var(--text-primary)', ...style }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id={tid} style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{title}</h3>
            {subtitle ? <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</p> : null}
          </div>
          {onClose ? <IconButton variant="bare" size={36} icon="x" label="Close" onClick={onClose} /> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>{children}</div>
        {actions ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>{actions}</div> : null}
      </div>
    </div>
  );
}

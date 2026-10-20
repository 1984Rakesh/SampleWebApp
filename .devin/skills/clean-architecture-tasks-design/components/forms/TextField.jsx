import React, { useState, useId } from 'react';
import { Icon } from '../core/Icon.jsx';
export function TextField({ label, required = false, value, defaultValue, onChange, placeholder, multiline = false, rows = 3, startIcon, endIcon,
  readOnly = false, disabled = false, variant = 'default', type = 'text', id, inputRef, autoFocus, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const autoId = useId();
  const fid = id || autoId;
  const toolbar = variant === 'toolbar';
  const border = readOnly ? 'var(--border-card)' : focus ? 'var(--primary)' : toolbar ? 'var(--border-control)' : 'var(--border-input)';
  const box = {
    display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10,
    padding: multiline ? '12px 14px' : '0 14px', minHeight: toolbar ? 44 : 46,
    background: readOnly ? 'var(--bg-readonly)' : toolbar ? 'var(--bg-paper)' : 'var(--bg-inset)',
    border: '1px solid ' + border, boxShadow: focus && !readOnly ? 'inset 0 0 0 0.5px var(--primary)' : 'none',
    borderRadius: 'var(--radius-control)', transition: 'border-color .15s ease', opacity: disabled ? 0.5 : 1,
  };
  const inputStyle = {
    flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: multiline ? 0 : '12px 0',
    fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: '22px', resize: multiline ? 'vertical' : undefined,
    color: readOnly ? 'var(--text-secondary)' : 'var(--text-primary)',
  };
  const common = { id: fid, value, defaultValue, placeholder, readOnly, disabled, required, autoFocus, ref: inputRef,
    onChange: onChange ? (e) => onChange(e.target.value, e) : undefined,
    onFocus: () => setFocus(true), onBlur: () => setFocus(false), style: inputStyle, ...rest };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, ...style }}>
      {label ? <label htmlFor={fid} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}{required ? <span aria-hidden="true" style={{ color: 'var(--danger)' }}> *</span> : null}</label> : null}
      <div style={box}>
        {startIcon ? <Icon name={startIcon} size={16} color="var(--text-secondary)" /> : null}
        {multiline ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
        {endIcon ? <Icon name={endIcon} size={16} color="var(--text-secondary)" /> : null}
      </div>
    </div>
  );
}

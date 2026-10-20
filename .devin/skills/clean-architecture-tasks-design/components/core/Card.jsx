import React from 'react';
export function Card({ padding = 24, radius = 20, as = 'div', children, style, ...rest }) {
  const Tag = as;
  return (
    <Tag style={{ background: 'var(--bg-paper)', border: '1px solid var(--border-card)', borderRadius: radius,
      boxShadow: 'var(--shadow-card)', padding, minWidth: 0, ...style }} {...rest}>{children}</Tag>
  );
}

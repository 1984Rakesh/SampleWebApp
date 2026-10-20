// cn(): clsx + a small tailwind-merge subset (later classes win per variant+utility group).
// In production use the shadcn lib/utils.ts (clsx + tailwind-merge).
const DISPLAY = { block: 1, 'inline-block': 1, inline: 1, flex: 1, 'inline-flex': 1, grid: 1, 'inline-grid': 1, hidden: 1, table: 1, contents: 1 };
const PREFIXES = ['min-w', 'max-w', 'min-h', 'max-h', 'gap-x', 'gap-y', 'inset', 'size', 'gap', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'm', 'h', 'w', 'rounded', 'bg', 'items', 'justify', 'leading', 'tracking', 'shadow', 'opacity', 'z', 'top', 'left', 'right', 'bottom', 'text', 'font'];
const TEXT_SIZE = /^(xs|sm|base|lg|xl|[2-9]xl|\[[\d.]+(px|rem|em)\])$/;
const WEIGHT = /^(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/;
const CORNER = /^(t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee)(-|$)/;
function splitVariant(c) {
  let depth = 0, idx = -1;
  for (let i = 0; i < c.length; i++) { const ch = c[i]; if (ch === '[') depth++; else if (ch === ']') depth--; else if (ch === ':' && depth === 0) idx = i; }
  return [c.slice(0, idx + 1), c.slice(idx + 1)];
}
function group(u) {
  u = u.replace(/^!/, '').replace(/^-/, '');
  if (DISPLAY[u]) return 'display';
  if (/^flex-(row|col)/.test(u)) return 'flex-dir';
  if (u === 'rounded' || u === 'shadow') return u;
  for (const p of PREFIXES) {
    if (u.indexOf(p + '-') !== 0) continue;
    const r = u.slice(p.length + 1);
    if (p === 'text') return TEXT_SIZE.test(r) ? 'text-size' : /^(left|center|right|justify|start|end)$/.test(r) ? 'text-align' : /^(wrap|nowrap|balance|pretty|ellipsis|clip)$/.test(r) ? null : 'text-color';
    if (p === 'font') return WEIGHT.test(r) ? 'font-weight' : 'font-family';
    if (p === 'rounded' && CORNER.test(r)) return null;
    if (p === 'bg' && /^(clip|origin|repeat|no-repeat|fixed|local|scroll|linear|radial|conic|none|cover|contain|auto|center|top|bottom|left|right)/.test(r)) return null;
    return p;
  }
  return null;
}
function flat(v, out) {
  if (!v) return;
  if (typeof v === 'string' || typeof v === 'number') String(v).split(/\s+/).forEach((c) => c && out.push(c));
  else if (Array.isArray(v)) v.forEach((x) => flat(x, out));
  else if (typeof v === 'object') for (const k in v) if (v[k]) flat(k, out);
}
export function cn(...inputs) {
  const list = []; flat(inputs, list);
  const seen = {}; const out = [];
  list.forEach((c) => { const [v, u] = splitVariant(c); const g = group(u); if (g) { const k = v + '|' + g; if (seen[k] !== undefined) out[seen[k]] = null; seen[k] = out.length; } out.push(c); });
  return out.filter(Boolean).join(' ');
}
export function cva(base, config) {
  const variants = (config && config.variants) || {}; const defaults = (config && config.defaultVariants) || {};
  return (props) => {
    const p = props || {}; const cls = [base];
    for (const k in variants) { const v = p[k] != null ? p[k] : defaults[k]; if (v != null && variants[k][v]) cls.push(variants[k][v]); }
    return cn(cls, p.className);
  };
}

/* @ds-bundle: {"format":4,"namespace":"CleanArchitectureTasksDesignSystem_40f78d","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"TaskRow","sourcePath":"components/data/TaskRow.jsx"},{"name":"TaskTable","sourcePath":"components/data/TaskTable.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/forms/Tabs.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"NavPill","sourcePath":"components/navigation/NavPill.jsx"},{"name":"UserPill","sourcePath":"components/navigation/UserPill.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"daab420f146d","components/core/Button.jsx":"56bd8f407fbf","components/core/Card.jsx":"3252757c1819","components/core/Chip.jsx":"f8af62c89125","components/core/Icon.jsx":"dba590af7da2","components/core/IconButton.jsx":"aa2b37376ef2","components/core/Logo.jsx":"89740a3b2a67","components/data/ProgressBar.jsx":"d46b58afa906","components/data/StatCard.jsx":"287c6b308bdb","components/data/TaskRow.jsx":"e47a06d91533","components/data/TaskTable.jsx":"84eaf070d714","components/forms/Checkbox.jsx":"73bb185fa207","components/forms/SegmentedControl.jsx":"b429d54a2ae3","components/forms/Select.jsx":"13be3174086f","components/forms/Tabs.jsx":"fc1002eb81cd","components/forms/TextField.jsx":"1b6643fc796a","components/navigation/AppHeader.jsx":"bcba29a4fa8c","components/navigation/NavPill.jsx":"56c6c18021b8","components/navigation/UserPill.jsx":"275d2cf6068e","components/overlay/Dialog.jsx":"36f64c7cf2f1","ui_kits/tasks-app/data.js":"13ee008200ef","ui_kits/tasks-app/screen-dashboard.jsx":"3eb188f37695","ui_kits/tasks-app/screen-profile.jsx":"c89f5cda4587","ui_kits/tasks-app/screen-tasks.jsx":"35c75bfeb023","ui_kits/tasks-app/task-dialog.jsx":"62960431ec8c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CleanArchitectureTasksDesignSystem_40f78d = window.CleanArchitectureTasksDesignSystem_40f78d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Avatar({
  name = '',
  size = 32,
  style,
  ...rest
}) {
  const initial = (name.trim()[0] || '?').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 999,
      background: 'var(--primary)',
      color: 'var(--on-primary)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.42),
      lineHeight: 1,
      flexShrink: 0,
      ...style
    }
  }, rest), initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  padding = 24,
  radius = 20,
  as = 'div',
  children,
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      background: 'var(--bg-paper)',
      border: '1px solid var(--border-card)',
      borderRadius: radius,
      boxShadow: 'var(--shadow-card)',
      padding,
      minWidth: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PRIORITY = {
  High: 'high',
  Medium: 'medium',
  Low: 'low'
};
const STATUS = {
  'To do': 'todo',
  'In progress': 'inprogress',
  Done: 'done'
};
function Chip({
  priority,
  status,
  tone,
  dot,
  children,
  style,
  ...rest
}) {
  const t = tone || (priority ? PRIORITY[priority] : status ? STATUS[status] : 'neutral');
  const label = children != null ? children : priority || status;
  const showDot = dot != null ? dot : !!priority;
  const fg = t === 'neutral' ? 'var(--neutral-tile-text)' : 'var(--chip-' + t + '-fg)';
  const bg = t === 'neutral' ? 'var(--neutral-tile)' : 'var(--chip-' + t + '-bg)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 999,
      background: bg,
      color: fg,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), showDot ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: fg,
      flexShrink: 0
    }
  }) : null, label);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LUCIDE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  label,
  style,
  ...rest
}) {
  const url = 'url("' + LUCIDE + name + '.svg")';
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: 'inline-block',
      flexShrink: 0,
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Button({
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  disabled = false,
  fullWidth = false,
  href,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const h = hover && !disabled;
  const sm = size === 'sm';
  const variants = {
    primary: {
      background: h ? 'var(--primary-hover)' : 'var(--primary)',
      color: 'var(--on-primary)',
      borderColor: 'transparent'
    },
    outlined: {
      background: h ? 'var(--hover-overlay)' : 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-input)'
    },
    text: {
      background: h ? 'var(--hover-overlay)' : 'transparent',
      color: 'var(--primary-soft)',
      borderColor: 'transparent'
    }
  };
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: sm ? '7px 14px' : 'var(--button-pad)',
    borderRadius: 'var(--radius-control)',
    border: '1px solid',
    fontFamily: 'var(--font-body)',
    fontSize: sm ? 14 : 15,
    fontWeight: 600,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color .15s ease, border-color .15s ease',
    ...variants[variant],
    ...style
  };
  const content = [startIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: "s",
    name: startIcon,
    size: sm ? 16 : 18
  }) : null, children, endIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: "e",
    name: endIcon,
    size: sm ? 16 : 18
  }) : null];
  const ev = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    style: s
  }, ev, rest), content);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: s
  }, ev, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function IconButton({
  icon,
  label,
  tone = 'default',
  variant = 'outlined',
  size = 40,
  iconSize,
  onClick,
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const danger = tone === 'danger';
  const bare = variant === 'bare';
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    padding: 0,
    flexShrink: 0,
    borderRadius: bare ? 10 : 'var(--radius-control)',
    border: bare ? '1px solid transparent' : '1px solid ' + (danger ? 'var(--danger-border)' : 'var(--border-control)'),
    background: hover && !disabled ? 'var(--hover-overlay)' : 'transparent',
    color: danger ? 'var(--danger)' : bare ? 'var(--text-secondary)' : 'var(--text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background-color .15s ease',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize || (size >= 40 ? 18 : 16)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function Logo({
  name = 'Clean Architecture',
  showWordmark = true,
  size = 32,
  href,
  onClick,
  style
}) {
  const inner = [/*#__PURE__*/React.createElement("span", {
    key: "m",
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'var(--primary)',
      color: 'var(--on-primary)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: Math.round(size * 0.56)
  })), showWordmark ? /*#__PURE__*/React.createElement("span", {
    key: "w",
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 19,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap'
    }
  }, name) : null];
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: 'none',
    border: 0,
    padding: 0,
    cursor: href || onClick ? 'pointer' : 'default',
    textDecoration: 'none',
    ...style
  };
  if (href) return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    "aria-label": name,
    style: s
  }, inner);
  if (onClick) return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-label": name,
    style: s
  }, inner);
  return /*#__PURE__*/React.createElement("span", {
    style: s
  }, inner);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
const DEFAULT_COLORS = {
  Completed: 'var(--done)',
  'In progress': 'var(--bar-in-progress)',
  'To do': 'var(--bar-todo)'
};
function ProgressBar({
  segments = [],
  height = 10,
  legend = false,
  label,
  style
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const color = s => s.color || DEFAULT_COLORS[s.label] || 'var(--bar-todo)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": label || segments.map(s => s.label + ' ' + s.value).join(', '),
    style: {
      display: 'flex',
      gap: 4,
      height
    }
  }, segments.filter(s => s.value > 0).map(s => /*#__PURE__*/React.createElement("span", {
    key: s.label,
    style: {
      flex: s.value / total + ' 1 0',
      borderRadius: 999,
      background: color(s)
    }
  }))), legend ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, segments.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: color(s)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      flex: 1
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, s.value)))) : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
const TILE = {
  done: ['var(--chip-done-bg)', 'var(--chip-done-fg)', 'circle-check'],
  inprogress: ['var(--chip-inprogress-bg)', 'var(--chip-inprogress-fg)', 'clock'],
  todo: ['var(--neutral-tile)', 'var(--neutral-tile-text)', 'list']
};
function StatCard({
  label,
  value,
  caption,
  tone = 'todo',
  icon,
  captionTone,
  style
}) {
  const [bg, fg, defIcon] = TILE[tone] || TILE.todo;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    padding: 24,
    style: {
      flex: '1 1 240px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-tile)',
      background: bg,
      color: fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || defIcon,
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 48,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      marginTop: 4
    }
  }, value), caption ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 13,
      color: captionTone === 'amber' ? 'var(--amber-text)' : 'var(--text-secondary)'
    }
  }, caption) : null);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
const {
  useState
} = React;
function Checkbox({
  checked = false,
  onChange,
  label,
  size = 22,
  disabled = false,
  style
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": checked,
    "aria-label": label,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      padding: 0,
      flexShrink: 0,
      borderRadius: 999,
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: '2px solid ' + (checked ? 'var(--done)' : hover ? 'var(--text-secondary)' : 'var(--checkbox-ring)'),
      background: checked ? 'var(--done)' : 'transparent',
      color: 'var(--on-done)',
      transition: 'background-color .15s ease, border-color .15s ease',
      ...style
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: Math.round(size * 0.62),
    style: {
      strokeWidth: 3
    }
  }) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/data/TaskRow.jsx
try { (() => {
function TaskRow({
  task,
  onToggle,
  divider = true,
  style
}) {
  const done = task.status === 'Done';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '18px 24px',
      borderTop: divider ? '1px solid var(--border-subtle)' : 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: done,
    label: (done ? 'Mark not done: ' : 'Mark complete: ') + task.title,
    onChange: () => onToggle && onToggle(task),
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '22px',
      textDecoration: done ? 'line-through' : 'none',
      color: done ? 'var(--text-secondary)' : 'var(--text-primary)'
    }
  }, task.title), task.description ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, task.description) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    status: task.status
  }), /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    priority: task.priority
  }))), task.dueLabel ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      whiteSpace: 'nowrap',
      fontWeight: task.dueToday ? 600 : 400,
      color: task.dueToday ? 'var(--amber-text)' : 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 14
  }), task.dueLabel) : null);
}
Object.assign(__ds_scope, { TaskRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TaskRow.jsx", error: String((e && e.message) || e) }); }

// components/data/TaskTable.jsx
try { (() => {
const th = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border-subtle)',
  whiteSpace: 'nowrap'
};
const td = {
  padding: '14px 16px',
  borderBottom: '1px solid var(--border-subtle)',
  verticalAlign: 'middle'
};
function TaskTable({
  tasks = [],
  onToggle,
  onEdit,
  onDelete,
  footer,
  emptyText = 'No tasks match these filters.',
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    padding: 0,
    style: {
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      minWidth: 860,
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 56
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }
  }, "Done")), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Task"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 140
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 140
    }
  }, "Priority"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 140
    }
  }, "Due"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 110,
      textAlign: 'right'
    }
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, tasks.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      ...td,
      textAlign: 'center',
      color: 'var(--text-secondary)',
      padding: 40
    }
  }, emptyText)) : null, tasks.map(t => {
    const done = t.status === 'Done';
    return /*#__PURE__*/React.createElement("tr", {
      key: t.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        paddingLeft: 20
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
      checked: done,
      label: (done ? 'Mark not done: ' : 'Mark complete: ') + t.title,
      onChange: () => onToggle && onToggle(t)
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        maxWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        textDecoration: done ? 'line-through' : 'none',
        color: done ? 'var(--text-secondary)' : 'var(--text-primary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-secondary)',
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.description)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
      status: t.status
    })), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
      priority: t.priority
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        fontSize: 14,
        whiteSpace: 'nowrap',
        color: t.dueToday && !done ? 'var(--amber-text)' : 'var(--text-secondary)',
        fontWeight: t.dueToday && !done ? 600 : 400
      }
    }, t.dueLabel || '\u2014'), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        whiteSpace: 'nowrap',
        paddingRight: 20
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      variant: "bare",
      size: 32,
      icon: "pencil",
      label: 'Edit ' + t.title,
      onClick: () => onEdit && onEdit(t)
    }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
      variant: "bare",
      size: 32,
      tone: "danger",
      icon: "trash-2",
      label: 'Delete ' + t.title,
      onClick: () => onDelete && onDelete(t)
    })));
  })))), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      padding: '14px 20px',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { TaskTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TaskTable.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
const TONES = {
  High: 'high',
  Medium: 'medium',
  Low: 'low'
};
function SegmentedControl({
  options = [],
  value,
  onChange,
  label,
  tinted = false,
  fullWidth = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": label,
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      gap: 2,
      padding: 4,
      background: 'var(--bg-segmented)',
      border: '1px solid var(--border-control)',
      borderRadius: 'var(--radius-control)',
      ...style
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const sel = v === value;
    const tone = tinted && TONES[v];
    const selBg = tone ? 'var(--chip-' + tone + '-bg)' : 'var(--segmented-selected-bg)';
    const selFg = tone ? 'var(--chip-' + tone + '-fg)' : 'var(--text-primary)';
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      role: "radio",
      "aria-checked": sel,
      onClick: () => onChange && onChange(v),
      style: {
        flex: fullWidth ? 1 : undefined,
        minHeight: 36,
        padding: '0 14px',
        border: 0,
        borderRadius: 'var(--radius-segment)',
        background: sel ? selBg : 'transparent',
        color: sel ? selFg : 'var(--text-secondary)',
        boxShadow: sel && !tone ? 'var(--segmented-selected-shadow)' : 'none',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: sel ? 600 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Select({
  value,
  onChange,
  options = [],
  label,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    "aria-label": label,
    value: value,
    onChange: e => onChange && onChange(e.target.value, e),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      height: 44,
      padding: '0 38px 0 14px',
      borderRadius: 'var(--radius-control)',
      border: '1px solid ' + (focus ? 'var(--primary)' : 'var(--border-control)'),
      background: 'var(--bg-paper)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      outline: 'none',
      width: '100%'
    }
  }, rest), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--text-secondary)",
    style: {
      position: 'absolute',
      right: 14,
      top: 14,
      pointerEvents: 'none'
    }
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": label,
    style: {
      display: 'inline-flex',
      gap: 2,
      padding: 4,
      background: 'var(--bg-paper)',
      border: '1px solid var(--border-control)',
      borderRadius: 'var(--radius-control)',
      flexShrink: 0,
      ...style
    }
  }, items.map(it => {
    const sel = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      role: "tab",
      "aria-selected": sel,
      onClick: () => onChange && onChange(it.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 34,
        padding: '0 12px',
        borderRadius: 'var(--radius-segment)',
        border: 0,
        background: sel ? 'var(--selected-tab)' : 'transparent',
        color: sel ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, it.label, it.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--text-secondary)'
      }
    }, it.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useId
} = React;
function TextField({
  label,
  required = false,
  value,
  defaultValue,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  startIcon,
  endIcon,
  readOnly = false,
  disabled = false,
  variant = 'default',
  type = 'text',
  id,
  inputRef,
  autoFocus,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const autoId = useId();
  const fid = id || autoId;
  const toolbar = variant === 'toolbar';
  const border = readOnly ? 'var(--border-card)' : focus ? 'var(--primary)' : toolbar ? 'var(--border-control)' : 'var(--border-input)';
  const box = {
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: 10,
    padding: multiline ? '12px 14px' : '0 14px',
    minHeight: toolbar ? 44 : 46,
    background: readOnly ? 'var(--bg-readonly)' : toolbar ? 'var(--bg-paper)' : 'var(--bg-inset)',
    border: '1px solid ' + border,
    boxShadow: focus && !readOnly ? 'inset 0 0 0 0.5px var(--primary)' : 'none',
    borderRadius: 'var(--radius-control)',
    transition: 'border-color .15s ease',
    opacity: disabled ? 0.5 : 1
  };
  const inputStyle = {
    flex: 1,
    minWidth: 0,
    border: 0,
    outline: 'none',
    background: 'transparent',
    padding: multiline ? 0 : '12px 0',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    lineHeight: '22px',
    resize: multiline ? 'vertical' : undefined,
    color: readOnly ? 'var(--text-secondary)' : 'var(--text-primary)'
  };
  const common = {
    id: fid,
    value,
    defaultValue,
    placeholder,
    readOnly,
    disabled,
    required,
    autoFocus,
    ref: inputRef,
    onChange: onChange ? e => onChange(e.target.value, e) : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: inputStyle,
    ...rest
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 0,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--danger)'
    }
  }, " *") : null) : null, /*#__PURE__*/React.createElement("div", {
    style: box
  }, startIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: startIcon,
    size: 16,
    color: "var(--text-secondary)"
  }) : null, multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows
  }, common)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, common)), endIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: endIcon,
    size: 16,
    color: "var(--text-secondary)"
  }) : null));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function NavPill({
  active = false,
  href,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = useState(false);
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--nav-pad)',
    borderRadius: 999,
    border: 0,
    background: active ? 'var(--selected-nav)' : 'transparent',
    color: active || hover ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color .15s ease',
    ...style
  };
  const ev = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    'aria-current': active ? 'page' : undefined
  };
  if (href) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    style: s
  }, ev), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: s
  }, ev), children);
}
Object.assign(__ds_scope, { NavPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavPill.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UserPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function UserPill({
  name = '',
  href,
  onClick,
  style
}) {
  const [hover, setHover] = useState(false);
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    height: 40,
    padding: '0 14px 0 4px',
    borderRadius: 999,
    border: '1px solid var(--border-control)',
    background: hover ? 'var(--hover-overlay)' : 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ...style
  };
  const inner = [/*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    key: "a",
    name: name,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    key: "n"
  }, name)];
  const ev = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    'aria-label': 'Profile: ' + name
  };
  if (href) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    style: s
  }, ev), inner);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: s
  }, ev), inner);
}
Object.assign(__ds_scope, { UserPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UserPill.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
const DEFAULT_ITEMS = [{
  key: 'dashboard',
  label: 'Dashboard'
}, {
  key: 'tasks',
  label: 'Tasks'
}, {
  key: 'profile',
  label: 'Profile'
}, {
  key: 'comparison',
  label: 'Comparison'
}];
function AppHeader({
  active = 'dashboard',
  items = DEFAULT_ITEMS,
  userName = '',
  theme = 'dark',
  onNavigate,
  onToggleTheme,
  onLogout,
  sticky = false,
  style
}) {
  const go = k => () => onNavigate && onNavigate(k);
  const next = theme === 'dark' ? 'light' : 'dark';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-header)',
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '12px 28px',
      padding: '12px 24px',
      minHeight: 64
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    onClick: go('dashboard')
  }), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Main",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4
    }
  }, items.map(it => /*#__PURE__*/React.createElement(__ds_scope.NavPill, {
    key: it.key,
    active: it.key === active,
    onClick: go(it.key)
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: theme === 'dark' ? 'sun' : 'moon',
    label: 'Switch to ' + next + ' theme',
    onClick: onToggleTheme
  }), /*#__PURE__*/React.createElement(__ds_scope.UserPill, {
    name: userName,
    onClick: go('profile')
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "log-out",
    tone: "danger",
    label: "Log out",
    onClick: onLogout
  }))));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
const {
  useEffect,
  useId
} = React;
function Dialog({
  open = true,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 540,
  contained = false,
  style
}) {
  const tid = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onMouseDown: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: contained ? 'absolute' : 'fixed',
      inset: 0,
      zIndex: 1300,
      background: 'var(--backdrop)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": tid,
    style: {
      width: '100%',
      maxWidth,
      maxHeight: 'calc(100% - 48px)',
      overflow: 'auto',
      background: 'var(--bg-paper)',
      border: '1px solid var(--border-dialog)',
      borderRadius: 'var(--radius-dialog)',
      padding: 'var(--dialog-pad)',
      boxShadow: 'var(--shadow-dialog)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    id: tid,
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, subtitle) : null), onClose ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    variant: "bare",
    size: 36,
    icon: "x",
    label: "Close",
    onClick: onClose
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      marginTop: 24
    }
  }, children), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 28,
      flexWrap: 'wrap'
    }
  }, actions) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tasks-app/data.js
try { (() => {
window.TasksKitData = function () {
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function label(off) {
    if (off == null) return '';
    if (off === 0) return 'Today';
    if (off === 1) return 'Tomorrow';
    const d = new Date(today.getTime() + off * DAY);
    return off > 0 ? wk[d.getDay()] + ', ' + d.getDate() + ' ' + mo[d.getMonth()] : d.getDate() + ' ' + mo[d.getMonth()];
  }
  const raw = [['Write API docs for task endpoints', 'Document the REST routes and example payloads.', 'To do', 'High', 0], ['Review pull request #42', 'Auth middleware refactor in the Node service.', 'In progress', 'Medium', 1], ['Set up MUI theme tokens', 'Move palette and typography into createTheme.', 'To do', 'Medium', 2], ['Update README', 'Add run instructions for client and server.', 'To do', 'Low', 4], ['Add due-date filter to the API', 'Query param for overdue and upcoming tasks.', 'In progress', 'Medium', 4], ['Fix login redirect bug', 'Users landed on a blank page after sign in.', 'Done', 'High', -3], ['Create database migrations', 'Tasks and users tables with indexes.', 'Done', 'Medium', -5], ['Draft onboarding copy', 'Short intro text for the empty dashboard.', 'Done', 'Low', null], ['Add unit tests for task use-cases', 'Cover create, complete and delete.', 'To do', 'High', 7], ['Paginate the tasks endpoint', 'Limit and offset on GET /tasks.', 'To do', 'Medium', 9], ['Add empty states', 'Dashboard and tasks list with no data.', 'To do', 'Low', 10], ['Audit color contrast', 'Check both themes against 4.5:1.', 'To do', 'Medium', 12], ['Set up CI pipeline', 'Lint, test and build on every PR.', 'To do', 'Low', null], ['Wire up profile update', 'Save full name through the user use-case.', 'In progress', 'High', 8], ['Seed demo data', 'Script for local development.', 'Done', 'Low', -8], ['Configure ESLint and Prettier', 'Shared config for client and server.', 'Done', 'Medium', -10]];
  function decorate(t) {
    return Object.assign({}, t, {
      dueLabel: label(t.dueOffset),
      dueToday: t.dueOffset === 0
    });
  }
  const tasks = raw.map((r, i) => decorate({
    id: i + 1,
    title: r[0],
    description: r[1],
    status: r[2],
    priority: r[3],
    dueOffset: r[4]
  }));
  const daysToSunday = (7 - today.getDay()) % 7;
  function stats(list) {
    const c = {
      total: list.length,
      done: 0,
      inprogress: 0,
      todo: 0,
      dueToday: 0,
      todoDueToday: 0,
      inprogressThisWeek: 0
    };
    list.forEach(t => {
      if (t.status === 'Done') c.done++;else if (t.status === 'In progress') c.inprogress++;else c.todo++;
      if (t.status !== 'Done' && t.dueOffset === 0) c.dueToday++;
      if (t.status === 'To do' && t.dueOffset === 0) c.todoDueToday++;
      if (t.status === 'In progress' && t.dueOffset != null && t.dueOffset >= 0 && t.dueOffset <= daysToSunday) c.inprogressThisWeek++;
    });
    c.pct = c.total ? Math.round(c.done / c.total * 100) : 0;
    return c;
  }
  function parseDue(str) {
    if (!str) return null;
    const d = new Date(str);
    if (isNaN(d)) return null;
    d.setHours(0, 0, 0, 0);
    return Math.round((d - today) / DAY);
  }
  function eyebrow() {
    const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const fm = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return full[today.getDay()] + ', ' + today.getDate() + ' ' + fm[today.getMonth()];
  }
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
  return {
    tasks,
    stats,
    decorate,
    parseDue,
    label,
    eyebrow,
    greeting,
    user: {
      name: 'Rakesh James Patole',
      email: 'patolerakesh@hotmail.com',
      joined: '18 Oct 2026'
    }
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tasks-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/tasks-app/screen-dashboard.jsx
try { (() => {
function ShortcutCard({
  icon,
  title,
  subtitle,
  onClick
}) {
  const {
    Card,
    Icon
  } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement(Card, {
    as: "button",
    padding: 16,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      borderColor: h ? 'var(--border-input)' : 'var(--border-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: 'var(--neutral-tile)',
      color: 'var(--neutral-tile-text)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 14,
      fontWeight: 600
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--text-secondary)"
  }));
}
function DashboardScreen({
  tasks,
  user,
  onToggle,
  onNew,
  go
}) {
  const {
    Button,
    Card,
    StatCard,
    TaskRow,
    ProgressBar,
    Icon
  } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData;
  const s = D.stats(tasks);
  const recent = tasks.filter(t => t.status !== 'Done').slice().sort((a, b) => (a.dueOffset ?? 999) - (b.dueOffset ?? 999)).slice(0, 4);
  const first = user.name.split(' ')[0];
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1264,
      margin: '0 auto',
      padding: '44px 32px 72px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, D.eyebrow()), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '10px 0 8px',
      fontFamily: 'var(--font-display)',
      fontSize: 42,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1
    }
  }, D.greeting(), ", ", first), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, s.dueToday, " ", s.dueToday === 1 ? 'task is' : 'tasks are', " due today and ", s.todo, " ", s.todo === 1 ? 'is' : 'are', " still to do.")), /*#__PURE__*/React.createElement(Button, {
    startIcon: "plus",
    onClick: onNew
  }, "New task")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Completed",
    value: s.done,
    tone: "done",
    caption: s.pct + '% of all tasks'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "In progress",
    value: s.inprogress,
    tone: "inprogress",
    caption: s.inprogressThisWeek + ' due this week'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "To do",
    value: s.todo,
    tone: "todo",
    caption: s.todoDueToday + ' due today',
    captionTone: "amber"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      flex: '1 1 520px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 24px 14px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Recent tasks"), /*#__PURE__*/React.createElement("a", {
    href: "#tasks",
    onClick: e => {
      e.preventDefault();
      go('tasks');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--primary-soft)'
    }
  }, "View all ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))), recent.map((t, i) => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    task: t,
    onToggle: onToggle,
    divider: i > 0
  })), recent.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 24px',
      color: 'var(--text-secondary)',
      fontSize: 14
    }
  }, "Nothing left to do.") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 0 300px',
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Overall progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      margin: '16px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, s.pct, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "of ", s.total, " tasks done")), /*#__PURE__*/React.createElement(ProgressBar, {
    legend: true,
    segments: [{
      label: 'Completed',
      value: s.done
    }, {
      label: 'In progress',
      value: s.inprogress
    }, {
      label: 'To do',
      value: s.todo
    }]
  })), /*#__PURE__*/React.createElement(ShortcutCard, {
    icon: "list",
    title: "Manage tasks",
    subtitle: "Create, edit and organize",
    onClick: () => go('tasks')
  }), /*#__PURE__*/React.createElement(ShortcutCard, {
    icon: "user",
    title: "Your profile",
    subtitle: "Update your details",
    onClick: () => go('profile')
  }))));
}
Object.assign(window, {
  DashboardScreen,
  ShortcutCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tasks-app/screen-dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tasks-app/screen-profile.jsx
try { (() => {
function ProfileScreen({
  user,
  tasks,
  pref,
  setPref,
  onSaveName
}) {
  const {
    Card,
    Avatar,
    Chip,
    TextField,
    Button,
    SegmentedControl
  } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const s = window.TasksKitData.stats(tasks);
  const [name, setName] = React.useState(user.name);
  React.useEffect(() => setName(user.name), [user.name]);
  const h2 = {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: '-0.01em'
  };
  const sub = {
    margin: '4px 0 0',
    fontSize: 14,
    color: 'var(--text-secondary)'
  };
  const count = (n, l) => /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 700
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, l));
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1064,
      margin: '0 auto',
      padding: '44px 32px 72px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 42,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1
    }
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 20,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 28,
    style: {
      flex: '1 1 280px',
      maxWidth: 280,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: user.name,
    size: 88
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.01em'
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, user.email), /*#__PURE__*/React.createElement(Chip, {
    tone: "neutral",
    style: {
      marginTop: 12
    }
  }, "Joined ", user.joined), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      marginTop: 24,
      paddingTop: 20,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, count(s.total, 'Created'), count(s.done, 'Completed'))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 420px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 24
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Account details"), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "Update the name shown across the app."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Full name",
    value: name,
    onChange: setName
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Email",
    value: user.email,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    onClick: () => setName(user.name)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    disabled: !name.trim() || name === user.name,
    onClick: () => onSaveName(name.trim())
  }, "Save changes"))), /*#__PURE__*/React.createElement(Card, {
    padding: 24,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Appearance"), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "Choose how the app looks.")), /*#__PURE__*/React.createElement(SegmentedControl, {
    label: "Theme",
    options: [{
      value: 'light',
      label: 'Light'
    }, {
      value: 'dark',
      label: 'Dark'
    }, {
      value: 'system',
      label: 'System'
    }],
    value: pref,
    onChange: setPref
  })))));
}
Object.assign(window, {
  ProfileScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tasks-app/screen-profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tasks-app/screen-tasks.jsx
try { (() => {
function TasksScreen({
  tasks,
  onToggle,
  onNew,
  onEdit,
  onDelete
}) {
  const {
    Button,
    TextField,
    Tabs,
    Select,
    TaskTable
  } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData;
  const s = D.stats(tasks);
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState('All');
  const [prio, setPrio] = React.useState('All');
  const [page, setPage] = React.useState(0);
  const PER = 8;
  const filtered = tasks.filter(t => (status === 'All' || t.status === status) && (prio === 'All' || t.priority === prio) && (!q || (t.title + ' ' + t.description).toLowerCase().includes(q.toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const p = Math.min(page, pages - 1);
  const rows = filtered.slice(p * PER, p * PER + PER);
  React.useEffect(() => setPage(0), [q, status, prio]);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1264,
      margin: '0 auto',
      padding: '44px 32px 72px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 8px',
      fontFamily: 'var(--font-display)',
      fontSize: 42,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1
    }
  }, "Tasks"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, s.total, " tasks in total, ", s.todo, " still to do.")), /*#__PURE__*/React.createElement(Button, {
    startIcon: "plus",
    onClick: onNew
  }, "New task")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    variant: "toolbar",
    startIcon: "search",
    placeholder: "Search tasks",
    "aria-label": "Search tasks",
    value: q,
    onChange: setQ,
    style: {
      flex: '1 1 260px'
    }
  }), /*#__PURE__*/React.createElement(Tabs, {
    label: "Status",
    value: status,
    onChange: setStatus,
    items: [{
      value: 'All',
      label: 'All',
      count: s.total
    }, {
      value: 'To do',
      label: 'To do',
      count: s.todo
    }, {
      value: 'In progress',
      label: 'In progress',
      count: s.inprogress
    }, {
      value: 'Done',
      label: 'Done',
      count: s.done
    }]
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Priority",
    value: prio,
    onChange: setPrio,
    options: [{
      value: 'All',
      label: 'Priority: All'
    }, 'High', 'Medium', 'Low']
  })), /*#__PURE__*/React.createElement(TaskTable, {
    tasks: rows,
    onToggle: onToggle,
    onEdit: onEdit,
    onDelete: onDelete,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Showing ", rows.length, " of ", filtered.length, " tasks"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outlined",
      disabled: p === 0,
      onClick: () => setPage(p - 1)
    }, "Previous"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outlined",
      disabled: p >= pages - 1,
      onClick: () => setPage(p + 1)
    }, "Next")))
  }));
}
Object.assign(window, {
  TasksScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tasks-app/screen-tasks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tasks-app/task-dialog.jsx
try { (() => {
function TaskDialog({
  open,
  task,
  onClose,
  onSave
}) {
  const {
    Dialog,
    Button,
    TextField,
    SegmentedControl
  } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [prio, setPrio] = React.useState('Medium');
  const [due, setDue] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    setTitle(task ? task.title : '');
    setDesc(task ? task.description : '');
    setPrio(task ? task.priority : 'Medium');
    setDue(task && task.dueLabel ? task.dueLabel : '');
    setTimeout(() => ref.current && ref.current.focus(), 30);
  }, [open, task]);
  const edit = !!task;
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    title: edit ? 'Edit task' : 'New task',
    subtitle: "Add the details. You can change them later.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outlined",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      disabled: !title.trim(),
      onClick: () => onSave({
        title: title.trim(),
        description: desc.trim(),
        priority: prio,
        due
      })
    }, edit ? 'Save changes' : 'Create task'))
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Title",
    required: true,
    value: title,
    onChange: setTitle,
    inputRef: ref
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Description",
    multiline: true,
    rows: 3,
    value: desc,
    onChange: setDesc
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Priority"), /*#__PURE__*/React.createElement(SegmentedControl, {
    tinted: true,
    fullWidth: true,
    label: "Priority",
    options: ['Low', 'Medium', 'High'],
    value: prio,
    onChange: setPrio
  })), /*#__PURE__*/React.createElement(TextField, {
    label: "Due date",
    placeholder: "23 Oct 2026",
    value: due,
    onChange: setDue,
    endIcon: "calendar"
  })));
}
Object.assign(window, {
  TaskDialog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tasks-app/task-dialog.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.TaskRow = __ds_scope.TaskRow;

__ds_ns.TaskTable = __ds_scope.TaskTable;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.NavPill = __ds_scope.NavPill;

__ds_ns.UserPill = __ds_scope.UserPill;

__ds_ns.Dialog = __ds_scope.Dialog;

})();

import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let Button;
let Badge;
let Checkbox;
let TaskTable;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  const ui = await vite.ssrLoadModule('/src/components/ui/index.ts');
  Button = ui.Button;
  Badge = ui.Badge;
  Checkbox = ui.Checkbox;
  TaskTable = (await vite.ssrLoadModule('/src/tasks/presentation/components/taskList/TaskTable.tsx')).default;
});

after(async () => { await vite?.close(); });

const render = (el) => renderToStaticMarkup(h(MemoryRouter, null, el));
const task = {
  id: 't1', title: 'Write tests', statusLabel: 'To do', statusVariant: 'status-todo',
  priorityLabel: 'High', priorityVariant: 'priority-high', dueDateLabel: 'Oct 20', dueDateTone: 'amber',
  searchText: '', statusValue: 'todo', priorityValue: 'high', toggleLabel: 'Mark complete',
  toggleAriaLabel: 'Mark complete: Write tests', isCompleted: false,
};
const renderTable = (t) => render(h(TaskTable, { tasks: [t], onEdit() {}, onDelete() {}, onToggleStatus() {} }));

test('Button default variant uses primary styling and DS height', () => {
  const html = render(h(Button, null, 'Save'));
  assert.match(html, /data-variant="default"/);
  assert.match(html, /bg-primary/);
  assert.match(html, /h-\[46px\]/);
});

test('Button destructive variant uses destructive tokens', () => {
  const html = render(h(Button, { variant: 'destructive' }, 'Delete'));
  assert.match(html, /text-destructive/);
  assert.match(html, /border-destructive-border/);
});

test('Button icon size keeps the aria-label', () => {
  const html = render(h(Button, { size: 'icon', 'aria-label': 'Close' }, 'x'));
  assert.match(html, /aria-label="Close"/);
  assert.match(html, /h-10 w-10/);
});

test('Badge renders a dot for priority variants only', () => {
  const priority = render(h(Badge, { variant: 'priority-high' }, 'High'));
  assert.match(priority, /data-slot="badge-dot"/);
  assert.match(priority, /High/);
  const status = render(h(Badge, { variant: 'status-done' }, 'Done'));
  assert.doesNotMatch(status, /badge-dot/);
  assert.match(status, /Done/);
});

test('Checkbox is round with success fill and accessible state', () => {
  const html = render(h(Checkbox, { checked: true, 'aria-label': 'Done' }));
  assert.match(html, /rounded-full/);
  assert.match(html, /data-\[state=checked\]:bg-success/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /aria-label="Done"/);
});

test('TaskTable renders six DS columns with a visually hidden checkbox header', () => {
  const html = renderTable(task);
  assert.equal((html.match(/<th[\s>]/g) || []).length, 6);
  assert.match(html, /sr-only">Done/);
  assert.match(html, /table-fixed/);
});

test('TaskTable shows a dash for a missing due date and labels the delete button', () => {
  const html = renderTable({ ...task, dueDateLabel: undefined });
  assert.match(html, /—/);
  assert.match(html, /aria-label="Delete Write tests"/);
});

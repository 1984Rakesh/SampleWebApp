import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let UiButton;
let UiTabs;
let UiToggleGroup;
let UiSelect;
let UiCheckbox;
let UiAlert;
let UiTextField;
let UiChip;
let UiDialog;
let UiSearchField;
let UiPaper;
let UiCode;
let UiScreen;
let UiFlex;
let UiText;
let UiTable;
let UiTableCell;
let UiTableFooter;
let TaskTable;
let Dialog;
let DialogContent;
let DialogDescription;

before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  const ui = await vite.ssrLoadModule('/src/components/ui/index.ts');
  UiButton = ui.UiButton;
  UiTabs = ui.UiTabs;
  UiToggleGroup = ui.UiToggleGroup;
  UiSelect = ui.UiSelect;
  UiCheckbox = ui.UiCheckbox;
  UiAlert = ui.UiAlert;
  UiTextField = ui.UiTextField;
  UiChip = ui.UiChip;
  UiDialog = (await vite.ssrLoadModule('/src/components/ui/UiDialog.tsx')).default;
  UiSearchField = (await vite.ssrLoadModule('/src/components/ui/UiSearchField.tsx')).default;
  UiPaper = (await vite.ssrLoadModule('/src/components/ui/UiPaper.tsx')).default;
  UiCode = (await vite.ssrLoadModule('/src/components/ui/UiCode.tsx')).default;
  UiScreen = ui.UiScreen;
  UiFlex = ui.UiFlex;
  UiText = ui.UiText;
  UiTable = ui.UiTable;
  UiTableCell = ui.UiTableCell;
  UiTableFooter = ui.UiTableFooter;
  TaskTable = (await vite.ssrLoadModule('/src/tasks/presentation/components/taskList/TaskTable.tsx')).default;
  const dialog = await vite.ssrLoadModule('/src/components/ui/dialog.tsx');
  Dialog = dialog.Dialog;
  DialogContent = dialog.DialogContent;
  DialogDescription = dialog.DialogDescription;
});

after(async () => { await vite?.close(); });

const render = (el) => renderToStaticMarkup(h(MemoryRouter, null, el));
const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

test('UiButton link renders an enabled anchor to the target', () => {
  const html = render(h(UiButton, { to: '/tasks', variant: 'solid' }, 'Open'));
  assert.match(html, /<a[^>]*href="\/tasks"[^>]*>/);
  assert.match(html, /Open/);
});

test('UiButton disabled link renders a disabled button, not a navigable anchor', () => {
  const html = render(h(UiButton, { to: '/tasks', disabled: true }, 'Open'));
  assert.doesNotMatch(html, /<a[^>]*href="\/tasks"/);
  assert.match(html, /<button[^>]*disabled/);
});

test('UiButton loading link renders a disabled button, not a navigable anchor', () => {
  const html = render(h(UiButton, { to: '/tasks', isLoading: true }, 'Open'));
  assert.doesNotMatch(html, /<a[^>]*href="\/tasks"/);
  assert.match(html, /<button[^>]*disabled/);
});

test('UiTabs exposes pressed state on the selected filter option', () => {
  const html = render(h(UiTabs, { value: 'a', options, onChange: () => {}, ariaLabel: 'Filter by status' }));
  assert.match(html, /role="group"[^>]*aria-label="Filter by status"/);
  assert.match(html, /aria-pressed="true"[^>]*>\s*Alpha/);
  assert.match(html, /aria-pressed="false"[^>]*>\s*Beta/);
});

test('UiToggleGroup marks the selected value and disables listed values', () => {
  const html = render(h(UiToggleGroup, { value: 'a', options, disabledValues: ['b'], onChange: () => {} }));
  assert.match(html, /aria-pressed="true"[^>]*>\s*Alpha/);
  assert.match(html, /aria-pressed="false"[^>]*disabled[^>]*>\s*Beta|disabled[^>]*aria-pressed="false"[^>]*>\s*Beta/);
});

test('UiSelect trigger is labelled by its visible label', () => {
  const html = render(h(UiSelect, { id: 'priority', label: 'Priority', value: '', options: [{ value: '', label: 'All' }, ...options], onChange: () => {} }));
  assert.match(html, /id="priority-label"/);
  assert.match(html, /aria-labelledby="priority-label"/);
});

test('UiCheckbox exposes its accessible label and checked state', () => {
  const html = render(h(UiCheckbox, { checked: true, ariaLabel: 'Complete task', onChange: () => {} }));
  assert.match(html, /aria-label="Complete task"/);
  assert.match(html, /data-state="checked"/);
});

test('UiAlert renders an alert region', () => {
  const html = render(h(UiAlert, { type: 'error' }, 'Failed'));
  assert.match(html, /role="alert"/);
  assert.match(html, /Failed/);
});

test('UiTextField associates label, input and helper text', () => {
  const html = render(h(UiTextField, { id: 'task-title', label: 'Title', value: '', onChange: () => {}, error: true, helperText: 'Required' }));
  assert.match(html, /<label[^>]*for="task-title"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="task-title-helper"/);
  assert.match(html, /id="task-title-helper"/);
});

const collect = (node, acc = []) => {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((item) => collect(item, acc)); return acc; }
  acc.push(node);
  collect(node.props?.children, acc);
  return acc;
};

test('UiDialog forwards open state and calls onClose only on close transitions', () => {
  const calls = [];
  const element = UiDialog({ open: true, onClose: () => calls.push('close'), title: 'Edit task' });
  assert.equal(element.type, Dialog);
  assert.equal(element.props.open, true);
  element.props.onOpenChange(true);
  assert.deepEqual(calls, []);
  element.props.onOpenChange(false);
  assert.deepEqual(calls, ['close']);
});

test('UiDialog maps maxWidth onto the content surface', () => {
  const content = UiDialog({ open: true, onClose: () => {}, title: 'T', maxWidth: 'md' }).props.children;
  assert.equal(content.type, DialogContent);
  assert.match(content.props.className, /sm:max-w-4xl/);
});

test('UiDialog omits the described-by override only while a description is supplied', () => {
  const withDescription = UiDialog({ open: true, onClose: () => {}, title: 'T', description: 'Details' }).props.children;
  assert.ok(!('aria-describedby' in withDescription.props));
  const parts = collect(withDescription.props.children);
  assert.ok(parts.some((part) => part.type === DialogDescription));

  const withoutDescription = UiDialog({ open: true, onClose: () => {}, title: 'T' }).props.children;
  assert.ok('aria-describedby' in withoutDescription.props);
  assert.equal(withoutDescription.props['aria-describedby'], undefined);
  assert.ok(!collect(withoutDescription.props.children).some((part) => part.type === DialogDescription));
});

test('UiSelect label is a real label element pointing at the trigger id', () => {
  const html = render(h(UiSelect, { id: 'priority', label: 'Priority', value: '', options: [{ value: '', label: 'All' }, ...options], onChange: () => {} }));
  assert.match(html, /<label[^>]*for="priority"/);
});

test('UiToggleGroup exposes its accessible group name', () => {
  const html = render(h(UiToggleGroup, { value: 'a', options, onChange: () => {}, ariaLabel: 'Priority' }));
  assert.match(html, /role="group"[^>]*aria-label="Priority"/);
});

test('UiSearchField associates a visually hidden label with the input id', () => {
  const html = render(h(UiSearchField, { id: 'task-search', value: '', onChange: () => {}, placeholder: 'Search tasks' }));
  assert.match(html, /<label[^>]*for="task-search"/);
  assert.match(html, /<label[^>]*sr-only/);
  assert.match(html, /<input[^>]*id="task-search"/);
});

test('UiPaper dark surface uses theme roles, not the neutral palette', () => {
  const html = render(h(UiPaper, { tone: 'dark', title: 'Code' }, 'body'));
  assert.doesNotMatch(html, /neutral-/);
  assert.match(html, /bg-muted/);
});

test('UiCode text follows the foreground role in both modes', () => {
  const html = render(h(UiCode, { code: 'const x = 1;', language: 'typescript' }));
  assert.doesNotMatch(html, /neutral-/);
  assert.match(html, /text-foreground/);
  assert.match(html, /language-typescript/);
});

test('UiScreen applies the DS page padding recipe at the md breakpoint', () => {
  const html = render(h(UiScreen, { maxWidth: '6xl' }, 'page'));
  assert.match(html, /md:px-8/);
  assert.match(html, /md:pt-10/);
  assert.match(html, /md:pb-16/);
  assert.match(html, /max-w-6xl/);
});

test('UiFlex fixedWidthFrom restores full width below the breakpoint', () => {
  const html = render(h(UiFlex, { fixedWidthFrom: 'sm' }, 'field'));
  assert.match(html, /w-full sm:w-40/);
});

test('UiText pageTitle renders an h1 at the DS 36px heading size', () => {
  const html = render(h(UiText, { variant: 'pageTitle' }, 'Tasks'));
  assert.match(html, /<h1/);
  assert.match(html, /font-heading text-4xl font-bold tracking-tight/);
});

test('UiTable fixed applies the DS fixed-layout recipe', () => {
  const html = render(h(UiTable, { fixed: true }, 'rows'));
  assert.match(html, /table-fixed/);
  assert.match(html, /min-w-\[860px\]/);
});

test('UiTableCell head uses sentence-case DS header styling', () => {
  const html = render(h(UiTableCell, { head: true }, 'Task'));
  assert.match(html, /<th/);
  assert.match(html, /font-medium/);
  assert.doesNotMatch(html, /uppercase/);
});

test('UiTableCell head width and edge map to DS column recipes', () => {
  const html = render(h(UiTableCell, { head: true, width: 'meta' }, 'Status'));
  assert.match(html, /w-32/);
  const checkbox = render(h(UiTableCell, { head: true, width: 'checkbox', edge: 'start' }, 'Done'));
  assert.match(checkbox, /w-12/);
  assert.match(checkbox, /pl-4/);
  const actions = render(h(UiTableCell, { head: true, width: 'actions', edge: 'end', align: 'right' }, 'Actions'));
  assert.match(actions, /w-24/);
  assert.match(actions, /pr-4/);
});

test('UiTableCell head hideLabel renders a visually hidden name', () => {
  const html = render(h(UiTableCell, { head: true, hideLabel: true }, 'Done'));
  assert.match(html, /sr-only/);
});

test('UiTableFooter renders the muted justify-between footer recipe', () => {
  const html = render(h(UiTableFooter, null, 'Showing'));
  assert.match(html, /justify-between/);
  assert.match(html, /text-muted-foreground/);
});

test('TaskTable renders six DS columns with a visually hidden checkbox header', () => {
  const task = {
    id: 't1', title: 'Write tests', statusLabel: 'To Do', statusTone: 'neutral',
    priorityLabel: 'High', priorityTone: 'danger', dueDateLabel: 'Oct 20', dueDateTone: 'amber',
    searchText: '', statusValue: 'todo', priorityValue: 'high', toggleLabel: 'Mark complete',
    toggleAriaLabel: 'Mark complete: Write tests', isCompleted: false,
  };
  const html = render(h(TaskTable, { tasks: [task], onEdit() {}, onDelete() {}, onToggleStatus() {} }));
  assert.equal((html.match(/<th[\s>]/g) || []).length, 6);
  assert.match(html, /sr-only">Done/);
  assert.match(html, /table-fixed/);
});

test('UiChip renders the label', () => {
  const html = render(h(UiChip, { label: 'Done', tone: 'success' }));
  assert.match(html, /Done/);
});

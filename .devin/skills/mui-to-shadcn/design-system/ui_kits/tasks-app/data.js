window.TasksKitData = (function () {
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function label(off) {
    if (off == null) return '';
    if (off === 0) return 'Today';
    if (off === 1) return 'Tomorrow';
    const d = new Date(today.getTime() + off * DAY);
    return off > 0 ? wk[d.getDay()] + ', ' + d.getDate() + ' ' + mo[d.getMonth()] : d.getDate() + ' ' + mo[d.getMonth()];
  }
  const raw = [
    ['Write API docs for task endpoints', 'Document the REST routes and example payloads.', 'To do', 'High', 0],
    ['Review pull request #42', 'Auth middleware refactor in the Node service.', 'In progress', 'Medium', 1],
    ['Set up shadcn theme tokens', 'Move palette and radius into globals.css.', 'To do', 'Medium', 2],
    ['Update README', 'Add run instructions for client and server.', 'To do', 'Low', 4],
    ['Add due-date filter to the API', 'Query param for overdue and upcoming tasks.', 'In progress', 'Medium', 4],
    ['Fix login redirect bug', 'Users landed on a blank page after sign in.', 'Done', 'High', -3],
    ['Create database migrations', 'Tasks and users tables with indexes.', 'Done', 'Medium', -5],
    ['Draft onboarding copy', 'Short intro text for the empty dashboard.', 'Done', 'Low', null],
    ['Add unit tests for task use-cases', 'Cover create, complete and delete.', 'To do', 'High', 7],
    ['Paginate the tasks endpoint', 'Limit and offset on GET /tasks.', 'To do', 'Medium', 9],
    ['Add empty states', 'Dashboard and tasks list with no data.', 'To do', 'Low', 10],
    ['Audit color contrast', 'Check both themes against 4.5:1.', 'To do', 'Medium', 12],
    ['Set up CI pipeline', 'Lint, test and build on every PR.', 'To do', 'Low', null],
    ['Wire up profile update', 'Save full name through the user use-case.', 'In progress', 'High', 8],
    ['Seed demo data', 'Script for local development.', 'Done', 'Low', -8],
    ['Configure ESLint and Prettier', 'Shared config for client and server.', 'Done', 'Medium', -10],
  ];
  function decorate(t) { return Object.assign({}, t, { dueLabel: label(t.dueOffset), dueToday: t.dueOffset === 0 }); }
  const tasks = raw.map((r, i) => decorate({ id: i + 1, title: r[0], description: r[1], status: r[2], priority: r[3], dueOffset: r[4] }));
  const daysToSunday = (7 - today.getDay()) % 7;
  function stats(list) {
    const c = { total: list.length, done: 0, inprogress: 0, todo: 0, dueToday: 0, todoDueToday: 0, inprogressThisWeek: 0 };
    list.forEach((t) => {
      if (t.status === 'Done') c.done++; else if (t.status === 'In progress') c.inprogress++; else c.todo++;
      if (t.status !== 'Done' && t.dueOffset === 0) c.dueToday++;
      if (t.status === 'To do' && t.dueOffset === 0) c.todoDueToday++;
      if (t.status === 'In progress' && t.dueOffset != null && t.dueOffset >= 0 && t.dueOffset <= daysToSunday) c.inprogressThisWeek++;
    });
    c.pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    return c;
  }
  function parseDue(str) {
    if (!str) return null; const d = new Date(str); if (isNaN(d)) return null; d.setHours(0, 0, 0, 0);
    return Math.round((d - today) / DAY);
  }
  function eyebrow() {
    const full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const fm = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return full[today.getDay()] + ', ' + today.getDate() + ' ' + fm[today.getMonth()];
  }
  function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  return { tasks, stats, decorate, parseDue, label, eyebrow, greeting, user: { name: 'Rakesh James Patole', email: 'patolerakesh@hotmail.com', joined: '18 Oct 2026' } };
})();

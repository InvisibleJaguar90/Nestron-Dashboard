// ── PLATFORM ICONS ─────────────────────────────────────────────────────────
// Flat-color inline SVGs — no gradients (avoids duplicate id issues in DOM)

const PLATFORM_ICONS = {
  linkedin: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="3" fill="#0077b5"/>
    <path d="M5.2 8.2H7.6V15H5.2V8.2ZM6.4 4.5C7.15 4.5 7.75 5.1 7.75 5.85C7.75 6.6 7.15 7.2 6.4 7.2C5.65 7.2 5.05 6.6 5.05 5.85C5.05 5.1 5.65 4.5 6.4 4.5ZM9.2 8.2H11.5V9.25H11.53C11.85 8.65 12.63 8 13.8 8C16.25 8 16.7 9.6 16.7 11.7V15H14.3V12.2C14.3 11.3 14.28 10.15 13.05 10.15C11.8 10.15 11.6 11.13 11.6 12.13V15H9.2V8.2Z" fill="white"/>
  </svg>`,

  instagram: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#e1306c"/>
    <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" stroke="white" stroke-width="1.4" fill="none"/>
    <circle cx="10" cy="10" r="3" stroke="white" stroke-width="1.4" fill="none"/>
    <circle cx="14" cy="6" r="1" fill="white"/>
  </svg>`,

  facebook: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="3" fill="#1877f2"/>
    <path d="M13 7H11C10.45 7 10 7.45 10 8V10H13L12.5 12.5H10V19H7.5V12.5H5.5V10H7.5V8C7.5 6.07 9.07 4.5 11 4.5H13V7Z" fill="white"/>
  </svg>`,

  x: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="3" fill="#111111"/>
    <path d="M11.35 9.22L15.5 4.5H14.35L10.84 8.48L8.02 4.5H4.5L8.86 10.74L4.5 15.5H5.65L9.37 11.28L12.38 15.5H15.9L11.35 9.22ZM9.94 10.6L9.43 9.87L6.07 5.36H7.49L10.39 9.19L10.9 9.92L14.37 14.69H12.95L9.94 10.6Z" fill="white"/>
  </svg>`,

  newsletter: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="3" fill="#B8722A"/>
    <rect x="3" y="5.5" width="14" height="9" rx="1.5" fill="none" stroke="white" stroke-width="1.4"/>
    <path d="M3.5 7L10 12L16.5 7" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  blog: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="3" fill="#2D6A4F"/>
    <rect x="4.5" y="3.5" width="11" height="13" rx="1.5" fill="none" stroke="white" stroke-width="1.3"/>
    <line x1="7" y1="7.5" x2="13" y2="7.5" stroke="white" stroke-width="1.1" stroke-linecap="round"/>
    <line x1="7" y1="10"  x2="13" y2="10"  stroke="white" stroke-width="1.1" stroke-linecap="round"/>
    <line x1="7" y1="12.5" x2="10.5" y2="12.5" stroke="white" stroke-width="1.1" stroke-linecap="round"/>
  </svg>`
};

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const PLATFORM_COLORS = {
  linkedin:   '#0077b5',
  instagram:  '#e1306c',
  facebook:   '#1877f2',
  x:          '#333333',
  newsletter: '#B8722A',
  blog:       '#2D6A4F'
};

const PLATFORMS = ['all', 'linkedin', 'instagram', 'facebook', 'x', 'newsletter', 'blog'];

const PLATFORM_LABELS = {
  linkedin:   'LinkedIn',
  instagram:  'Instagram',
  facebook:   'Facebook',
  x:          'X',
  newsletter: 'Newsletter',
  blog:       'Blog'
};

const STATUS_LABELS = {
  draft:     'Draft',
  in_review: 'In Review',
  approved:  'Approved',
  scheduled: 'Scheduled',
  published: 'Published'
};

// Ordered list for cycling clicks on the badge
const STATUS_CYCLE = ['draft', 'in_review', 'approved', 'scheduled', 'published'];

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Max compact cards shown per day cell in month view before overflow chip
const MONTH_CELL_CAP = 3;

// ── STATE ──────────────────────────────────────────────────────────────────

let allPosts = [];
let activeFilter = 'all';
let lastFocusedElement = null;
let cardElements = {};          // postId → card DOM element (week view)
let currentUploadPostId = null; // which post is waiting for a file pick
let currentEditPostId   = null; // null = add mode, string id = edit mode

// Calendar view state
const _today = new Date();
_today.setHours(0, 0, 0, 0);

let currentView = 'month';
let currentYear  = _today.getFullYear();
let currentMonth = _today.getMonth(); // 0-indexed
let currentWeekStart = calcWeekMonday(_today);

// Month picker state
let pickerYear = _today.getFullYear();
let pickerEl   = null;

// ── DOM REFS ───────────────────────────────────────────────────────────────

const filterBarEl     = document.getElementById('filter-bar');
const calendarEl      = document.getElementById('calendar-main');
const backdropEl      = document.getElementById('modal-backdrop');
const closeBtnEl      = document.getElementById('modal-close');
const modalIconEl     = document.getElementById('modal-platform-icon');
const modalTitleEl    = document.getElementById('modal-title');
const modalLabelEl    = document.getElementById('modal-platform-label');
const modalVideoBadgeEl = document.getElementById('modal-video-badge');
const tabMockBtn      = document.getElementById('tab-mock');
const tabTextBtn      = document.getElementById('tab-text');
const panelMockEl     = document.getElementById('panel-mock');
const panelTextEl     = document.getElementById('panel-text');
const iframeEl        = document.getElementById('mock-iframe');
const copyTextEl      = document.getElementById('copy-text');
const headerDateEl    = document.getElementById('header-date');
const calTitleEl      = document.getElementById('cal-title');
const addBackdropEl   = document.getElementById('add-backdrop');
const addFormEl       = document.getElementById('add-form');
const addCloseEl      = document.getElementById('add-close');
const addDateEl       = document.getElementById('add-date');
const addPlatformEl   = document.getElementById('add-platform');
const addUploadBtnEl  = document.getElementById('add-upload-btn');
const addUploadNameEl = document.getElementById('add-upload-name');

// ── SHARED FILE INPUTS ─────────────────────────────────────────────────────

// For replacing a mock on an existing card
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.html,text/html';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  const post = getMergedPosts().find(p => p.id === currentUploadPostId);
  if (post) await handleFileUpload(post, file);
  fileInput.value = '';
  currentUploadPostId = null;
});

// For the add/edit modal's optional mock attachment
const addFileInput = document.createElement('input');
addFileInput.type = 'file';
addFileInput.accept = '.html,text/html';
addFileInput.style.display = 'none';
document.body.appendChild(addFileInput);

let pendingAddMockHtml = null;
addFileInput.addEventListener('change', async () => {
  const file = addFileInput.files[0];
  if (!file) return;
  pendingAddMockHtml = await file.text();
  addUploadNameEl.textContent = file.name;
  addFileInput.value = '';
});

// ── UTILITY ────────────────────────────────────────────────────────────────

function dateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayStr() { return dateToStr(_today); }

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  }).format(parseLocalDate(dateStr));
}

function calcWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Returns 42 cells (6 rows × 7 cols, Mon-start) for year/month. */
function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1; // Mon = 0
  const cells = [];
  const cursor = new Date(year, month, 1 - startDow);
  for (let i = 0; i < 42; i++) {
    cells.push({
      dateStr: dateToStr(cursor),
      isCurrentMonth: cursor.getMonth() === month && cursor.getFullYear() === year
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

/** Returns 7 Date objects Mon–Sun for the week starting at monday. */
function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function groupPostsByDate(posts) {
  const map = {};
  posts.forEach(p => {
    if (!map[p.scheduled_date]) map[p.scheduled_date] = [];
    map[p.scheduled_date].push(p);
  });
  return map;
}

function tryParseJson(str) {
  try { return str ? JSON.parse(str) : null; } catch { return null; }
}

function renderHeaderDate() {
  headerDateEl.textContent = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  }).format(_today);
}

function updateCalTitle() {
  if (!calTitleEl) return;
  if (currentView === 'month') {
    calTitleEl.textContent = new Intl.DateTimeFormat('en-US', {
      month: 'long', year: 'numeric'
    }).format(new Date(currentYear, currentMonth, 1));
  } else if (currentView === 'week') {
    const sunday = new Date(currentWeekStart);
    sunday.setDate(currentWeekStart.getDate() + 6);
    const mFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    const sameMo = currentWeekStart.getMonth() === sunday.getMonth() &&
                   currentWeekStart.getFullYear() === sunday.getFullYear();
    const sFmt = sameMo
      ? new Intl.DateTimeFormat('en-US', { day: 'numeric' })
      : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    calTitleEl.textContent =
      `${mFmt.format(currentWeekStart)} – ${sFmt.format(sunday)}, ${sunday.getFullYear()}`;
  } else {
    calTitleEl.textContent = 'All Posts';
  }
}

function getPlatformIcon(platform) { return PLATFORM_ICONS[platform] || ''; }

// ── TITLE EXTRACTION ───────────────────────────────────────────────────────

function extractHtmlTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function getCardTitle(post) {
  if (post.mockTitle) return post.mockTitle;
  const label = PLATFORM_LABELS[post.platform] || post.platform;
  return post.week ? `${label} · W${post.week}` : label;
}

// ── DATA ───────────────────────────────────────────────────────────────────

async function loadPosts() {
  const res = await fetch('data/schedule.json');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return [...data.posts].sort((a, b) =>
    a.scheduled_date.localeCompare(b.scheduled_date)
  );
}

function filterByPlatform(posts, platform) {
  return platform === 'all' ? posts : posts.filter(p => p.platform === platform);
}

// ── STATUS OVERRIDES ───────────────────────────────────────────────────────
// Allows clicking badges on schedule.json posts to change status without editing the file.

function getStatusOverrides() {
  return tryParseJson(localStorage.getItem('nestron_status_overrides')) || {};
}

function setStatusOverride(postId, status) {
  const overrides = getStatusOverrides();
  overrides[postId] = status;
  try { localStorage.setItem('nestron_status_overrides', JSON.stringify(overrides)); } catch {}
}

// ── LOCAL DRAFTS ───────────────────────────────────────────────────────────

function loadLocalDrafts() {
  return tryParseJson(localStorage.getItem('nestron_local_drafts')) || [];
}

function saveLocalDraft(draft) {
  const drafts = loadLocalDrafts();
  const idx = drafts.findIndex(d => d.id === draft.id);
  const { blobUrl: _b, ...saveable } = draft; // don't persist blob URLs
  if (idx >= 0) drafts[idx] = saveable;
  else drafts.push(saveable);
  try { localStorage.setItem('nestron_local_drafts', JSON.stringify(drafts)); } catch {}
}

function deleteLocalDraft(id) {
  const post = getMergedPosts().find(p => p.id === id);
  if (post && post.blobUrl) URL.revokeObjectURL(post.blobUrl);
  const drafts = loadLocalDrafts().filter(d => d.id !== id);
  try { localStorage.setItem('nestron_local_drafts', JSON.stringify(drafts)); } catch {}
  localStorage.removeItem(`mock_${id}`);
  localStorage.removeItem(`meta_${id}`);
  renderCalendar();
}

/** Merges schedule.json posts with local drafts; applies status overrides. */
function getMergedPosts() {
  const overrides = getStatusOverrides();
  const locals = loadLocalDrafts().map(d => {
    const html = localStorage.getItem(`mock_${d.id}`);
    if (html && !d.blobUrl) d.blobUrl = htmlToBlobUrl(html);
    const meta = tryParseJson(localStorage.getItem(`meta_${d.id}`));
    if (meta && meta.mockTitle && !d.mockTitle) d.mockTitle = meta.mockTitle;
    return { ...d, isLocal: true };
  });
  // Local drafts take precedence over schedule.json entries with the same ID
  const localIds = new Set(locals.map(d => d.id));
  const jsonPosts = allPosts.filter(p => !localIds.has(p.id));
  return [...jsonPosts, ...locals]
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
    .map(p => overrides[p.id] ? { ...p, status: overrides[p.id] } : p);
}

// ── VIEW STATE (persist + shareable URLs) ──────────────────────────────────

function saveViewState() {
  try {
    localStorage.setItem('nestron_view_state', JSON.stringify({
      view: currentView, year: currentYear, month: currentMonth,
      filter: activeFilter, weekStart: dateToStr(currentWeekStart)
    }));
  } catch {}
}

/**
 * On load, URL params take precedence (shareable links work for teammates).
 * Falls back to localStorage for personal view preference.
 */
function loadViewState() {
  const params = new URLSearchParams(window.location.search);
  const hasUrlState = params.has('v') || params.has('f') || params.has('y') || params.has('m') || params.has('w');

  if (hasUrlState) {
    const v = params.get('v');
    const f = params.get('f');
    const y = params.get('y');
    const m = params.get('m');
    const w = params.get('w');
    if (v && ['month', 'week', 'all'].includes(v)) currentView = v;
    if (f && PLATFORMS.includes(f)) activeFilter = f;
    if (y) currentYear  = parseInt(y);
    if (m) currentMonth = parseInt(m) - 1;
    if (w) currentWeekStart = calcWeekMonday(parseLocalDate(w));
    return;
  }

  const saved = tryParseJson(localStorage.getItem('nestron_view_state'));
  if (!saved) return;
  if (saved.view && ['month', 'week', 'all'].includes(saved.view)) currentView = saved.view;
  if (saved.filter && PLATFORMS.includes(saved.filter)) activeFilter = saved.filter;
  if (saved.year)  currentYear  = saved.year;
  if (saved.month !== undefined) currentMonth = saved.month;
  if (saved.weekStart) currentWeekStart = calcWeekMonday(parseLocalDate(saved.weekStart));
}

/** Updates the URL bar so the current view can be copied and shared. */
function writeUrlParams() {
  const params = new URLSearchParams();
  params.set('v', currentView);
  if (activeFilter !== 'all') params.set('f', activeFilter);
  if (currentView === 'month') {
    params.set('y', currentYear);
    params.set('m', currentMonth + 1);
  } else if (currentView === 'week') {
    params.set('w', dateToStr(currentWeekStart));
  }
  try {
    window.history.replaceState(null, '', `?${params.toString()}`);
  } catch {}
}

// ── UPLOAD / STORAGE ───────────────────────────────────────────────────────

function loadMocksFromStorage() {
  allPosts.forEach(post => {
    const html = localStorage.getItem(`mock_${post.id}`);
    if (html) {
      post.blobUrl = htmlToBlobUrl(html);
      const extracted = extractHtmlTitle(html);
      if (extracted) post.mockTitle = extracted;
    }
    const meta = tryParseJson(localStorage.getItem(`meta_${post.id}`));
    if (meta && meta.mockTitle) post.mockTitle = meta.mockTitle;
  });
}

function htmlToBlobUrl(html) {
  // Inject an absolute base href so relative paths like ../../assets/ resolve correctly
  // from blob: URLs (where <base href="/"> can be ambiguous in some browsers).
  const based = /<base[\s>]/i.test(html)
    ? html
    : html.replace(/(<head[^>]*>)/i, `$1<base href="${window.location.origin}/">`);
  return URL.createObjectURL(new Blob([based], { type: 'text/html' }));
}

async function preloadMockFiles() {
  await Promise.all(
    allPosts
      .filter(p => p.mock_file && !p.blobUrl)
      .map(async p => {
        try {
          const r = await fetch(p.mock_file);
          const html = await r.text();
          p.blobUrl = htmlToBlobUrl(html);
          if (!p.mockTitle) {
            const extracted = extractHtmlTitle(html);
            if (extracted) p.mockTitle = extracted;
          }
        } catch {}
      })
  );
}

function triggerUpload(postId) {
  currentUploadPostId = postId;
  fileInput.click();
}

async function handleFileUpload(post, file) {
  const html = await file.text();
  const extracted = extractHtmlTitle(html);
  if (extracted) {
    post.mockTitle = extracted;
    try { localStorage.setItem(`meta_${post.id}`, JSON.stringify({ mockTitle: extracted })); } catch {}
  }
  try { localStorage.setItem(`mock_${post.id}`, html); } catch {}
  if (post.isLocal) saveLocalDraft(post);
  if (post.blobUrl) URL.revokeObjectURL(post.blobUrl);
  post.blobUrl = htmlToBlobUrl(html);
  updateCardPreview(post);
}

// ── ADD / EDIT POST MODAL ──────────────────────────────────────────────────

function populateAddPlatformSelect() {
  addPlatformEl.innerHTML = '';
  PLATFORMS.filter(p => p !== 'all').forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = PLATFORM_LABELS[p];
    addPlatformEl.appendChild(opt);
  });
}

function openAddPostForm(dateStr) {
  currentEditPostId = null;
  pendingAddMockHtml = null;
  addUploadNameEl.textContent = 'No file chosen';
  addFormEl.reset();
  if (dateStr) addDateEl.value = dateStr;
  document.getElementById('add-title').textContent = 'New post';
  addBackdropEl.classList.add('is-open');
}

function openEditPostForm(post) {
  currentEditPostId = post.id;
  pendingAddMockHtml = null;
  addUploadNameEl.textContent = 'No file chosen';
  addFormEl.reset();
  // Pre-fill
  addPlatformEl.value = post.platform;
  addDateEl.value = post.scheduled_date;
  document.getElementById('add-topic').value   = post.topic    || '';
  document.getElementById('add-has-video').checked = !!post.has_video;
  document.getElementById('add-title').textContent = 'Edit post';
  addBackdropEl.classList.add('is-open');
}

function closeAddPostModal() {
  addBackdropEl.classList.remove('is-open');
  pendingAddMockHtml = null;
  currentEditPostId  = null;
}

function handleAddPostSubmit(e) {
  e.preventDefault();
  const fd = new FormData(addFormEl);
  const platform       = fd.get('platform');
  const scheduled_date = fd.get('scheduled_date');
  if (!platform || !scheduled_date) return;

  const day  = parseInt(scheduled_date.split('-')[2]);
  const week = Math.ceil(day / 7);

  if (currentEditPostId) {
    // ── Edit mode ───────────────────────────────────────────────────────────
    const all = loadLocalDrafts();
    const idx = all.findIndex(d => d.id === currentEditPostId);
    // Base: existing local draft OR the schedule.json post (creating a local override)
    const base = idx >= 0 ? all[idx] : (allPosts.find(p => p.id === currentEditPostId) || {});
    const updated = {
      ...base,
      id: currentEditPostId,
      isLocal: true,
      platform,
      scheduled_date,
      topic: fd.get('topic') || '',
      week,
      status: base.status || 'draft',
      has_video: fd.get('has_video') === 'on'
    };
    if (pendingAddMockHtml) {
      const extracted = extractHtmlTitle(pendingAddMockHtml);
      if (extracted) {
        updated.mockTitle = extracted;
        try { localStorage.setItem(`meta_${updated.id}`, JSON.stringify({ mockTitle: extracted })); } catch {}
      }
      try { localStorage.setItem(`mock_${updated.id}`, pendingAddMockHtml); } catch {}
      if (base.blobUrl) URL.revokeObjectURL(base.blobUrl);
      updated.blobUrl = htmlToBlobUrl(pendingAddMockHtml);
    }
    saveLocalDraft(updated);
  } else {
    // ── Add mode: create new local draft ───────────────────────────────────
    const draft = {
      id: `local_${Date.now()}`,
      platform, scheduled_date,
      topic:    fd.get('topic')    || '',
      week, status: 'draft', isLocal: true,
      has_video: fd.get('has_video') === 'on'
    };
    if (pendingAddMockHtml) {
      const extracted = extractHtmlTitle(pendingAddMockHtml);
      if (extracted) {
        draft.mockTitle = extracted;
        try { localStorage.setItem(`meta_${draft.id}`, JSON.stringify({ mockTitle: extracted })); } catch {}
      }
      try { localStorage.setItem(`mock_${draft.id}`, pendingAddMockHtml); } catch {}
      draft.blobUrl = htmlToBlobUrl(pendingAddMockHtml);
    }
    saveLocalDraft(draft);
  }

  closeAddPostModal();
  renderCalendar();
}

// ── FILTER TABS ────────────────────────────────────────────────────────────

function renderFilterTabs() {
  filterBarEl.innerHTML = '';
  PLATFORMS.forEach(platform => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab' + (platform === activeFilter ? ' active' : '');
    btn.dataset.platform = platform;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', platform === activeFilter ? 'true' : 'false');
    btn.textContent = platform === 'all' ? 'All' : PLATFORM_LABELS[platform];
    btn.addEventListener('click', () => {
      activeFilter = platform;
      renderFilterTabs();
      renderCalendar();
    });
    filterBarEl.appendChild(btn);
  });
}

// ── CALENDAR: MAIN DISPATCHER ──────────────────────────────────────────────

function renderCalendar() {
  cardElements = {};
  calendarEl.innerHTML = '';

  // Entrance animation — force reflow to restart even if class was already present
  calendarEl.classList.remove('cal-entering');
  void calendarEl.offsetWidth;
  calendarEl.classList.add('cal-entering');
  calendarEl.addEventListener('animationend',
    () => calendarEl.classList.remove('cal-entering'), { once: true });

  updateCalTitle();
  saveViewState();
  writeUrlParams();

  const posts = filterByPlatform(getMergedPosts(), activeFilter);
  if (currentView === 'month') renderMonthView(posts);
  else if (currentView === 'week') renderWeekView(posts);
  else renderAllView(posts);
}

// ── CALENDAR: MONTH VIEW ───────────────────────────────────────────────────

function renderMonthView(posts) {
  const postsByDate = groupPostsByDate(posts);
  const tStr = todayStr();

  const grid = document.createElement('div');
  grid.className = 'cal-month-grid';

  DOW_LABELS.forEach(label => {
    const h = document.createElement('div');
    h.className = 'cal-day-header';
    h.textContent = label;
    grid.appendChild(h);
  });

  getMonthDays(currentYear, currentMonth).forEach(({ dateStr, isCurrentMonth }) => {
    const dow = parseLocalDate(dateStr).getDay(); // 0=Sun, 6=Sat
    grid.appendChild(buildDayCell(dateStr, postsByDate[dateStr] || [], {
      isCurrentMonth,
      isToday:   dateStr === tStr,
      isWeekend: dow === 0 || dow === 6,
      cap:       MONTH_CELL_CAP
    }));
  });

  calendarEl.appendChild(grid);
}

function buildDayCell(dateStr, dayPosts, {
  isCurrentMonth = true, isToday = false, isWeekend = false, cap = Infinity
} = {}) {
  const cell = document.createElement('div');
  cell.className = 'cal-day-cell' +
    (!isCurrentMonth ? ' cal-day-cell--other'   : '') +
    (isToday         ? ' cal-day-cell--today'   : '') +
    (isWeekend       ? ' cal-day-cell--weekend' : '');

  // Density heat map attribute
  const n = dayPosts.length;
  if (n > 0) cell.dataset.density = n <= 2 ? '1' : n <= 4 ? '2' : '3';

  const dayNum = document.createElement('div');
  dayNum.className = 'cal-day-num';
  dayNum.textContent = String(parseInt(dateStr.split('-')[2]));
  cell.appendChild(dayNum);

  const postsWrap = document.createElement('div');
  postsWrap.className = 'cal-day-posts';

  const visible  = dayPosts.slice(0, cap);
  const overflow = dayPosts.length - visible.length;

  visible.forEach(post => postsWrap.appendChild(buildCompactCard(post)));

  if (overflow > 0) {
    const chip = document.createElement('button');
    chip.className = 'cal-overflow-chip';
    chip.textContent = `+${overflow} more`;
    chip.addEventListener('click', e => {
      e.stopPropagation();
      currentView      = 'week';
      currentWeekStart = calcWeekMonday(parseLocalDate(dateStr));
      document.querySelectorAll('.cal-view-btn')
        .forEach(b => b.classList.toggle('active', b.dataset.view === 'week'));
      renderCalendar();
    });
    postsWrap.appendChild(chip);
  }

  cell.appendChild(postsWrap);

  const addBtn = document.createElement('button');
  addBtn.className = 'cal-add-btn';
  addBtn.setAttribute('aria-label', `Add post on ${dateStr}`);
  addBtn.textContent = '+';
  addBtn.addEventListener('click', e => { e.stopPropagation(); openAddPostForm(dateStr); });
  cell.appendChild(addBtn);

  return cell;
}

// ── CALENDAR: WEEK VIEW ────────────────────────────────────────────────────

function renderWeekView(posts) {
  const postsByDate = groupPostsByDate(posts);
  const days  = getWeekDays(currentWeekStart);
  const tStr  = todayStr();
  let totalPosts = 0;

  const grid = document.createElement('div');
  grid.className = 'cal-week-grid';

  days.forEach((date, i) => {
    const dStr      = dateToStr(date);
    const isToday   = dStr === tStr;
    const dow       = date.getDay();
    const isWeekend = dow === 0 || dow === 6;

    const col = document.createElement('div');
    col.className = 'cal-week-col' +
      (isToday   ? ' cal-week-col--today'   : '') +
      (isWeekend ? ' cal-week-col--weekend' : '');

    const dayHeader = document.createElement('div');
    dayHeader.className = 'cal-week-day-header';

    const dowEl = document.createElement('span');
    dowEl.className = 'cal-week-dow';
    dowEl.textContent = DOW_LABELS[i];

    const dateNum = document.createElement('span');
    dateNum.className = 'cal-week-date';
    dateNum.textContent = date.getDate();

    dayHeader.appendChild(dowEl);
    dayHeader.appendChild(dateNum);
    col.appendChild(dayHeader);

    const dayPosts = postsByDate[dStr] || [];
    totalPosts += dayPosts.length;

    const postsWrap = document.createElement('div');
    postsWrap.className = 'cal-week-posts';
    dayPosts.forEach(post => postsWrap.appendChild(buildCard(post)));
    col.appendChild(postsWrap);

    const addBtn = document.createElement('button');
    addBtn.className = 'cal-week-add';
    addBtn.textContent = '+ Add post';
    addBtn.addEventListener('click', () => openAddPostForm(dStr));
    col.appendChild(addBtn);

    grid.appendChild(col);
  });

  calendarEl.appendChild(grid);

  // Empty week hint
  if (totalPosts === 0) {
    const hint = document.createElement('p');
    hint.className = 'week-empty-hint';
    hint.textContent = 'Nothing scheduled this week — click + in any column to add a post.';
    calendarEl.appendChild(hint);
  }
}

// ── CALENDAR: ALL VIEW ─────────────────────────────────────────────────────

function renderAllView(posts) {
  if (!posts.length) {
    const msg = document.createElement('p');
    msg.className = 'empty-state';
    msg.textContent = 'No posts scheduled.';
    calendarEl.appendChild(msg);
    return;
  }

  const earliest  = posts[0].scheduled_date.slice(0, 7);
  const futureDate = new Date(_today.getFullYear(), _today.getMonth() + 3, 1);
  const futureKey  = dateToStr(futureDate).slice(0, 7);

  const monthKeys = [];
  let cursor = earliest;
  while (cursor <= futureKey) {
    monthKeys.push(cursor);
    const [cy, cm] = cursor.split('-').map(Number);
    cursor = dateToStr(new Date(cy, cm, 1)).slice(0, 7);
  }

  const postsByMonth = {};
  posts.forEach(p => {
    const mk = p.scheduled_date.slice(0, 7);
    if (!postsByMonth[mk]) postsByMonth[mk] = {};
    if (!postsByMonth[mk][p.scheduled_date]) postsByMonth[mk][p.scheduled_date] = [];
    postsByMonth[mk][p.scheduled_date].push(p);
  });

  const tStr         = todayStr();
  const todayMonthKey = tStr.slice(0, 7);
  let todaySectionEl = null;

  monthKeys.forEach(mk => {
    const [y, m] = mk.split('-').map(Number);

    const section = document.createElement('div');
    section.className = 'all-month-section';
    if (mk === todayMonthKey) {
      todaySectionEl = section;
    }

    const monthHeader = document.createElement('div');
    monthHeader.className = 'all-month-header';

    const monthName = document.createElement('span');
    monthName.className = 'all-month-name';
    monthName.textContent = new Intl.DateTimeFormat('en-US', { month: 'long' })
      .format(new Date(y, m - 1, 1));

    const monthYear = document.createElement('span');
    monthYear.className = 'all-month-year';
    monthYear.textContent = y;

    monthHeader.appendChild(monthName);
    monthHeader.appendChild(monthYear);
    section.appendChild(monthHeader);

    const dayMap      = postsByMonth[mk] || {};
    const sortedDates = Object.keys(dayMap).sort();

    if (!sortedDates.length) {
      const empty = document.createElement('p');
      empty.className = 'all-empty';
      empty.textContent = 'No posts this month.';
      section.appendChild(empty);
    } else {
      sortedDates.forEach(dStr => {
        const dayGroup = document.createElement('div');
        dayGroup.className = 'all-day-group';

        const dayLabel = document.createElement('div');
        dayLabel.className = 'all-day-label' + (dStr === tStr ? ' all-day-label--today' : '');
        dayLabel.textContent = formatDate(dStr);
        dayGroup.appendChild(dayLabel);

        const postsWrap = document.createElement('div');
        postsWrap.className = 'all-day-posts';
        dayMap[dStr].forEach(post => postsWrap.appendChild(buildCompactCard(post)));
        dayGroup.appendChild(postsWrap);

        section.appendChild(dayGroup);
      });
    }

    calendarEl.appendChild(section);
  });

  // Smooth scroll to today's month section (#6)
  if (todaySectionEl) {
    requestAnimationFrame(() => {
      todaySectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

// ── CARD BUILDERS ──────────────────────────────────────────────────────────

/** Compact card — used in month + all views. No iframe, just icon/title/badge. */
function buildCompactCard(post) {
  const card = document.createElement('div');
  card.className = 'cal-compact-card' + (post.isLocal ? ' cal-compact-card--local' : '');
  card.style.setProperty('--platform-color', PLATFORM_COLORS[post.platform] || '#888');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.title = getCardTitle(post);

  const icon = document.createElement('span');
  icon.className = 'cal-compact-icon';
  icon.innerHTML = getPlatformIcon(post.platform);

  const title = document.createElement('span');
  title.className = 'cal-compact-title';
  title.textContent = getCardTitle(post);

  card.appendChild(icon);
  card.appendChild(title);
  card.appendChild(buildBadge(post));

  if (post.has_video) {
    const vTag = document.createElement('span');
    vTag.className = 'cal-video-tag';
    vTag.textContent = '▶ Video';
    card.appendChild(vTag);
  }

  const editBtn = document.createElement('button');
  editBtn.className = 'cal-compact-edit';
  editBtn.setAttribute('aria-label', 'Edit post');
  editBtn.title = 'Edit post';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', e => { e.stopPropagation(); openEditPostForm(post); });
  card.appendChild(editBtn);

  const delBtn = document.createElement('button');
  delBtn.className = 'cal-compact-delete';
  delBtn.setAttribute('aria-label', 'Delete post');
  delBtn.title = 'Delete post';
  delBtn.textContent = '×';
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (post.isLocal) deleteLocalDraft(post.id);
    else card.remove();
  });
  card.appendChild(delBtn);

  const openCard = () => {
    openModal(post, (post.blobUrl || post.mock_file) ? 'mock' : 'text');
  };

  card.addEventListener('click', openCard);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); }
  });

  return card;
}

/** Full preview card — used in week view with scaled iframe. */
function buildCard(post) {
  const card = document.createElement('div');
  card.className = 'card' + (post.isLocal ? ' card--local' : '');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.style.borderLeftColor = PLATFORM_COLORS[post.platform] || '#888';

  cardElements[post.id] = card;

  const dateLabel = document.createElement('div');
  dateLabel.className = 'card-date-label';
  dateLabel.textContent = formatDate(post.scheduled_date);

  const previewWrap = document.createElement('div');
  previewWrap.className = 'card-preview-wrap';
  populatePreviewWrap(previewWrap, post);

  if (post.has_video) {
    const vTag = document.createElement('div');
    vTag.className = 'card-video-tag';
    vTag.textContent = '▶ Video';
    previewWrap.appendChild(vTag);
  }

  const info = document.createElement('div');
  info.className = 'card-info';

  const iconWrap = document.createElement('span');
  iconWrap.className = 'card-platform-icon';
  iconWrap.innerHTML = getPlatformIcon(post.platform);

  const topic = document.createElement('span');
  topic.className = 'card-topic';
  topic.textContent = getCardTitle(post);

  info.appendChild(iconWrap);
  info.appendChild(topic);
  info.appendChild(buildBadge(post));

  card.appendChild(dateLabel);
  card.appendChild(previewWrap);
  card.appendChild(info);

  const editBtn = document.createElement('button');
  editBtn.className = 'card-edit-btn';
  editBtn.setAttribute('aria-label', 'Edit post');
  editBtn.title = 'Edit post';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', e => { e.stopPropagation(); openEditPostForm(post); });
  card.appendChild(editBtn);

  const delBtn = document.createElement('button');
  delBtn.className = 'card-delete-btn';
  delBtn.setAttribute('aria-label', 'Delete post');
  delBtn.title = 'Delete post';
  delBtn.textContent = '×';
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (post.isLocal) deleteLocalDraft(post.id);
    else card.remove();
  });
  card.appendChild(delBtn);

  const openCard = () => {
    if (post.blobUrl || post.mock_file) openModal(post, 'mock');
    else if (post.copy || post.copy_zh) openModal(post, 'text');
    else triggerUpload(post.id);
  };

  card.addEventListener('click', openCard);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); }
  });

  return card;
}

function populatePreviewWrap(wrap, post) {
  wrap.innerHTML = '';

  if (post.blobUrl || post.mock_file) {
    const frame = document.createElement('iframe');
    frame.className = 'card-preview-frame';
    frame.src = post.blobUrl || post.mock_file;
    frame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    frame.setAttribute('tabindex', '-1');
    frame.title = getCardTitle(post);

    const overlay = document.createElement('div');
    overlay.className = 'card-hover-overlay';

    [['Full Mock · 完整预览', 'mock'], ['Text Only · 纯文字', 'text']].forEach(([label, tab]) => {
      const btn = document.createElement('button');
      btn.className = 'card-action';
      btn.textContent = label;
      btn.addEventListener('click', e => { e.stopPropagation(); openModal(post, tab); });
      overlay.appendChild(btn);
    });

    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'card-action card-action--replace';
    replaceBtn.textContent = 'Replace';
    replaceBtn.addEventListener('click', e => { e.stopPropagation(); triggerUpload(post.id); });
    overlay.appendChild(replaceBtn);

    wrap.appendChild(frame);
    wrap.appendChild(overlay);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'card-preview-placeholder';

    const icon = document.createElement('div');
    icon.className = 'upload-icon';
    icon.textContent = '+';

    const hint = document.createElement('div');
    hint.className = 'upload-hint';
    hint.textContent = 'Click to upload mock (.html)';

    placeholder.appendChild(icon);
    placeholder.appendChild(hint);
    wrap.appendChild(placeholder);
  }
}

function updateCardPreview(post) {
  const card = cardElements[post.id];
  if (!card) return;
  const previewWrap = card.querySelector('.card-preview-wrap');
  if (previewWrap) populatePreviewWrap(previewWrap, post);
  const topicEl = card.querySelector('.card-topic');
  if (topicEl) topicEl.textContent = getCardTitle(post);
}

/**
 * Badge with click-to-cycle status.
 * For local drafts: persists in localStorage via saveLocalDraft.
 * For schedule.json posts: persists a status override in localStorage.
 */
function buildBadge(post) {
  const span = document.createElement('span');
  span.className = 'badge';
  span.dataset.status = post.status;
  span.textContent = STATUS_LABELS[post.status] || post.status;
  span.title = 'Click to change status';

  span.addEventListener('click', e => {
    e.stopPropagation();
    const idx  = STATUS_CYCLE.indexOf(post.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    post.status = next; // mutate in-memory copy for this session
    if (post.isLocal) saveLocalDraft(post);
    else setStatusOverride(post.id, next);
    span.dataset.status = next;
    span.textContent    = STATUS_LABELS[next] || next;
  });

  return span;
}

// ── MONTH PICKER ───────────────────────────────────────────────────────────

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildMonthPicker() {
  const picker = document.createElement('div');
  picker.className = 'month-picker';
  picker.id = 'month-picker';

  // Year navigation row
  const yearRow = document.createElement('div');
  yearRow.className = 'month-picker-year-row';

  const prevYrBtn = document.createElement('button');
  prevYrBtn.className = 'picker-yr-btn';
  prevYrBtn.textContent = '‹';
  prevYrBtn.addEventListener('click', e => { e.stopPropagation(); pickerYear--; refreshPickerYear(); });

  const yrLabel = document.createElement('span');
  yrLabel.className = 'picker-yr-label';
  yrLabel.id = 'picker-yr-label';
  yrLabel.textContent = pickerYear;

  const nextYrBtn = document.createElement('button');
  nextYrBtn.className = 'picker-yr-btn';
  nextYrBtn.textContent = '›';
  nextYrBtn.addEventListener('click', e => { e.stopPropagation(); pickerYear++; refreshPickerYear(); });

  yearRow.appendChild(prevYrBtn);
  yearRow.appendChild(yrLabel);
  yearRow.appendChild(nextYrBtn);
  picker.appendChild(yearRow);

  // Month grid
  const monthGrid = document.createElement('div');
  monthGrid.className = 'month-picker-grid';
  monthGrid.id = 'month-picker-grid';

  MONTH_ABBR.forEach((abbr, i) => {
    const btn = document.createElement('button');
    btn.className = 'picker-month-btn';
    btn.dataset.monthIndex = i;
    btn.textContent = abbr;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      currentYear  = pickerYear;
      currentMonth = i;
      currentView  = 'month';
      document.querySelectorAll('.cal-view-btn')
        .forEach(b => b.classList.toggle('active', b.dataset.view === 'month'));
      closeMonthPicker();
      renderCalendar();
    });
    monthGrid.appendChild(btn);
  });

  picker.appendChild(monthGrid);
  return picker;
}

function refreshPickerYear() {
  const label = document.getElementById('picker-yr-label');
  if (label) label.textContent = pickerYear;
  document.querySelectorAll('.picker-month-btn').forEach(btn => {
    btn.classList.toggle('active',
      pickerYear === currentYear && parseInt(btn.dataset.monthIndex) === currentMonth);
  });
}

function openMonthPicker() {
  if (!pickerEl) {
    pickerEl = buildMonthPicker();
    document.body.appendChild(pickerEl);
  }
  pickerYear = currentYear;
  refreshPickerYear();

  // Position below cal-title
  const rect = calTitleEl.getBoundingClientRect();
  pickerEl.style.top  = `${rect.bottom + window.scrollY + 8}px`;
  pickerEl.style.left = `${rect.left + window.scrollX}px`;
  pickerEl.classList.add('is-open');
}

function closeMonthPicker() {
  if (pickerEl) pickerEl.classList.remove('is-open');
}

// ── MODAL ──────────────────────────────────────────────────────────────────

function openModal(post, tab = 'mock') {
  lastFocusedElement = document.activeElement;

  modalIconEl.innerHTML    = getPlatformIcon(post.platform);
  modalTitleEl.textContent = getCardTitle(post);
  modalLabelEl.textContent = PLATFORM_LABELS[post.platform] || post.platform;
  modalVideoBadgeEl.classList.toggle('hidden', !post.has_video);

  const hasMock = !!(post.blobUrl || post.mock_file);
  iframeEl.src = post.blobUrl || post.mock_file || '';

  // Build bilingual copy panel
  copyTextEl.innerHTML = '';
  if (post.copy) {
    const en = document.createElement('div');
    en.className = 'copy-section';
    en.textContent = post.copy;
    copyTextEl.appendChild(en);
  }
  if (post.copy_zh) {
    if (post.copy) {
      const hr = document.createElement('hr');
      hr.className = 'copy-divider';
      copyTextEl.appendChild(hr);
    }
    const zh = document.createElement('div');
    zh.className = 'copy-section copy-zh';
    zh.textContent = post.copy_zh;
    copyTextEl.appendChild(zh);
  }
  if (!post.copy && !post.copy_zh) {
    if (post.topic) {
      const topicEl = document.createElement('p');
      topicEl.className = 'copy-section';
      topicEl.textContent = post.topic;
      copyTextEl.appendChild(topicEl);
    } else {
      const msg = document.createElement('p');
      msg.className = 'copy-empty';
      msg.textContent = 'No copy text · 暂无文字';
      copyTextEl.appendChild(msg);
    }
  }

  const startTab = (tab === 'mock' && hasMock) ? 'mock' : 'text';
  switchModalTab(startTab);
  backdropEl.classList.add('is-open');
  closeBtnEl.focus();
}

function closeModal() {
  backdropEl.classList.remove('is-open');
  iframeEl.src = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function switchModalTab(tab) {
  const isMock = tab === 'mock';
  tabMockBtn.classList.toggle('active', isMock);
  tabMockBtn.setAttribute('aria-selected', String(isMock));
  panelMockEl.classList.toggle('hidden', !isMock);
  tabTextBtn.classList.toggle('active', !isMock);
  tabTextBtn.setAttribute('aria-selected', String(!isMock));
  panelTextEl.classList.toggle('hidden', isMock);
}

// ── NAVIGATION ─────────────────────────────────────────────────────────────

function bindCalNavEvents() {
  document.getElementById('cal-prev').addEventListener('click', () => {
    if (currentView === 'month') {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    } else if (currentView === 'week') {
      currentWeekStart = new Date(currentWeekStart);
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    }
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    if (currentView === 'month') {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    } else if (currentView === 'week') {
      currentWeekStart = new Date(currentWeekStart);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    renderCalendar();
  });

  document.getElementById('cal-today').addEventListener('click', () => {
    currentYear      = _today.getFullYear();
    currentMonth     = _today.getMonth();
    currentWeekStart = calcWeekMonday(_today);
    renderCalendar();
  });

  document.querySelectorAll('.cal-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cal-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderCalendar();
    });
  });

  // Set initial active view button (respects loaded state)
  const initialBtn = document.querySelector(`[data-view="${currentView}"]`);
  if (initialBtn) initialBtn.classList.add('active');

  // Month picker: click cal-title to open / close
  calTitleEl.addEventListener('click', () => {
    if (pickerEl && pickerEl.classList.contains('is-open')) closeMonthPicker();
    else openMonthPicker();
  });

  // Close picker on outside click
  document.addEventListener('click', e => {
    if (pickerEl && pickerEl.classList.contains('is-open') &&
        !pickerEl.contains(e.target) && e.target !== calTitleEl) {
      closeMonthPicker();
    }
  });
}

// ── EVENTS ─────────────────────────────────────────────────────────────────

function bindEvents() {
  // Post preview modal
  closeBtnEl.addEventListener('click', closeModal);
  backdropEl.addEventListener('click', e => { if (e.target === backdropEl) closeModal(); });
  tabMockBtn.addEventListener('click', () => switchModalTab('mock'));
  tabTextBtn.addEventListener('click', () => switchModalTab('text'));

  // Add/edit post modal
  addCloseEl.addEventListener('click', closeAddPostModal);
  addBackdropEl.addEventListener('click', e => { if (e.target === addBackdropEl) closeAddPostModal(); });
  addFormEl.addEventListener('submit', handleAddPostSubmit);
  addUploadBtnEl.addEventListener('click', () => addFileInput.click());

  // Escape closes whichever modal is open
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (backdropEl.classList.contains('is-open'))    closeModal();
      else if (addBackdropEl.classList.contains('is-open')) closeAddPostModal();
      else closeMonthPicker();
    }
  });
}

// ── INIT ───────────────────────────────────────────────────────────────────

async function init() {
  renderHeaderDate();
  populateAddPlatformSelect();
  loadViewState();   // restore state before binding nav (sets initial active view button)
  bindEvents();
  bindCalNavEvents();
  try {
    allPosts = await loadPosts();
    loadMocksFromStorage();
    await preloadMockFiles();
    renderFilterTabs();
    renderCalendar();
  } catch (err) {
    calendarEl.innerHTML =
      '<p class="empty-state">Could not load schedule.json — run via HTTP server (python3 -m http.server 8000).</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);

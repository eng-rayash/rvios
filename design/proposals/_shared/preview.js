/* أدوات لوحة التوكنز — تقرأ القيم الحيّة من :root
   حتى تبقى اللوحة صادقة مهما عُدّلت التوكنز. */

const COLOR_TOKENS = [
  'primary-50','primary-100','primary-300','primary-500','primary-700','primary-900',
  'gold-100','gold-500','gold-700',
  'ink-900','ink-700','ink-500','ink-300',
  'surface-0','surface-1','surface-2','surface-3',
  'border-subtle','border-default','border-strong',
  'success','warning','danger','info',
];

const TEXT_TOKENS = ['5xl','4xl','3xl','2xl','xl','lg','base','sm','xs'];
const RADIUS_TOKENS = ['xs','sm','md','lg','xl','full'];
const SHADOW_TOKENS = ['xs','sm','md','lg','glow'];

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function renderSwatches() {
  const host = document.getElementById('swatches');
  if (!host) return;
  host.innerHTML = COLOR_TOKENS.map((t) => {
    const v = css(`--color-${t}`);
    return `<div class="tok">
      <i style="background:${v || 'transparent'}"></i>
      <span>${t}<em>${v || '— مفقود'}</em></span>
    </div>`;
  }).join('');
}

function renderTypeScale() {
  const host = document.getElementById('typescale');
  if (!host) return;
  host.innerHTML = TEXT_TOKENS.map((t) => {
    const v = css(`--text-${t}`);
    return `<div style="display:flex;align-items:baseline;gap:var(--space-6);padding-block:var(--space-2);border-bottom:1px solid var(--color-border-subtle)">
      <code style="font-family:var(--font-mono);font-size:11px;color:var(--color-text-secondary);min-width:110px">text-${t} · ${v}</code>
      <span style="font-size:${v}">نحن نبني الأنظمة</span>
    </div>`;
  }).join('');
}

function renderShapes() {
  const host = document.getElementById('shapes');
  if (!host) return;
  const radii = RADIUS_TOKENS.map((t) => {
    const v = css(`--radius-${t}`);
    return `<div style="text-align:center">
      <div style="width:76px;height:76px;background:var(--color-primary-500);border-radius:${v}"></div>
      <code style="font-family:var(--font-mono);font-size:11px;color:var(--color-text-secondary)">${t}<br>${v}</code>
    </div>`;
  }).join('');
  const shadows = SHADOW_TOKENS.map((t) => {
    const v = css(`--shadow-${t}`);
    return `<div style="text-align:center">
      <div style="width:76px;height:76px;background:var(--color-surface-3);box-shadow:${v};border-radius:var(--radius-md)"></div>
      <code style="font-family:var(--font-mono);font-size:11px;color:var(--color-text-secondary)">shadow-${t}</code>
    </div>`;
  }).join('');
  host.innerHTML = radii + shadows;
}

/* فحص الاكتمال: أي توكن إلزامي مفقود يظهر في الـ console
   وفي شريط المعاينة — لا مقترح يُعتمد وهو ناقص. */
function auditTokens() {
  const required = [
    ...COLOR_TOKENS.map((t) => `--color-${t}`),
    ...TEXT_TOKENS.map((t) => `--text-${t}`),
    ...RADIUS_TOKENS.map((t) => `--radius-${t}`),
    ...SHADOW_TOKENS.map((t) => `--shadow-${t}`),
    '--font-display','--font-body','--font-mono',
    '--leading-tight','--leading-normal','--leading-loose',
    '--motion-fast','--motion-base','--motion-slow',
    '--ease-out','--ease-in-out','--ease-spring',
    '--z-base','--z-dropdown','--z-sticky','--z-overlay','--z-modal','--z-toast',
    '--color-text-primary','--color-text-secondary','--color-text-inverse','--color-text-on-primary',
    ...[1,2,3,4,5,6,8,10,12,16,20,24].map((n) => `--space-${n}`),
  ];
  const missing = required.filter((n) => !css(n));
  const bar = document.querySelector('.pv-bar span');
  if (missing.length) {
    console.warn('[tokens] مفقود:', missing);
    if (bar) bar.innerHTML += ` · <b style="color:var(--color-danger)">⚠ ${missing.length} توكن مفقود (انظر console)</b>`;
  } else {
    console.info(`[tokens] ✔ مكتمل — ${required.length} توكناً`);
    if (bar) bar.innerHTML += ` · <b style="color:var(--color-success)">✔ ${required.length} توكناً</b>`;
  }
}

function renderAll() { renderSwatches(); renderTypeScale(); renderShapes(); }

renderAll();
auditTokens();

new MutationObserver(renderAll).observe(document.documentElement, {
  attributes: true, attributeFilter: ['data-theme'],
});

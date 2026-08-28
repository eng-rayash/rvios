/* ============================================================
   Coverflow — نسخة vanilla للمعاينة
   المنطق هنا هو نفسه الذي نُقل إلى
   rvios-site/components/CoverflowGallery.tsx

   سكربت كلاسيكي عمداً لا ESM: بعض الخوادم الثابتة على ويندوز
   تقدّم .js بترميز text/plain فيرفضها المتصفح كـ module،
   والـ modules لا تعمل أصلاً عبر file://
   ============================================================ */
(function () {
'use strict';

const PERSPECTIVE_DEPTH = 240;   // بُعد البطاقات الجانبية للخلف
const SCALE_STEP = 0.13;         // تقلّص كل درجة ابتعاد
const MAX_VISIBLE = 2;           // كم بطاقة على كل جانب

function initCoverflow(root) {
  const track = root.querySelector('[data-cf-track]');
  if (!track) return;
  const cards = [...track.querySelectorAll('[data-cf-card]')];
  const counter = root.querySelector('[data-cf-counter]');
  const dotsHost = root.querySelector('[data-cf-dots]');
  const live = root.querySelector('[data-cf-live]');
  const n = cards.length;
  if (!n) return;

  const cfg = {
    gap: Number(root.dataset.gap ?? 200),
    tilt: Number(root.dataset.tilt ?? 12),
    sideTilt: Number(root.dataset.sideTilt ?? 4),
    dim: Number(root.dataset.dim ?? 0.55),
    autoplayMs: Number(root.dataset.autoplay ?? 0),
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let locked = false;
  let timer = null;

  /* نقاط — تُبنى مرة واحدة */
  const dots = dotsHost ? cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cf-dot';
    b.setAttribute('aria-label', `الانتقال إلى العمل ${i + 1}`);
    b.addEventListener('click', () => go(i));
    dotsHost.appendChild(b);
    return b;
  }) : [];

  function layout() {
    cards.forEach((card, i) => {
      /* المسافة الدائرية الأقصر — تجعل الالتفاف غير مرئي */
      let rel = i - active;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;

      const dist = Math.abs(rel);
      const visible = dist <= MAX_VISIBLE;

      /* RTL: الموجب يذهب يساراً حتى يتقدّم الشريط مع اتجاه القراءة */
      const x = -rel * cfg.gap;
      const z = -dist * PERSPECTIVE_DEPTH;
      const ry = rel * cfg.tilt;
      const rz = -rel * cfg.sideTilt;
      const scale = Math.max(0.4, 1 - dist * SCALE_STEP);

      card.style.transform =
        `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) ` +
        `rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
      card.style.opacity = visible ? '1' : '0';
      card.style.pointerEvents = visible && rel !== 0 ? 'auto' : rel === 0 ? 'none' : 'none';
      card.classList.toggle('is-active', rel === 0);
      card.setAttribute('aria-hidden', String(!visible));
      /* البطاقة الفعّالة تخرج من ترتيب التبويب لأنها ليست هدف تنقّل */
      card.tabIndex = visible && rel !== 0 ? 0 : -1;

      const veil = card.querySelector('[data-cf-veil]');
      if (veil) veil.style.opacity = rel === 0 ? '0' : String(cfg.dim);
    });

    dots.forEach((d, i) => {
      const on = i === active;
      d.classList.toggle('is-on', on);
      d.setAttribute('aria-current', on ? 'true' : 'false');
    });

    if (counter) {
      counter.textContent = `${ar(active + 1)} / ${ar(n)}`;
    }
    if (live) {
      const t = cards[active].dataset.title || '';
      live.textContent = `${active + 1} من ${n}: ${t}`;
    }
  }

  const ar = (num) => String(num).padStart(2, '0').replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

  function go(i) {
    if (locked) return;
    const next = ((i % n) + n) % n;
    if (next === active) return;
    active = next;
    if (!reduced) {
      locked = true;
      setTimeout(() => { locked = false; }, 620);
    }
    layout();
  }

  const step = (dir) => go(active + dir);

  /* ── التفاعل ── */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => go(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); }
    });
  });

  root.querySelector('[data-cf-prev]')?.addEventListener('click', () => step(-1));
  root.querySelector('[data-cf-next]')?.addEventListener('click', () => step(1));

  /* في RTL السهم الأيسر يتقدّم — اتجاه القراءة لا اتجاه المحور */
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(-1); }
    if (e.key === 'Home')       { e.preventDefault(); go(0); }
    if (e.key === 'End')        { e.preventDefault(); go(n - 1); }
  });

  /* سحب باللمس */
  let startX = null;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) step(dx > 0 ? -1 : 1);
    startX = null;
  }, { passive: true });

  /* تشغيل تلقائي — يتوقف عند التحويم أو التركيز أو إخفاء التبويب */
  function startAuto() {
    if (!cfg.autoplayMs || reduced) return;
    stopAuto();
    timer = setInterval(() => step(1), cfg.autoplayMs);
  }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  root.addEventListener('focusin', stopAuto);
  root.addEventListener('focusout', startAuto);
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  layout();
  startAuto();
}

document.querySelectorAll('[data-coverflow]').forEach(initCoverflow);

})();

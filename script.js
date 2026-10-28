// Slideshow: advances every 6 seconds, pauses on hover or focus, never auto-plays with reduced motion.
(function () {
  const root = document.getElementById('slider');
  if (!root) return;
  const slides = [...root.querySelectorAll('.slide')];
  const dots = [...root.querySelectorAll('.dots button')];
  const pauseBtn = root.querySelector('.pause');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0, timer = null, paused = reduced, hovering = false;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
    dots.forEach((d, n) => d.setAttribute('aria-current', n === current ? 'true' : 'false'));
  }
  function schedule() {
    clearInterval(timer);
    if (!paused && !hovering) timer = setInterval(() => show(current + 1), 6000);
  }
  function setPaused(p) {
    paused = p;
    pauseBtn.textContent = p ? 'Play' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.setAttribute('aria-label', p ? 'Play the slideshow' : 'Pause the slideshow');
    schedule();
  }

  root.querySelectorAll('.arrow').forEach(b => b.addEventListener('click', () => { show(current + Number(b.dataset.dir)); schedule(); }));
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); schedule(); }));
  pauseBtn.addEventListener('click', () => setPaused(!paused));
  root.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  root.addEventListener('focusin', () => { hovering = true; schedule(); });
  root.addEventListener('focusout', () => { hovering = false; schedule(); });
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { show(current + 1); schedule(); }
    if (e.key === 'ArrowLeft') { show(current - 1); schedule(); }
  });
  setPaused(reduced);
})();

// Menu button on small screens
(function () {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  });
})();

// Tabs in "In practice"
(function () {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  if (!tabs.length) return;
  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (step) { const next = tabs[(i + step + tabs.length) % tabs.length]; select(next); next.focus(); }
    });
  });
})();

// Links like contact.html?topic=... pre-select that topic in the enquiry form
(function () {
  const select = document.getElementById('f-topic');
  const topic = new URLSearchParams(window.location.search).get('topic');
  if (!select || !topic) return;
  const match = [...select.options].find(o => o.text === topic);
  if (match) select.value = match.text;
})();

// Enquiry form: builds an email draft in the visitor's own email app; nothing is sent or stored by the site
(function () {
  const form = document.getElementById('enquiry');
  if (!form) return;
  const error = document.getElementById('form-error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = document.getElementById('f-name'), msgEl = document.getElementById('f-msg');
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) {
      error.textContent = !name ? 'Add your name so I know who to reply to.' : 'Add a line or two about your challenge.';
      error.hidden = false;
      (!name ? nameEl : msgEl).focus();
      return;
    }
    error.hidden = true;
    const business = document.getElementById('f-business').value.trim();
    const topic = document.getElementById('f-topic').value;
    const subject = 'Enquiry: ' + topic + (business ? ' (' + business + ')' : '');
    const body = 'Name: ' + name + '\n' + (business ? 'Business: ' + business + '\n' : '') +
                 'Topic: ' + topic + '\n\n' + message + '\n';
    window.location.href = 'mailto:titusdinkar@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();

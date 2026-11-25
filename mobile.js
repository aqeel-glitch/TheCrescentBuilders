/* Automatic Mobile Hamburger Menu & Single-Tap Accordion Injector */
function initCrescentMobileMenu() {
  const nav = document.querySelector('header nav');
  if (!nav || document.getElementById('cb-mobile-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'cb-mobile-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle Menu');
  btn.innerHTML = '☰ <span style="font-size:13px;font-weight:600;">MENU</span>';

  btn.addEventListener('click', function () {
    nav.classList.toggle('cb-menu-open');
    btn.innerHTML = nav.classList.contains('cb-menu-open')
      ? '✕ <span style="font-size:13px;font-weight:600;">CLOSE</span>'
      : '☰ <span style="font-size:13px;font-weight:600;">MENU</span>';
  });

  const logoLink = nav.querySelector('a');
  if (logoLink && logoLink.nextSibling) {
    nav.insertBefore(btn, logoLink.nextSibling);
  } else {
    nav.appendChild(btn);
  }

  /* Build native 1-tap open/close mobile accordions */
  const subMenus = {
    'Other Services': [
      { label: 'Gutters', href: 'Gutters.html' },
      { label: 'Doors', href: 'Doors.html' }
    ],
    'Pricing': [
      { label: 'Roof Cost Calculator', href: 'Calculator.html' },
      { label: 'Siding Cost Calculator', href: 'Calculator.html' },
      { label: 'Window Cost Calculator', href: 'Calculator.html' },
      { label: 'Financing', href: 'Financing.html' }
    ],
    'About': [
      { label: 'Our Company', href: 'index.html' },
      { label: 'Service Areas', href: 'ServiceAreas.html' },
      { label: 'Warranty', href: 'Warranty.html' },
      { label: 'Certifications', href: 'Licensing.html' },
      { label: 'Blog', href: 'Blog.html' }
    ]
  };

  nav.querySelectorAll('button[aria-expanded]').forEach(function (reactBtn) {
    const labelText = reactBtn.textContent.replace('▼', '').trim();
    const items = subMenus[labelText];
    if (!items || reactBtn.dataset.cbMobileReady) return;
    reactBtn.dataset.cbMobileReady = '1';

    const mobileBtn = document.createElement('button');
    mobileBtn.type = 'button';
    mobileBtn.className = 'cb-mobile-acc-btn';
    mobileBtn.innerHTML = '<span>' + labelText + '</span><span class="cb-acc-arrow" style="font-size:10px;color:#b49609;transition:transform .2s;">▼</span>';

    const panel = document.createElement('div');
    panel.className = 'cb-mobile-acc-panel';
    items.forEach(function (it) {
      const a = document.createElement('a');
      a.href = it.href;
      a.textContent = it.label;
      a.style.cssText = 'display:block;color:#2b2b2b;text-decoration:none;padding:10px 20px;font-weight:500;';
      panel.appendChild(a);
    });

    mobileBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = panel.classList.contains('cb-open');
      nav.querySelectorAll('.cb-mobile-acc-panel.cb-open').forEach(function (p) {
        p.classList.remove('cb-open');
        if (p.previousElementSibling) {
          p.previousElementSibling.querySelector('.cb-acc-arrow').style.transform = 'rotate(0deg)';
        }
      });
      if (!isOpen) {
        panel.classList.add('cb-open');
        mobileBtn.querySelector('.cb-acc-arrow').style.transform = 'rotate(180deg)';
      }
    });

    reactBtn.classList.add('cb-desktop-only-btn');
    reactBtn.parentElement.appendChild(mobileBtn);
    reactBtn.parentElement.appendChild(panel);
  });
}

/* Watch DOM continuously until Header renders on any page speed */
(function () {
  var observer = new MutationObserver(function () {
    initCrescentMobileMenu();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  window.addEventListener('load', initCrescentMobileMenu);
  setTimeout(initCrescentMobileMenu, 300);
  setTimeout(initCrescentMobileMenu, 1200);
})();

/* Force Circular Favicon on All Pages */
window.addEventListener('load', function () {
  const img = new Image();
  img.src = './assets/favicon.png?v=4';
  img.onload = function () {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);

    document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  };
});

/* Smooth Scroll Reveal across all sections and cards */
(function () {
  function initScrollReveal() {
    var targets = document.querySelectorAll('section, .qcard, .tcard');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('cb-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function (el, index) {
      if (index === 0 && el.tagName === 'SECTION') return;
      el.classList.add('cb-reveal');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(initScrollReveal, 250);
    });
  } else {
    setTimeout(initScrollReveal, 250);
  }
})();

/* Send All Website Form Submissions Directly to GoHighLevel Webhook */
(function () {
  var GHL_WEBHOOK_URL = 'https://leadconnectorhq.com';
  var liveData = {};
  var ghlSentLock = false;

  var ORDER_KEYS = [
    'first_name',
    'last_name',
    'street_address',
    'city',
    'state',
    'zip_code',
    'phone_number',
    'email_address',
    'how_did_you_hear_about_us',
    'notes'
  ];

  function cleanLabelText(raw) {
    return (raw || '')
      .replace(/required/gi, '')
      .replace(/\*/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  function getFieldKey(el, idx) {
    var label = el.closest ? el.closest('label') : null;
    if (label) {
      var clone = label.cloneNode(true);
      clone.querySelectorAll('input, select, textarea, span, div, small').forEach(function (n) { n.remove(); });
      var key = cleanLabelText(clone.textContent);
      if (key) return key;
    }
    if (el.previousElementSibling) {
      var sibKey = cleanLabelText(el.previousElementSibling.textContent);
      if (sibKey) return sibKey;
    }
    if (el.parentElement && el.parentElement.previousElementSibling) {
      var parentSibKey = cleanLabelText(el.parentElement.previousElementSibling.textContent);
      if (parentSibKey) return parentSibKey;
    }
    return ORDER_KEYS[idx] || ('field_' + idx);
  }

  function snapshotAllFields() {
    var fields = Array.from(document.querySelectorAll('input, select, textarea')).filter(function (el) {
      return el.type !== 'submit' && el.type !== 'button' && el.type !== 'hidden';
    });

    fields.forEach(function (el, idx) {
      var val = (el.value || '').trim();
      if (!val) return;
      var key = getFieldKey(el, idx);
      liveData[key] = val;
      if (ORDER_KEYS[idx] && !liveData[ORDER_KEYS[idx]]) {
        liveData[ORDER_KEYS[idx]] = val;
      }
    });

    var pressed = [];
    document.querySelectorAll('button[aria-pressed="true"]').forEach(function (b) {
      var label = b.textContent.replace(/[✓✔]/g, '').trim();
      if (label) pressed.push(label);
    });
    if (pressed.length) {
      liveData.project_type = pressed.join(', ');
    }
  }

  function fireToGHL() {
    snapshotAllFields();
    if (ghlSentLock) return;
    if (Object.keys(liveData).length === 0) return;

    ghlSentLock = true;
    setTimeout(function () { ghlSentLock = false; }, 3500);

    var payload = Object.assign({
      source_page: window.location.pathname.split('/').pop() || 'index.html',
      page_url: window.location.href,
      submitted_at: new Date().toISOString()
    }, liveData);

    fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function () {});
  }

  document.addEventListener('input', snapshotAllFields, true);
  document.addEventListener('change', snapshotAllFields, true);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, input[type="submit"]');
    if (!btn) return;
    var text = (btn.textContent || btn.value || '').trim().toLowerCase();
    if (/^(submit|request|send|get estimate|get free estimate|schedule|book)/.test(text)) {
      fireToGHL();
    }
  }, true);
})();

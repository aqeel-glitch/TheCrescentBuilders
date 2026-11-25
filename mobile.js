/* Automatic Mobile Hamburger Menu Injector */
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

  // Logo ke bilkul baad Hamburger button lagayein
  const logoLink = nav.querySelector('a');
  if (logoLink && logoLink.nextSibling) {
    nav.insertBefore(btn, logoLink.nextSibling);
  } else {
    nav.appendChild(btn);
  }
}

// Claude runtime ke render hone ke baad menu activate karein
window.addEventListener('load', function () {
  setTimeout(initCrescentMobileMenu, 300);
  setTimeout(initCrescentMobileMenu, 1000);
});
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
      // Keep the top hero banner visible immediately on load
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
/* Fix double-tap issue on mobile dropdown categories */
(function () {
  document.addEventListener('touchstart', function (e) {
    var link = e.target.closest('nav a, header a, .cb-drawer a, [data-dropdown] > a');
    if (!link) return;

    var parent = link.parentElement;
    var submenu = parent ? parent.querySelector('ul, div[style*="position: absolute"], .dropdown-menu') : null;

    if (submenu && window.innerWidth <= 960) {
      var isOpen = submenu.style.display === 'block' || submenu.classList.contains('open');
      if (!isOpen) {
        e.preventDefault();
        // Close other open submenus first
        document.querySelectorAll('.cb-sub-open').forEach(function (el) {
          el.style.display = '';
          el.classList.remove('cb-sub-open', 'open');
        });
        submenu.style.display = 'block';
        submenu.classList.add('cb-sub-open', 'open');
      }
    }
  }, { passive: false });
})();

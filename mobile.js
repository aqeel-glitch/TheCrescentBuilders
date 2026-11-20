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

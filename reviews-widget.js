/* Automatic Dummy Review Replacer -> Live Elfsight Google Reviews */
function injectElfsightReviews() {
  // 1. Elfsight platform script load karein agar pehle se nahi hai
  if (!document.querySelector('script[src*="://elfsightcdn.com"]')) {
    const s = document.createElement('script');
    s.src = 'https://://elfsightcdn.com';
    s.async = true;
    document.head.appendChild(s);
  }

  // 2. Screen par dummy review cards dhoondein
  const allElements = document.querySelectorAll('div, section');
  for (let el of allElements) {
    if (
      el.innerText &&
      (el.innerText.includes('[Customer Name 1]') ||
        el.innerText.includes('[Real Google review'))
    ) {
      // Woh grid container dhoondein jis ke andar dummy cards hain
      const gridContainer = Array.from(el.querySelectorAll('div')).find(
        (d) =>
          d.style.display === 'grid' &&
          (d.innerText.includes('[Customer Name 1]') ||
            d.innerText.includes('[Real Google review'))
      );

      if (gridContainer && !gridContainer.dataset.elfsightInjected) {
        gridContainer.dataset.elfsightInjected = 'true';
        gridContainer.style.display = 'block';
        gridContainer.innerHTML =
          '<div class="elfsight-app-cb0c1266-21c7-44e5-8f4e-859ddbeea578"></div>';

        // "Showing 1 of 2" wala text bhi hide karein
        const parent = gridContainer.parentElement;
        if (parent) {
          Array.from(parent.querySelectorAll('div, span')).forEach((sub) => {
            if (sub.innerText && sub.innerText.trim().startsWith('Showing ')) {
              sub.style.display = 'none';
            }
          });
        }
      }
    }
  }
}

window.addEventListener('load', function () {
  setTimeout(injectElfsightReviews, 400);
  setTimeout(injectElfsightReviews, 1200);
});

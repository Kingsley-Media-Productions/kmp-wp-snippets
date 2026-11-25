/*
  TITLE:
            KMP Amelia Skip Package Popup - Auto-skip the Amelia packages popup in the step-by-step booking form
  DESCRIPTION:
            Amelia's step-by-step booking form shows a "packages" slide-up popup after Continue is clicked on the
            Service selection step, and there is no setting to turn it off. This code hides that popup and clicks
            its Skip button once the popup's slide-in animation has settled (clicking during the animation blanks
            the form). If Skip can't be clicked within 5 seconds, or the popup is still there 3 seconds after the
            click, the popup is revealed so the customer can skip it manually.
            Works with the form inline on a page or opened in a modal (e.g. from a header booking button).
            Remove any older copy of this snippet so two versions don't run at once.
  VERSION:
            0.1.0
  DATES:
            Version release: 2026.11.24
            Initial Release: 2026.11.24 - Republic of Ireland

  AUTHOR:
            Kingsley Chimezie
            Founder and Lead Developer @ Kingsley Media Productions
  URL:
            https://kingsley.ie
  REQUIRES:
            - Amelia Booking Plugin (step-by-step booking form)
            - A method of adding Custom JavaScript to WordPress (e.g. WPCode, site-wide, footer)
            - Run site-wide so it also works when the form opens in a modal

  Copyright © 2026 - Present, Kingsley Media Productions (KMP). Released under the MIT License. See LICENSE in the repository root.
*/

(function () {
  // Guard: only run once per page, even if the snippet is loaded twice
  if (window.__kmpSkipPkg) return; window.__kmpSkipPkg = true;

  // Hide the packages popup visually from the start so customers never see it flash
  var st = document.createElement('style');
  st.id = 'kmp-hide-pkg-popup';
  st.textContent = '.am-package-popup{opacity:0!important;pointer-events:none!important;}';
  document.head.appendChild(st);

  // Popups already being handled
  var seen = new WeakSet();

  // True when an element is actually rendered on screen
  function shown(el) { var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && el.getClientRects().length > 0; }

  // Fallback: make the popup visible and clickable again so the customer can skip it manually
  function reveal(p) { p.style.setProperty('opacity', '1', 'important'); p.style.setProperty('pointer-events', 'auto', 'important'); }

  // Wait until the Skip button has stopped moving (slide-up animation finished), then click it
  function run(p, btn) {
    var t0 = Date.now(), last = null, still = 0;
    (function tick() {
      // Popup closed or removed in the meantime: nothing to do
      if (!document.body.contains(p) || !shown(p)) return;
      // Safety net: if it never settles within 5s, hand control back to the customer
      if (Date.now() - t0 > 5000) return reveal(p);
      // Compare the button's position across checks; 3 identical readings 100ms apart = settled
      var r = btn.getBoundingClientRect(), y = Math.round(r.top);
      still = (y === last) ? still + 1 : 0; last = y;
      if (still >= 3 && !btn.disabled) {
        btn.click();
        // If the popup is somehow still there 3s after the click, reveal it as a fallback
        setTimeout(function () { if (document.body.contains(p) && shown(p)) reveal(p); }, 3000);
        return;
      }
      setTimeout(tick, 100);
    })();
  }

  // Look for a visible packages popup with a visible Skip button and start handling it
  function scan() {
    document.querySelectorAll('.am-package-popup').forEach(function (p) {
      // Popup hidden again (e.g. customer went back): forget it so it's handled next time it opens
      if (!shown(p)) { seen.delete(p); return; }
      if (seen.has(p)) return;
      var btn = p.querySelector('.am-slide-popup__block-footer button'); // the Skip button
      if (!btn || !shown(btn)) return;
      seen.add(p); run(p, btn);
    });
  }

  // Amelia renders with Vue, so watch the DOM (including modals) for the popup appearing or changing
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  scan();
})();

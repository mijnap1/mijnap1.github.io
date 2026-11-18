export const SEEN_KEY = "homeIntroSeen";

/**
 * Decides before first paint whether to show the intro video: once per
 * session, and not when just switching between the English and French home.
 */
export const INTRO_BOOT_SCRIPT = `(function(){
  try { if (sessionStorage.getItem('${SEEN_KEY}') === '1') return; } catch (e) {}
  function norm(p){ return p ? (p.replace(/\\/+$/, '') || '/') : null; }
  try {
    if (document.referrer) {
      var ref = new URL(document.referrer, location.origin);
      var homes = { '/': true, '/fr': true };
      var from = norm(ref.pathname), to = norm(location.pathname);
      if (ref.origin === location.origin && homes[from] && homes[to] && from !== to) return;
    }
  } catch (e) {}
  document.documentElement.classList.add('has-intro-loader');
})();`;

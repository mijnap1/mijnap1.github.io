export const STORAGE_KEY = "theme";
export const DARK_CLASS = "dark-mode";

/** Runs before first paint (see RootDocument) so dark mode never flashes light. */
export const THEME_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.body.classList.add('${DARK_CLASS}');}catch(e){}})();`;

/**
 * Theme controller: light | dark | system
 *
 * - light / dark: force appearance via data-theme + .dark class
 * - system: leave appearance to the browser (prefers-color-scheme)
 *   so extensions like Dark Reader can detect and follow OS theme.
 *
 * Preference is stored in localStorage under "theme".
 */
(function () {
  const STORAGE_KEY = "theme";
  const ROOT = document.documentElement;
  const MQ = window.matchMedia("(prefers-color-scheme: dark)");

  function getMeta() {
    return document.querySelector('meta[name="color-scheme"]');
  }

  /**
   * Apply theme signals that browsers and extensions can read:
   * - data-theme="light|dark|system"
   * - class "dark" only when forced dark
   * - color-scheme CSS (inline removed in system mode so CSS/meta win)
   * - <meta name="color-scheme">
   */
  function apply(mode) {
    const valid = mode === "light" || mode === "dark" || mode === "system" ? mode : "system";
    ROOT.dataset.theme = valid;

    // Forced modes get an explicit class; system relies on media queries.
    ROOT.classList.toggle("dark", valid === "dark");
    ROOT.classList.toggle("light", valid === "light");

    const meta = getMeta();

    if (valid === "system") {
      // Allow both schemes — detectors / Dark Reader follow prefers-color-scheme.
      ROOT.style.removeProperty("color-scheme");
      if (meta) meta.setAttribute("content", "light dark");
    } else if (valid === "dark") {
      ROOT.style.colorScheme = "dark";
      if (meta) meta.setAttribute("content", "dark");
    } else {
      ROOT.style.colorScheme = "light";
      if (meta) meta.setAttribute("content", "light");
    }

    // Announce for assistive tech / any listeners
    ROOT.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme: valid, prefersDark: MQ.matches },
      })
    );
  }

  function getStored() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "light" || v === "dark" || v === "system") return v;
    } catch {
      /* ignore */
    }
    return "system";
  }

  function setTheme(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    apply(mode);
    syncButtons(mode);
  }

  function syncButtons(mode) {
    document.querySelectorAll("[data-theme-set]").forEach((btn) => {
      const active = btn.getAttribute("data-theme-set") === mode;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  // Apply immediately (also run early inline in <head> to avoid FOUC)
  apply(getStored());

  document.addEventListener("DOMContentLoaded", () => {
    syncButtons(getStored());

    document.querySelectorAll("[data-theme-set]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTheme(btn.getAttribute("data-theme-set"));
      });
    });

    // System mode: CSS media queries handle restyle; keep buttons in sync only.
    MQ.addEventListener("change", () => {
      if (getStored() === "system") {
        apply("system");
      }
    });
  });

  window.__setTheme = setTheme;
})();

/*!
 * Highlighter pen v1.0.4
 * Marker-like selection overlay using <marker> + optional native input selection yellow.
 * https://github.com/mimoklef/highlighter-pen/
 * © 2026 Morgan Bouyakhlef
 * Released under the MIT License
 */
(function (global) {
  "use strict";

  const DEFAULTS = {
    markerImage: "https://cdn.jsdelivr.net/gh/mimoklef/highlighter-pen@v1.0.4/assets/marker.png",
    markerZIndex: 10,
    hideNativeSelection: true,
    inputSelectionYellow: true,
    inputSelectionColor: "rgba(255,235,59,0.95)",
    exclude: "input, textarea, select, button, label"
  };

  function createStyle(id, cssText) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement("style");
    el.id = id;
    el.textContent = cssText;
    document.head.appendChild(el);
    return el;
  }

  function isTextLikeInput(el) {
    if (!el) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.tagName !== "INPUT") return false;
    const type = (el.getAttribute("type") || "text").toLowerCase();
    return ["text", "email", "password", "search", "tel", "url", "number"].includes(type);
  }

  function HighlighterPen(userOptions) {
    const opt = Object.assign({}, DEFAULTS, userOptions || {});
    const STYLE_MAIN_ID = "hp-style-main";
    const STYLE_INPUT_ID = "hp-style-input";
    const STYLE_HIDESEL_ID = "hp-style-hidesel";

    let overlays = [];
    let padTop = 0;
    let padBottom = 0;
    let destroyed = false;

    let onSelectionChange, onScroll, onResize, onPointerDown, onKeyDown;

    function injectStyles() {
      createStyle(
        STYLE_MAIN_ID,
        `
marker{
  border-image-source: url("${opt.markerImage}");
  border-image-slice: 0 27 0 29 fill;
  border-image-width: 0px 1ch 0px 1ch;
  border-image-outset: 0px 1ch 0px 1ch;
  border-image-repeat: round stretch;
  background-color: transparent;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0.8em 0;
  mix-blend-mode: multiply;
  opacity: 1;
  z-index: ${opt.markerZIndex} !important;
}
        `.trim()
      );

      if (opt.hideNativeSelection) {
        createStyle(
          STYLE_HIDESEL_ID,
          `
::selection { background: none; }
::-moz-selection { background: none; }
          `.trim()
        );
      }

      if (opt.inputSelectionYellow) {
        createStyle(
          STYLE_INPUT_ID,
          `
input::selection, textarea::selection { background: ${opt.inputSelectionColor}; color: inherit; }
input::-moz-selection, textarea::-moz-selection { background: ${opt.inputSelectionColor}; color: inherit; }
          `.trim()
        );
      }
    }

    function readMarkerPaddingPx() {
      const t = document.createElement("marker");
      t.textContent = "A";
      t.style.position = "fixed";
      t.style.left = "-9999px";
      t.style.top = "-9999px";
      t.style.pointerEvents = "none";
      document.body.appendChild(t);

      const cs = getComputedStyle(t);
      padTop = parseFloat(cs.paddingTop) || 0;
      padBottom = parseFloat(cs.paddingBottom) || 0;

      t.remove();
    }

    function clearOverlays() {
      overlays.forEach((el) => el.remove());
      overlays = [];
    }

    function draw() {
      if (destroyed) return;

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        clearOverlays();
        return;
      }

      const ae = document.activeElement;
      if (isTextLikeInput(ae)) {
        clearOverlays();
        return;
      }

      const range = sel.getRangeAt(0);

      const sp = range.startContainer.parentElement;
      const ep = range.endContainer.parentElement;
      if ((sp && sp.closest("marker")) || (ep && ep.closest("marker"))) return;

      const rects = Array.from(range.getClientRects()).filter(
        (r) => r.width > 1 && r.height > 1
      );

      clearOverlays();
      if (!rects.length) return;

      for (const r of rects) {
        const m = document.createElement("marker");

        m.style.position = "fixed";
        m.style.left = `${r.left}px`;
        m.style.top = `${Math.round(r.top - padTop)}px`;
        m.style.width = `${Math.round(r.width)}px`;
        m.style.height = `${Math.round(r.height + padTop + padBottom)}px`;
        m.style.display = "block";
        m.style.pointerEvents = "none";
        m.style.margin = "0";
        m.style.padding = "0";

        document.body.appendChild(m);
        overlays.push(m);
      }
    }

    function cancelSelection() {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      clearOverlays();
    }

    function init() {
      injectStyles();

      requestAnimationFrame(() => {
        if (destroyed) return;
        readMarkerPaddingPx();
        draw();
      });

      onSelectionChange = () => requestAnimationFrame(draw);
      onScroll = () => requestAnimationFrame(draw);
      onResize = () => requestAnimationFrame(draw);

      onPointerDown = (e) => {
        const el = e.target && e.target.closest(opt.exclude);
        if (!el) return;

        if (isTextLikeInput(el)) return;

        cancelSelection();
      };

      // Ensure a clean selection state before browser "select all"
      onKeyDown = (e) => {
        const key = (e.key || "").toLowerCase();
        const isSelectAll = (e.ctrlKey || e.metaKey) && !e.shiftKey && key === "a";
        if (!isSelectAll) return;

        const ae = document.activeElement;

        if (isTextLikeInput(ae)) {
          clearOverlays();
          return;
        }

        clearOverlays();

        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          sel.removeAllRanges();
        }
      };

      document.addEventListener("keydown", onKeyDown, true);
      document.addEventListener("selectionchange", onSelectionChange);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("pointerdown", onPointerDown, true);

      return api;
    }

    function destroy() {
      destroyed = true;
      clearOverlays();

      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    }

    const api = { init, draw, clear: clearOverlays, cancelSelection, destroy, options: opt };
    return api;
  }

  global.HighlighterPen = HighlighterPen;
})(typeof window !== "undefined" ? window : this);

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = globalThis.HighlighterPen;
}
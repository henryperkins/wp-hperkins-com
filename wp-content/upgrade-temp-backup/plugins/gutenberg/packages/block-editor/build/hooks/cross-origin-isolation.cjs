"use strict";

// packages/block-editor/src/hooks/cross-origin-isolation.js
function addCrossOriginAttribute(el) {
  if (!el.hasAttribute("crossorigin")) {
    el.setAttribute("crossorigin", "anonymous");
  }
}
if (window.crossOriginIsolated) {
  let startObservingBody = function() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
      });
    } else if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true
          });
        }
      });
    }
  };
  startObservingBody2 = startObservingBody;
  const observer = new window.MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [mutation.addedNodes, mutation.target].forEach((value) => {
        const nodes = value instanceof window.NodeList ? value : [value];
        nodes.forEach((node) => {
          const el = node;
          if (!el.querySelectorAll) {
            return;
          }
          el.querySelectorAll(
            "img,source,script,video,link"
          ).forEach((v) => {
            addCrossOriginAttribute(v);
          });
          if (["IMG", "SOURCE", "SCRIPT", "VIDEO", "LINK"].includes(
            el.nodeName
          )) {
            addCrossOriginAttribute(el);
          }
        });
      });
    });
  });
  startObservingBody();
}
var startObservingBody2;
//# sourceMappingURL=cross-origin-isolation.cjs.map

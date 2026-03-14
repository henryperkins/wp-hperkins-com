// packages/interactivity-router/src/assets/styles.ts
import { shortestCommonSupersequence } from "./scs.mjs";
var areNodesEqual = (a, b) => a.isEqualNode(b);
var normalizeMedia = (element) => {
  element = element.cloneNode(true);
  const media = element.media;
  const { originalMedia } = element.dataset;
  if (media === "preload") {
    element.media = originalMedia || "all";
    element.removeAttribute("data-original-media");
  } else if (!element.media) {
    element.media = "all";
  }
  return element;
};
function updateStylesWithSCS(X, Y, parent = window.document.head) {
  if (X.length === 0) {
    return Y.map((element) => {
      const promise = prepareStylePromise(element);
      parent.appendChild(element);
      return promise;
    });
  }
  const xNormalized = X.map(normalizeMedia);
  const yNormalized = Y.map(normalizeMedia);
  const scs = shortestCommonSupersequence(
    xNormalized,
    yNormalized,
    areNodesEqual
  );
  const xLength = X.length;
  const yLength = Y.length;
  const promises = [];
  let last = X[xLength - 1];
  let xIndex = 0;
  let yIndex = 0;
  for (const scsElement of scs) {
    const xElement = X[xIndex];
    const yElement = Y[yIndex];
    const xNormEl = xNormalized[xIndex];
    const yNormEl = yNormalized[yIndex];
    if (xIndex < xLength && areNodesEqual(xNormEl, scsElement)) {
      if (yIndex < yLength && areNodesEqual(yNormEl, scsElement)) {
        promises.push(prepareStylePromise(xElement));
        yIndex++;
      }
      xIndex++;
    } else {
      promises.push(prepareStylePromise(yElement));
      if (xIndex < xLength) {
        xElement.before(yElement);
      } else {
        last.after(yElement);
        last = yElement;
      }
      yIndex++;
    }
  }
  return promises;
}
var stylePromiseCache = /* @__PURE__ */ new WeakMap();
var prepareStylePromise = (element) => {
  if (stylePromiseCache.has(element)) {
    return stylePromiseCache.get(element);
  }
  if (window.document.contains(element) && element.media !== "preload") {
    const promise2 = Promise.resolve(element);
    stylePromiseCache.set(element, promise2);
    return promise2;
  }
  if (element.hasAttribute("media") && element.media !== "all") {
    element.dataset.originalMedia = element.media;
  }
  element.media = "preload";
  if (element instanceof HTMLStyleElement) {
    const promise2 = Promise.resolve(element);
    stylePromiseCache.set(element, promise2);
    return promise2;
  }
  const promise = new Promise((resolve, reject) => {
    element.addEventListener("load", () => resolve(element));
    element.addEventListener("error", (event) => {
      const { href } = event.target;
      reject(
        Error(
          `The style sheet with the following URL failed to load: ${href}`
        )
      );
    });
  });
  stylePromiseCache.set(element, promise);
  return promise;
};
var preloadStyles = (doc) => {
  const currentStyleElements = Array.from(
    window.document.querySelectorAll(
      "style,link[rel=stylesheet]"
    )
  );
  const newStyleElements = Array.from(
    doc.querySelectorAll("style,link[rel=stylesheet]")
  );
  return updateStylesWithSCS(currentStyleElements, newStyleElements);
};
var applyStyles = (styles) => {
  window.document.querySelectorAll("style,link[rel=stylesheet]").forEach((el) => {
    if (el.sheet) {
      if (styles.includes(el)) {
        if (el.sheet.media.mediaText === "preload") {
          const { originalMedia = "all" } = el.dataset;
          el.sheet.media.mediaText = originalMedia;
        }
        el.sheet.disabled = false;
      } else {
        el.sheet.disabled = true;
      }
    }
  });
};
export {
  applyStyles,
  normalizeMedia,
  preloadStyles,
  updateStylesWithSCS
};
//# sourceMappingURL=styles.mjs.map

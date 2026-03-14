// packages/interactivity-router/src/assets/script-modules.ts
import {
  initialImportMap,
  importPreloadedModule,
  preloadWithMap
} from "./dynamic-importmap/index.mjs";
var resolvedScriptModules = /* @__PURE__ */ new Set();
var markScriptModuleAsResolved = (url) => {
  resolvedScriptModules.add(url);
};
var preloadScriptModules = (doc) => {
  const importMapElement = doc.querySelector(
    "script#wp-importmap[type=importmap]"
  );
  const importMap = importMapElement ? JSON.parse(importMapElement.text) : { imports: {}, scopes: {} };
  for (const key in initialImportMap.imports) {
    delete importMap.imports[key];
  }
  const moduleUrls = [
    ...doc.querySelectorAll(
      "script[type=module][src][data-wp-router-options]"
    )
  ].filter((script) => {
    try {
      const parsed = JSON.parse(
        script.getAttribute("data-wp-router-options")
      );
      return parsed?.loadOnClientNavigation === true;
    } catch {
      return false;
    }
  }).map((script) => script.src);
  return moduleUrls.filter((url) => !resolvedScriptModules.has(url)).map((url) => preloadWithMap(url, importMap));
};
var importScriptModules = (modules) => Promise.all(modules.map((m) => importPreloadedModule(m)));
export {
  importScriptModules,
  markScriptModuleAsResolved,
  preloadScriptModules
};
//# sourceMappingURL=script-modules.mjs.map

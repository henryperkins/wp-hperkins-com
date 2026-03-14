// packages/interactivity-router/src/assets/dynamic-importmap/index.ts
import { addImportMap, resolve } from "./resolver.mjs";
import { initPromise, topLevelLoad, preloadModule } from "./loader.mjs";
import {
  initialImportMap,
  importPreloadedModule
} from "./loader.mjs";
var baseUrl = document.baseURI;
var pageBaseUrl = baseUrl;
Object.defineProperty(self, "wpInteractivityRouterImport", {
  value: importShim,
  writable: false,
  enumerable: false,
  configurable: false
});
async function importShim(id) {
  await initPromise;
  return topLevelLoad(resolve(id, pageBaseUrl), {
    credentials: "same-origin"
  });
}
async function importWithMap(id, importMapIn) {
  addImportMap(importMapIn);
  return importShim(id);
}
async function preloadWithMap(id, importMapIn) {
  addImportMap(importMapIn);
  await initPromise;
  return preloadModule(resolve(id, pageBaseUrl), {
    credentials: "same-origin"
  });
}
export {
  importPreloadedModule,
  importWithMap,
  initialImportMap,
  preloadWithMap
};
//# sourceMappingURL=index.mjs.map

// packages/editor/src/bindings/api.js
import { registerBlockBindingsSource } from "@wordpress/blocks";
import patternOverrides from "./pattern-overrides.mjs";
import postData from "./post-data.mjs";
import postMeta from "./post-meta.mjs";
import termData from "./term-data.mjs";
function registerCoreBlockBindingsSources() {
  registerBlockBindingsSource(patternOverrides);
  registerBlockBindingsSource(postData);
  registerBlockBindingsSource(postMeta);
  registerBlockBindingsSource(termData);
}
export {
  registerCoreBlockBindingsSources
};
//# sourceMappingURL=api.mjs.map

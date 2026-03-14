// packages/editor/src/store/defaults.js
import { SETTINGS_DEFAULTS } from "@wordpress/block-editor";
var EDITOR_SETTINGS_DEFAULTS = {
  ...SETTINGS_DEFAULTS,
  richEditingEnabled: true,
  codeEditingEnabled: true,
  fontLibraryEnabled: true,
  enableCustomFields: void 0,
  defaultRenderingMode: "post-only"
};
export {
  EDITOR_SETTINGS_DEFAULTS
};
//# sourceMappingURL=defaults.mjs.map

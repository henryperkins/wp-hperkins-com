"use strict";

// packages/editor/src/hooks/default-autocompleters.js
var import_hooks = require("@wordpress/hooks");
var import_components = require("../components/index.cjs");
function setDefaultCompleters(completers = []) {
  completers.push({ ...import_components.userAutocompleter });
  return completers;
}
(0, import_hooks.addFilter)(
  "editor.Autocomplete.completers",
  "editor/autocompleters/set-default-completers",
  setDefaultCompleters
);
//# sourceMappingURL=default-autocompleters.cjs.map

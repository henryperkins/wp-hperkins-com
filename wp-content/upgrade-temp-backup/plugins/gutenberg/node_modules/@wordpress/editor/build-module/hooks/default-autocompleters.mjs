// packages/editor/src/hooks/default-autocompleters.js
import { addFilter } from "@wordpress/hooks";
import { userAutocompleter } from "../components/index.mjs";
function setDefaultCompleters(completers = []) {
  completers.push({ ...userAutocompleter });
  return completers;
}
addFilter(
  "editor.Autocomplete.completers",
  "editor/autocompleters/set-default-completers",
  setDefaultCompleters
);
//# sourceMappingURL=default-autocompleters.mjs.map

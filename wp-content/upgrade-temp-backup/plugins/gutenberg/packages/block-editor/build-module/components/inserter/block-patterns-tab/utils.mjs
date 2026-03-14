// packages/block-editor/src/components/inserter/block-patterns-tab/utils.js
import { __, _x } from "@wordpress/i18n";
var INSERTER_PATTERN_TYPES = {
  user: "user",
  theme: "theme",
  directory: "directory"
};
var INSERTER_SYNC_TYPES = {
  full: "fully",
  unsynced: "unsynced"
};
var allPatternsCategory = {
  name: "allPatterns",
  label: _x("All", "patterns")
};
var myPatternsCategory = {
  name: "myPatterns",
  label: __("My patterns")
};
var starterPatternsCategory = {
  name: "core/starter-content",
  label: __("Starter content")
};
function isPatternFiltered(pattern, sourceFilter, syncFilter) {
  const isUserPattern = pattern.name.startsWith("core/block");
  const isDirectoryPattern = pattern.source === "core" || pattern.source?.startsWith("pattern-directory");
  if (sourceFilter === INSERTER_PATTERN_TYPES.theme && (isUserPattern || isDirectoryPattern)) {
    return true;
  }
  if (sourceFilter === INSERTER_PATTERN_TYPES.directory && (isUserPattern || !isDirectoryPattern)) {
    return true;
  }
  if (sourceFilter === INSERTER_PATTERN_TYPES.user && pattern.type !== INSERTER_PATTERN_TYPES.user) {
    return true;
  }
  if (syncFilter === INSERTER_SYNC_TYPES.full && pattern.syncStatus !== "") {
    return true;
  }
  if (syncFilter === INSERTER_SYNC_TYPES.unsynced && pattern.syncStatus !== "unsynced" && isUserPattern) {
    return true;
  }
  return false;
}
export {
  INSERTER_PATTERN_TYPES,
  INSERTER_SYNC_TYPES,
  allPatternsCategory,
  isPatternFiltered,
  myPatternsCategory,
  starterPatternsCategory
};
//# sourceMappingURL=utils.mjs.map

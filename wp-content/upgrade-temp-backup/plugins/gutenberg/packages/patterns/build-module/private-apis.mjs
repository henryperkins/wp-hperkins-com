// packages/patterns/src/private-apis.js
import { lock } from "./lock-unlock.mjs";
import OverridesPanel from "./components/overrides-panel.mjs";
import {
  default as CreatePatternModal,
  CreatePatternModalContents
} from "./components/create-pattern-modal.mjs";
import {
  default as DuplicatePatternModal,
  useDuplicatePatternProps
} from "./components/duplicate-pattern-modal.mjs";
import { isOverridableBlock } from "./api/index.mjs";
import RenamePatternModal from "./components/rename-pattern-modal.mjs";
import PatternsMenuItems from "./components/index.mjs";
import RenamePatternCategoryModal from "./components/rename-pattern-category-modal.mjs";
import PatternOverridesControls from "./components/pattern-overrides-controls.mjs";
import ResetOverridesControl from "./components/reset-overrides-control.mjs";
import { useAddPatternCategory } from "./private-hooks.mjs";
import {
  PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY,
  EXCLUDED_PATTERN_SOURCES,
  PATTERN_SYNC_TYPES
} from "./constants.mjs";
var privateApis = {};
lock(privateApis, {
  OverridesPanel,
  CreatePatternModal,
  CreatePatternModalContents,
  DuplicatePatternModal,
  isOverridableBlock,
  useDuplicatePatternProps,
  RenamePatternModal,
  PatternsMenuItems,
  RenamePatternCategoryModal,
  PatternOverridesControls,
  ResetOverridesControl,
  useAddPatternCategory,
  PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY,
  EXCLUDED_PATTERN_SOURCES,
  PATTERN_SYNC_TYPES
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map

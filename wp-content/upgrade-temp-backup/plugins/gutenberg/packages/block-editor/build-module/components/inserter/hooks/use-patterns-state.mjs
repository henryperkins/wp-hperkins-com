// packages/block-editor/src/components/inserter/hooks/use-patterns-state.js
import { useCallback, useMemo } from "@wordpress/element";
import { cloneBlock, createBlock } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { store as blockEditorStore } from "../../../store/index.mjs";
import { unlock } from "../../../lock-unlock.mjs";
import { isNavigationOverlayContextKey } from "../../../store/private-keys.mjs";
import { INSERTER_PATTERN_TYPES } from "../block-patterns-tab/utils.mjs";
import { isFiltered } from "../../../store/utils.mjs";
var usePatternsState = (onInsert, rootClientId, selectedCategory, isQuick) => {
  const options = useMemo(
    () => ({ [isFiltered]: !!isQuick }),
    [isQuick]
  );
  const isWithinNavigationOverlayContext = useSelect((select) => {
    const { getSettings } = unlock(select(blockEditorStore));
    const settings = getSettings();
    return settings[isNavigationOverlayContextKey] ?? false;
  }, []);
  const { patternCategories, patterns, userPatternCategories } = useSelect(
    (select) => {
      const { getSettings, __experimentalGetAllowedPatterns } = unlock(
        select(blockEditorStore)
      );
      const {
        __experimentalUserPatternCategories,
        __experimentalBlockPatternCategories
      } = getSettings();
      return {
        patterns: __experimentalGetAllowedPatterns(
          rootClientId,
          options
        ),
        userPatternCategories: __experimentalUserPatternCategories,
        patternCategories: __experimentalBlockPatternCategories
      };
    },
    [rootClientId, options]
  );
  const filteredPatterns = useMemo(() => {
    return patterns.filter((pattern) => {
      const hasNavigationCategory = pattern.categories?.includes("navigation");
      if (hasNavigationCategory && !isWithinNavigationOverlayContext) {
        return false;
      }
      return true;
    });
  }, [patterns, isWithinNavigationOverlayContext]);
  const { getClosestAllowedInsertionPointForPattern } = unlock(
    useSelect(blockEditorStore)
  );
  const allCategories = useMemo(() => {
    const categories = [...patternCategories];
    userPatternCategories?.forEach((userCategory) => {
      if (!categories.find(
        (existingCategory) => existingCategory.name === userCategory.name
      )) {
        categories.push(userCategory);
      }
    });
    return categories;
  }, [patternCategories, userPatternCategories]);
  const { createSuccessNotice } = useDispatch(noticesStore);
  const onClickPattern = useCallback(
    (pattern, blocks) => {
      const destinationRootClientId = isQuick ? rootClientId : getClosestAllowedInsertionPointForPattern(
        pattern,
        rootClientId
      );
      if (destinationRootClientId === null) {
        return;
      }
      const patternBlocks = pattern.type === INSERTER_PATTERN_TYPES.user && pattern.syncStatus !== "unsynced" ? [createBlock("core/block", { ref: pattern.id })] : blocks;
      onInsert(
        (patternBlocks ?? []).map((block) => {
          const clonedBlock = cloneBlock(block);
          if (clonedBlock.attributes.metadata?.categories?.includes(
            selectedCategory
          )) {
            clonedBlock.attributes.metadata.categories = [
              selectedCategory
            ];
          }
          return clonedBlock;
        }),
        pattern.name,
        false,
        destinationRootClientId
      );
      createSuccessNotice(
        sprintf(
          /* translators: %s: block pattern title. */
          __('Block pattern "%s" inserted.'),
          pattern.title
        ),
        {
          type: "snackbar",
          id: "inserter-notice"
        }
      );
    },
    [
      createSuccessNotice,
      onInsert,
      selectedCategory,
      rootClientId,
      getClosestAllowedInsertionPointForPattern,
      isQuick
    ]
  );
  return [filteredPatterns, allCategories, onClickPattern];
};
var use_patterns_state_default = usePatternsState;
export {
  use_patterns_state_default as default
};
//# sourceMappingURL=use-patterns-state.mjs.map

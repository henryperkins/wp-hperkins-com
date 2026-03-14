// packages/editor/src/components/block-visibility/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { hasBlockSupport, store as blocksStore } from "@wordpress/blocks";
import { useMemo } from "@wordpress/element";
import { Button } from "@wordpress/components";
import { __, _n, sprintf } from "@wordpress/i18n";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { BlockManager } = unlock(blockEditorPrivateApis);
var EMPTY_ARRAY = [];
function BlockVisibility() {
  const { showBlockTypes, hideBlockTypes } = unlock(
    useDispatch(editorStore)
  );
  const {
    blockTypes,
    allowedBlockTypes: _allowedBlockTypes,
    hiddenBlockTypes: _hiddenBlockTypes
  } = useSelect((select) => {
    return {
      blockTypes: select(blocksStore).getBlockTypes(),
      allowedBlockTypes: select(editorStore).getEditorSettings().allowedBlockTypes,
      hiddenBlockTypes: select(preferencesStore).get("core", "hiddenBlockTypes") ?? EMPTY_ARRAY
    };
  }, []);
  const allowedBlockTypes = useMemo(() => {
    if (_allowedBlockTypes === true) {
      return blockTypes;
    }
    return blockTypes.filter(({ name }) => {
      return _allowedBlockTypes?.includes(name);
    });
  }, [_allowedBlockTypes, blockTypes]);
  const filteredBlockTypes = allowedBlockTypes.filter(
    (blockType) => hasBlockSupport(blockType, "inserter", true) && (!blockType.parent || blockType.parent.includes("core/post-content"))
  );
  const hiddenBlockTypes = _hiddenBlockTypes.filter((hiddenBlock) => {
    return filteredBlockTypes.some(
      (registeredBlock) => registeredBlock.name === hiddenBlock
    );
  });
  const selectedBlockTypes = filteredBlockTypes.filter(
    (blockType) => !hiddenBlockTypes.includes(blockType.name)
  );
  const numberOfHiddenBlocks = filteredBlockTypes.length - selectedBlockTypes.length;
  function enableAllBlockTypes() {
    onChangeSelectedBlockTypes(filteredBlockTypes);
  }
  const onChangeSelectedBlockTypes = (newSelectedBlockTypes) => {
    if (selectedBlockTypes.length > newSelectedBlockTypes.length) {
      const blockTypesToHide = selectedBlockTypes.filter(
        (blockType) => !newSelectedBlockTypes.find(
          ({ name }) => name === blockType.name
        )
      );
      hideBlockTypes(blockTypesToHide.map(({ name }) => name));
    } else if (selectedBlockTypes.length < newSelectedBlockTypes.length) {
      const blockTypesToShow = newSelectedBlockTypes.filter(
        (blockType) => !selectedBlockTypes.find(
          ({ name }) => name === blockType.name
        )
      );
      showBlockTypes(blockTypesToShow.map(({ name }) => name));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "editor-block-visibility", children: [
    !!numberOfHiddenBlocks && /* @__PURE__ */ jsxs("div", { className: "editor-block-visibility__disabled-blocks-count", children: [
      sprintf(
        /* translators: %d: number of blocks. */
        _n(
          "%d block is hidden.",
          "%d blocks are hidden.",
          numberOfHiddenBlocks
        ),
        numberOfHiddenBlocks
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          variant: "link",
          onClick: enableAllBlockTypes,
          children: __("Reset")
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      BlockManager,
      {
        blockTypes: filteredBlockTypes,
        selectedBlockTypes,
        onChange: onChangeSelectedBlockTypes,
        showSelectAll: false
      }
    )
  ] });
}
export {
  BlockVisibility as default
};
//# sourceMappingURL=index.mjs.map

// packages/block-library/src/footnotes/format.js
import { v4 as createId } from "uuid";
import { __ } from "@wordpress/i18n";
import { formatListNumbered as icon } from "@wordpress/icons";
import { insertObject } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  store as blockEditorStore,
  privateApis
} from "@wordpress/block-editor";
import { useSelect, useDispatch, useRegistry } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { createBlock, store as blocksStore } from "@wordpress/blocks";
import { unlock } from "../lock-unlock.mjs";
import { name as FOOTNOTES_BLOCK_NAME } from "./index.mjs";
import { jsx } from "react/jsx-runtime";
var formatName = "core/footnote";
var { usesContextKey } = unlock(privateApis);
var POST_CONTENT_BLOCK_NAME = "core/post-content";
var SYNCED_PATTERN_BLOCK_NAME = "core/block";
var format = {
  title: __("Footnote"),
  tagName: "sup",
  className: "fn",
  attributes: {
    "data-fn": "data-fn"
  },
  interactive: true,
  contentEditable: false,
  [usesContextKey]: ["postType", "postId"],
  edit: function Edit({
    value,
    onChange,
    isObjectActive,
    context: { postType, postId }
  }) {
    const registry = useRegistry();
    const {
      getSelectedBlockClientId,
      getBlocks,
      getBlockRootClientId,
      getBlockName,
      getBlockParentsByBlockName
    } = registry.select(blockEditorStore);
    const isFootnotesSupported = useSelect(
      (select) => {
        if (!select(blocksStore).getBlockType("core/footnotes")) {
          return false;
        }
        const allowedBlocks = select(blockEditorStore).getSettings().allowedBlockTypes;
        if (allowedBlocks === false || Array.isArray(allowedBlocks) && !allowedBlocks.includes("core/footnotes")) {
          return false;
        }
        const entityRecord = select(coreDataStore).getEntityRecord(
          "postType",
          postType,
          postId
        );
        if ("string" !== typeof entityRecord?.meta?.footnotes) {
          return false;
        }
        const {
          getBlockParentsByBlockName: _getBlockParentsByBlockName,
          getSelectedBlockClientId: _getSelectedBlockClientId,
          getBlockName: _getBlockName
        } = select(blockEditorStore);
        const selectedClientId = _getSelectedBlockClientId();
        if (!selectedClientId) {
          return false;
        }
        if (_getBlockName(selectedClientId) === FOOTNOTES_BLOCK_NAME) {
          return false;
        }
        const parentCoreBlocks = _getBlockParentsByBlockName(
          selectedClientId,
          SYNCED_PATTERN_BLOCK_NAME
        );
        return !parentCoreBlocks || parentCoreBlocks.length === 0;
      },
      [postType, postId]
    );
    const { selectionChange, insertBlock } = useDispatch(blockEditorStore);
    if (!isFootnotesSupported) {
      return null;
    }
    function onClick() {
      registry.batch(() => {
        let id;
        if (isObjectActive) {
          const object = value.replacements[value.start];
          id = object?.attributes?.["data-fn"];
        } else {
          id = createId();
          const newValue = insertObject(
            value,
            {
              type: formatName,
              attributes: {
                "data-fn": id
              },
              innerHTML: `<a href="#${id}" id="${id}-link">*</a>`
            },
            value.end,
            value.end
          );
          newValue.start = newValue.end - 1;
          onChange(newValue);
        }
        const selectedClientId = getSelectedBlockClientId();
        const parentPostContent = getBlockParentsByBlockName(
          selectedClientId,
          POST_CONTENT_BLOCK_NAME
        );
        const blocks = parentPostContent.length ? getBlocks(parentPostContent[0]) : getBlocks();
        let fnBlock = null;
        {
          const queue = [...blocks];
          while (queue.length) {
            const block = queue.shift();
            if (block.name === "core/footnotes") {
              fnBlock = block;
              break;
            }
            queue.push(...block.innerBlocks);
          }
        }
        if (!fnBlock) {
          let rootClientId = getBlockRootClientId(selectedClientId);
          while (rootClientId && getBlockName(rootClientId) !== POST_CONTENT_BLOCK_NAME) {
            rootClientId = getBlockRootClientId(rootClientId);
          }
          fnBlock = createBlock("core/footnotes");
          insertBlock(fnBlock, void 0, rootClientId);
        }
        selectionChange(fnBlock.clientId, id, 0, 0);
      });
    }
    return /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        icon,
        title: __("Footnote"),
        onClick,
        isActive: isObjectActive
      }
    );
  }
};
export {
  format,
  formatName
};
//# sourceMappingURL=format.mjs.map

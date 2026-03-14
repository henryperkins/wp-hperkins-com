"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/provider/disable-non-page-content-blocks.js
var disable_non_page_content_blocks_exports = {};
__export(disable_non_page_content_blocks_exports, {
  default: () => DisableNonPageContentBlocks
});
module.exports = __toCommonJS(disable_non_page_content_blocks_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_use_post_content_blocks = __toESM(require("./use-post-content-blocks.cjs"));
function DisableNonPageContentBlocks() {
  const contentOnlyIds = (0, import_use_post_content_blocks.default)();
  const { templateParts } = (0, import_data.useSelect)((select) => {
    const { getBlocksByName } = select(import_block_editor.store);
    return {
      templateParts: getBlocksByName("core/template-part")
    };
  }, []);
  const disabledIds = (0, import_data.useSelect)(
    (select) => {
      const { getBlockOrder } = select(import_block_editor.store);
      return templateParts.flatMap(
        (clientId) => getBlockOrder(clientId)
      );
    },
    [templateParts]
  );
  const registry = (0, import_data.useRegistry)();
  (0, import_element.useEffect)(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(import_block_editor.store);
    setBlockEditingMode("", "disabled");
    return () => {
      unsetBlockEditingMode("");
    };
  }, [registry]);
  (0, import_element.useEffect)(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(import_block_editor.store);
    registry.batch(() => {
      for (const clientId of contentOnlyIds) {
        setBlockEditingMode(clientId, "contentOnly");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of contentOnlyIds) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [contentOnlyIds, registry]);
  (0, import_element.useEffect)(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(import_block_editor.store);
    registry.batch(() => {
      for (const clientId of templateParts) {
        setBlockEditingMode(clientId, "contentOnly");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of templateParts) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [templateParts, registry]);
  (0, import_element.useEffect)(() => {
    const { setBlockEditingMode, unsetBlockEditingMode } = registry.dispatch(import_block_editor.store);
    registry.batch(() => {
      for (const clientId of disabledIds) {
        setBlockEditingMode(clientId, "disabled");
      }
    });
    return () => {
      registry.batch(() => {
        for (const clientId of disabledIds) {
          unsetBlockEditingMode(clientId);
        }
      });
    };
  }, [disabledIds, registry]);
  return null;
}
//# sourceMappingURL=disable-non-page-content-blocks.cjs.map

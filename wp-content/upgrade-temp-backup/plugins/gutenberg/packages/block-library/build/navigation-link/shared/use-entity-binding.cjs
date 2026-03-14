"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation-link/shared/use-entity-binding.js
var use_entity_binding_exports = {};
__export(use_entity_binding_exports, {
  buildNavigationLinkEntityBinding: () => buildNavigationLinkEntityBinding,
  useEntityBinding: () => useEntityBinding
});
module.exports = __toCommonJS(use_entity_binding_exports);
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
function buildNavigationLinkEntityBinding(kind) {
  if (kind === void 0) {
    throw new Error(
      'buildNavigationLinkEntityBinding requires a kind parameter. Only "post-type" and "taxonomy" are supported.'
    );
  }
  if (kind !== "post-type" && kind !== "taxonomy") {
    throw new Error(
      `Invalid kind "${kind}" provided to buildNavigationLinkEntityBinding. Only 'post-type' and 'taxonomy' are supported.`
    );
  }
  const source = kind === "taxonomy" ? "core/term-data" : "core/post-data";
  return {
    url: {
      source,
      args: {
        field: "link"
      }
    }
  };
}
function useEntityBinding({ clientId, attributes }) {
  const { updateBlockBindings } = (0, import_block_editor.useBlockBindingsUtils)(clientId);
  const { metadata, id, kind, type } = attributes;
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const hasUrlBinding = !!metadata?.bindings?.url && !!id;
  const expectedSource = kind === "post-type" ? "core/post-data" : "core/term-data";
  const hasCorrectBinding = hasUrlBinding && metadata?.bindings?.url?.source === expectedSource;
  const { isBoundEntityAvailable, entityRecord } = (0, import_data.useSelect)(
    (select) => {
      if (!hasCorrectBinding || !id) {
        return { isBoundEntityAvailable: false, entityRecord: null };
      }
      const isPostType = kind === "post-type";
      const isTaxonomy = kind === "taxonomy";
      if (!isPostType && !isTaxonomy) {
        return { isBoundEntityAvailable: false, entityRecord: null };
      }
      if (blockEditingMode === "disabled") {
        return { isBoundEntityAvailable: true, entityRecord: null };
      }
      const { getEntityRecord, hasFinishedResolution } = select(import_core_data.store);
      const entityType = isTaxonomy ? "taxonomy" : "postType";
      const typeForAPI = type === "tag" ? "post_tag" : type;
      const record = getEntityRecord(entityType, typeForAPI, id);
      const hasResolved = hasFinishedResolution("getEntityRecord", [
        entityType,
        typeForAPI,
        id
      ]);
      const isAvailable = hasResolved ? record !== void 0 : true;
      return {
        isBoundEntityAvailable: isAvailable,
        entityRecord: record || null
      };
    },
    [kind, type, id, hasCorrectBinding, blockEditingMode]
  );
  const clearBinding = (0, import_element.useCallback)(() => {
    if (hasUrlBinding) {
      updateBlockBindings({ url: void 0 });
    }
  }, [updateBlockBindings, hasUrlBinding]);
  const createBinding = (0, import_element.useCallback)(
    (updatedAttributes) => {
      const kindToUse = updatedAttributes?.kind ?? kind;
      if (!kindToUse) {
        return;
      }
      try {
        const binding = buildNavigationLinkEntityBinding(kindToUse);
        updateBlockBindings(binding);
      } catch (error) {
        console.warn(
          "Failed to create entity binding:",
          error.message
        );
      }
    },
    [updateBlockBindings, kind]
  );
  return {
    hasUrlBinding: hasCorrectBinding,
    isBoundEntityAvailable,
    entityRecord,
    clearBinding,
    createBinding
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildNavigationLinkEntityBinding,
  useEntityBinding
});
//# sourceMappingURL=use-entity-binding.cjs.map

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

// packages/block-library/src/navigation-link/shared/use-handle-link-change.js
var use_handle_link_change_exports = {};
__export(use_handle_link_change_exports, {
  useHandleLinkChange: () => useHandleLinkChange
});
module.exports = __toCommonJS(use_handle_link_change_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_update_attributes = require("./update-attributes.cjs");
var import_use_entity_binding = require("./use-entity-binding.cjs");
function useHandleLinkChange({ clientId, attributes, setAttributes }) {
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const { hasUrlBinding, createBinding, clearBinding } = (0, import_use_entity_binding.useEntityBinding)({
    clientId,
    attributes
  });
  return (0, import_element.useCallback)(
    (updatedLink) => {
      if (!updatedLink) {
        return;
      }
      const attrs = {
        url: updatedLink.url,
        kind: updatedLink.kind,
        type: updatedLink.type,
        id: updatedLink.id
      };
      if (!attributes.label || attributes.label === "") {
        attrs.title = updatedLink.title;
      }
      const willBeCustomLink = !updatedLink.id && hasUrlBinding;
      if (willBeCustomLink) {
        clearBinding();
        updateBlockAttributes(clientId, {
          url: updatedLink.url,
          kind: "custom",
          type: "custom",
          id: void 0
        });
      } else {
        const { isEntityLink, attributes: updatedAttributes } = (0, import_update_attributes.updateAttributes)(attrs, setAttributes, attributes);
        if (isEntityLink) {
          createBinding(updatedAttributes);
        } else {
          clearBinding();
        }
      }
    },
    [
      attributes,
      clientId,
      hasUrlBinding,
      createBinding,
      clearBinding,
      setAttributes,
      updateBlockAttributes
    ]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useHandleLinkChange
});
//# sourceMappingURL=use-handle-link-change.cjs.map

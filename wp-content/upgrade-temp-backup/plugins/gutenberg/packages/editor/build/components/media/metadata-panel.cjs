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

// packages/editor/src/components/media/metadata-panel.js
var metadata_panel_exports = {};
__export(metadata_panel_exports, {
  default: () => MediaMetadataPanel
});
module.exports = __toCommonJS(metadata_panel_exports);
var import_media_editor = require("@wordpress/media-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_post_fields = __toESM(require("../post-fields/index.cjs"));
var import_post_card_panel = __toESM(require("../post-card-panel/index.cjs"));
var import_post_panel_section = __toESM(require("../post-panel-section/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function MediaMetadataPanel({ onActionPerformed }) {
  const { media, postType, postId } = (0, import_data.useSelect)((select) => {
    const _postType = select(import_store.store).getCurrentPostType();
    const _postId = select(import_store.store).getCurrentPostId();
    const currentPost = select(import_core_data.store).getEditedEntityRecord(
      "postType",
      _postType,
      _postId,
      {
        _embed: "author,wp:attached-to"
      }
    );
    return {
      media: currentPost,
      postType: _postType,
      postId: _postId
    };
  }, []);
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const fields = (0, import_post_fields.default)({ postType: "attachment" });
  const settings = (0, import_element.useMemo)(
    () => ({
      fields
    }),
    [fields]
  );
  const handleUpdate = (updates) => {
    editPost(updates);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_section.default, { className: "editor-media-metadata-panel", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_media_editor.MediaEditorProvider,
    {
      value: media,
      settings,
      onChange: handleUpdate,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_media_editor.MediaForm,
        {
          header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_post_card_panel.default,
            {
              postType,
              postId,
              onActionPerformed
            }
          )
        }
      )
    }
  ) });
}
//# sourceMappingURL=metadata-panel.cjs.map

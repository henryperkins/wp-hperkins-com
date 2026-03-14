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

// packages/edit-site/src/components/add-new-post/index.js
var add_new_post_exports = {};
__export(add_new_post_exports, {
  default: () => AddNewPostModal
});
module.exports = __toCommonJS(add_new_post_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_notices = require("@wordpress/notices");
var import_html_entities = require("@wordpress/html-entities");
var import_blocks = require("@wordpress/blocks");
var import_jsx_runtime = require("react/jsx-runtime");
function AddNewPostModal({ postType, onSave, onClose }) {
  const labels = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getPostType(postType)?.labels,
    [postType]
  );
  const [isCreatingPost, setIsCreatingPost] = (0, import_element.useState)(false);
  const [title, setTitle] = (0, import_element.useState)("");
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createErrorNotice, createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { resolveSelect } = (0, import_data.useRegistry)();
  async function createPost(event) {
    event.preventDefault();
    if (isCreatingPost) {
      return;
    }
    setIsCreatingPost(true);
    try {
      const postTypeObject = await resolveSelect(import_core_data.store).getPostType(postType);
      const newPage = await saveEntityRecord(
        "postType",
        postType,
        {
          status: "draft",
          title,
          slug: title ?? void 0,
          content: !!postTypeObject.template && postTypeObject.template.length ? (0, import_blocks.serialize)(
            (0, import_blocks.synchronizeBlocksWithTemplate)(
              [],
              postTypeObject.template
            )
          ) : void 0
        },
        { throwOnError: true }
      );
      onSave(newPage);
      createSuccessNotice(
        (0, import_i18n.sprintf)(
          // translators: %s: Title of the created post or template, e.g: "Hello world".
          (0, import_i18n.__)('"%s" successfully created.'),
          (0, import_html_entities.decodeEntities)(newPage.title?.rendered || title) || (0, import_i18n.__)("(no title)")
        ),
        { type: "snackbar" }
      );
    } catch (error) {
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("An error occurred while creating the item.");
      createErrorNotice(errorMessage, {
        type: "snackbar"
      });
    } finally {
      setIsCreatingPost(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (
        // translators: %s: post type singular_name label e.g: "Page".
        (0, import_i18n.sprintf)((0, import_i18n.__)("Draft new: %s"), labels?.singular_name)
      ),
      onRequestClose: onClose,
      focusOnMount: "firstContentElement",
      size: "small",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: createPost, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            __next40pxDefaultSize: true,
            label: (0, import_i18n.__)("Title"),
            onChange: setTitle,
            placeholder: (0, import_i18n.__)("No title"),
            value: title
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 2, justify: "end", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onClose,
              children: (0, import_i18n.__)("Cancel")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              type: "submit",
              isBusy: isCreatingPost,
              "aria-disabled": isCreatingPost,
              children: (0, import_i18n.__)("Create draft")
            }
          )
        ] })
      ] }) })
    }
  );
}
//# sourceMappingURL=index.cjs.map

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

// packages/fields/src/actions/duplicate-post.tsx
var duplicate_post_exports = {};
__export(duplicate_post_exports, {
  default: () => duplicate_post_default
});
module.exports = __toCommonJS(duplicate_post_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var duplicatePost = {
  id: "duplicate-post",
  label: (0, import_i18n._x)("Duplicate", "action label"),
  isEligible({ status }) {
    return status !== "trash";
  },
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [item, setItem] = (0, import_element.useState)({
      ...items[0],
      title: (0, import_i18n.sprintf)(
        /* translators: %s: Existing post title */
        (0, import_i18n._x)("%s (Copy)", "post"),
        (0, import_utils.getItemTitle)(items[0])
      )
    });
    const [isCreatingPage, setIsCreatingPage] = (0, import_element.useState)(false);
    const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
    async function createPage(event) {
      event.preventDefault();
      if (isCreatingPage) {
        return;
      }
      const isTemplate = item.type === "wp_template";
      const newItemObject = {
        status: isTemplate ? "publish" : "draft",
        title: item.title,
        slug: isTemplate ? item.slug : item.title || (0, import_i18n.__)("No title"),
        comment_status: item.comment_status,
        content: typeof item.content === "string" ? item.content : item.content.raw,
        excerpt: typeof item.excerpt === "string" ? item.excerpt : item.excerpt?.raw,
        meta: item.meta,
        parent: item.parent,
        password: item.password,
        template: item.template,
        format: item.format,
        featured_media: item.featured_media,
        menu_order: item.menu_order,
        ping_status: item.ping_status
      };
      const assignablePropertiesPrefix = "wp:action-assign-";
      const assignableProperties = Object.keys(item?._links || {}).filter(
        (property) => property.startsWith(assignablePropertiesPrefix)
      ).map(
        (property) => property.slice(assignablePropertiesPrefix.length)
      );
      assignableProperties.forEach((property) => {
        if (item.hasOwnProperty(property)) {
          newItemObject[property] = item[property];
        }
      });
      setIsCreatingPage(true);
      try {
        const newItem = await saveEntityRecord(
          "postType",
          item.type,
          newItemObject,
          { throwOnError: true }
        );
        createSuccessNotice(
          (0, import_i18n.sprintf)(
            // translators: %s: Title of the created post, e.g: "Hello world".
            (0, import_i18n.__)('"%s" successfully created.'),
            (0, import_utils.getItemTitle)(newItem)
          ),
          {
            id: "duplicate-post-action",
            type: "snackbar"
          }
        );
        if (onActionPerformed) {
          onActionPerformed([newItem]);
        }
      } catch (error) {
        const typedError = error;
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : (0, import_i18n.__)("An error occurred while duplicating the page.");
        createErrorNotice(errorMessage, {
          type: "snackbar"
        });
      } finally {
        setIsCreatingPage(false);
        closeModal?.();
      }
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: createPage, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
      typeof item.id === "string" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: (0, import_i18n.__)(
        "You are about to duplicate a bundled template. Changes will not be live until you activate the new template."
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalInputControl,
        {
          __next40pxDefaultSize: true,
          label: (0, import_i18n.__)("Title"),
          placeholder: (0, import_i18n.__)("No title"),
          value: (0, import_utils.getItemTitle)(item),
          onChange: (value) => setItem((prev) => ({
            ...prev,
            title: value || (0, import_i18n.__)("No title")
          }))
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 2, justify: "end", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            variant: "tertiary",
            onClick: closeModal,
            __next40pxDefaultSize: true,
            children: (0, import_i18n.__)("Cancel")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            variant: "primary",
            type: "submit",
            isBusy: isCreatingPage,
            "aria-disabled": isCreatingPage,
            __next40pxDefaultSize: true,
            children: (0, import_i18n._x)("Duplicate", "action label")
          }
        )
      ] })
    ] }) });
  }
};
var duplicate_post_default = duplicatePost;
//# sourceMappingURL=duplicate-post.cjs.map

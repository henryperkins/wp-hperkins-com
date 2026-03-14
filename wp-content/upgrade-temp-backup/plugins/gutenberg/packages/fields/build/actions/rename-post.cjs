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

// packages/fields/src/actions/rename-post.tsx
var rename_post_exports = {};
__export(rename_post_exports, {
  default: () => rename_post_default
});
module.exports = __toCommonJS(rename_post_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_patterns = require("@wordpress/patterns");
var import_components = require("@wordpress/components");
var import_notices = require("@wordpress/notices");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PATTERN_TYPES } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var renamePost = {
  id: "rename-post",
  label: (0, import_i18n.__)("Rename"),
  modalFocusOnMount: "firstContentElement",
  isEligible(post) {
    if (post.status === "trash") {
      return false;
    }
    if (post.type === "wp_template" && typeof post.id === "string" && window?.__experimentalTemplateActivate) {
      return false;
    }
    const specialChecks = ["wp_template", "wp_template_part"];
    if (!window?.__experimentalTemplateActivate) {
      specialChecks.push("wp_template");
    }
    if (!specialChecks.includes(post.type)) {
      return post.permissions?.update;
    }
    if ((0, import_utils.isTemplate)(post) && !window?.__experimentalTemplateActivate) {
      return (0, import_utils.isTemplateRemovable)(post) && post.is_custom && post.permissions?.update;
    }
    if ((0, import_utils.isTemplatePart)(post)) {
      return post.source === "custom" && !post?.has_theme_file && post.permissions?.update;
    }
    return post.type === PATTERN_TYPES.user && post.permissions?.update;
  },
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [item] = items;
    const [title, setTitle] = (0, import_element.useState)(() => (0, import_utils.getItemTitle)(item, ""));
    const { editEntityRecord, saveEditedEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
    async function onRename(event) {
      event.preventDefault();
      try {
        await editEntityRecord("postType", item.type, item.id, {
          title
        });
        setTitle("");
        closeModal?.();
        await saveEditedEntityRecord("postType", item.type, item.id, {
          throwOnError: true
        });
        createSuccessNotice((0, import_i18n.__)("Name updated"), {
          type: "snackbar"
        });
        onActionPerformed?.(items);
      } catch (error) {
        const typedError = error;
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : (0, import_i18n.__)("An error occurred while updating the name");
        createErrorNotice(errorMessage, { type: "snackbar" });
      }
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: onRename, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          __next40pxDefaultSize: true,
          label: (0, import_i18n.__)("Name"),
          value: title,
          onChange: setTitle,
          required: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: () => {
              closeModal?.();
            },
            children: (0, import_i18n.__)("Cancel")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            type: "submit",
            children: (0, import_i18n.__)("Save")
          }
        )
      ] })
    ] }) });
  }
};
var rename_post_default = renamePost;
//# sourceMappingURL=rename-post.cjs.map

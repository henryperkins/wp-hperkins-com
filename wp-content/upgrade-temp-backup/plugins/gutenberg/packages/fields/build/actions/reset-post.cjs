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

// packages/fields/src/actions/reset-post.tsx
var reset_post_exports = {};
__export(reset_post_exports, {
  default: () => reset_post_default
});
module.exports = __toCommonJS(reset_post_exports);
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_url = require("@wordpress/url");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var isTemplateRevertable = (templateOrTemplatePart) => {
  if (!templateOrTemplatePart) {
    return false;
  }
  return templateOrTemplatePart.source === "custom" && (Boolean(templateOrTemplatePart?.plugin) || templateOrTemplatePart?.has_theme_file);
};
var revertTemplate = async (template, { allowUndo = true } = {}) => {
  const noticeId = "edit-site-template-reverted";
  (0, import_data.dispatch)(import_notices.store).removeNotice(noticeId);
  if (!isTemplateRevertable(template)) {
    (0, import_data.dispatch)(import_notices.store).createErrorNotice(
      (0, import_i18n.__)("This template is not revertable."),
      {
        type: "snackbar"
      }
    );
    return;
  }
  try {
    const templateEntityConfig = (0, import_data.select)(import_core_data.store).getEntityConfig(
      "postType",
      template.type
    );
    if (!templateEntityConfig) {
      (0, import_data.dispatch)(import_notices.store).createErrorNotice(
        (0, import_i18n.__)(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const fileTemplatePath = (0, import_url.addQueryArgs)(
      `${templateEntityConfig.baseURL}/${template.id}`,
      { context: "edit", source: template.origin }
    );
    const fileTemplate = await (0, import_api_fetch.default)({
      path: fileTemplatePath
    });
    if (!fileTemplate) {
      (0, import_data.dispatch)(import_notices.store).createErrorNotice(
        (0, import_i18n.__)(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const serializeBlocks = ({ blocks: blocksForSerialization = [] }) => (0, import_blocks.__unstableSerializeAndClean)(blocksForSerialization);
    const edited = (0, import_data.select)(import_core_data.store).getEditedEntityRecord(
      "postType",
      template.type,
      template.id
    );
    (0, import_data.dispatch)(import_core_data.store).editEntityRecord(
      "postType",
      template.type,
      template.id,
      {
        content: serializeBlocks,
        // Required to make the `undo` behave correctly.
        blocks: edited.blocks,
        // Required to revert the blocks in the editor.
        source: "custom"
        // required to avoid turning the editor into a dirty state
      },
      {
        undoIgnore: true
        // Required to merge this edit with the last undo level.
      }
    );
    const blocks = (0, import_blocks.parse)(fileTemplate?.content?.raw);
    (0, import_data.dispatch)(import_core_data.store).editEntityRecord(
      "postType",
      template.type,
      fileTemplate.id,
      {
        content: serializeBlocks,
        blocks,
        source: "theme"
      }
    );
    if (allowUndo) {
      const undoRevert = () => {
        (0, import_data.dispatch)(import_core_data.store).editEntityRecord(
          "postType",
          template.type,
          edited.id,
          {
            content: serializeBlocks,
            blocks: edited.blocks,
            source: "custom"
          }
        );
      };
      (0, import_data.dispatch)(import_notices.store).createSuccessNotice(
        (0, import_i18n.__)("Template reset."),
        {
          type: "snackbar",
          id: noticeId,
          actions: [
            {
              label: (0, import_i18n.__)("Undo"),
              onClick: undoRevert
            }
          ]
        }
      );
    }
  } catch (error) {
    const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("Template revert failed. Please reload.");
    (0, import_data.dispatch)(import_notices.store).createErrorNotice(errorMessage, {
      type: "snackbar"
    });
  }
};
var resetPostAction = {
  id: "reset-post",
  label: (0, import_i18n.__)("Reset"),
  isEligible: (item) => {
    if (window?.__experimentalTemplateActivate) {
      return item.type === "wp_template_part" && item?.source === "custom" && item?.has_theme_file;
    }
    return (0, import_utils.isTemplateOrTemplatePart)(item) && item?.source === "custom" && (Boolean(item.type === "wp_template" && item?.plugin) || item?.has_theme_file);
  },
  icon: import_icons.backup,
  supportsBulk: true,
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = (0, import_element.useState)(false);
    const { saveEditedEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
    const onConfirm = async () => {
      try {
        for (const template of items) {
          await revertTemplate(template, {
            allowUndo: false
          });
          await saveEditedEntityRecord(
            "postType",
            template.type,
            template.id
          );
        }
        createSuccessNotice(
          items.length > 1 ? (0, import_i18n.sprintf)(
            /* translators: %d: The number of items. */
            (0, import_i18n.__)("%d items reset."),
            items.length
          ) : (0, import_i18n.sprintf)(
            /* translators: %s: The template/part's name. */
            (0, import_i18n.__)('"%s" reset.'),
            (0, import_utils.getItemTitle)(items[0])
          ),
          {
            type: "snackbar",
            id: "revert-template-action"
          }
        );
      } catch (error) {
        let fallbackErrorMessage;
        if (items[0].type === "wp_template") {
          fallbackErrorMessage = items.length === 1 ? (0, import_i18n.__)(
            "An error occurred while reverting the template."
          ) : (0, import_i18n.__)(
            "An error occurred while reverting the templates."
          );
        } else {
          fallbackErrorMessage = items.length === 1 ? (0, import_i18n.__)(
            "An error occurred while reverting the template part."
          ) : (0, import_i18n.__)(
            "An error occurred while reverting the template parts."
          );
        }
        const typedError = error;
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : fallbackErrorMessage;
        createErrorNotice(errorMessage, { type: "snackbar" });
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Reset to default and clear all customizations?") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: (0, import_i18n.__)("Cancel")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            onClick: async () => {
              setIsBusy(true);
              await onConfirm();
              onActionPerformed?.(items);
              setIsBusy(false);
              closeModal?.();
            },
            isBusy,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: (0, import_i18n.__)("Reset")
          }
        )
      ] })
    ] });
  }
};
var reset_post_default = resetPostAction;
//# sourceMappingURL=reset-post.cjs.map

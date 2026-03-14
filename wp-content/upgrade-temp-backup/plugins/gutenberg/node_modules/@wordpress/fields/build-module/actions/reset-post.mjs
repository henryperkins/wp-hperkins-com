// packages/fields/src/actions/reset-post.tsx
import { backup } from "@wordpress/icons";
import { dispatch, select, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useState } from "@wordpress/element";
import { parse, __unstableSerializeAndClean } from "@wordpress/blocks";
import {
  Button,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { addQueryArgs } from "@wordpress/url";
import apiFetch from "@wordpress/api-fetch";
import { getItemTitle, isTemplateOrTemplatePart } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var isTemplateRevertable = (templateOrTemplatePart) => {
  if (!templateOrTemplatePart) {
    return false;
  }
  return templateOrTemplatePart.source === "custom" && (Boolean(templateOrTemplatePart?.plugin) || templateOrTemplatePart?.has_theme_file);
};
var revertTemplate = async (template, { allowUndo = true } = {}) => {
  const noticeId = "edit-site-template-reverted";
  dispatch(noticesStore).removeNotice(noticeId);
  if (!isTemplateRevertable(template)) {
    dispatch(noticesStore).createErrorNotice(
      __("This template is not revertable."),
      {
        type: "snackbar"
      }
    );
    return;
  }
  try {
    const templateEntityConfig = select(coreStore).getEntityConfig(
      "postType",
      template.type
    );
    if (!templateEntityConfig) {
      dispatch(noticesStore).createErrorNotice(
        __(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const fileTemplatePath = addQueryArgs(
      `${templateEntityConfig.baseURL}/${template.id}`,
      { context: "edit", source: template.origin }
    );
    const fileTemplate = await apiFetch({
      path: fileTemplatePath
    });
    if (!fileTemplate) {
      dispatch(noticesStore).createErrorNotice(
        __(
          "The editor has encountered an unexpected error. Please reload."
        ),
        { type: "snackbar" }
      );
      return;
    }
    const serializeBlocks = ({ blocks: blocksForSerialization = [] }) => __unstableSerializeAndClean(blocksForSerialization);
    const edited = select(coreStore).getEditedEntityRecord(
      "postType",
      template.type,
      template.id
    );
    dispatch(coreStore).editEntityRecord(
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
    const blocks = parse(fileTemplate?.content?.raw);
    dispatch(coreStore).editEntityRecord(
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
        dispatch(coreStore).editEntityRecord(
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
      dispatch(noticesStore).createSuccessNotice(
        __("Template reset."),
        {
          type: "snackbar",
          id: noticeId,
          actions: [
            {
              label: __("Undo"),
              onClick: undoRevert
            }
          ]
        }
      );
    }
  } catch (error) {
    const errorMessage = error.message && error.code !== "unknown_error" ? error.message : __("Template revert failed. Please reload.");
    dispatch(noticesStore).createErrorNotice(errorMessage, {
      type: "snackbar"
    });
  }
};
var resetPostAction = {
  id: "reset-post",
  label: __("Reset"),
  isEligible: (item) => {
    if (window?.__experimentalTemplateActivate) {
      return item.type === "wp_template_part" && item?.source === "custom" && item?.has_theme_file;
    }
    return isTemplateOrTemplatePart(item) && item?.source === "custom" && (Boolean(item.type === "wp_template" && item?.plugin) || item?.has_theme_file);
  },
  icon: backup,
  supportsBulk: true,
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = useState(false);
    const { saveEditedEntityRecord } = useDispatch(coreStore);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
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
          items.length > 1 ? sprintf(
            /* translators: %d: The number of items. */
            __("%d items reset."),
            items.length
          ) : sprintf(
            /* translators: %s: The template/part's name. */
            __('"%s" reset.'),
            getItemTitle(items[0])
          ),
          {
            type: "snackbar",
            id: "revert-template-action"
          }
        );
      } catch (error) {
        let fallbackErrorMessage;
        if (items[0].type === "wp_template") {
          fallbackErrorMessage = items.length === 1 ? __(
            "An error occurred while reverting the template."
          ) : __(
            "An error occurred while reverting the templates."
          );
        } else {
          fallbackErrorMessage = items.length === 1 ? __(
            "An error occurred while reverting the template part."
          ) : __(
            "An error occurred while reverting the template parts."
          );
        }
        const typedError = error;
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : fallbackErrorMessage;
        createErrorNotice(errorMessage, { type: "snackbar" });
      }
    };
    return /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
      /* @__PURE__ */ jsx(Text, { children: __("Reset to default and clear all customizations?") }),
      /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: __("Cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
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
            children: __("Reset")
          }
        )
      ] })
    ] });
  }
};
var reset_post_default = resetPostAction;
export {
  reset_post_default as default
};
//# sourceMappingURL=reset-post.mjs.map

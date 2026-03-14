// packages/fields/src/actions/rename-post.tsx
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import {
  Button,
  TextControl,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { store as noticesStore } from "@wordpress/notices";
import { unlock } from "../lock-unlock.mjs";
import {
  getItemTitle,
  isTemplateRemovable,
  isTemplate,
  isTemplatePart
} from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { PATTERN_TYPES } = unlock(patternsPrivateApis);
var renamePost = {
  id: "rename-post",
  label: __("Rename"),
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
    if (isTemplate(post) && !window?.__experimentalTemplateActivate) {
      return isTemplateRemovable(post) && post.is_custom && post.permissions?.update;
    }
    if (isTemplatePart(post)) {
      return post.source === "custom" && !post?.has_theme_file && post.permissions?.update;
    }
    return post.type === PATTERN_TYPES.user && post.permissions?.update;
  },
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [item] = items;
    const [title, setTitle] = useState(() => getItemTitle(item, ""));
    const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
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
        createSuccessNotice(__("Name updated"), {
          type: "snackbar"
        });
        onActionPerformed?.(items);
      } catch (error) {
        const typedError = error;
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : __("An error occurred while updating the name");
        createErrorNotice(errorMessage, { type: "snackbar" });
      }
    }
    return /* @__PURE__ */ jsx("form", { onSubmit: onRename, children: /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
      /* @__PURE__ */ jsx(
        TextControl,
        {
          __next40pxDefaultSize: true,
          label: __("Name"),
          value: title,
          onChange: setTitle,
          required: true
        }
      ),
      /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: () => {
              closeModal?.();
            },
            children: __("Cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            type: "submit",
            children: __("Save")
          }
        )
      ] })
    ] }) });
  }
};
var rename_post_default = renamePost;
export {
  rename_post_default as default
};
//# sourceMappingURL=rename-post.mjs.map

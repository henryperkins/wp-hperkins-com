// packages/fields/src/actions/duplicate-post.tsx
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf, _x } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useState } from "@wordpress/element";
import {
  Button,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalInputControl as InputControl
} from "@wordpress/components";
import { getItemTitle } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var duplicatePost = {
  id: "duplicate-post",
  label: _x("Duplicate", "action label"),
  isEligible({ status }) {
    return status !== "trash";
  },
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [item, setItem] = useState({
      ...items[0],
      title: sprintf(
        /* translators: %s: Existing post title */
        _x("%s (Copy)", "post"),
        getItemTitle(items[0])
      )
    });
    const [isCreatingPage, setIsCreatingPage] = useState(false);
    const { saveEntityRecord } = useDispatch(coreStore);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    async function createPage(event) {
      event.preventDefault();
      if (isCreatingPage) {
        return;
      }
      const isTemplate = item.type === "wp_template";
      const newItemObject = {
        status: isTemplate ? "publish" : "draft",
        title: item.title,
        slug: isTemplate ? item.slug : item.title || __("No title"),
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
          sprintf(
            // translators: %s: Title of the created post, e.g: "Hello world".
            __('"%s" successfully created.'),
            getItemTitle(newItem)
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
        const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : __("An error occurred while duplicating the page.");
        createErrorNotice(errorMessage, {
          type: "snackbar"
        });
      } finally {
        setIsCreatingPage(false);
        closeModal?.();
      }
    }
    return /* @__PURE__ */ jsx("form", { onSubmit: createPage, children: /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
      typeof item.id === "string" && /* @__PURE__ */ jsx("div", { children: __(
        "You are about to duplicate a bundled template. Changes will not be live until you activate the new template."
      ) }),
      /* @__PURE__ */ jsx(
        InputControl,
        {
          __next40pxDefaultSize: true,
          label: __("Title"),
          placeholder: __("No title"),
          value: getItemTitle(item),
          onChange: (value) => setItem((prev) => ({
            ...prev,
            title: value || __("No title")
          }))
        }
      ),
      /* @__PURE__ */ jsxs(HStack, { spacing: 2, justify: "end", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "tertiary",
            onClick: closeModal,
            __next40pxDefaultSize: true,
            children: __("Cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            type: "submit",
            isBusy: isCreatingPage,
            "aria-disabled": isCreatingPage,
            __next40pxDefaultSize: true,
            children: _x("Duplicate", "action label")
          }
        )
      ] })
    ] }) });
  }
};
var duplicate_post_default = duplicatePost;
export {
  duplicate_post_default as default
};
//# sourceMappingURL=duplicate-post.mjs.map

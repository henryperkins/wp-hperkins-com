// packages/fields/src/components/create-template-part-modal/index.tsx
import {
  Icon,
  BaseControl,
  TextControl,
  Button,
  Modal,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { store as coreStore } from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  check,
  footer as footerIcon,
  header as headerIcon,
  sidebar as sidebarIcon,
  navigationOverlay as navigationOverlayIcon,
  symbolFilled as symbolFilledIcon
} from "@wordpress/icons";
import { store as noticesStore } from "@wordpress/notices";
import { serialize } from "@wordpress/blocks";
import {
  getCleanTemplatePartSlug,
  getUniqueTemplatePartTitle,
  useExistingTemplateParts
} from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getAreaRadioId(value, instanceId) {
  return `fields-create-template-part-modal__area-option-${value}-${instanceId}`;
}
function getAreaRadioDescriptionId(value, instanceId) {
  return `fields-create-template-part-modal__area-option-description-${value}-${instanceId}`;
}
function CreateTemplatePartModal({
  modalTitle,
  ...restProps
}) {
  const defaultModalTitle = useSelect(
    (select) => select(coreStore).getPostType("wp_template_part")?.labels?.add_new_item,
    []
  );
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: modalTitle || defaultModalTitle,
      onRequestClose: restProps.closeModal,
      overlayClassName: "fields-create-template-part-modal",
      focusOnMount: "firstContentElement",
      size: "medium",
      children: /* @__PURE__ */ jsx(CreateTemplatePartModalContents, { ...restProps })
    }
  );
}
var getTemplatePartIcon = (areaOrIconName) => {
  if ("header" === areaOrIconName) {
    return headerIcon;
  } else if ("footer" === areaOrIconName) {
    return footerIcon;
  } else if ("sidebar" === areaOrIconName) {
    return sidebarIcon;
  } else if ("navigation-overlay" === areaOrIconName) {
    return navigationOverlayIcon;
  }
  return symbolFilledIcon;
};
function CreateTemplatePartModalContents({
  defaultArea = "uncategorized",
  blocks = [],
  confirmLabel = __("Add"),
  closeModal,
  onCreate,
  onError,
  defaultTitle = ""
}) {
  const { createErrorNotice } = useDispatch(noticesStore);
  const { saveEntityRecord } = useDispatch(coreStore);
  const existingTemplateParts = useExistingTemplateParts();
  const [title, setTitle] = useState(defaultTitle);
  const [area, setArea] = useState(defaultArea);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const instanceId = useInstanceId(CreateTemplatePartModal);
  const defaultTemplatePartAreas = useSelect(
    (select) => select(coreStore).getCurrentTheme()?.default_template_part_areas,
    []
  );
  async function createTemplatePart() {
    if (!title || isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      const uniqueTitle = getUniqueTemplatePartTitle(
        title,
        existingTemplateParts
      );
      const cleanSlug = getCleanTemplatePartSlug(uniqueTitle);
      const templatePart = await saveEntityRecord(
        "postType",
        "wp_template_part",
        {
          slug: cleanSlug,
          title: uniqueTitle,
          content: serialize(blocks),
          area
        },
        { throwOnError: true }
      );
      await onCreate(templatePart);
    } catch (error) {
      const errorMessage = error instanceof Error && "code" in error && error.message && error.code !== "unknown_error" ? error.message : __(
        "An error occurred while creating the template part."
      );
      createErrorNotice(errorMessage, { type: "snackbar" });
      onError?.();
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx(
    "form",
    {
      onSubmit: async (event) => {
        event.preventDefault();
        await createTemplatePart();
      },
      children: /* @__PURE__ */ jsxs(VStack, { spacing: "4", children: [
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
        /* @__PURE__ */ jsxs("fieldset", { className: "fields-create-template-part-modal__area-fieldset", children: [
          /* @__PURE__ */ jsx(BaseControl.VisualLabel, { as: "legend", children: __("Area") }),
          /* @__PURE__ */ jsx("div", { className: "fields-create-template-part-modal__area-radio-group", children: (defaultTemplatePartAreas ?? []).map(
            (item) => {
              const icon = getTemplatePartIcon(item.icon);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "fields-create-template-part-modal__area-radio-wrapper",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        id: getAreaRadioId(
                          item.area,
                          instanceId
                        ),
                        name: `fields-create-template-part-modal__area-${instanceId}`,
                        value: item.area,
                        checked: area === item.area,
                        onChange: () => {
                          setArea(item.area);
                        },
                        "aria-describedby": getAreaRadioDescriptionId(
                          item.area,
                          instanceId
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Icon,
                      {
                        icon,
                        className: "fields-create-template-part-modal__area-radio-icon"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        htmlFor: getAreaRadioId(
                          item.area,
                          instanceId
                        ),
                        className: "fields-create-template-part-modal__area-radio-label",
                        children: item.label
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Icon,
                      {
                        icon: check,
                        className: "fields-create-template-part-modal__area-radio-checkmark"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "fields-create-template-part-modal__area-radio-description",
                        id: getAreaRadioDescriptionId(
                          item.area,
                          instanceId
                        ),
                        children: item.description
                      }
                    )
                  ]
                },
                item.area
              );
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: () => {
                closeModal();
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
              "aria-disabled": !title || isSubmitting,
              isBusy: isSubmitting,
              children: confirmLabel
            }
          )
        ] })
      ] })
    }
  );
}
export {
  CreateTemplatePartModalContents,
  CreateTemplatePartModal as default
};
//# sourceMappingURL=index.mjs.map

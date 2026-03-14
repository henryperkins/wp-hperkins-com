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

// packages/fields/src/components/create-template-part-modal/index.tsx
var create_template_part_modal_exports = {};
__export(create_template_part_modal_exports, {
  CreateTemplatePartModalContents: () => CreateTemplatePartModalContents,
  default: () => CreateTemplatePartModal
});
module.exports = __toCommonJS(create_template_part_modal_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_notices = require("@wordpress/notices");
var import_blocks = require("@wordpress/blocks");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const defaultModalTitle = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getPostType("wp_template_part")?.labels?.add_new_item,
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: modalTitle || defaultModalTitle,
      onRequestClose: restProps.closeModal,
      overlayClassName: "fields-create-template-part-modal",
      focusOnMount: "firstContentElement",
      size: "medium",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateTemplatePartModalContents, { ...restProps })
    }
  );
}
var getTemplatePartIcon = (areaOrIconName) => {
  if ("header" === areaOrIconName) {
    return import_icons.header;
  } else if ("footer" === areaOrIconName) {
    return import_icons.footer;
  } else if ("sidebar" === areaOrIconName) {
    return import_icons.sidebar;
  } else if ("navigation-overlay" === areaOrIconName) {
    return import_icons.navigationOverlay;
  }
  return import_icons.symbolFilled;
};
function CreateTemplatePartModalContents({
  defaultArea = "uncategorized",
  blocks = [],
  confirmLabel = (0, import_i18n.__)("Add"),
  closeModal,
  onCreate,
  onError,
  defaultTitle = ""
}) {
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const existingTemplateParts = (0, import_utils.useExistingTemplateParts)();
  const [title, setTitle] = (0, import_element.useState)(defaultTitle);
  const [area, setArea] = (0, import_element.useState)(defaultArea);
  const [isSubmitting, setIsSubmitting] = (0, import_element.useState)(false);
  const instanceId = (0, import_compose.useInstanceId)(CreateTemplatePartModal);
  const defaultTemplatePartAreas = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.default_template_part_areas,
    []
  );
  async function createTemplatePart() {
    if (!title || isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      const uniqueTitle = (0, import_utils.getUniqueTemplatePartTitle)(
        title,
        existingTemplateParts
      );
      const cleanSlug = (0, import_utils.getCleanTemplatePartSlug)(uniqueTitle);
      const templatePart = await saveEntityRecord(
        "postType",
        "wp_template_part",
        {
          slug: cleanSlug,
          title: uniqueTitle,
          content: (0, import_blocks.serialize)(blocks),
          area
        },
        { throwOnError: true }
      );
      await onCreate(templatePart);
    } catch (error) {
      const errorMessage = error instanceof Error && "code" in error && error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)(
        "An error occurred while creating the template part."
      );
      createErrorNotice(errorMessage, { type: "snackbar" });
      onError?.();
    } finally {
      setIsSubmitting(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "form",
    {
      onSubmit: async (event) => {
        event.preventDefault();
        await createTemplatePart();
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "4", children: [
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { className: "fields-create-template-part-modal__area-fieldset", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { as: "legend", children: (0, import_i18n.__)("Area") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-create-template-part-modal__area-radio-group", children: (defaultTemplatePartAreas ?? []).map(
            (item) => {
              const icon = getTemplatePartIcon(item.icon);
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "fields-create-template-part-modal__area-radio-wrapper",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Icon,
                      {
                        icon,
                        className: "fields-create-template-part-modal__area-radio-icon"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Icon,
                      {
                        icon: import_icons.check,
                        className: "fields-create-template-part-modal__area-radio-checkmark"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: () => {
                closeModal();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateTemplatePartModalContents
});
//# sourceMappingURL=index.cjs.map

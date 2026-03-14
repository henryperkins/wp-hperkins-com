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

// packages/block-library/src/navigation/edit/overlay-template-part-selector.js
var overlay_template_part_selector_exports = {};
__export(overlay_template_part_selector_exports, {
  default: () => OverlayTemplatePartSelector
});
module.exports = __toCommonJS(overlay_template_part_selector_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
var import_notices = require("@wordpress/notices");
var import_icons = require("@wordpress/icons");
var import_create_template_part_id = require("../../template-part/edit/utils/create-template-part-id.cjs");
var import_use_create_overlay = __toESM(require("./use-create-overlay.cjs"));
var import_deleted_overlay_warning = __toESM(require("./deleted-overlay-warning.cjs"));
var import_constants = require("../constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function OverlayTemplatePartSelector({
  overlay,
  overlayMenu,
  setAttributes,
  onNavigateToEntityRecord,
  isCreatingOverlay,
  setIsCreatingOverlay
}) {
  const headingId = (0, import_compose.useInstanceId)(
    OverlayTemplatePartSelector,
    "wp-block-navigation__overlay-selector-heading"
  );
  const {
    records: templateParts,
    isResolving,
    hasResolved
  } = (0, import_core_data.useEntityRecords)("postType", "wp_template_part", {
    per_page: -1
  });
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const currentTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.stylesheet,
    []
  );
  const [localIsCreating, setLocalIsCreating] = (0, import_element.useState)(false);
  const isCreating = isCreatingOverlay !== void 0 ? isCreatingOverlay : localIsCreating;
  const setIsCreating = setIsCreatingOverlay !== void 0 ? setIsCreatingOverlay : setLocalIsCreating;
  const overlayTemplateParts = (0, import_element.useMemo)(() => {
    if (!templateParts) {
      return [];
    }
    return templateParts.filter(
      (templatePart) => templatePart.area === import_constants.NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
    );
  }, [templateParts]);
  const createOverlayTemplatePart = (0, import_use_create_overlay.default)(overlayTemplateParts);
  const selectedTemplatePart = (0, import_element.useMemo)(() => {
    if (!overlay || !overlayTemplateParts) {
      return null;
    }
    return overlayTemplateParts.find(
      (templatePart) => templatePart.slug === overlay
    );
  }, [overlay, overlayTemplateParts]);
  const options = (0, import_element.useMemo)(() => {
    const baseOptions = [
      {
        label: (0, import_i18n.__)("Default"),
        value: ""
      }
    ];
    if (!hasResolved || isResolving) {
      return baseOptions;
    }
    const templatePartOptions = overlayTemplateParts.map(
      (templatePart) => {
        const label = templatePart.title?.rendered ? (0, import_html_entities.decodeEntities)(templatePart.title.rendered) : templatePart.slug;
        return {
          label,
          value: templatePart.slug
        };
      }
    );
    if (overlay && !selectedTemplatePart) {
      templatePartOptions.unshift({
        label: (0, import_i18n.sprintf)(
          /* translators: %s: Overlay slug. */
          (0, import_i18n.__)("%s (missing)"),
          overlay
        ),
        value: overlay
      });
    }
    return [...baseOptions, ...templatePartOptions];
  }, [
    overlayTemplateParts,
    hasResolved,
    isResolving,
    overlay,
    selectedTemplatePart
  ]);
  const handleSelectChange = (value) => {
    setAttributes({
      overlay: value || void 0
    });
  };
  const handleEditClick = () => {
    if (!overlay || !selectedTemplatePart || !onNavigateToEntityRecord) {
      return;
    }
    const theme = selectedTemplatePart.theme || currentTheme;
    const templatePartId = (0, import_create_template_part_id.createTemplatePartId)(theme, overlay);
    const params = {
      postId: templatePartId,
      postType: "wp_template_part"
    };
    if (overlayMenu === "mobile") {
      params.viewport = "mobile";
    }
    onNavigateToEntityRecord(params);
  };
  const handleCreateOverlay = (0, import_element.useCallback)(async () => {
    try {
      setIsCreating(true);
      const templatePart = await createOverlayTemplatePart();
      setAttributes({
        overlay: templatePart.slug
      });
      if (onNavigateToEntityRecord) {
        const theme = templatePart.theme || currentTheme;
        const templatePartId = (0, import_create_template_part_id.createTemplatePartId)(
          theme,
          templatePart.slug
        );
        const params = {
          postId: templatePartId,
          postType: "wp_template_part"
        };
        if (overlayMenu === "mobile") {
          params.viewport = "mobile";
        }
        onNavigateToEntityRecord(params);
      } else {
        setIsCreating(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error && "code" in error && error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("An error occurred while creating the overlay.");
      createErrorNotice(errorMessage, { type: "snackbar" });
      setIsCreating(false);
    }
  }, [
    createOverlayTemplatePart,
    setAttributes,
    onNavigateToEntityRecord,
    createErrorNotice,
    currentTheme,
    setIsCreating,
    overlayMenu
  ]);
  const handleClearOverlay = (0, import_element.useCallback)(() => {
    setAttributes({ overlay: void 0 });
  }, [setAttributes]);
  const isCreateButtonDisabled = isResolving || isCreating;
  const isOverlayMissing = (0, import_element.useMemo)(() => {
    return overlay && hasResolved && !isResolving && !selectedTemplatePart;
  }, [overlay, hasResolved, isResolving, selectedTemplatePart]);
  const helpText = (0, import_element.useMemo)(() => {
    if (overlayTemplateParts.length === 0 && hasResolved) {
      return (0, import_i18n.__)("No overlays found.");
    }
    return (0, import_i18n.__)("Select an overlay for navigation.");
  }, [overlayTemplateParts.length, hasResolved]);
  const editButtonLabel = (0, import_element.useMemo)(() => {
    return selectedTemplatePart ? (0, import_i18n.sprintf)(
      /* translators: %s: Overlay title. */
      (0, import_i18n.__)("Edit overlay: %s"),
      selectedTemplatePart.title?.rendered ? (0, import_html_entities.decodeEntities)(selectedTemplatePart.title.rendered) : selectedTemplatePart.slug
    ) : (0, import_i18n.__)("Edit overlay");
  }, [selectedTemplatePart]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "wp-block-navigation__overlay-selector", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "h3",
      {
        id: headingId,
        className: "wp-block-navigation__overlay-selector-header",
        children: (0, import_i18n.__)("Overlay template")
      }
    ),
    hasResolved && (overlayTemplateParts.length === 0 || isCreating && overlayTemplateParts.length === 1) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: handleCreateOverlay,
        disabled: isCreateButtonDisabled,
        accessibleWhenDisabled: true,
        isBusy: isCreating,
        className: "wp-block-navigation__overlay-create-button-prominent",
        children: (0, import_i18n.__)("Create overlay")
      }
    ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "small",
          icon: import_icons.plus,
          onClick: handleCreateOverlay,
          disabled: isCreateButtonDisabled,
          accessibleWhenDisabled: true,
          isBusy: isCreating,
          label: (0, import_i18n.__)("Create new overlay template"),
          showTooltip: true,
          className: "wp-block-navigation__overlay-create-button"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.__experimentalHStack,
        {
          alignment: "flex-start",
          className: "wp-block-navigation__overlay-selector-controls",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexBlock, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.SelectControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Overlay template"),
                hideLabelFromVision: true,
                "aria-labelledby": headingId,
                value: overlay || "",
                options,
                onChange: handleSelectChange,
                disabled: isResolving,
                accessibleWhenDisabled: true,
                help: helpText
              }
            ) }),
            overlay && hasResolved && selectedTemplatePart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleEditClick,
                disabled: !onNavigateToEntityRecord,
                accessibleWhenDisabled: true,
                label: editButtonLabel,
                showTooltip: true,
                className: "wp-block-navigation__overlay-edit-button",
                children: (0, import_i18n.__)("Edit")
              }
            ) })
          ]
        }
      ),
      isOverlayMissing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_deleted_overlay_warning.default,
        {
          onClear: handleClearOverlay,
          onCreate: handleCreateOverlay,
          isCreating
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalHStack,
      {
        alignment: "flex-start",
        className: "wp-block-navigation__overlay-help-text-wrapper",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalText,
          {
            variant: "muted",
            isBlock: true,
            className: "wp-block-navigation__overlay-help-text",
            children: (0, import_i18n.__)(
              "An overlay template allows you to customize the appearance of the dialog that opens when the menu button is pressed."
            )
          }
        )
      }
    )
  ] });
}
//# sourceMappingURL=overlay-template-part-selector.cjs.map

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

// packages/editor/src/components/post-excerpt/panel.js
var panel_exports = {};
__export(panel_exports, {
  PrivatePostExcerptPanel: () => PrivatePostExcerptPanel,
  default: () => PostExcerptPanel
});
module.exports = __toCommonJS(panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_index = __toESM(require("./index.cjs"));
var import_check = __toESM(require("./check.cjs"));
var import_plugin = __toESM(require("./plugin.cjs"));
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_get_template_info = require("../../utils/get-template-info.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var PANEL_NAME = "post-excerpt";
function ExcerptPanel() {
  const { isOpened, isEnabled, postType } = (0, import_data.useSelect)((select) => {
    const {
      isEditorPanelOpened,
      isEditorPanelEnabled,
      getCurrentPostType
    } = select(import_store.store);
    return {
      isOpened: isEditorPanelOpened(PANEL_NAME),
      isEnabled: isEditorPanelEnabled(PANEL_NAME),
      postType: getCurrentPostType()
    };
  }, []);
  const { toggleEditorPanelOpened } = (0, import_data.useDispatch)(import_store.store);
  const toggleExcerptPanel = () => toggleEditorPanelOpened(PANEL_NAME);
  if (!isEnabled) {
    return null;
  }
  const shouldUseDescriptionLabel = [
    "wp_template",
    "wp_template_part",
    "wp_block"
  ].includes(postType);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.PanelBody,
    {
      title: shouldUseDescriptionLabel ? (0, import_i18n.__)("Description") : (0, import_i18n.__)("Excerpt"),
      opened: isOpened,
      onToggle: toggleExcerptPanel,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin.default.Slot, { children: (fills) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index.default, {}),
        fills
      ] }) })
    }
  );
}
function PostExcerptPanel() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcerptPanel, {}) });
}
function PrivatePostExcerptPanel() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivateExcerpt, {}) });
}
function PrivateExcerpt() {
  const { shouldRender, excerpt, shouldBeUsedAsDescription, allowEditing } = (0, import_data.useSelect)((select) => {
    const {
      getCurrentPostType,
      getCurrentPostId,
      getEditedPostAttribute,
      isEditorPanelEnabled
    } = select(import_store.store);
    const postType = getCurrentPostType();
    const isTemplateOrTemplatePart = [
      "wp_template",
      "wp_template_part"
    ].includes(postType);
    const isPattern = postType === "wp_block";
    const _shouldBeUsedAsDescription = isTemplateOrTemplatePart || isPattern;
    const _usedAttribute = isTemplateOrTemplatePart ? "description" : "excerpt";
    const _excerpt = getEditedPostAttribute(_usedAttribute);
    const template = isTemplateOrTemplatePart && select(import_core_data.store).getEntityRecord(
      "postType",
      postType,
      getCurrentPostId()
    );
    const fallback = !_excerpt && isTemplateOrTemplatePart ? (0, import_get_template_info.getTemplateInfo)({
      template,
      templateTypes: select(import_core_data.store).getCurrentTheme()?.default_template_types
    })?.description : void 0;
    const _shouldRender = isEditorPanelEnabled(PANEL_NAME) || _shouldBeUsedAsDescription;
    return {
      excerpt: _excerpt ?? fallback,
      shouldRender: _shouldRender,
      shouldBeUsedAsDescription: _shouldBeUsedAsDescription,
      // If we should render, allow editing for all post types that are not used as description.
      // For the rest allow editing only for user generated entities.
      allowEditing: _shouldRender && (!_shouldBeUsedAsDescription || isPattern || template && template.source === import_constants.TEMPLATE_ORIGINS.custom && !template.has_theme_file && template.is_custom)
    };
  }, []);
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const label = shouldBeUsedAsDescription ? (0, import_i18n.__)("Description") : (0, import_i18n.__)("Excerpt");
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": label,
      headerTitle: label,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor, label]
  );
  if (!shouldRender) {
    return false;
  }
  const excerptText = !!excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { align: "left", numberOfLines: 4, truncate: allowEditing, children: (0, import_html_entities.decodeEntities)(excerpt) });
  if (!allowEditing) {
    return excerptText;
  }
  const excerptPlaceholder = shouldBeUsedAsDescription ? (0, import_i18n.__)("Add a description\u2026") : (0, import_i18n.__)("Add an excerpt\u2026");
  const triggerEditLabel = shouldBeUsedAsDescription ? (0, import_i18n.__)("Edit description") : (0, import_i18n.__)("Edit excerpt");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
    excerptText,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Dropdown,
      {
        className: "editor-post-excerpt__dropdown",
        contentClassName: "editor-post-excerpt__dropdown__content",
        popoverProps,
        focusOnMount: true,
        ref: setPopoverAnchor,
        renderToggle: ({ onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            onClick: onToggle,
            variant: "link",
            children: excerptText ? triggerEditLabel : excerptPlaceholder
          }
        ),
        renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_editor.__experimentalInspectorPopoverHeader,
            {
              title: label,
              onClose
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin.default.Slot, { children: (fills) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_index.default,
              {
                hideLabelFromVision: true,
                updateOnBlur: true
              }
            ),
            fills
          ] }) }) })
        ] })
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrivatePostExcerptPanel
});
//# sourceMappingURL=panel.cjs.map

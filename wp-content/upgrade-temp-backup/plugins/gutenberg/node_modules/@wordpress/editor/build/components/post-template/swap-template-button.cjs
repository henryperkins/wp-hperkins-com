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

// packages/editor/src/components/post-template/swap-template-button.js
var swap_template_button_exports = {};
__export(swap_template_button_exports, {
  default: () => SwapTemplateButton
});
module.exports = __toCommonJS(swap_template_button_exports);
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_blocks = require("@wordpress/blocks");
var import_hooks = require("./hooks.cjs");
var import_search_templates = require("../../utils/search-templates.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function SwapTemplateButton({ onClick }) {
  const [showModal, setShowModal] = (0, import_element.useState)(false);
  const { postType, postId } = (0, import_hooks.useEditedPostContext)();
  const availableTemplates = (0, import_hooks.useAvailableTemplates)(postType);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const onTemplateSelect = async (template) => {
    editEntityRecord(
      "postType",
      postType,
      postId,
      { template: template.name },
      { undoIgnore: true }
    );
    setShowModal(false);
    onClick();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.MenuItem,
      {
        disabled: !availableTemplates?.length,
        accessibleWhenDisabled: true,
        onClick: () => setShowModal(true),
        children: (0, import_i18n.__)("Change template")
      }
    ),
    showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Modal,
      {
        title: (0, import_i18n.__)("Choose a template"),
        onRequestClose: () => setShowModal(false),
        overlayClassName: "editor-post-template__swap-template-modal",
        isFullScreen: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-template__swap-template-modal-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          TemplatesList,
          {
            postType,
            onSelect: onTemplateSelect
          }
        ) })
      }
    )
  ] });
}
function TemplatesList({ postType, onSelect }) {
  const [searchValue, setSearchValue] = (0, import_element.useState)("");
  const availableTemplates = (0, import_hooks.useAvailableTemplates)(postType);
  const templatesAsPatterns = (0, import_element.useMemo)(
    () => availableTemplates.map((template) => ({
      name: template.slug,
      blocks: (0, import_blocks.parse)(template.content.raw),
      title: (0, import_html_entities.decodeEntities)(template.title.rendered),
      id: template.id
    })),
    [availableTemplates]
  );
  const filteredBlockTemplates = (0, import_element.useMemo)(() => {
    return (0, import_search_templates.searchTemplates)(templatesAsPatterns, searchValue);
  }, [templatesAsPatterns, searchValue]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.SearchControl,
      {
        onChange: setSearchValue,
        value: searchValue,
        label: (0, import_i18n.__)("Search"),
        placeholder: (0, import_i18n.__)("Search"),
        className: "editor-post-template__swap-template-search"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalBlockPatternsList,
      {
        label: (0, import_i18n.__)("Templates"),
        blockPatterns: filteredBlockTemplates,
        onClickPattern: onSelect
      }
    )
  ] });
}
//# sourceMappingURL=swap-template-button.cjs.map

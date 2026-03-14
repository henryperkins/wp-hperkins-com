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

// packages/edit-post/src/components/init-pattern-modal/index.js
var init_pattern_modal_exports = {};
__export(init_pattern_modal_exports, {
  default: () => InitPatternModal
});
module.exports = __toCommonJS(init_pattern_modal_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_jsx_runtime = require("react/jsx-runtime");
function InitPatternModal() {
  const { editPost } = (0, import_data.useDispatch)(import_editor.store);
  const [syncType, setSyncType] = (0, import_element.useState)(void 0);
  const [title, setTitle] = (0, import_element.useState)("");
  const isNewPost = (0, import_data.useSelect)(
    (select) => select(import_editor.store).isCleanNewPost(),
    []
  );
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(() => isNewPost);
  if (!isNewPost) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (0, import_i18n.__)("Create pattern"),
      onRequestClose: () => {
        setIsModalOpen(false);
      },
      overlayClassName: "reusable-blocks-menu-items__convert-modal",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();
            setIsModalOpen(false);
            editPost({
              title,
              meta: {
                wp_pattern_sync_status: syncType
              }
            });
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextControl,
              {
                label: (0, import_i18n.__)("Name"),
                value: title,
                onChange: setTitle,
                placeholder: (0, import_i18n.__)("My pattern"),
                className: "patterns-create-modal__name-input",
                __next40pxDefaultSize: true
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToggleControl,
              {
                label: (0, import_i18n._x)("Synced", "pattern (singular)"),
                help: (0, import_i18n.__)(
                  "Sync this pattern across multiple locations."
                ),
                checked: !syncType,
                onChange: () => {
                  setSyncType(
                    !syncType ? "unsynced" : void 0
                  );
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { justify: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                type: "submit",
                disabled: !title,
                accessibleWhenDisabled: true,
                children: (0, import_i18n.__)("Create")
              }
            ) })
          ] })
        }
      )
    }
  ) });
}
//# sourceMappingURL=index.cjs.map

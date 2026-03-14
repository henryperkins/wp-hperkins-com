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

// packages/block-editor/src/components/block-removal-warning-modal/index.js
var block_removal_warning_modal_exports = {};
__export(block_removal_warning_modal_exports, {
  BlockRemovalWarningModal: () => BlockRemovalWarningModal
});
module.exports = __toCommonJS(block_removal_warning_modal_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockRemovalWarningModal({ rules }) {
  const [confirmed, setConfirmed] = (0, import_element.useState)(false);
  const { clientIds, selectPrevious, message } = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_store.store)).getRemovalPromptData()
  );
  const {
    clearBlockRemovalPrompt,
    setBlockRemovalRules,
    privateRemoveBlocks
  } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  (0, import_element.useEffect)(() => {
    setBlockRemovalRules(rules);
    return () => {
      setBlockRemovalRules();
    };
  }, [rules, setBlockRemovalRules]);
  (0, import_element.useEffect)(() => {
    setConfirmed(false);
  }, [clientIds]);
  if (!message) {
    return;
  }
  const isStructured = typeof message === "object" && message !== null;
  const description = isStructured ? message.description : message;
  const requireConfirmation = isStructured && message.requireConfirmation;
  const isRemoveDisabled = requireConfirmation && !confirmed;
  const onConfirmRemoval = () => {
    privateRemoveBlocks(
      clientIds,
      selectPrevious,
      /* force */
      true
    );
    clearBlockRemovalPrompt();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (0, import_i18n.__)("Confirm deletion"),
      onRequestClose: clearBlockRemovalPrompt,
      size: "medium",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description }),
          isStructured && (message.warning || message.subtext) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
            message.warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: message.warning }),
            message.warning && message.subtext && " ",
            message.subtext
          ] })
        ] }),
        requireConfirmation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.CheckboxControl,
          {
            label: (0, import_i18n.__)("I understand the consequences"),
            checked: confirmed,
            onChange: setConfirmed
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: "tertiary",
              onClick: clearBlockRemovalPrompt,
              __next40pxDefaultSize: true,
              children: (0, import_i18n.__)("Cancel")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: "primary",
              onClick: onConfirmRemoval,
              disabled: isRemoveDisabled,
              accessibleWhenDisabled: true,
              __next40pxDefaultSize: true,
              children: (0, import_i18n.__)("Delete")
            }
          )
        ] })
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockRemovalWarningModal
});
//# sourceMappingURL=index.cjs.map

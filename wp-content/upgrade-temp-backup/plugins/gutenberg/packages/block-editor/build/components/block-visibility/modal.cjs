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

// packages/block-editor/src/components/block-visibility/modal.js
var modal_exports = {};
__export(modal_exports, {
  default: () => BlockVisibilityModal
});
module.exports = __toCommonJS(modal_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_notices = require("@wordpress/notices");
var import_constants = require("./constants.cjs");
var import_store = require("../../store/index.cjs");
var import_utils = require("../../hooks/utils.cjs");
var import_utils2 = require("./utils.cjs");

// packages/block-editor/src/components/block-visibility/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='4334c7deb6']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "4334c7deb6");
  style.appendChild(document.createTextNode(".block-editor-block-visibility-modal{z-index:1000001}.block-editor-block-visibility-modal__options{border:0;list-style:none;margin:24px 0;padding:0}.block-editor-block-visibility-modal__options-item{align-items:center;display:flex;gap:24px;justify-content:space-between;margin:0 0 16px}.block-editor-block-visibility-modal__options-item:last-child{margin:0}.block-editor-block-visibility-modal__options-item--everywhere{align-items:start;flex-direction:column}.block-editor-block-visibility-modal__options-checkbox--everywhere{font-weight:600}.block-editor-block-visibility-modal__options-icon--checked{fill:#ddd}.block-editor-block-visibility-modal__sub-options{padding-inline-start:12px;width:100%}.block-editor-block-visibility-modal__description{color:#757575;font-size:12px}.block-editor-block-visibility-info{align-items:center;display:flex;justify-content:start;margin:0 16px 16px;padding-bottom:4px;padding-top:4px}"));
  document.head.appendChild(style);
}

// packages/block-editor/src/components/block-visibility/modal.js
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_VIEWPORT_CHECKBOX_VALUES = {
  [import_constants.BLOCK_VISIBILITY_VIEWPORTS.mobile.key]: false,
  [import_constants.BLOCK_VISIBILITY_VIEWPORTS.tablet.key]: false,
  [import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.key]: false
};
var EMPTY_BLOCKS = [];
function BlockVisibilityModal({ clientIds, onClose }) {
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const blocks = (0, import_data.useSelect)(
    (select) => select(import_store.store).getBlocksByClientId(clientIds) ?? EMPTY_BLOCKS,
    [clientIds]
  );
  const listViewShortcut = (0, import_data.useSelect)((select) => {
    return select(import_keyboard_shortcuts.store).getShortcutRepresentation(
      "core/editor/toggle-list-view"
    );
  }, []);
  const initialViewportValues = (0, import_element.useMemo)(() => {
    if (blocks?.length === 0) {
      return {
        hideEverywhere: false,
        viewportChecked: {}
      };
    }
    const viewportValues = {};
    import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.forEach(([, { key }]) => {
      viewportValues[key] = (0, import_utils2.getViewportCheckboxState)(blocks, key);
    });
    return {
      hideEverywhere: (0, import_utils2.getHideEverywhereCheckboxState)(blocks),
      viewportChecked: viewportValues
    };
  }, [blocks]);
  const [viewportChecked, setViewportChecked] = (0, import_element.useState)(
    initialViewportValues?.viewportChecked ?? {}
  );
  const [hideEverywhere, setHideEverywhere] = (0, import_element.useState)(
    initialViewportValues?.hideEverywhere ?? false
  );
  const handleViewportCheckboxChange = (0, import_element.useCallback)(
    (viewport, isChecked) => {
      setViewportChecked({
        ...viewportChecked,
        [viewport]: isChecked
      });
    },
    [viewportChecked]
  );
  const noticeMessage = (0, import_element.useMemo)(() => {
    if (!hideEverywhere) {
      return (0, import_i18n.sprintf)(
        // translators: %s: The shortcut key to access the List View.
        (0, import_i18n.__)(
          "Block visibility settings updated. You can access them via the List View (%s)."
        ),
        listViewShortcut
      );
    }
    const message = blocks?.length > 1 ? (
      // translators: %s: The shortcut key to access the List View.
      (0, import_i18n.__)(
        "Blocks hidden. You can access them via the List View (%s)."
      )
    ) : (
      // translators: %s: The shortcut key to access the List View.
      (0, import_i18n.__)(
        "Block hidden. You can access it via the List View (%s)."
      )
    );
    return (0, import_i18n.sprintf)(message, listViewShortcut);
  }, [hideEverywhere, blocks?.length, listViewShortcut]);
  const isAnyViewportChecked = (0, import_element.useMemo)(
    () => Object.values(viewportChecked).some(
      (checked) => checked === true || checked === null
    ),
    [viewportChecked]
  );
  const isDirty = (0, import_element.useMemo)(() => {
    if (hideEverywhere !== initialViewportValues.hideEverywhere) {
      return true;
    }
    return import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.some(
      ([, { key }]) => viewportChecked[key] !== initialViewportValues.viewportChecked[key]
    );
  }, [hideEverywhere, viewportChecked, initialViewportValues]);
  const hasIndeterminateValues = (0, import_element.useMemo)(() => {
    if (hideEverywhere === null) {
      return true;
    }
    return Object.values(viewportChecked).some(
      (checked) => checked === null
    );
  }, [hideEverywhere, viewportChecked]);
  const handleSubmit = (0, import_element.useCallback)(
    (event) => {
      event.preventDefault();
      const newVisibility = hideEverywhere ? false : {
        viewport: import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.reduce(
          (acc, [, { key }]) => {
            if (viewportChecked[key]) {
              acc[key] = false;
            }
            return acc;
          },
          {}
        )
      };
      const attributesByClientId = Object.fromEntries(
        blocks.map(({ clientId, attributes }) => [
          clientId,
          {
            metadata: (0, import_utils.cleanEmptyObject)({
              ...attributes?.metadata,
              blockVisibility: newVisibility
            })
          }
        ])
      );
      updateBlockAttributes(clientIds, attributesByClientId, {
        uniqueByBlock: true
      });
      createSuccessNotice(noticeMessage, {
        id: hideEverywhere ? "block-visibility-hidden" : "block-visibility-viewports-updated",
        type: "snackbar"
      });
      onClose();
    },
    [
      blocks,
      clientIds,
      createSuccessNotice,
      hideEverywhere,
      noticeMessage,
      onClose,
      updateBlockAttributes,
      viewportChecked
    ]
  );
  const hasMultipleBlocks = blocks?.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: clientIds?.length > 1 ? (0, import_i18n.__)("Hide blocks") : (0, import_i18n.__)("Hide block"),
      onRequestClose: onClose,
      overlayClassName: "block-editor-block-visibility-modal",
      size: "small",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: hasMultipleBlocks ? (0, import_i18n.__)(
            "Select the viewport sizes for which you want to hide the blocks. Changes will apply to all selected blocks."
          ) : (0, import_i18n.__)(
            "Select the viewport size for which you want to hide the block."
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "block-editor-block-visibility-modal__options", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "block-editor-block-visibility-modal__options-item block-editor-block-visibility-modal__options-item--everywhere", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.CheckboxControl,
              {
                className: "block-editor-block-visibility-modal__options-checkbox--everywhere",
                label: (0, import_i18n.__)("Omit from published content"),
                checked: hideEverywhere === true,
                indeterminate: hideEverywhere === null,
                onChange: (checked) => {
                  setHideEverywhere(checked);
                  setViewportChecked(
                    DEFAULT_VIEWPORT_CHECKBOX_VALUES
                  );
                }
              }
            ),
            hideEverywhere !== true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "block-editor-block-visibility-modal__sub-options", children: import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.map(
              ([, { label, icon, key }]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "li",
                {
                  className: "block-editor-block-visibility-modal__options-item",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.CheckboxControl,
                      {
                        label: (0, import_i18n.sprintf)(
                          // translators: %s: The viewport name.
                          (0, import_i18n.__)("Hide on %s"),
                          label
                        ),
                        checked: viewportChecked[key] ?? false,
                        indeterminate: viewportChecked[key] === null,
                        onChange: (checked) => handleViewportCheckboxChange(
                          key,
                          checked
                        )
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Icon,
                      {
                        icon,
                        className: (0, import_clsx.default)({
                          "block-editor-block-visibility-modal__options-icon--checked": viewportChecked[key]
                        })
                      }
                    )
                  ]
                },
                key
              )
            ) })
          ] }) }),
          hasMultipleBlocks && hasIndeterminateValues && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-editor-block-visibility-modal__description", children: (0, import_i18n.__)(
            "Selected blocks have different visibility settings. The checkboxes show an indeterminate state when settings differ."
          ) }),
          !hasMultipleBlocks && hideEverywhere === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-editor-block-visibility-modal__description", children: (0, import_i18n.sprintf)(
            // translators: %s: The shortcut key to access the List View.
            (0, import_i18n.__)(
              "Block will be hidden in the editor, and omitted from the published markup on the frontend. You can configure it again by selecting it in the List View (%s)."
            ),
            listViewShortcut
          ) }),
          !hasMultipleBlocks && !hideEverywhere && isAnyViewportChecked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-editor-block-visibility-modal__description", children: (0, import_element.createInterpolateElement)(
            (0, import_i18n.sprintf)(
              // translators: %s: The shortcut key to access the List View
              (0, import_i18n.__)(
                "Block will be hidden according to the selected viewports. It will be <strong>included in the published markup on the frontend</strong>. You can configure it again by selecting it in the List View (%s)."
              ),
              listViewShortcut
            ),
            {
              strong: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {})
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Flex,
          {
            className: "block-editor-block-visibility-modal__actions",
            justify: "flex-end",
            expanded: false,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  variant: "tertiary",
                  onClick: onClose,
                  __next40pxDefaultSize: true,
                  children: (0, import_i18n.__)("Cancel")
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  variant: "primary",
                  type: "submit",
                  disabled: !isDirty,
                  accessibleWhenDisabled: true,
                  __next40pxDefaultSize: true,
                  children: (0, import_i18n.__)("Apply")
                }
              ) })
            ]
          }
        )
      ] })
    }
  );
}
//# sourceMappingURL=modal.cjs.map

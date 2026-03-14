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

// packages/block-library/src/html/modal.js
var modal_exports = {};
__export(modal_exports, {
  default: () => HTMLEditModal
});
module.exports = __toCommonJS(modal_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_preview = __toESM(require("./preview.cjs"));
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function HTMLEditModal({
  isOpen,
  onRequestClose,
  content,
  setAttributes
}) {
  const { html, css, js } = (0, import_utils.parseContent)(content);
  const [editedHtml, setEditedHtml] = (0, import_element.useState)(html);
  const [editedCss, setEditedCss] = (0, import_element.useState)(css);
  const [editedJs, setEditedJs] = (0, import_element.useState)(js);
  const [isDirty, setIsDirty] = (0, import_element.useState)(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = (0, import_element.useState)(false);
  const [isFullscreen, setIsFullscreen] = (0, import_element.useState)(false);
  const { canUserUseUnfilteredHTML } = (0, import_data.useSelect)((select) => {
    const settings = select(import_block_editor.store).getSettings();
    return {
      canUserUseUnfilteredHTML: settings.__experimentalCanUserUseUnfilteredHTML
    };
  }, []);
  const hasRestrictedContent = !canUserUseUnfilteredHTML && (css.trim() || js.trim());
  if (!isOpen) {
    return null;
  }
  const handleHtmlChange = (value) => {
    setEditedHtml(value);
    setIsDirty(true);
  };
  const handleCssChange = (value) => {
    setEditedCss(value);
    setIsDirty(true);
  };
  const handleJsChange = (value) => {
    setEditedJs(value);
    setIsDirty(true);
  };
  const handleUpdate = () => {
    setAttributes({
      content: (0, import_utils.serializeContent)({
        html: editedHtml,
        css: canUserUseUnfilteredHTML ? editedCss : "",
        js: canUserUseUnfilteredHTML ? editedJs : ""
      })
    });
    setIsDirty(false);
  };
  const handleCancel = () => {
    setIsDirty(false);
    onRequestClose();
  };
  const handleRequestClose = () => {
    if (isDirty) {
      setShowUnsavedWarning(true);
    } else {
      onRequestClose();
    }
  };
  const handleDiscardChanges = () => {
    setShowUnsavedWarning(false);
    onRequestClose();
  };
  const handleContinueEditing = () => {
    setShowUnsavedWarning(false);
  };
  const handleUpdateAndClose = () => {
    handleUpdate();
    onRequestClose();
  };
  const toggleFullscreen = () => {
    setIsFullscreen((prevState) => !prevState);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Modal,
      {
        title: (0, import_i18n.__)("Edit HTML"),
        onRequestClose: handleRequestClose,
        className: "block-library-html__modal",
        size: "large",
        isDismissible: false,
        shouldCloseOnClickOutside: !isDirty,
        shouldCloseOnEsc: !isDirty,
        isFullScreen: isFullscreen,
        __experimentalHideHeader: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, { orientation: "horizontal", defaultTabId: "html", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalGrid,
          {
            columns: 1,
            templateRows: "auto 1fr auto",
            gap: 4,
            style: { height: "100%" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__experimentalHStack,
                {
                  justify: "space-between",
                  className: "block-library-html__modal-header",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabList, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: "html", children: "HTML" }),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: "css", children: "CSS" }),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: "js", children: (0, import_i18n.__)("JavaScript") })
                    ] }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        __next40pxDefaultSize: true,
                        icon: isFullscreen ? import_icons.square : import_icons.fullscreen,
                        label: (0, import_i18n.__)("Enable/disable fullscreen"),
                        onClick: toggleFullscreen,
                        variant: "tertiary"
                      }
                    ) })
                  ]
                }
              ),
              hasRestrictedContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Notice,
                {
                  status: "warning",
                  isDismissible: false,
                  className: "block-library-html__modal-notice",
                  children: (0, import_i18n.__)(
                    "This block contains CSS or JavaScript that will be removed when you save because you do not have permission to use unfiltered HTML."
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__experimentalHStack,
                {
                  alignment: "stretch",
                  justify: "flex-start",
                  spacing: 4,
                  className: "block-library-html__modal-tabs",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-library-html__modal-content", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Tabs.TabPanel,
                        {
                          tabId: "html",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            import_block_editor.PlainText,
                            {
                              value: editedHtml,
                              onChange: handleHtmlChange,
                              placeholder: (0, import_i18n.__)("Write HTML\u2026"),
                              "aria-label": (0, import_i18n.__)("HTML"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      ),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Tabs.TabPanel,
                        {
                          tabId: "css",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            import_block_editor.PlainText,
                            {
                              value: editedCss,
                              onChange: handleCssChange,
                              placeholder: (0, import_i18n.__)("Write CSS\u2026"),
                              "aria-label": (0, import_i18n.__)("CSS"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      ),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Tabs.TabPanel,
                        {
                          tabId: "js",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            import_block_editor.PlainText,
                            {
                              value: editedJs,
                              onChange: handleJsChange,
                              placeholder: (0, import_i18n.__)(
                                "Write JavaScript\u2026"
                              ),
                              "aria-label": (0, import_i18n.__)("JavaScript"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-library-html__preview", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_preview.default,
                      {
                        content: (0, import_utils.serializeContent)({
                          html: editedHtml,
                          css: editedCss,
                          js: editedJs
                        })
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__experimentalHStack,
                {
                  alignment: "center",
                  justify: "flex-end",
                  spacing: 4,
                  className: "block-library-html__modal-footer",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "tertiary",
                        onClick: handleCancel,
                        children: (0, import_i18n.__)("Cancel")
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "primary",
                        onClick: handleUpdateAndClose,
                        children: (0, import_i18n.__)("Update")
                      }
                    )
                  ]
                }
              )
            ]
          }
        ) })
      }
    ),
    showUnsavedWarning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.Modal,
      {
        title: (0, import_i18n.__)("Unsaved changes"),
        onRequestClose: handleContinueEditing,
        size: "medium",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
            "You have unsaved changes. What would you like to do?"
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { direction: "row", justify: "flex-end", gap: 2, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleDiscardChanges,
                children: (0, import_i18n.__)("Discard unsaved changes")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleContinueEditing,
                children: (0, import_i18n.__)("Continue editing")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                onClick: handleUpdateAndClose,
                children: (0, import_i18n.__)("Update and close")
              }
            )
          ] })
        ]
      }
    )
  ] });
}
//# sourceMappingURL=modal.cjs.map

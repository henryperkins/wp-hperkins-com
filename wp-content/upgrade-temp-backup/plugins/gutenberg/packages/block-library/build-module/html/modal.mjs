// packages/block-library/src/html/modal.js
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import {
  Modal,
  Button,
  Flex,
  Notice,
  privateApis as componentsPrivateApis,
  __experimentalHStack as HStack,
  __experimentalGrid as Grid
} from "@wordpress/components";
import { PlainText, store as blockEditorStore } from "@wordpress/block-editor";
import { fullscreen, square } from "@wordpress/icons";
import { unlock } from "../lock-unlock.mjs";
import Preview from "./preview.mjs";
import { parseContent, serializeContent } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
function HTMLEditModal({
  isOpen,
  onRequestClose,
  content,
  setAttributes
}) {
  const { html, css, js } = parseContent(content);
  const [editedHtml, setEditedHtml] = useState(html);
  const [editedCss, setEditedCss] = useState(css);
  const [editedJs, setEditedJs] = useState(js);
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { canUserUseUnfilteredHTML } = useSelect((select) => {
    const settings = select(blockEditorStore).getSettings();
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
      content: serializeContent({
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Modal,
      {
        title: __("Edit HTML"),
        onRequestClose: handleRequestClose,
        className: "block-library-html__modal",
        size: "large",
        isDismissible: false,
        shouldCloseOnClickOutside: !isDirty,
        shouldCloseOnEsc: !isDirty,
        isFullScreen: isFullscreen,
        __experimentalHideHeader: true,
        children: /* @__PURE__ */ jsx(Tabs, { orientation: "horizontal", defaultTabId: "html", children: /* @__PURE__ */ jsxs(
          Grid,
          {
            columns: 1,
            templateRows: "auto 1fr auto",
            gap: 4,
            style: { height: "100%" },
            children: [
              /* @__PURE__ */ jsxs(
                HStack,
                {
                  justify: "space-between",
                  className: "block-library-html__modal-header",
                  children: [
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Tabs.TabList, { children: [
                      /* @__PURE__ */ jsx(Tabs.Tab, { tabId: "html", children: "HTML" }),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ jsx(Tabs.Tab, { tabId: "css", children: "CSS" }),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ jsx(Tabs.Tab, { tabId: "js", children: __("JavaScript") })
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        __next40pxDefaultSize: true,
                        icon: isFullscreen ? square : fullscreen,
                        label: __("Enable/disable fullscreen"),
                        onClick: toggleFullscreen,
                        variant: "tertiary"
                      }
                    ) })
                  ]
                }
              ),
              hasRestrictedContent && /* @__PURE__ */ jsx(
                Notice,
                {
                  status: "warning",
                  isDismissible: false,
                  className: "block-library-html__modal-notice",
                  children: __(
                    "This block contains CSS or JavaScript that will be removed when you save because you do not have permission to use unfiltered HTML."
                  )
                }
              ),
              /* @__PURE__ */ jsxs(
                HStack,
                {
                  alignment: "stretch",
                  justify: "flex-start",
                  spacing: 4,
                  className: "block-library-html__modal-tabs",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "block-library-html__modal-content", children: [
                      /* @__PURE__ */ jsx(
                        Tabs.TabPanel,
                        {
                          tabId: "html",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ jsx(
                            PlainText,
                            {
                              value: editedHtml,
                              onChange: handleHtmlChange,
                              placeholder: __("Write HTML\u2026"),
                              "aria-label": __("HTML"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      ),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ jsx(
                        Tabs.TabPanel,
                        {
                          tabId: "css",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ jsx(
                            PlainText,
                            {
                              value: editedCss,
                              onChange: handleCssChange,
                              placeholder: __("Write CSS\u2026"),
                              "aria-label": __("CSS"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      ),
                      canUserUseUnfilteredHTML && /* @__PURE__ */ jsx(
                        Tabs.TabPanel,
                        {
                          tabId: "js",
                          focusable: false,
                          className: "block-library-html__modal-tab",
                          children: /* @__PURE__ */ jsx(
                            PlainText,
                            {
                              value: editedJs,
                              onChange: handleJsChange,
                              placeholder: __(
                                "Write JavaScript\u2026"
                              ),
                              "aria-label": __("JavaScript"),
                              className: "block-library-html__modal-editor"
                            }
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "block-library-html__preview", children: /* @__PURE__ */ jsx(
                      Preview,
                      {
                        content: serializeContent({
                          html: editedHtml,
                          css: editedCss,
                          js: editedJs
                        })
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                HStack,
                {
                  alignment: "center",
                  justify: "flex-end",
                  spacing: 4,
                  className: "block-library-html__modal-footer",
                  children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "tertiary",
                        onClick: handleCancel,
                        children: __("Cancel")
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        __next40pxDefaultSize: true,
                        variant: "primary",
                        onClick: handleUpdateAndClose,
                        children: __("Update")
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
    showUnsavedWarning && /* @__PURE__ */ jsxs(
      Modal,
      {
        title: __("Unsaved changes"),
        onRequestClose: handleContinueEditing,
        size: "medium",
        children: [
          /* @__PURE__ */ jsx("p", { children: __(
            "You have unsaved changes. What would you like to do?"
          ) }),
          /* @__PURE__ */ jsxs(Flex, { direction: "row", justify: "flex-end", gap: 2, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleDiscardChanges,
                children: __("Discard unsaved changes")
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleContinueEditing,
                children: __("Continue editing")
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                onClick: handleUpdateAndClose,
                children: __("Update and close")
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  HTMLEditModal as default
};
//# sourceMappingURL=modal.mjs.map

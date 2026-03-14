// packages/block-library/src/file/inspector.js
import { __ } from "@wordpress/i18n";
import {
  RangeControl,
  SelectControl,
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { MIN_PREVIEW_HEIGHT, MAX_PREVIEW_HEIGHT } from "./edit.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FileBlockInspector({
  hrefs,
  openInNewWindow,
  showDownloadButton,
  changeLinkDestinationOption,
  changeOpenInNewWindow,
  changeShowDownloadButton,
  displayPreview,
  changeDisplayPreview,
  previewHeight,
  changePreviewHeight
}) {
  const { href, textLinkHref, attachmentPage } = hrefs;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  let linkDestinationOptions = [{ value: href, label: __("URL") }];
  if (attachmentPage) {
    linkDestinationOptions = [
      { value: href, label: __("Media file") },
      { value: attachmentPage, label: __("Attachment page") }
    ];
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(InspectorControls, { children: [
    href.endsWith(".pdf") && /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("PDF settings"),
        resetAll: () => {
          changeDisplayPreview(true);
          changePreviewHeight(600);
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show inline embed"),
              isShownByDefault: true,
              hasValue: () => !displayPreview,
              onDeselect: () => changeDisplayPreview(true),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show inline embed"),
                  help: displayPreview ? __(
                    "Note: Most phone and tablet browsers won't display embedded PDFs."
                  ) : null,
                  checked: !!displayPreview,
                  onChange: changeDisplayPreview
                }
              )
            }
          ),
          displayPreview && /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Height in pixels"),
              isShownByDefault: true,
              hasValue: () => previewHeight !== 600,
              onDeselect: () => changePreviewHeight(600),
              children: /* @__PURE__ */ jsx(
                RangeControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Height in pixels"),
                  min: MIN_PREVIEW_HEIGHT,
                  max: Math.max(
                    MAX_PREVIEW_HEIGHT,
                    previewHeight
                  ),
                  value: previewHeight,
                  onChange: changePreviewHeight
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          changeLinkDestinationOption(href);
          changeOpenInNewWindow(false);
          changeShowDownloadButton(true);
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Link to"),
              isShownByDefault: true,
              hasValue: () => textLinkHref !== href,
              onDeselect: () => changeLinkDestinationOption(href),
              children: /* @__PURE__ */ jsx(
                SelectControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Link to"),
                  value: textLinkHref,
                  options: linkDestinationOptions,
                  onChange: changeLinkDestinationOption
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Open in new tab"),
              isShownByDefault: true,
              hasValue: () => !!openInNewWindow,
              onDeselect: () => changeOpenInNewWindow(false),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Open in new tab"),
                  checked: openInNewWindow,
                  onChange: changeOpenInNewWindow
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show download button"),
              isShownByDefault: true,
              hasValue: () => !showDownloadButton,
              onDeselect: () => changeShowDownloadButton(true),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show download button"),
                  checked: showDownloadButton,
                  onChange: changeShowDownloadButton
                }
              )
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  FileBlockInspector as default
};
//# sourceMappingURL=inspector.mjs.map

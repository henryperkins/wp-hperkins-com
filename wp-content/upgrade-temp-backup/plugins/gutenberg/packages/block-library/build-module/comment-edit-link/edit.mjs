// packages/block-library/src/comment-edit-link/edit.js
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit(props) {
  const { attributes, setAttributes } = props;
  const { linkTarget } = attributes;
  useDeprecatedTextAlign(props);
  const blockProps = useBlockProps();
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const inspectorControls = /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          linkTarget: "_self"
        });
      },
      dropdownMenuProps,
      children: /* @__PURE__ */ jsx(
        ToolsPanelItem,
        {
          label: __("Open in new tab"),
          isShownByDefault: true,
          hasValue: () => linkTarget === "_blank",
          onDeselect: () => setAttributes({ linkTarget: "_self" }),
          children: /* @__PURE__ */ jsx(
            ToggleControl,
            {
              label: __("Open in new tab"),
              onChange: (value) => setAttributes({
                linkTarget: value ? "_blank" : "_self"
              }),
              checked: linkTarget === "_blank"
            }
          )
        }
      )
    }
  ) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    inspectorControls,
    /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(
      "a",
      {
        href: "#edit-comment-pseudo-link",
        onClick: (event) => event.preventDefault(),
        children: __("Edit")
      }
    ) })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map

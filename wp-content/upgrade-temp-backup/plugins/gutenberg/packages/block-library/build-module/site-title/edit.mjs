// packages/block-library/src/site-title/edit.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import {
  RichText,
  InspectorControls,
  BlockControls,
  useBlockProps,
  HeadingLevelDropdown,
  useBlockEditingMode
} from "@wordpress/block-editor";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { createBlock, getDefaultBlockName } from "@wordpress/blocks";
import { decodeEntities } from "@wordpress/html-entities";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SiteTitleEdit(props) {
  useDeprecatedTextAlign(props);
  const { attributes, setAttributes, insertBlocksAfter } = props;
  const { level, levelOptions, isLink, linkTarget } = attributes;
  const { canUserEdit, title } = useSelect((select) => {
    const { canUser, getEntityRecord, getEditedEntityRecord } = select(coreStore);
    const canEdit = canUser("update", {
      kind: "root",
      name: "site"
    });
    const settings = canEdit ? getEditedEntityRecord("root", "site") : {};
    const readOnlySettings = getEntityRecord("root", "__unstableBase");
    return {
      canUserEdit: canEdit,
      title: canEdit ? settings?.title : readOnlySettings?.name
    };
  }, []);
  const { editEntityRecord } = useDispatch(coreStore);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const blockEditingMode = useBlockEditingMode();
  function setTitle(newTitle) {
    editEntityRecord("root", "site", void 0, {
      title: newTitle.trim()
    });
  }
  const TagName = level === 0 ? "p" : `h${level}`;
  const blockProps = useBlockProps({
    className: !canUserEdit && !title && "wp-block-site-title__placeholder"
  });
  const siteTitleContent = canUserEdit ? /* @__PURE__ */ jsx(TagName, { ...blockProps, children: /* @__PURE__ */ jsx(
    RichText,
    {
      tagName: isLink ? "a" : "span",
      href: isLink ? "#site-title-pseudo-link" : void 0,
      "aria-label": __("Site title text"),
      placeholder: __("Write site title\u2026"),
      value: title,
      onChange: setTitle,
      allowedFormats: [],
      disableLineBreaks: true,
      __unstableOnSplitAtEnd: () => insertBlocksAfter(createBlock(getDefaultBlockName()))
    }
  ) }) : /* @__PURE__ */ jsx(TagName, { ...blockProps, children: isLink ? /* @__PURE__ */ jsx(
    "a",
    {
      href: "#site-title-pseudo-link",
      onClick: (event) => event.preventDefault(),
      children: decodeEntities(title) || __("Site Title placeholder")
    }
  ) : /* @__PURE__ */ jsx("span", { children: decodeEntities(title) || __("Site Title placeholder") }) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    blockEditingMode === "default" && /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      HeadingLevelDropdown,
      {
        value: level,
        options: levelOptions,
        onChange: (newLevel) => setAttributes({ level: newLevel })
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          setAttributes({
            isLink: true,
            linkTarget: "_self"
          });
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !isLink,
              label: __("Make title link to home"),
              onDeselect: () => setAttributes({ isLink: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Make title link to home"),
                  onChange: () => setAttributes({ isLink: !isLink }),
                  checked: isLink
                }
              )
            }
          ),
          isLink && /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => linkTarget !== "_self",
              label: __("Open in new tab"),
              onDeselect: () => setAttributes({ linkTarget: "_self" }),
              isShownByDefault: true,
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
        ]
      }
    ) }),
    siteTitleContent
  ] });
}
export {
  SiteTitleEdit as default
};
//# sourceMappingURL=edit.mjs.map

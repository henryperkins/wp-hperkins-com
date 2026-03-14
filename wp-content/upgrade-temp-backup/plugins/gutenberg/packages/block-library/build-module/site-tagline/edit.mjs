// packages/block-library/src/site-tagline/edit.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  useBlockProps,
  BlockControls,
  HeadingLevelDropdown,
  RichText
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { createBlock, getDefaultBlockName } from "@wordpress/blocks";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SiteTaglineEdit(props) {
  useDeprecatedTextAlign(props);
  const { attributes, setAttributes, insertBlocksAfter } = props;
  const { level, levelOptions } = attributes;
  const { canUserEdit, tagline } = useSelect((select) => {
    const { canUser, getEntityRecord, getEditedEntityRecord } = select(coreStore);
    const canEdit = canUser("update", {
      kind: "root",
      name: "site"
    });
    const settings = canEdit ? getEditedEntityRecord("root", "site") : {};
    const readOnlySettings = getEntityRecord("root", "__unstableBase");
    return {
      canUserEdit: canEdit,
      tagline: canEdit ? settings?.description : readOnlySettings?.description
    };
  }, []);
  const TagName = level === 0 ? "p" : `h${level}`;
  const { editEntityRecord } = useDispatch(coreStore);
  function setTagline(newTagline) {
    editEntityRecord("root", "site", void 0, {
      description: newTagline
    });
  }
  const blockProps = useBlockProps({
    className: !canUserEdit && !tagline && "wp-block-site-tagline__placeholder"
  });
  const siteTaglineContent = canUserEdit ? /* @__PURE__ */ jsx(
    RichText,
    {
      allowedFormats: [],
      onChange: setTagline,
      "aria-label": __("Site tagline text"),
      placeholder: __("Write site tagline\u2026"),
      tagName: TagName,
      value: tagline,
      disableLineBreaks: true,
      __unstableOnSplitAtEnd: () => insertBlocksAfter(createBlock(getDefaultBlockName())),
      ...blockProps
    }
  ) : /* @__PURE__ */ jsx(TagName, { ...blockProps, children: tagline || __("Site Tagline placeholder") });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      HeadingLevelDropdown,
      {
        value: level,
        options: levelOptions,
        onChange: (newLevel) => setAttributes({ level: newLevel })
      }
    ) }),
    siteTaglineContent
  ] });
}
export {
  SiteTaglineEdit as default
};
//# sourceMappingURL=edit.mjs.map

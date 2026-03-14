// packages/block-library/src/heading/edit.js
import { __ } from "@wordpress/i18n";
import { useEffect, Platform } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import {
  RichText,
  useBlockProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { generateAnchor, setAnchor } from "./autogenerate-anchors.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function HeadingEdit(props) {
  const {
    attributes,
    setAttributes,
    mergeBlocks,
    onReplace,
    style,
    clientId
  } = props;
  useDeprecatedTextAlign(props);
  const { content, level, placeholder, anchor } = attributes;
  const tagName = "h" + level;
  const blockProps = useBlockProps({
    style
  });
  const { canGenerateAnchors } = useSelect((select) => {
    const { getGlobalBlockCount, getSettings } = select(blockEditorStore);
    const settings = getSettings();
    return {
      canGenerateAnchors: !!settings.generateAnchors || getGlobalBlockCount("core/table-of-contents") > 0
    };
  }, []);
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  useEffect(() => {
    if (!canGenerateAnchors) {
      return;
    }
    if (!anchor && content) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        anchor: generateAnchor(clientId, content)
      });
    }
    setAnchor(clientId, anchor);
    return () => setAnchor(clientId, null);
  }, [anchor, content, clientId, canGenerateAnchors]);
  const onContentChange = (value) => {
    const newAttrs = { content: value };
    if (canGenerateAnchors && (!anchor || !value || generateAnchor(clientId, content) === anchor)) {
      newAttrs.anchor = generateAnchor(clientId, value);
    }
    setAttributes(newAttrs);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    RichText,
    {
      identifier: "content",
      tagName,
      value: content,
      onChange: onContentChange,
      onMerge: mergeBlocks,
      onReplace,
      onRemove: () => onReplace([]),
      placeholder: placeholder || __("Heading"),
      ...Platform.isNative && { deleteEnter: true },
      ...blockProps
    }
  ) });
}
var edit_default = HeadingEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map

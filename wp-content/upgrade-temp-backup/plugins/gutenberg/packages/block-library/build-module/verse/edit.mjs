// packages/block-library/src/verse/edit.js
import { __ } from "@wordpress/i18n";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { createBlock, getDefaultBlockName } from "@wordpress/blocks";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { jsx } from "react/jsx-runtime";
function VerseEdit(props) {
  const {
    attributes,
    setAttributes,
    mergeBlocks,
    onRemove,
    insertBlocksAfter,
    style
  } = props;
  const { content } = attributes;
  useDeprecatedTextAlign(props);
  const blockProps = useBlockProps({ style });
  return /* @__PURE__ */ jsx(
    RichText,
    {
      tagName: "pre",
      identifier: "content",
      preserveWhiteSpace: true,
      value: content,
      onChange: (nextContent) => {
        setAttributes({
          content: nextContent
        });
      },
      "aria-label": __("Poetry text"),
      placeholder: __("Write poetry\u2026"),
      onRemove,
      onMerge: mergeBlocks,
      ...blockProps,
      __unstablePastePlainText: true,
      __unstableOnSplitAtDoubleLineEnd: () => insertBlocksAfter(createBlock(getDefaultBlockName()))
    }
  );
}
export {
  VerseEdit as default
};
//# sourceMappingURL=edit.mjs.map

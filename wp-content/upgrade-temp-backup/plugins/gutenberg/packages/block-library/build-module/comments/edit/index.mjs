// packages/block-library/src/comments/edit/index.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import CommentsInspectorControls from "./comments-inspector-controls.mjs";
import CommentsLegacy from "./comments-legacy.mjs";
import TEMPLATE from "./template.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CommentsEdit(props) {
  const { attributes, setAttributes, clientId } = props;
  const { tagName: TagName, legacy } = attributes;
  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE
  });
  if (legacy) {
    return /* @__PURE__ */ jsx(CommentsLegacy, { ...props });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      CommentsInspectorControls,
      {
        attributes,
        setAttributes,
        clientId
      }
    ),
    /* @__PURE__ */ jsx(TagName, { ...innerBlocksProps })
  ] });
}
export {
  CommentsEdit as default
};
//# sourceMappingURL=index.mjs.map

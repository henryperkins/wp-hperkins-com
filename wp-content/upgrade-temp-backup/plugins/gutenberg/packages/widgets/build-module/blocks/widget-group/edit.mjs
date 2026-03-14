// packages/widgets/src/blocks/widget-group/edit.js
import {
  useBlockProps,
  BlockIcon,
  ButtonBlockAppender,
  InnerBlocks,
  store as blockEditorStore,
  RichText
} from "@wordpress/block-editor";
import { Placeholder } from "@wordpress/components";
import { group as groupIcon } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit(props) {
  const { clientId } = props;
  const hasInnerBlocks = useSelect(
    (select) => select(blockEditorStore).getBlockCount(clientId) > 0,
    [clientId]
  );
  return /* @__PURE__ */ jsx("div", { ...useBlockProps({ className: "widget" }), children: !hasInnerBlocks ? /* @__PURE__ */ jsx(PlaceholderContent, { ...props }) : /* @__PURE__ */ jsx(PreviewContent, { ...props }) });
}
function PlaceholderContent({ clientId }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Placeholder,
      {
        className: "wp-block-widget-group__placeholder",
        icon: /* @__PURE__ */ jsx(BlockIcon, { icon: groupIcon }),
        label: __("Widget Group"),
        children: /* @__PURE__ */ jsx(ButtonBlockAppender, { rootClientId: clientId })
      }
    ),
    /* @__PURE__ */ jsx(InnerBlocks, { renderAppender: false })
  ] });
}
function PreviewContent({ attributes, setAttributes }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      RichText,
      {
        tagName: "h2",
        identifier: "title",
        className: "widget-title",
        allowedFormats: [],
        placeholder: __("Title"),
        value: attributes.title ?? "",
        onChange: (title) => setAttributes({ title })
      }
    ),
    /* @__PURE__ */ jsx(InnerBlocks, {})
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map

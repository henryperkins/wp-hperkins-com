// packages/block-library/src/comment-author-avatar/edit.js
import {
  InspectorControls,
  useBlockProps,
  __experimentalGetSpacingClassesAndStyles as useSpacingProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { PanelBody, ResizableBox, RangeControl } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { __, isRTL } from "@wordpress/i18n";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit({
  attributes,
  context: { commentId },
  setAttributes,
  isSelected
}) {
  const { height, width } = attributes;
  const [avatars] = useEntityProp(
    "root",
    "comment",
    "author_avatar_urls",
    commentId
  );
  const [authorName] = useEntityProp(
    "root",
    "comment",
    "author_name",
    commentId
  );
  const avatarUrls = avatars ? Object.values(avatars) : null;
  const sizes = avatars ? Object.keys(avatars) : null;
  const minSize = sizes ? sizes[0] : 24;
  const maxSize = sizes ? sizes[sizes.length - 1] : 96;
  const blockProps = useBlockProps();
  const spacingProps = useSpacingProps(attributes);
  const maxSizeBuffer = Math.floor(maxSize * 2.5);
  const avatarURL = useSelect((select) => {
    const { __experimentalDiscussionSettings } = select(blockEditorStore).getSettings();
    return __experimentalDiscussionSettings?.avatarURL;
  }, []);
  const inspectorControls = /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(PanelBody, { title: __("Settings"), children: /* @__PURE__ */ jsx(
    RangeControl,
    {
      __next40pxDefaultSize: true,
      label: __("Image size"),
      onChange: (newWidth) => setAttributes({
        width: newWidth,
        height: newWidth
      }),
      min: minSize,
      max: maxSizeBuffer,
      initialPosition: width,
      value: width
    }
  ) }) });
  const resizableAvatar = /* @__PURE__ */ jsx(
    ResizableBox,
    {
      size: {
        width,
        height
      },
      showHandle: isSelected,
      onResizeStop: (event, direction, elt, delta) => {
        setAttributes({
          height: parseInt(height + delta.height, 10),
          width: parseInt(width + delta.width, 10)
        });
      },
      lockAspectRatio: true,
      enable: {
        top: false,
        right: !isRTL(),
        bottom: true,
        left: isRTL()
      },
      minWidth: minSize,
      maxWidth: maxSizeBuffer,
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src: avatarUrls ? avatarUrls[avatarUrls.length - 1] : avatarURL,
          alt: `${authorName} ${__("Avatar")}`,
          ...blockProps
        }
      )
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    inspectorControls,
    /* @__PURE__ */ jsx("div", { ...spacingProps, children: resizableAvatar })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map

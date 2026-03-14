// packages/block-library/src/cover/edit/cover-placeholder.js
import { BlockIcon, MediaPlaceholder } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { cover as icon } from "@wordpress/icons";
import { ALLOWED_MEDIA_TYPES } from "../shared.mjs";
import { jsx } from "react/jsx-runtime";
function CoverPlaceholder({
  disableMediaButtons = false,
  children,
  onSelectMedia,
  onError,
  style,
  toggleUseFeaturedImage
}) {
  return /* @__PURE__ */ jsx(
    MediaPlaceholder,
    {
      icon: /* @__PURE__ */ jsx(BlockIcon, { icon }),
      labels: {
        title: __("Cover")
      },
      onSelect: onSelectMedia,
      allowedTypes: ALLOWED_MEDIA_TYPES,
      disableMediaButtons,
      onToggleFeaturedImage: toggleUseFeaturedImage,
      onError,
      style,
      children
    }
  );
}
export {
  CoverPlaceholder as default
};
//# sourceMappingURL=cover-placeholder.mjs.map

// packages/block-directory/src/components/downloadable-block-icon/index.js
import { BlockIcon } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function DownloadableBlockIcon({ icon }) {
  const className = "block-directory-downloadable-block-icon";
  return icon.match(/\.(jpeg|jpg|gif|png|svg)(?:\?.*)?$/) !== null ? /* @__PURE__ */ jsx("img", { className, src: icon, alt: "" }) : /* @__PURE__ */ jsx(BlockIcon, { className, icon, showColors: true });
}
var downloadable_block_icon_default = DownloadableBlockIcon;
export {
  downloadable_block_icon_default as default
};
//# sourceMappingURL=index.mjs.map

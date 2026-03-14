// packages/block-directory/src/components/downloadable-block-notice/index.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var DownloadableBlockNotice = ({ block }) => {
  const errorNotice = useSelect(
    (select) => select(blockDirectoryStore).getErrorNoticeForBlock(block.id),
    [block]
  );
  if (!errorNotice) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "block-directory-downloadable-block-notice", children: /* @__PURE__ */ jsxs("div", { className: "block-directory-downloadable-block-notice__content", children: [
    errorNotice.message,
    errorNotice.isFatal ? " " + __("Try reloading the page.") : null
  ] }) });
};
var downloadable_block_notice_default = DownloadableBlockNotice;
export {
  DownloadableBlockNotice,
  downloadable_block_notice_default as default
};
//# sourceMappingURL=index.mjs.map

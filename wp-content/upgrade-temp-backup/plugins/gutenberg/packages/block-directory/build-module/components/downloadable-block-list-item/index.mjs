// packages/block-directory/src/components/downloadable-block-list-item/index.js
import clsx from "clsx";
import { __, _n, sprintf } from "@wordpress/i18n";
import {
  Tooltip,
  Spinner,
  VisuallyHidden,
  Composite
} from "@wordpress/components";
import { createInterpolateElement } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { getBlockType } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import BlockRatings from "../block-ratings/index.mjs";
import DownloadableBlockIcon from "../downloadable-block-icon/index.mjs";
import DownloadableBlockNotice from "../downloadable-block-notice/index.mjs";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function getDownloadableBlockLabel({ title, rating, ratingCount }, { hasNotice, isInstalled, isInstalling }) {
  const stars = Math.round(rating / 0.5) * 0.5;
  if (!isInstalled && hasNotice) {
    return sprintf("Retry installing %s.", decodeEntities(title));
  }
  if (isInstalled) {
    return sprintf("Add %s.", decodeEntities(title));
  }
  if (isInstalling) {
    return sprintf("Installing %s.", decodeEntities(title));
  }
  if (ratingCount < 1) {
    return sprintf("Install %s.", decodeEntities(title));
  }
  return sprintf(
    /* translators: 1: block title, 2: average rating, 3: total ratings count. */
    _n(
      "Install %1$s. %2$s stars with %3$s review.",
      "Install %1$s. %2$s stars with %3$s reviews.",
      ratingCount
    ),
    decodeEntities(title),
    stars,
    ratingCount
  );
}
function DownloadableBlockListItem({ item, onClick }) {
  const { author, description, icon, rating, title } = item;
  const isInstalled = !!getBlockType(item.name);
  const { hasNotice, isInstalling, isInstallable } = useSelect(
    (select) => {
      const { getErrorNoticeForBlock, isInstalling: isBlockInstalling } = select(blockDirectoryStore);
      const notice = getErrorNoticeForBlock(item.id);
      const hasFatal = notice && notice.isFatal;
      return {
        hasNotice: !!notice,
        isInstalling: isBlockInstalling(item.id),
        isInstallable: !hasFatal
      };
    },
    [item]
  );
  let statusText = "";
  if (isInstalled) {
    statusText = __("Installed!");
  } else if (isInstalling) {
    statusText = __("Installing\u2026");
  }
  const itemLabel = getDownloadableBlockLabel(item, {
    hasNotice,
    isInstalled,
    isInstalling
  });
  return /* @__PURE__ */ jsx(Tooltip, { placement: "top", text: itemLabel, children: /* @__PURE__ */ jsxs(
    Composite.Item,
    {
      className: clsx(
        "block-directory-downloadable-block-list-item",
        isInstalling && "is-installing"
      ),
      accessibleWhenDisabled: true,
      disabled: isInstalling || !isInstallable,
      onClick: (event) => {
        event.preventDefault();
        onClick();
      },
      "aria-label": itemLabel,
      type: "button",
      role: "option",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "block-directory-downloadable-block-list-item__icon", children: [
          /* @__PURE__ */ jsx(DownloadableBlockIcon, { icon, title }),
          isInstalling ? /* @__PURE__ */ jsx("span", { className: "block-directory-downloadable-block-list-item__spinner", children: /* @__PURE__ */ jsx(Spinner, {}) }) : /* @__PURE__ */ jsx(BlockRatings, { rating })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "block-directory-downloadable-block-list-item__details", children: [
          /* @__PURE__ */ jsx("span", { className: "block-directory-downloadable-block-list-item__title", children: createInterpolateElement(
            sprintf(
              /* translators: 1: block title. 2: author name. */
              __("%1$s <span>by %2$s</span>"),
              decodeEntities(title),
              author
            ),
            {
              span: /* @__PURE__ */ jsx("span", { className: "block-directory-downloadable-block-list-item__author" })
            }
          ) }),
          hasNotice ? /* @__PURE__ */ jsx(DownloadableBlockNotice, { block: item }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "block-directory-downloadable-block-list-item__desc", children: !!statusText ? statusText : decodeEntities(description) }),
            isInstallable && !(isInstalled || isInstalling) && /* @__PURE__ */ jsx(VisuallyHidden, { children: __("Install block") })
          ] })
        ] })
      ]
    }
  ) });
}
var downloadable_block_list_item_default = DownloadableBlockListItem;
export {
  downloadable_block_list_item_default as default
};
//# sourceMappingURL=index.mjs.map

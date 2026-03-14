// packages/block-library/src/page-list-item/edit.js
import clsx from "clsx";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { safeHTML } from "@wordpress/dom";
import { ItemSubmenuIcon } from "../navigation-link/icons.mjs";
import {
  getColors,
  getNavigationChildBlockProps
} from "../navigation/edit/utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function useFrontPageId() {
  return useSelect((select) => {
    const canReadSettings = select(coreStore).canUser("read", {
      kind: "root",
      name: "site"
    });
    if (!canReadSettings) {
      return void 0;
    }
    const site = select(coreStore).getEntityRecord("root", "site");
    return site?.show_on_front === "page" && site?.page_on_front;
  }, []);
}
function PageListItemEdit({ context, attributes }) {
  const { id, label, link, hasChildren, title } = attributes;
  const isNavigationChild = "showSubmenuIcon" in context;
  const frontPageId = useFrontPageId();
  const submenuVisibility = context.submenuVisibility;
  const openOnClick = submenuVisibility === "click";
  const innerBlocksColors = getColors(context, true);
  const navigationChildBlockProps = getNavigationChildBlockProps(innerBlocksColors);
  const blockProps = useBlockProps(navigationChildBlockProps, {
    className: "wp-block-pages-list__item"
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps);
  return /* @__PURE__ */ jsxs(
    "li",
    {
      className: clsx("wp-block-pages-list__item", {
        "has-child": hasChildren,
        "wp-block-navigation-item": isNavigationChild,
        // Class assignment logic matches PHP rendering in page-list/index.php
        "open-on-click": openOnClick,
        "open-always": submenuVisibility === "always",
        // Must check hover mode explicitly to match PHP elseif structure (index.php:212)
        "open-on-hover-click": submenuVisibility === "hover" && context.showSubmenuIcon,
        "menu-item-home": id === frontPageId
      }),
      children: [
        hasChildren && openOnClick ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "wp-block-navigation-item__content wp-block-navigation-submenu__toggle",
              "aria-expanded": "false",
              dangerouslySetInnerHTML: {
                __html: safeHTML(label)
              }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "wp-block-page-list__submenu-icon wp-block-navigation__submenu-icon", children: /* @__PURE__ */ jsx(ItemSubmenuIcon, {}) })
        ] }) : /* @__PURE__ */ jsx(
          "a",
          {
            className: clsx("wp-block-pages-list__item__link", {
              "wp-block-navigation-item__content": isNavigationChild
            }),
            href: link,
            dangerouslySetInnerHTML: {
              __html: safeHTML(title)
            }
          }
        ),
        hasChildren && /* @__PURE__ */ jsxs(Fragment, { children: [
          !openOnClick && context.showSubmenuIcon && /* @__PURE__ */ jsx(
            "button",
            {
              className: "wp-block-navigation-item__content wp-block-navigation-submenu__toggle wp-block-page-list__submenu-icon wp-block-navigation__submenu-icon",
              "aria-expanded": "false",
              type: "button",
              children: /* @__PURE__ */ jsx(ItemSubmenuIcon, {})
            }
          ),
          /* @__PURE__ */ jsx("ul", { ...innerBlocksProps })
        ] })
      ]
    },
    id
  );
}
export {
  PageListItemEdit as default
};
//# sourceMappingURL=edit.mjs.map

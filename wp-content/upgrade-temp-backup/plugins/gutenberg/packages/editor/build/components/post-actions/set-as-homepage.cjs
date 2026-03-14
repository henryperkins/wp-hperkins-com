"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-actions/set-as-homepage.js
var set_as_homepage_exports = {};
__export(set_as_homepage_exports, {
  useSetAsHomepageAction: () => useSetAsHomepageAction
});
module.exports = __toCommonJS(set_as_homepage_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_notices = require("@wordpress/notices");
var import_get_item_title = require("../../utils/get-item-title.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var SetAsHomepageModal = ({ items, closeModal }) => {
  const [item] = items;
  const pageTitle = (0, import_get_item_title.getItemTitle)(item);
  const { showOnFront, currentHomePage, isSaving } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, isSavingEntityRecord } = select(import_core_data.store);
      const siteSettings = getEntityRecord("root", "site");
      const currentHomePageItem = getEntityRecord(
        "postType",
        "page",
        siteSettings?.page_on_front
      );
      return {
        showOnFront: siteSettings?.show_on_front,
        currentHomePage: currentHomePageItem,
        isSaving: isSavingEntityRecord("root", "site")
      };
    }
  );
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  async function onSetPageAsHomepage(event) {
    event.preventDefault();
    try {
      await saveEntityRecord("root", "site", {
        page_on_front: item.id,
        show_on_front: "page"
      });
      createSuccessNotice((0, import_i18n.__)("Homepage updated."), {
        type: "snackbar"
      });
    } catch (error) {
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("An error occurred while setting the homepage.");
      createErrorNotice(errorMessage, { type: "snackbar" });
    } finally {
      closeModal?.();
    }
  }
  let modalWarning = "";
  if ("posts" === showOnFront) {
    modalWarning = (0, import_i18n.__)(
      "This will replace the current homepage which is set to display latest posts."
    );
  } else if (currentHomePage) {
    modalWarning = (0, import_i18n.sprintf)(
      // translators: %s: title of the current home page.
      (0, import_i18n.__)('This will replace the current homepage: "%s"'),
      (0, import_get_item_title.getItemTitle)(currentHomePage)
    );
  }
  const modalText = (0, import_i18n.sprintf)(
    // translators: %1$s: title of the page to be set as the homepage, %2$s: homepage replacement warning message.
    (0, import_i18n.__)('Set "%1$s" as the site homepage? %2$s'),
    pageTitle,
    modalWarning
  ).trim();
  const modalButtonLabel = (0, import_i18n.__)("Set homepage");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: onSetPageAsHomepage, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: modalText }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "tertiary",
          onClick: () => {
            closeModal?.();
          },
          disabled: isSaving,
          accessibleWhenDisabled: true,
          children: (0, import_i18n.__)("Cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "primary",
          type: "submit",
          disabled: isSaving,
          accessibleWhenDisabled: true,
          children: modalButtonLabel
        }
      )
    ] })
  ] }) });
};
var useSetAsHomepageAction = () => {
  const { pageOnFront, pageForPosts } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, canUser } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site") : void 0;
    return {
      pageOnFront: siteSettings?.page_on_front,
      pageForPosts: siteSettings?.page_for_posts
    };
  });
  return (0, import_element.useMemo)(
    () => ({
      id: "set-as-homepage",
      label: (0, import_i18n.__)("Set as homepage"),
      isEligible(post) {
        if (post.status !== "publish") {
          return false;
        }
        if (post.type !== "page") {
          return false;
        }
        if (pageOnFront === post.id) {
          return false;
        }
        if (pageForPosts === post.id) {
          return false;
        }
        return true;
      },
      modalFocusOnMount: "firstContentElement",
      RenderModal: SetAsHomepageModal
    }),
    [pageForPosts, pageOnFront]
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSetAsHomepageAction
});
//# sourceMappingURL=set-as-homepage.cjs.map

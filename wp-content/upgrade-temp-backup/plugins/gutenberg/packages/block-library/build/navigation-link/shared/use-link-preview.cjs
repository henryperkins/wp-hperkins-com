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

// packages/block-library/src/navigation-link/shared/use-link-preview.js
var use_link_preview_exports = {};
__export(use_link_preview_exports, {
  computeBadges: () => computeBadges,
  computeDisplayUrl: () => computeDisplayUrl,
  useLinkPreview: () => useLinkPreview
});
module.exports = __toCommonJS(use_link_preview_exports);
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useRemoteUrlData, isHashLink, isRelativePath } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function computeDisplayUrl({ linkUrl, homeUrl } = {}) {
  if (!linkUrl) {
    return { displayUrl: "", isExternal: false };
  }
  let displayUrl = (0, import_url.safeDecodeURI)(linkUrl);
  let isExternal = false;
  if (isRelativePath(linkUrl) || isHashLink(linkUrl)) {
    return { displayUrl, isExternal: false };
  }
  try {
    const parsedUrl = new URL(linkUrl);
    const siteHost = new URL(homeUrl).host;
    if (parsedUrl.host === siteHost) {
      let path = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      if (path.endsWith("/") && path.length > 1) {
        path = path.slice(0, -1);
      }
      displayUrl = path;
    } else {
      isExternal = true;
    }
  } catch (e) {
    isExternal = true;
  }
  return { displayUrl, isExternal };
}
function computeBadges({
  url,
  type,
  isExternal,
  entityStatus,
  hasBinding,
  isEntityAvailable
}) {
  const badges = [];
  if (url) {
    if (isExternal) {
      badges.push({
        label: (0, import_i18n.__)("External link"),
        intent: "default"
      });
    } else if (isHashLink(url)) {
      badges.push({
        label: (0, import_i18n.__)("Internal link"),
        intent: "default"
      });
    } else if (type && type !== "custom") {
      badges.push({ label: capitalize(type), intent: "default" });
    } else {
      badges.push({
        label: (0, import_i18n.__)("Page"),
        intent: "default"
      });
    }
  }
  if (hasBinding && !isEntityAvailable) {
    badges.push({
      label: (0, import_i18n.sprintf)(
        /* translators: %s is the entity type (e.g., "page", "post", "category") */
        (0, import_i18n.__)("Missing %s"),
        type
      ),
      intent: "error"
    });
  } else if (!url) {
    badges.push({ label: (0, import_i18n.__)("No link selected"), intent: "error" });
  } else if (entityStatus) {
    const statusMap = {
      publish: { label: (0, import_i18n.__)("Published"), intent: "success" },
      future: { label: (0, import_i18n.__)("Scheduled"), intent: "warning" },
      draft: { label: (0, import_i18n.__)("Draft"), intent: "warning" },
      pending: { label: (0, import_i18n.__)("Pending"), intent: "warning" },
      private: { label: (0, import_i18n.__)("Private"), intent: "default" },
      trash: { label: (0, import_i18n.__)("Trash"), intent: "error" }
    };
    const badge = statusMap[entityStatus];
    if (badge) {
      badges.push(badge);
    }
  }
  return badges;
}
function useLinkPreview({
  url,
  entityRecord,
  type,
  hasBinding,
  isEntityAvailable
}) {
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord(
      "root",
      "__unstableBase"
    )?.home;
  }, []);
  const title = entityRecord?.title?.rendered || entityRecord?.title || entityRecord?.name;
  const { richData } = useRemoteUrlData(title ? null : url);
  const { displayUrl, isExternal } = computeDisplayUrl({
    linkUrl: url,
    homeUrl
  });
  const image = (0, import_data.useSelect)(
    (select) => {
      if (!entityRecord?.featured_media) {
        return null;
      }
      const { getEntityRecord } = select(import_core_data.store);
      const media = getEntityRecord(
        "postType",
        "attachment",
        entityRecord.featured_media
      );
      return media?.media_details?.sizes?.thumbnail?.source_url || media?.media_details?.sizes?.medium?.source_url || media?.source_url || null;
    },
    [entityRecord?.featured_media]
  );
  const badges = computeBadges({
    url,
    type,
    isExternal,
    entityStatus: entityRecord?.status,
    hasBinding,
    isEntityAvailable
  });
  const displayTitle = url ? title || richData?.title || (0, import_url.safeDecodeURI)(url) : (0, import_i18n.__)("Add link");
  return {
    title: displayTitle,
    url: displayUrl,
    image,
    badges
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeBadges,
  computeDisplayUrl,
  useLinkPreview
});
//# sourceMappingURL=use-link-preview.cjs.map

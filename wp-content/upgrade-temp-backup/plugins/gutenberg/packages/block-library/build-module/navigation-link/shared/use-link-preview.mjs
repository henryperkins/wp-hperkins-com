// packages/block-library/src/navigation-link/shared/use-link-preview.js
import { __, sprintf } from "@wordpress/i18n";
import { safeDecodeURI } from "@wordpress/url";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
var { useRemoteUrlData, isHashLink, isRelativePath } = unlock(
  blockEditorPrivateApis
);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function computeDisplayUrl({ linkUrl, homeUrl } = {}) {
  if (!linkUrl) {
    return { displayUrl: "", isExternal: false };
  }
  let displayUrl = safeDecodeURI(linkUrl);
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
        label: __("External link"),
        intent: "default"
      });
    } else if (isHashLink(url)) {
      badges.push({
        label: __("Internal link"),
        intent: "default"
      });
    } else if (type && type !== "custom") {
      badges.push({ label: capitalize(type), intent: "default" });
    } else {
      badges.push({
        label: __("Page"),
        intent: "default"
      });
    }
  }
  if (hasBinding && !isEntityAvailable) {
    badges.push({
      label: sprintf(
        /* translators: %s is the entity type (e.g., "page", "post", "category") */
        __("Missing %s"),
        type
      ),
      intent: "error"
    });
  } else if (!url) {
    badges.push({ label: __("No link selected"), intent: "error" });
  } else if (entityStatus) {
    const statusMap = {
      publish: { label: __("Published"), intent: "success" },
      future: { label: __("Scheduled"), intent: "warning" },
      draft: { label: __("Draft"), intent: "warning" },
      pending: { label: __("Pending"), intent: "warning" },
      private: { label: __("Private"), intent: "default" },
      trash: { label: __("Trash"), intent: "error" }
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
  const homeUrl = useSelect((select) => {
    return select(coreDataStore).getEntityRecord(
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
  const image = useSelect(
    (select) => {
      if (!entityRecord?.featured_media) {
        return null;
      }
      const { getEntityRecord } = select(coreDataStore);
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
  const displayTitle = url ? title || richData?.title || safeDecodeURI(url) : __("Add link");
  return {
    title: displayTitle,
    url: displayUrl,
    image,
    badges
  };
}
export {
  computeBadges,
  computeDisplayUrl,
  useLinkPreview
};
//# sourceMappingURL=use-link-preview.mjs.map

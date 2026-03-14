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

// packages/editor/src/components/media-categories/index.js
var media_categories_exports = {};
__export(media_categories_exports, {
  default: () => media_categories_default
});
module.exports = __toCommonJS(media_categories_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_core_data = require("@wordpress/core-data");
var getExternalLink = (url, text) => `<a ${getExternalLinkAttributes(url)}>${text}</a>`;
var getExternalLinkAttributes = (url) => `href="${url}" target="_blank" rel="noreferrer noopener"`;
var getOpenverseLicense = (license, licenseVersion) => {
  let licenseName = license.trim();
  if (license !== "pdm") {
    licenseName = license.toUpperCase().replace("SAMPLING", "Sampling");
  }
  if (licenseVersion) {
    licenseName += ` ${licenseVersion}`;
  }
  if (!["pdm", "cc0"].includes(license)) {
    licenseName = `CC ${licenseName}`;
  }
  return licenseName;
};
var getOpenverseCaption = (item) => {
  const {
    title,
    foreign_landing_url: foreignLandingUrl,
    creator,
    creator_url: creatorUrl,
    license,
    license_version: licenseVersion,
    license_url: licenseUrl
  } = item;
  const fullLicense = getOpenverseLicense(license, licenseVersion);
  const _creator = (0, import_html_entities.decodeEntities)(creator);
  let _caption;
  if (_creator) {
    _caption = title ? (0, import_i18n.sprintf)(
      // translators: %1s: Title of a media work from Openverse; %2$s: Name of the work's creator; %3s: Work's licence e.g: "CC0 1.0".
      (0, import_i18n._x)('"%1$s" by %2$s/ %3$s', "caption"),
      getExternalLink(
        foreignLandingUrl,
        (0, import_html_entities.decodeEntities)(title)
      ),
      creatorUrl ? getExternalLink(creatorUrl, _creator) : _creator,
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    ) : (0, import_i18n.sprintf)(
      // translators: %1s: Link attributes for a given Openverse media work; %2s: Name of the work's creator; %3s: Works's licence e.g: "CC0 1.0".
      (0, import_i18n._x)("<a %1$s>Work</a> by %2$s/ %3$s", "caption"),
      getExternalLinkAttributes(foreignLandingUrl),
      creatorUrl ? getExternalLink(creatorUrl, _creator) : _creator,
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    );
  } else {
    _caption = title ? (0, import_i18n.sprintf)(
      // translators: %1s: Title of a media work from Openverse; %2s: Work's licence e.g: "CC0 1.0".
      (0, import_i18n._x)('"%1$s"/ %2$s', "caption"),
      getExternalLink(
        foreignLandingUrl,
        (0, import_html_entities.decodeEntities)(title)
      ),
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    ) : (0, import_i18n.sprintf)(
      // translators: %1s: Link attributes for a given Openverse media work; %2s: Works's licence e.g: "CC0 1.0".
      (0, import_i18n._x)("<a %1$s>Work</a>/ %2$s", "caption"),
      getExternalLinkAttributes(foreignLandingUrl),
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    );
  }
  return _caption.replace(/\s{2}/g, " ");
};
var coreMediaFetch = async (query = {}) => {
  const mediaItems = await (0, import_data.resolveSelect)(import_core_data.store).getEntityRecords(
    "postType",
    "attachment",
    {
      ...query,
      orderBy: !!query?.search ? "relevance" : "date"
    }
  );
  return mediaItems.map((mediaItem) => ({
    ...mediaItem,
    alt: mediaItem.alt_text,
    url: mediaItem.source_url,
    previewUrl: mediaItem.media_details?.sizes?.medium?.source_url,
    caption: mediaItem.caption?.raw
  }));
};
var inserterMediaCategories = [
  {
    name: "images",
    labels: {
      name: (0, import_i18n.__)("Images"),
      search_items: (0, import_i18n.__)("Search images")
    },
    mediaType: "image",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "image" });
    }
  },
  {
    name: "videos",
    labels: {
      name: (0, import_i18n.__)("Videos"),
      search_items: (0, import_i18n.__)("Search videos")
    },
    mediaType: "video",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "video" });
    }
  },
  {
    name: "audio",
    labels: {
      name: (0, import_i18n.__)("Audio"),
      search_items: (0, import_i18n.__)("Search audio")
    },
    mediaType: "audio",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "audio" });
    }
  },
  {
    name: "openverse",
    labels: {
      name: (0, import_i18n.__)("Openverse"),
      search_items: (0, import_i18n.__)("Search Openverse")
    },
    mediaType: "image",
    async fetch(query = {}) {
      const defaultArgs = {
        mature: false,
        excluded_source: "flickr,inaturalist,wikimedia",
        license: "pdm,cc0"
      };
      const finalQuery = { ...query, ...defaultArgs };
      const mapFromInserterMediaRequest = {
        per_page: "page_size",
        search: "q"
      };
      const url = new URL("https://api.openverse.org/v1/images/");
      Object.entries(finalQuery).forEach(([key, value]) => {
        const queryKey = mapFromInserterMediaRequest[key] || key;
        url.searchParams.set(queryKey, value);
      });
      const response = await window.fetch(url, {
        headers: {
          "User-Agent": "WordPress/inserter-media-fetch"
        }
      });
      const jsonResponse = await response.json();
      const results = jsonResponse.results;
      return results.map((result) => ({
        ...result,
        // This is a temp solution for better titles, until Openverse API
        // completes the cleaning up of some titles of their upstream data.
        title: result.title?.toLowerCase().startsWith("file:") ? result.title.slice(5) : result.title,
        sourceId: result.id,
        id: void 0,
        caption: getOpenverseCaption(result),
        previewUrl: result.thumbnail
      }));
    },
    getReportUrl: ({ sourceId }) => `https://wordpress.org/openverse/image/${sourceId}/report/`,
    isExternalResource: true
  }
];
var media_categories_default = inserterMediaCategories;
//# sourceMappingURL=index.cjs.map

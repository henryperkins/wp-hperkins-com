// packages/editor/src/components/media-categories/index.js
import { __, sprintf, _x } from "@wordpress/i18n";
import { resolveSelect } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { store as coreStore } from "@wordpress/core-data";
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
  const _creator = decodeEntities(creator);
  let _caption;
  if (_creator) {
    _caption = title ? sprintf(
      // translators: %1s: Title of a media work from Openverse; %2$s: Name of the work's creator; %3s: Work's licence e.g: "CC0 1.0".
      _x('"%1$s" by %2$s/ %3$s', "caption"),
      getExternalLink(
        foreignLandingUrl,
        decodeEntities(title)
      ),
      creatorUrl ? getExternalLink(creatorUrl, _creator) : _creator,
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    ) : sprintf(
      // translators: %1s: Link attributes for a given Openverse media work; %2s: Name of the work's creator; %3s: Works's licence e.g: "CC0 1.0".
      _x("<a %1$s>Work</a> by %2$s/ %3$s", "caption"),
      getExternalLinkAttributes(foreignLandingUrl),
      creatorUrl ? getExternalLink(creatorUrl, _creator) : _creator,
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    );
  } else {
    _caption = title ? sprintf(
      // translators: %1s: Title of a media work from Openverse; %2s: Work's licence e.g: "CC0 1.0".
      _x('"%1$s"/ %2$s', "caption"),
      getExternalLink(
        foreignLandingUrl,
        decodeEntities(title)
      ),
      licenseUrl ? getExternalLink(
        `${licenseUrl}?ref=openverse`,
        fullLicense
      ) : fullLicense
    ) : sprintf(
      // translators: %1s: Link attributes for a given Openverse media work; %2s: Works's licence e.g: "CC0 1.0".
      _x("<a %1$s>Work</a>/ %2$s", "caption"),
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
  const mediaItems = await resolveSelect(coreStore).getEntityRecords(
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
      name: __("Images"),
      search_items: __("Search images")
    },
    mediaType: "image",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "image" });
    }
  },
  {
    name: "videos",
    labels: {
      name: __("Videos"),
      search_items: __("Search videos")
    },
    mediaType: "video",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "video" });
    }
  },
  {
    name: "audio",
    labels: {
      name: __("Audio"),
      search_items: __("Search audio")
    },
    mediaType: "audio",
    async fetch(query = {}) {
      return coreMediaFetch({ ...query, media_type: "audio" });
    }
  },
  {
    name: "openverse",
    labels: {
      name: __("Openverse"),
      search_items: __("Search Openverse")
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
export {
  media_categories_default as default
};
//# sourceMappingURL=index.mjs.map

// packages/block-library/src/cover/embed-video-utils.js
import { getBlockVariations } from "@wordpress/blocks";
import { matchesPatterns } from "../embed/util.mjs";
var DEFAULT_EMBED_BLOCK = "core/embed";
var VIDEO_PROVIDERS = [
  "youtube",
  "vimeo",
  "videopress",
  "animoto",
  "tiktok",
  "wordpress-tv"
];
function isValidVideoEmbedUrl(url) {
  if (!url) {
    return false;
  }
  const embedBlock = findVideoEmbedProvider(url);
  return embedBlock !== null;
}
function getVideoEmbedProvider(url) {
  const embedBlock = findVideoEmbedProvider(url);
  return embedBlock ? embedBlock.name : null;
}
function findVideoEmbedProvider(url) {
  const embedVariations = getBlockVariations(DEFAULT_EMBED_BLOCK);
  if (!embedVariations) {
    return null;
  }
  const matchingVariation = embedVariations.find(
    ({ patterns }) => matchesPatterns(url, patterns)
  );
  if (!matchingVariation || !VIDEO_PROVIDERS.includes(matchingVariation.name)) {
    return null;
  }
  return matchingVariation;
}
function getIframeSrc(html) {
  if (!html) {
    return null;
  }
  const srcMatch = html.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : null;
}
function detectProviderFromSrc(src) {
  if (!src) {
    return null;
  }
  const lowerSrc = src.toLowerCase();
  if (lowerSrc.includes("youtube.com") || lowerSrc.includes("youtu.be")) {
    return "youtube";
  }
  if (lowerSrc.includes("vimeo.com")) {
    return "vimeo";
  }
  if (lowerSrc.includes("videopress.com")) {
    return "videopress";
  }
  if (lowerSrc.includes("animoto.com")) {
    return "animoto";
  }
  if (lowerSrc.includes("tiktok.com")) {
    return "tiktok";
  }
  if (lowerSrc.includes("wordpress.tv")) {
    return "wordpress-tv";
  }
  return null;
}
function getBackgroundVideoSrc(src) {
  if (!src) {
    return src;
  }
  try {
    const url = new URL(src);
    const provider = detectProviderFromSrc(src);
    switch (provider) {
      case "youtube":
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("mute", "1");
        url.searchParams.set("loop", "1");
        url.searchParams.set("controls", "0");
        url.searchParams.set("showinfo", "0");
        url.searchParams.set("modestbranding", "1");
        url.searchParams.set("playsinline", "1");
        url.searchParams.set("rel", "0");
        const videoId = url.pathname.split("/").pop();
        if (videoId) {
          url.searchParams.set("playlist", videoId);
        }
        break;
      case "vimeo":
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("muted", "1");
        url.searchParams.set("loop", "1");
        url.searchParams.set("background", "1");
        url.searchParams.set("controls", "0");
        break;
      case "videopress":
      case "wordpress-tv":
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("loop", "1");
        url.searchParams.set("muted", "1");
        break;
      default:
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("muted", "1");
        url.searchParams.set("loop", "1");
        break;
    }
    return url.toString();
  } catch (error) {
    return src;
  }
}
export {
  detectProviderFromSrc,
  getBackgroundVideoSrc,
  getIframeSrc,
  getVideoEmbedProvider,
  isValidVideoEmbedUrl
};
//# sourceMappingURL=embed-video-utils.mjs.map

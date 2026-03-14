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

// packages/format-library/src/link/utils.js
var utils_exports = {};
__export(utils_exports, {
  createLinkFormat: () => createLinkFormat,
  getFormatBoundary: () => getFormatBoundary,
  isValidHref: () => isValidHref
});
module.exports = __toCommonJS(utils_exports);
var import_url = require("@wordpress/url");
function isValidHref(href) {
  if (!href) {
    return false;
  }
  const trimmedHref = href.trim();
  if (!trimmedHref) {
    return false;
  }
  if (/^\S+:/.test(trimmedHref)) {
    const protocol = (0, import_url.getProtocol)(trimmedHref);
    if (!(0, import_url.isValidProtocol)(protocol)) {
      return false;
    }
    if (protocol.startsWith("http") && !/^https?:\/\/[^\/\s]/i.test(trimmedHref)) {
      return false;
    }
    const authority = (0, import_url.getAuthority)(trimmedHref);
    if (!(0, import_url.isValidAuthority)(authority)) {
      return false;
    }
    const path = (0, import_url.getPath)(trimmedHref);
    if (path && !(0, import_url.isValidPath)(path)) {
      return false;
    }
    const queryString = (0, import_url.getQueryString)(trimmedHref);
    if (queryString && !(0, import_url.isValidQueryString)(queryString)) {
      return false;
    }
    const fragment = (0, import_url.getFragment)(trimmedHref);
    if (fragment && !(0, import_url.isValidFragment)(fragment)) {
      return false;
    }
  }
  if (trimmedHref.startsWith("#") && !(0, import_url.isValidFragment)(trimmedHref)) {
    return false;
  }
  return true;
}
function createLinkFormat({
  url,
  type,
  id,
  opensInNewWindow,
  nofollow,
  cssClasses
}) {
  const format = {
    type: "core/link",
    attributes: {
      url
    }
  };
  if (type) {
    format.attributes.type = type;
  }
  if (id) {
    format.attributes.id = id;
  }
  if (opensInNewWindow) {
    format.attributes.target = "_blank";
    format.attributes.rel = format.attributes.rel ? format.attributes.rel + " noreferrer noopener" : "noreferrer noopener";
  }
  if (nofollow) {
    format.attributes.rel = format.attributes.rel ? format.attributes.rel + " nofollow" : "nofollow";
  }
  const trimmedCssClasses = cssClasses?.trim();
  if (trimmedCssClasses?.length) {
    format.attributes.class = trimmedCssClasses;
  }
  return format;
}
function getFormatBoundary(value, format, startIndex = value.start, endIndex = value.end) {
  const EMPTY_BOUNDARIES = {
    start: void 0,
    end: void 0
  };
  const { formats } = value;
  let targetFormat;
  let initialIndex;
  if (!formats?.length) {
    return EMPTY_BOUNDARIES;
  }
  const newFormats = formats.slice();
  const formatAtStart = newFormats[startIndex]?.find(
    ({ type }) => type === format.type
  );
  const formatAtEnd = newFormats[endIndex]?.find(
    ({ type }) => type === format.type
  );
  const formatAtEndMinusOne = newFormats[endIndex - 1]?.find(
    ({ type }) => type === format.type
  );
  if (!!formatAtStart) {
    targetFormat = formatAtStart;
    initialIndex = startIndex;
  } else if (!!formatAtEnd) {
    targetFormat = formatAtEnd;
    initialIndex = endIndex;
  } else if (!!formatAtEndMinusOne) {
    targetFormat = formatAtEndMinusOne;
    initialIndex = endIndex - 1;
  } else {
    return EMPTY_BOUNDARIES;
  }
  const index = newFormats[initialIndex].indexOf(targetFormat);
  const walkingArgs = [newFormats, initialIndex, targetFormat, index];
  startIndex = walkToStart(...walkingArgs);
  endIndex = walkToEnd(...walkingArgs);
  startIndex = startIndex < 0 ? 0 : startIndex;
  return {
    start: startIndex,
    end: endIndex + 1
  };
}
function walkToBoundary(formats, initialIndex, targetFormatRef, formatIndex, direction) {
  let index = initialIndex;
  const directions = {
    forwards: 1,
    backwards: -1
  };
  const directionIncrement = directions[direction] || 1;
  const inverseDirectionIncrement = directionIncrement * -1;
  while (formats[index] && formats[index][formatIndex] === targetFormatRef) {
    index = index + directionIncrement;
  }
  index = index + inverseDirectionIncrement;
  return index;
}
var partialRight = (fn, ...partialArgs) => (...args) => fn(...args, ...partialArgs);
var walkToStart = partialRight(walkToBoundary, "backwards");
var walkToEnd = partialRight(walkToBoundary, "forwards");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLinkFormat,
  getFormatBoundary,
  isValidHref
});
//# sourceMappingURL=utils.cjs.map

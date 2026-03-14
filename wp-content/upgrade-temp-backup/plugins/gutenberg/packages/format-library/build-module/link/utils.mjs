// packages/format-library/src/link/utils.js
import {
  getProtocol,
  isValidProtocol,
  getAuthority,
  isValidAuthority,
  getPath,
  isValidPath,
  getQueryString,
  isValidQueryString,
  getFragment,
  isValidFragment
} from "@wordpress/url";
function isValidHref(href) {
  if (!href) {
    return false;
  }
  const trimmedHref = href.trim();
  if (!trimmedHref) {
    return false;
  }
  if (/^\S+:/.test(trimmedHref)) {
    const protocol = getProtocol(trimmedHref);
    if (!isValidProtocol(protocol)) {
      return false;
    }
    if (protocol.startsWith("http") && !/^https?:\/\/[^\/\s]/i.test(trimmedHref)) {
      return false;
    }
    const authority = getAuthority(trimmedHref);
    if (!isValidAuthority(authority)) {
      return false;
    }
    const path = getPath(trimmedHref);
    if (path && !isValidPath(path)) {
      return false;
    }
    const queryString = getQueryString(trimmedHref);
    if (queryString && !isValidQueryString(queryString)) {
      return false;
    }
    const fragment = getFragment(trimmedHref);
    if (fragment && !isValidFragment(fragment)) {
      return false;
    }
  }
  if (trimmedHref.startsWith("#") && !isValidFragment(trimmedHref)) {
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
export {
  createLinkFormat,
  getFormatBoundary,
  isValidHref
};
//# sourceMappingURL=utils.mjs.map

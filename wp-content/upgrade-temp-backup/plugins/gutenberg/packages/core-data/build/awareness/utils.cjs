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

// packages/core-data/src/awareness/utils.ts
var utils_exports = {};
__export(utils_exports, {
  areCollaboratorInfosEqual: () => areCollaboratorInfosEqual,
  areMapsEqual: () => areMapsEqual,
  generateCollaboratorInfo: () => generateCollaboratorInfo,
  getRecordValue: () => getRecordValue,
  getTypedKeys: () => getTypedKeys
});
module.exports = __toCommonJS(utils_exports);
function getBrowserName() {
  const userAgent = window.navigator.userAgent;
  let browserName = "Unknown";
  if (userAgent.includes("Firefox")) {
    browserName = "Firefox";
  } else if (userAgent.includes("Edg")) {
    browserName = "Microsoft Edge";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browserName = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browserName = "Safari";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browserName = "Internet Explorer";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browserName = "Opera";
  }
  return browserName;
}
function areMapsEqual(map1, map2, comparatorFn) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value1] of map1.entries()) {
    if (!map2.has(key)) {
      return false;
    }
    if (!comparatorFn(value1, map2.get(key))) {
      return false;
    }
  }
  return true;
}
function areCollaboratorInfosEqual(collaboratorInfo1, collaboratorInfo2) {
  if (!collaboratorInfo1 || !collaboratorInfo2) {
    return collaboratorInfo1 === collaboratorInfo2;
  }
  if (Object.keys(collaboratorInfo1).length !== Object.keys(collaboratorInfo2).length) {
    return false;
  }
  return Object.entries(collaboratorInfo1).every(([key, value]) => {
    return value === collaboratorInfo2[key];
  });
}
function generateCollaboratorInfo(currentCollaborator) {
  const { avatar_urls, id, name, slug } = currentCollaborator;
  return {
    avatar_urls,
    // eslint-disable-line camelcase
    browserType: getBrowserName(),
    enteredAt: Date.now(),
    id,
    name,
    slug
  };
}
function getRecordValue(obj, key) {
  if ("object" === typeof obj && null !== obj && key in obj) {
    return obj[key];
  }
  return null;
}
function getTypedKeys(obj) {
  return Object.keys(obj);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  areCollaboratorInfosEqual,
  areMapsEqual,
  generateCollaboratorInfo,
  getRecordValue,
  getTypedKeys
});
//# sourceMappingURL=utils.cjs.map

// packages/core-data/src/awareness/utils.ts
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
export {
  areCollaboratorInfosEqual,
  areMapsEqual,
  generateCollaboratorInfo,
  getRecordValue,
  getTypedKeys
};
//# sourceMappingURL=utils.mjs.map

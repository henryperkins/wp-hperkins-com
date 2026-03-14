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

// packages/dataviews/src/hooks/use-data.ts
var use_data_exports = {};
__export(use_data_exports, {
  default: () => useData
});
module.exports = __toCommonJS(use_data_exports);
var import_element = require("@wordpress/element");
function useData(data, isLoading, paginationInfo) {
  const previousDataRef = (0, import_element.useRef)(data);
  const previousPaginationInfoRef = (0, import_element.useRef)(paginationInfo);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = (0, import_element.useState)(
    !isLoading
  );
  (0, import_element.useEffect)(() => {
    if (!isLoading) {
      previousDataRef.current = data;
      previousPaginationInfoRef.current = paginationInfo;
      setHasInitiallyLoaded(true);
    }
  }, [data, isLoading, paginationInfo]);
  return {
    data: isLoading && previousDataRef.current?.length ? previousDataRef.current : data,
    paginationInfo: isLoading && previousDataRef.current?.length ? previousPaginationInfoRef.current : paginationInfo,
    hasInitiallyLoaded
  };
}
//# sourceMappingURL=use-data.cjs.map

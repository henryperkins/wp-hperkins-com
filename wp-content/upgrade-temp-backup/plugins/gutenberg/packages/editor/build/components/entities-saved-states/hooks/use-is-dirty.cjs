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

// packages/editor/src/components/entities-saved-states/hooks/use-is-dirty.js
var use_is_dirty_exports = {};
__export(use_is_dirty_exports, {
  useIsDirty: () => useIsDirty
});
module.exports = __toCommonJS(use_is_dirty_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var useIsDirty = () => {
  const { editedEntities, siteEdits, siteEntityConfig } = (0, import_data.useSelect)(
    (select) => {
      const {
        __experimentalGetDirtyEntityRecords,
        getEntityRecordEdits,
        getEntityConfig
      } = select(import_core_data.store);
      return {
        editedEntities: __experimentalGetDirtyEntityRecords(),
        siteEdits: getEntityRecordEdits("root", "site"),
        siteEntityConfig: getEntityConfig("root", "site")
      };
    },
    []
  );
  const dirtyEntityRecords = (0, import_element.useMemo)(() => {
    const editedEntitiesWithoutSite = editedEntities.filter(
      (record) => !(record.kind === "root" && record.name === "site")
    );
    const siteEntityLabels = siteEntityConfig?.meta?.labels ?? {};
    const {
      site_logo: siteLogoEdit,
      site_icon: siteIconEdit,
      ...otherSiteEdits
    } = siteEdits ?? {};
    const orderedSiteProperties = [
      siteLogoEdit !== void 0 && "site_logo",
      siteIconEdit !== void 0 && "site_icon",
      ...Object.keys(otherSiteEdits)
    ].filter(Boolean);
    const editedSiteEntities = orderedSiteProperties.map(
      (property) => ({
        kind: "root",
        name: "site",
        title: siteEntityLabels[property] || property,
        property
      })
    );
    return [...editedEntitiesWithoutSite, ...editedSiteEntities];
  }, [editedEntities, siteEdits, siteEntityConfig]);
  const [unselectedEntities, _setUnselectedEntities] = (0, import_element.useState)([]);
  const setUnselectedEntities = ({ kind, name, key, property }, checked) => {
    if (checked) {
      _setUnselectedEntities(
        unselectedEntities.filter(
          (elt) => elt.kind !== kind || elt.name !== name || elt.key !== key || elt.property !== property
        )
      );
    } else {
      _setUnselectedEntities([
        ...unselectedEntities,
        { kind, name, key, property }
      ]);
    }
  };
  const isDirty = dirtyEntityRecords.length - unselectedEntities.length > 0;
  return {
    dirtyEntityRecords,
    isDirty,
    setUnselectedEntities,
    unselectedEntities
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsDirty
});
//# sourceMappingURL=use-is-dirty.cjs.map

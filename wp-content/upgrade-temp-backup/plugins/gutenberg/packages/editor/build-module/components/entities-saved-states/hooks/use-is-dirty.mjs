// packages/editor/src/components/entities-saved-states/hooks/use-is-dirty.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useMemo, useState } from "@wordpress/element";
var useIsDirty = () => {
  const { editedEntities, siteEdits, siteEntityConfig } = useSelect(
    (select) => {
      const {
        __experimentalGetDirtyEntityRecords,
        getEntityRecordEdits,
        getEntityConfig
      } = select(coreStore);
      return {
        editedEntities: __experimentalGetDirtyEntityRecords(),
        siteEdits: getEntityRecordEdits("root", "site"),
        siteEntityConfig: getEntityConfig("root", "site")
      };
    },
    []
  );
  const dirtyEntityRecords = useMemo(() => {
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
  const [unselectedEntities, _setUnselectedEntities] = useState([]);
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
export {
  useIsDirty
};
//# sourceMappingURL=use-is-dirty.mjs.map

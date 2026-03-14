// packages/editor/src/components/entities-saved-states/entity-type-list.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { PanelBody, PanelRow } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { getGlobalStylesChanges } from "@wordpress/global-styles-engine";
import EntityRecordItem from "./entity-record-item.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getEntityDescription(entity, count) {
  switch (entity) {
    case "site":
      return 1 === count ? __("This change will affect your whole site.") : __("These changes will affect your whole site.");
    case "wp_template":
      return __(
        "This change will affect other parts of your site that use this template."
      );
    case "page":
    case "post":
      return __("The following has been modified.");
  }
}
function GlobalStylesDescription({ record }) {
  const { editedRecord, savedRecord } = useSelect(
    (select) => {
      const { getEditedEntityRecord, getEntityRecord } = select(coreStore);
      return {
        editedRecord: getEditedEntityRecord(
          record.kind,
          record.name,
          record.key
        ),
        savedRecord: getEntityRecord(
          record.kind,
          record.name,
          record.key
        )
      };
    },
    [record.kind, record.name, record.key]
  );
  const globalStylesChanges = getGlobalStylesChanges(
    editedRecord,
    savedRecord,
    {
      maxResults: 10
    }
  );
  return globalStylesChanges.length ? /* @__PURE__ */ jsx("ul", { className: "entities-saved-states__changes", children: globalStylesChanges.map((change) => /* @__PURE__ */ jsx("li", { children: change }, change)) }) : null;
}
function EntityDescription({ record, count }) {
  if ("globalStyles" === record?.name) {
    return null;
  }
  const description = getEntityDescription(record?.name, count);
  return description ? /* @__PURE__ */ jsx(PanelRow, { children: description }) : null;
}
function EntityTypeList({
  list,
  unselectedEntities,
  setUnselectedEntities
}) {
  const count = list.length;
  const firstRecord = list[0];
  const entityConfig = useSelect(
    (select) => select(coreStore).getEntityConfig(
      firstRecord.kind,
      firstRecord.name
    ),
    [firstRecord.kind, firstRecord.name]
  );
  let entityLabel = entityConfig.label;
  if (firstRecord?.name === "wp_template_part") {
    entityLabel = 1 === count ? __("Template Part") : __("Template Parts");
  }
  return /* @__PURE__ */ jsxs(
    PanelBody,
    {
      title: entityLabel,
      initialOpen: true,
      className: "entities-saved-states__panel-body",
      children: [
        /* @__PURE__ */ jsx(EntityDescription, { record: firstRecord, count }),
        list.map((record) => {
          return /* @__PURE__ */ jsx(
            EntityRecordItem,
            {
              record,
              checked: !unselectedEntities.some(
                (elt) => elt.kind === record.kind && elt.name === record.name && elt.key === record.key && elt.property === record.property
              ),
              onChange: (value) => setUnselectedEntities(record, value)
            },
            record.key || record.property
          );
        }),
        "globalStyles" === firstRecord?.name && /* @__PURE__ */ jsx(GlobalStylesDescription, { record: firstRecord })
      ]
    }
  );
}
export {
  EntityTypeList as default
};
//# sourceMappingURL=entity-type-list.mjs.map

// packages/editor/src/components/entities-saved-states/entity-record-item.js
import { CheckboxControl, PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { getTemplateInfo } from "../../utils/get-template-info.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function EntityRecordItem({ record, checked, onChange }) {
  const { name, kind, title, key } = record;
  const { entityRecordTitle, hasPostMetaChanges } = useSelect(
    (select) => {
      if ("postType" !== kind || "wp_template" !== name) {
        return {
          entityRecordTitle: title,
          hasPostMetaChanges: unlock(
            select(editorStore)
          ).hasPostMetaChanges(name, key)
        };
      }
      const template = select(coreStore).getEditedEntityRecord(
        kind,
        name,
        key
      );
      const { default_template_types: templateTypes = [] } = select(coreStore).getCurrentTheme() ?? {};
      return {
        entityRecordTitle: getTemplateInfo({
          template,
          templateTypes
        }).title,
        hasPostMetaChanges: unlock(
          select(editorStore)
        ).hasPostMetaChanges(name, key)
      };
    },
    [name, kind, title, key]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PanelRow, { children: /* @__PURE__ */ jsx(
      CheckboxControl,
      {
        label: decodeEntities(entityRecordTitle) || __("Untitled"),
        checked,
        onChange,
        className: "entities-saved-states__change-control"
      }
    ) }),
    hasPostMetaChanges && /* @__PURE__ */ jsx("ul", { className: "entities-saved-states__changes", children: /* @__PURE__ */ jsx("li", { children: __("Post Meta.") }) })
  ] });
}
export {
  EntityRecordItem as default
};
//# sourceMappingURL=entity-record-item.mjs.map

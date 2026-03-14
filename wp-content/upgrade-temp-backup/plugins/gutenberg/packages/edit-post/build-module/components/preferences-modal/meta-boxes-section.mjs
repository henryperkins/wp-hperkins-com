// packages/edit-post/src/components/preferences-modal/meta-boxes-section.js
import { __ } from "@wordpress/i18n";
import { withSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { privateApis as preferencesPrivateApis } from "@wordpress/preferences";
import EnableCustomFieldsOption from "./enable-custom-fields.mjs";
import EnablePanelOption from "./enable-panel.mjs";
import { store as editPostStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { PreferencesModalSection } = unlock(preferencesPrivateApis);
function MetaBoxesSection({
  areCustomFieldsRegistered,
  metaBoxes,
  ...sectionProps
}) {
  const thirdPartyMetaBoxes = metaBoxes.filter(
    ({ id }) => id !== "postcustom"
  );
  if (!areCustomFieldsRegistered && thirdPartyMetaBoxes.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(PreferencesModalSection, { ...sectionProps, children: [
    areCustomFieldsRegistered && /* @__PURE__ */ jsx(EnableCustomFieldsOption, { label: __("Custom fields") }),
    thirdPartyMetaBoxes.map(({ id, title }) => /* @__PURE__ */ jsx(
      EnablePanelOption,
      {
        label: title,
        panelName: `meta-box-${id}`
      },
      id
    ))
  ] });
}
var meta_boxes_section_default = withSelect((select) => {
  const { getEditorSettings } = select(editorStore);
  const { getAllMetaBoxes } = select(editPostStore);
  return {
    // This setting should not live in the block editor's store.
    areCustomFieldsRegistered: getEditorSettings().enableCustomFields !== void 0,
    metaBoxes: getAllMetaBoxes()
  };
})(MetaBoxesSection);
export {
  MetaBoxesSection,
  meta_boxes_section_default as default
};
//# sourceMappingURL=meta-boxes-section.mjs.map

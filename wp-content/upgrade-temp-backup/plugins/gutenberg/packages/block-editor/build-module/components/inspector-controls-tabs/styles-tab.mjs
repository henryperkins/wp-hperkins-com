// packages/block-editor/src/components/inspector-controls-tabs/styles-tab.js
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import BlockStyles from "../block-styles/index.mjs";
import InspectorControls from "../inspector-controls/index.mjs";
import { useBorderPanelLabel } from "../../hooks/border.mjs";
import { useBlockSettings } from "../../hooks/utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { ColorEdit } from "../../hooks/color.mjs";
import { ColorToolsPanel } from "../global-styles/color-panel.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SectionBlockColorControls({
  blockName,
  clientId,
  contentClientIds
}) {
  const settings = useBlockSettings(blockName);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const { hasButtons, hasHeading } = useSelect(
    (select) => {
      const blockNames = select(blockEditorStore).getBlockNamesByClientId(
        contentClientIds
      );
      return {
        hasButtons: blockNames.includes("core/buttons"),
        hasHeading: blockNames.includes("core/heading")
      };
    },
    [contentClientIds]
  );
  const setAttributes = (newAttributes) => {
    updateBlockAttributes(clientId, newAttributes);
  };
  return /* @__PURE__ */ jsx(
    ColorEdit,
    {
      clientId,
      name: blockName,
      settings,
      setAttributes,
      asWrapper: ColorToolsPanel,
      label: __("Color"),
      defaultControls: {
        text: true,
        background: true,
        button: hasButtons,
        heading: hasHeading
      }
    }
  );
}
var StylesTab = ({
  blockName,
  clientId,
  hasBlockStyles,
  isSectionBlock,
  contentClientIds
}) => {
  const borderPanelLabel = useBorderPanelLabel({ blockName });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hasBlockStyles && /* @__PURE__ */ jsx(BlockStyles, { clientId }),
    isSectionBlock && /* @__PURE__ */ jsx(
      SectionBlockColorControls,
      {
        blockName,
        clientId,
        contentClientIds
      }
    ),
    !isSectionBlock && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        InspectorControls.Slot,
        {
          group: "color",
          label: __("Color"),
          className: "color-block-support-panel__inner-wrapper"
        }
      ),
      /* @__PURE__ */ jsx(
        InspectorControls.Slot,
        {
          group: "background",
          label: __("Background image")
        }
      ),
      /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "filter" }),
      /* @__PURE__ */ jsx(
        InspectorControls.Slot,
        {
          group: "typography",
          label: __("Typography")
        }
      ),
      /* @__PURE__ */ jsx(
        InspectorControls.Slot,
        {
          group: "dimensions",
          label: __("Dimensions")
        }
      ),
      /* @__PURE__ */ jsx(
        InspectorControls.Slot,
        {
          group: "border",
          label: borderPanelLabel
        }
      ),
      /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "styles" })
    ] })
  ] });
};
var styles_tab_default = StylesTab;
export {
  styles_tab_default as default
};
//# sourceMappingURL=styles-tab.mjs.map

// packages/block-editor/src/components/inspector-controls-tabs/use-inspector-controls-tabs.js
import { __experimentalUseSlotFills as useSlotFills } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import InspectorControlsGroups from "../inspector-controls/groups.mjs";
import { InspectorAdvancedControls } from "../inspector-controls/index.mjs";
import { TAB_LIST_VIEW, TAB_SETTINGS, TAB_STYLES, TAB_CONTENT } from "./utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
var EMPTY_ARRAY = [];
function getShowTabs(blockName, tabSettings = {}) {
  if (tabSettings[blockName] !== void 0) {
    return tabSettings[blockName];
  }
  if (tabSettings.default !== void 0) {
    return tabSettings.default;
  }
  return true;
}
function useInspectorControlsTabs(blockName, contentClientIds, isSectionBlock, hasBlockStyles) {
  const tabs = [];
  const {
    bindings: bindingsGroup,
    border: borderGroup,
    color: colorGroup,
    content: contentGroup,
    default: defaultGroup,
    dimensions: dimensionsGroup,
    list: listGroup,
    position: positionGroup,
    styles: stylesGroup,
    typography: typographyGroup,
    effects: effectsGroup
  } = InspectorControlsGroups;
  const listFills = useSlotFills(listGroup.name);
  const hasListFills = !!listFills && listFills.length;
  const contentFills = useSlotFills(contentGroup.name);
  const hasContentFills = !!contentFills && contentFills.length;
  const styleFills = [
    ...useSlotFills(borderGroup.name) || [],
    ...useSlotFills(colorGroup.name) || [],
    ...useSlotFills(dimensionsGroup.name) || [],
    ...useSlotFills(stylesGroup.name) || [],
    ...useSlotFills(typographyGroup.name) || [],
    ...useSlotFills(effectsGroup.name) || []
  ];
  const hasStyleFills = styleFills.length;
  const advancedFills = [
    ...useSlotFills(InspectorAdvancedControls.slotName) || [],
    ...useSlotFills(bindingsGroup.name) || []
  ];
  const settingsFills = [
    ...useSlotFills(defaultGroup.name) || [],
    ...useSlotFills(positionGroup.name) || [],
    ...hasListFills && hasStyleFills > 1 ? advancedFills : []
  ];
  const shouldShowBlockFields = window?.__experimentalContentOnlyInspectorFields;
  const hasContentTab = hasContentFills || !shouldShowBlockFields && contentClientIds?.length;
  if (hasContentTab) {
    tabs.push(TAB_CONTENT);
  }
  if (hasListFills) {
    tabs.push(TAB_LIST_VIEW);
  }
  if (settingsFills.length || // Advanced fills show up in settings tab if available or they blend into the default tab, if there's only one tab.
  advancedFills.length && (hasContentTab || hasListFills)) {
    tabs.push(TAB_SETTINGS);
  }
  if (hasBlockStyles || hasStyleFills) {
    tabs.push(TAB_STYLES);
  }
  const tabSettings = useSelect((select) => {
    return select(blockEditorStore).getSettings().blockInspectorTabs;
  }, []);
  const showTabs = getShowTabs(blockName, tabSettings);
  return showTabs ? tabs : EMPTY_ARRAY;
}
export {
  useInspectorControlsTabs as default
};
//# sourceMappingURL=use-inspector-controls-tabs.mjs.map

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/inspector-controls-tabs/use-inspector-controls-tabs.js
var use_inspector_controls_tabs_exports = {};
__export(use_inspector_controls_tabs_exports, {
  default: () => useInspectorControlsTabs
});
module.exports = __toCommonJS(use_inspector_controls_tabs_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_groups = __toESM(require("../inspector-controls/groups.cjs"));
var import_inspector_controls = require("../inspector-controls/index.cjs");
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
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
  } = import_groups.default;
  const listFills = (0, import_components.__experimentalUseSlotFills)(listGroup.name);
  const hasListFills = !!listFills && listFills.length;
  const contentFills = (0, import_components.__experimentalUseSlotFills)(contentGroup.name);
  const hasContentFills = !!contentFills && contentFills.length;
  const styleFills = [
    ...(0, import_components.__experimentalUseSlotFills)(borderGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(colorGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(dimensionsGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(stylesGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(typographyGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(effectsGroup.name) || []
  ];
  const hasStyleFills = styleFills.length;
  const advancedFills = [
    ...(0, import_components.__experimentalUseSlotFills)(import_inspector_controls.InspectorAdvancedControls.slotName) || [],
    ...(0, import_components.__experimentalUseSlotFills)(bindingsGroup.name) || []
  ];
  const settingsFills = [
    ...(0, import_components.__experimentalUseSlotFills)(defaultGroup.name) || [],
    ...(0, import_components.__experimentalUseSlotFills)(positionGroup.name) || [],
    ...hasListFills && hasStyleFills > 1 ? advancedFills : []
  ];
  const shouldShowBlockFields = window?.__experimentalContentOnlyInspectorFields;
  const hasContentTab = hasContentFills || !shouldShowBlockFields && contentClientIds?.length;
  if (hasContentTab) {
    tabs.push(import_utils.TAB_CONTENT);
  }
  if (hasListFills) {
    tabs.push(import_utils.TAB_LIST_VIEW);
  }
  if (settingsFills.length || // Advanced fills show up in settings tab if available or they blend into the default tab, if there's only one tab.
  advancedFills.length && (hasContentTab || hasListFills)) {
    tabs.push(import_utils.TAB_SETTINGS);
  }
  if (hasBlockStyles || hasStyleFills) {
    tabs.push(import_utils.TAB_STYLES);
  }
  const tabSettings = (0, import_data.useSelect)((select) => {
    return select(import_store.store).getSettings().blockInspectorTabs;
  }, []);
  const showTabs = getShowTabs(blockName, tabSettings);
  return showTabs ? tabs : EMPTY_ARRAY;
}
//# sourceMappingURL=use-inspector-controls-tabs.cjs.map

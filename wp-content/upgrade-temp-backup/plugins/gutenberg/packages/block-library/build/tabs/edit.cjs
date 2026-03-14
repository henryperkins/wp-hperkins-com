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

// packages/block-library/src/tabs/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_controls = __toESM(require("./controls.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var TABS_TEMPLATE = [
  [
    "core/tabs-menu",
    {
      lock: {
        remove: true
      }
    }
  ],
  [
    "core/tab-panel",
    {
      lock: {
        remove: true
      }
    },
    [
      [
        "core/tab",
        {
          anchor: "tab-1",
          label: "Tab 1"
        },
        [["core/paragraph"]]
      ]
    ]
  ]
];
function Edit({
  clientId,
  attributes,
  setAttributes,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const { anchor, activeTabIndex, editorActiveTabIndex } = attributes;
  (0, import_element.useEffect)(() => {
    if (editorActiveTabIndex === void 0) {
      setAttributes({ editorActiveTabIndex: activeTabIndex });
    }
  }, []);
  const tabs = (0, import_data.useSelect)(
    (select) => {
      const { getBlocks } = select(import_block_editor.store);
      const innerBlocks = getBlocks(clientId);
      const tabPanel = innerBlocks.find(
        (block) => block.name === "core/tab-panel"
      );
      if (!tabPanel) {
        return [];
      }
      return tabPanel.innerBlocks.filter(
        (block) => block.name === "core/tab"
      );
    },
    [clientId]
  );
  const contextValue = (0, import_element.useMemo)(() => {
    const tabList = tabs.map((tab, index) => ({
      id: tab.attributes.anchor || `tab-${index}`,
      label: tab.attributes.label || "",
      clientId: tab.clientId,
      index
    }));
    return {
      "core/tabs-list": tabList,
      "core/tabs-id": anchor,
      "core/tabs-activeTabIndex": activeTabIndex,
      "core/tabs-editorActiveTabIndex": editorActiveTabIndex
    };
  }, [tabs, anchor, activeTabIndex, editorActiveTabIndex]);
  const blockProps = (0, import_block_editor.useBlockProps)({
    className: layoutClassNames
  });
  const innerBlockProps = (0, import_block_editor.useInnerBlocksProps)(blockProps, {
    __experimentalCaptureToolbars: true,
    template: TABS_TEMPLATE,
    templateLock: false,
    renderAppender: false
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockContextProvider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...innerBlockProps, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_controls.default,
      {
        clientId,
        attributes,
        setAttributes
      }
    ),
    innerBlockProps.children
  ] }) });
}
var edit_default = Edit;
//# sourceMappingURL=edit.cjs.map

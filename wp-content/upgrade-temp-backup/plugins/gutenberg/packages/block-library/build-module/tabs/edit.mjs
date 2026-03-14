// packages/block-library/src/tabs/edit.js
import {
  useBlockProps,
  useInnerBlocksProps,
  BlockContextProvider,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useMemo, useEffect } from "@wordpress/element";
import Controls from "./controls.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  useEffect(() => {
    if (editorActiveTabIndex === void 0) {
      setAttributes({ editorActiveTabIndex: activeTabIndex });
    }
  }, []);
  const tabs = useSelect(
    (select) => {
      const { getBlocks } = select(blockEditorStore);
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
  const contextValue = useMemo(() => {
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
  const blockProps = useBlockProps({
    className: layoutClassNames
  });
  const innerBlockProps = useInnerBlocksProps(blockProps, {
    __experimentalCaptureToolbars: true,
    template: TABS_TEMPLATE,
    templateLock: false,
    renderAppender: false
  });
  return /* @__PURE__ */ jsx(BlockContextProvider, { value: contextValue, children: /* @__PURE__ */ jsxs("div", { ...innerBlockProps, children: [
    /* @__PURE__ */ jsx(
      Controls,
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
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map

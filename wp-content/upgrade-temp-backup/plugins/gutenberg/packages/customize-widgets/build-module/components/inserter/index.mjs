// packages/customize-widgets/src/components/inserter/index.js
import { __ } from "@wordpress/i18n";
import { __experimentalLibrary as Library } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { closeSmall } from "@wordpress/icons";
import { store as customizeWidgetsStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Inserter({ setIsOpened }) {
  const inserterTitleId = useInstanceId(
    Inserter,
    "customize-widget-layout__inserter-panel-title"
  );
  const insertionPoint = useSelect(
    (select) => select(customizeWidgetsStore).__experimentalGetInsertionPoint(),
    []
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "customize-widgets-layout__inserter-panel",
      "aria-labelledby": inserterTitleId,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "customize-widgets-layout__inserter-panel-header", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: inserterTitleId,
              className: "customize-widgets-layout__inserter-panel-header-title",
              children: __("Add a block")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: closeSmall,
              onClick: () => setIsOpened(false),
              "aria-label": __("Close inserter")
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "customize-widgets-layout__inserter-panel-content", children: /* @__PURE__ */ jsx(
          Library,
          {
            rootClientId: insertionPoint.rootClientId,
            __experimentalInsertionIndex: insertionPoint.insertionIndex,
            showInserterHelpPanel: true,
            onSelect: () => setIsOpened(false)
          }
        ) })
      ]
    }
  );
}
var inserter_default = Inserter;
export {
  inserter_default as default
};
//# sourceMappingURL=index.mjs.map

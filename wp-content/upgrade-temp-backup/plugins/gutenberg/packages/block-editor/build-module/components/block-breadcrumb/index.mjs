// packages/block-editor/src/components/block-breadcrumb/index.js
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import { chevronRightSmall, Icon } from "@wordpress/icons";
import { useRef } from "@wordpress/element";
import BlockTitle from "../block-title/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useBlockElementRef } from "../block-list/use-block-props/use-block-refs.mjs";
import getEditorRegion from "../../utils/get-editor-region.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockBreadcrumb({ rootLabelText }) {
  const { selectBlock, clearSelectedBlock } = useDispatch(blockEditorStore);
  const { clientId, parents, hasSelection } = useSelect((select) => {
    const {
      getSelectionStart,
      getSelectedBlockClientId,
      getEnabledBlockParents
    } = unlock(select(blockEditorStore));
    const selectedBlockClientId = getSelectedBlockClientId();
    return {
      parents: getEnabledBlockParents(selectedBlockClientId),
      clientId: selectedBlockClientId,
      hasSelection: !!getSelectionStart().clientId
    };
  }, []);
  const rootLabel = rootLabelText || _x("Document", "noun, breadcrumb");
  const blockRef = useRef();
  useBlockElementRef(clientId, blockRef);
  return /* @__PURE__ */ jsxs(
    "ul",
    {
      className: "block-editor-block-breadcrumb",
      role: "list",
      "aria-label": __("Block breadcrumb"),
      children: [
        /* @__PURE__ */ jsxs(
          "li",
          {
            className: !hasSelection ? "block-editor-block-breadcrumb__current" : void 0,
            "aria-current": !hasSelection ? "true" : void 0,
            children: [
              hasSelection && /* @__PURE__ */ jsx(
                Button,
                {
                  size: "small",
                  className: "block-editor-block-breadcrumb__button",
                  onClick: () => {
                    const blockEditor = blockRef.current?.closest(
                      ".editor-styles-wrapper"
                    );
                    clearSelectedBlock();
                    getEditorRegion(blockEditor)?.focus();
                  },
                  children: rootLabel
                }
              ),
              !hasSelection && /* @__PURE__ */ jsx("span", { children: rootLabel }),
              !!clientId && /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: chevronRightSmall,
                  className: "block-editor-block-breadcrumb__separator"
                }
              )
            ]
          }
        ),
        parents.map((parentClientId) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              className: "block-editor-block-breadcrumb__button",
              onClick: () => selectBlock(parentClientId),
              children: /* @__PURE__ */ jsx(
                BlockTitle,
                {
                  clientId: parentClientId,
                  maximumLength: 35,
                  context: "breadcrumb"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Icon,
            {
              icon: chevronRightSmall,
              className: "block-editor-block-breadcrumb__separator"
            }
          )
        ] }, parentClientId)),
        !!clientId && /* @__PURE__ */ jsx(
          "li",
          {
            className: "block-editor-block-breadcrumb__current",
            "aria-current": "true",
            children: /* @__PURE__ */ jsx(
              BlockTitle,
              {
                clientId,
                maximumLength: 35,
                context: "breadcrumb"
              }
            )
          }
        )
      ]
    }
  );
}
var block_breadcrumb_default = BlockBreadcrumb;
export {
  block_breadcrumb_default as default
};
//# sourceMappingURL=index.mjs.map

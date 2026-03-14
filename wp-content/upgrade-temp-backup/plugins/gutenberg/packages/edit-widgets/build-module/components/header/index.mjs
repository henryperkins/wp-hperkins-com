// packages/edit-widgets/src/components/header/index.js
import { BlockToolbar } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Popover, VisuallyHidden } from "@wordpress/components";
import { PinnedItems } from "@wordpress/interface";
import { useViewportMatch } from "@wordpress/compose";
import { store as preferencesStore } from "@wordpress/preferences";
import DocumentTools from "./document-tools/index.mjs";
import SaveButton from "../save-button/index.mjs";
import MoreMenu from "../more-menu/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Header() {
  const isLargeViewport = useViewportMatch("medium");
  const blockToolbarRef = useRef();
  const { hasFixedToolbar } = useSelect(
    (select) => ({
      hasFixedToolbar: !!select(preferencesStore).get(
        "core/edit-widgets",
        "fixedToolbar"
      )
    }),
    []
  );
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "edit-widgets-header", children: [
    /* @__PURE__ */ jsxs("div", { className: "edit-widgets-header__navigable-toolbar-wrapper", children: [
      isLargeViewport && /* @__PURE__ */ jsx("h1", { className: "edit-widgets-header__title", children: __("Widgets") }),
      !isLargeViewport && /* @__PURE__ */ jsx(
        VisuallyHidden,
        {
          as: "h1",
          className: "edit-widgets-header__title",
          children: __("Widgets")
        }
      ),
      /* @__PURE__ */ jsx(DocumentTools, {}),
      hasFixedToolbar && isLargeViewport && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "selected-block-tools-wrapper", children: /* @__PURE__ */ jsx(BlockToolbar, { hideDragHandle: true }) }),
        /* @__PURE__ */ jsx(
          Popover.Slot,
          {
            ref: blockToolbarRef,
            name: "block-toolbar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "edit-widgets-header__actions", children: [
      /* @__PURE__ */ jsx(PinnedItems.Slot, { scope: "core/edit-widgets" }),
      /* @__PURE__ */ jsx(SaveButton, {}),
      /* @__PURE__ */ jsx(MoreMenu, {})
    ] })
  ] }) });
}
var header_default = Header;
export {
  header_default as default
};
//# sourceMappingURL=index.mjs.map

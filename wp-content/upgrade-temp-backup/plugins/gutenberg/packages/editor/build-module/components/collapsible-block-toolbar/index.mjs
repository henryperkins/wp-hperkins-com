// packages/editor/src/components/collapsible-block-toolbar/index.js
import clsx from "clsx";
import {
  BlockToolbar,
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { Button, Popover } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { next, previous } from "@wordpress/icons";
import { useSelect } from "@wordpress/data";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHasBlockToolbar } = unlock(blockEditorPrivateApis);
function CollapsibleBlockToolbar({ isCollapsed, onToggle }) {
  const { blockSelectionStart } = useSelect((select) => {
    return {
      blockSelectionStart: select(blockEditorStore).getBlockSelectionStart()
    };
  }, []);
  const hasBlockToolbar = useHasBlockToolbar();
  const hasBlockSelection = !!blockSelectionStart;
  useEffect(() => {
    if (blockSelectionStart) {
      onToggle(false);
    }
  }, [blockSelectionStart, onToggle]);
  if (!hasBlockToolbar) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("editor-collapsible-block-toolbar", {
          "is-collapsed": isCollapsed || !hasBlockSelection
        }),
        children: /* @__PURE__ */ jsx(BlockToolbar, { hideDragHandle: true })
      }
    ),
    /* @__PURE__ */ jsx(Popover.Slot, { name: "block-toolbar" }),
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "editor-collapsible-block-toolbar__toggle",
        icon: isCollapsed ? next : previous,
        onClick: () => {
          onToggle(!isCollapsed);
        },
        label: isCollapsed ? __("Show block tools") : __("Hide block tools"),
        size: "compact"
      }
    )
  ] });
}
export {
  CollapsibleBlockToolbar as default
};
//# sourceMappingURL=index.mjs.map

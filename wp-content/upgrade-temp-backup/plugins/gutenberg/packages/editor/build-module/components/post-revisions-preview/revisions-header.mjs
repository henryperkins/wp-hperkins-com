// packages/editor/src/components/post-revisions-preview/revisions-header.js
import { useSelect, useDispatch } from "@wordpress/data";
import { Button } from "@wordpress/components";
import { store as interfaceStore } from "@wordpress/interface";
import { __, _x, isRTL } from "@wordpress/i18n";
import { drawerLeft, drawerRight, seen } from "@wordpress/icons";
import HeaderSkeleton from "../header/header-skeleton.mjs";
import MoreMenu from "../more-menu/index.mjs";
import PostPreviewButton from "../post-preview-button/index.mjs";
import RevisionsSlider from "./revisions-slider.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { sidebars } from "../sidebar/constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function RevisionsHeader({ showDiff, onToggleDiff }) {
  const { currentRevisionId, sidebarIsOpened } = useSelect((select) => {
    return {
      currentRevisionId: unlock(
        select(editorStore)
      ).getCurrentRevisionId(),
      sidebarIsOpened: !!select(interfaceStore).getActiveComplementaryArea(
        "core"
      )
    };
  }, []);
  const { setCurrentRevisionId, restoreRevision } = unlock(
    useDispatch(editorStore)
  );
  const { enableComplementaryArea, disableComplementaryArea } = useDispatch(interfaceStore);
  const canRestore = !!currentRevisionId;
  const handleRestore = () => {
    if (currentRevisionId) {
      restoreRevision(currentRevisionId);
    }
  };
  return /* @__PURE__ */ jsx(
    HeaderSkeleton,
    {
      className: "editor-revisions-header",
      toolbar: /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          size: "compact",
          icon: seen,
          label: _x("Show changes", "revisions"),
          isPressed: showDiff,
          onClick: onToggleDiff
        }
      ),
      center: /* @__PURE__ */ jsx(RevisionsSlider, {}),
      settings: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(PostPreviewButton, { className: "editor-header__post-preview-button" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            icon: isRTL() ? drawerLeft : drawerRight,
            label: _x("Settings", "panel button label"),
            isPressed: sidebarIsOpened,
            "aria-expanded": sidebarIsOpened,
            onClick: () => {
              if (sidebarIsOpened) {
                disableComplementaryArea("core");
              } else {
                enableComplementaryArea(
                  "core",
                  sidebars.document
                );
              }
            },
            size: "compact"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            size: "compact",
            onClick: () => setCurrentRevisionId(null),
            children: __("Exit")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            accessibleWhenDisabled: true,
            variant: "primary",
            size: "compact",
            className: "editor-revisions-header__restore-button",
            disabled: !canRestore,
            onClick: handleRestore,
            children: __("Restore")
          }
        ),
        /* @__PURE__ */ jsx(MoreMenu, { disabled: true })
      ] })
    }
  );
}
var revisions_header_default = RevisionsHeader;
export {
  revisions_header_default as default
};
//# sourceMappingURL=revisions-header.mjs.map

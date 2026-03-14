// packages/edit-widgets/src/components/layout/interface.js
import { useViewportMatch } from "@wordpress/compose";
import { BlockBreadcrumb } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import {
  InterfaceSkeleton,
  ComplementaryArea,
  store as interfaceStore
} from "@wordpress/interface";
import { __ } from "@wordpress/i18n";
import { store as preferencesStore } from "@wordpress/preferences";
import Header from "../header/index.mjs";
import WidgetAreasBlockEditorContent from "../widget-areas-block-editor-content/index.mjs";
import { store as editWidgetsStore } from "../../store/index.mjs";
import SecondarySidebar from "../secondary-sidebar/index.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var interfaceLabels = {
  /* translators: accessibility text for the widgets screen top bar landmark region. */
  header: __("Widgets top bar"),
  /* translators: accessibility text for the widgets screen content landmark region. */
  body: __("Widgets and blocks"),
  /* translators: accessibility text for the widgets screen settings landmark region. */
  sidebar: __("Widgets settings"),
  /* translators: accessibility text for the widgets screen footer landmark region. */
  footer: __("Widgets footer")
};
function Interface({ blockEditorSettings }) {
  const isMobileViewport = useViewportMatch("medium", "<");
  const isHugeViewport = useViewportMatch("huge", ">=");
  const { setIsInserterOpened, setIsListViewOpened, closeGeneralSidebar } = useDispatch(editWidgetsStore);
  const {
    hasBlockBreadCrumbsEnabled,
    hasSidebarEnabled,
    isInserterOpened,
    isListViewOpened
  } = useSelect(
    (select) => ({
      hasSidebarEnabled: !!select(
        interfaceStore
      ).getActiveComplementaryArea(editWidgetsStore.name),
      isInserterOpened: !!select(editWidgetsStore).isInserterOpened(),
      isListViewOpened: !!select(editWidgetsStore).isListViewOpened(),
      hasBlockBreadCrumbsEnabled: !!select(preferencesStore).get(
        "core/edit-widgets",
        "showBlockBreadcrumbs"
      )
    }),
    []
  );
  useEffect(() => {
    if (hasSidebarEnabled && !isHugeViewport) {
      setIsInserterOpened(false);
      setIsListViewOpened(false);
    }
  }, [hasSidebarEnabled, isHugeViewport]);
  useEffect(() => {
    if ((isInserterOpened || isListViewOpened) && !isHugeViewport) {
      closeGeneralSidebar();
    }
  }, [isInserterOpened, isListViewOpened, isHugeViewport]);
  const secondarySidebarLabel = isListViewOpened ? __("List View") : __("Block Library");
  const hasSecondarySidebar = isListViewOpened || isInserterOpened;
  return /* @__PURE__ */ jsx(
    InterfaceSkeleton,
    {
      labels: {
        ...interfaceLabels,
        secondarySidebar: secondarySidebarLabel
      },
      header: /* @__PURE__ */ jsx(Header, {}),
      secondarySidebar: hasSecondarySidebar && /* @__PURE__ */ jsx(SecondarySidebar, {}),
      sidebar: /* @__PURE__ */ jsx(ComplementaryArea.Slot, { scope: "core/edit-widgets" }),
      content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
        WidgetAreasBlockEditorContent,
        {
          blockEditorSettings
        }
      ) }),
      footer: hasBlockBreadCrumbsEnabled && !isMobileViewport && /* @__PURE__ */ jsx("div", { className: "edit-widgets-layout__footer", children: /* @__PURE__ */ jsx(BlockBreadcrumb, { rootLabelText: __("Widgets") }) })
    }
  );
}
var interface_default = Interface;
export {
  interface_default as default
};
//# sourceMappingURL=interface.mjs.map

// packages/editor/src/components/global-styles-sidebar/index.js
import { FlexItem, Flex, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { styles, seen, backup } from "@wordpress/icons";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { useViewportMatch, usePrevious } from "@wordpress/compose";
import { store as coreStore } from "@wordpress/core-data";
import { store as interfaceStore } from "@wordpress/interface";
import GlobalStylesUI from "../global-styles/index.mjs";
import { GlobalStylesActionMenu } from "../global-styles/menu.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import DefaultSidebar from "./default-sidebar.mjs";
import WelcomeGuideStyles from "./welcome-guide.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function GlobalStylesSidebar() {
  const {
    shouldResetNavigation,
    stylesPath,
    showStylebook,
    showListViewByDefault,
    hasRevisions,
    activeComplementaryArea,
    editorSettings
  } = useSelect((select) => {
    const { getActiveComplementaryArea } = select(interfaceStore);
    const { getStylesPath, getShowStylebook } = unlock(
      select(editorStore)
    );
    const _isVisualEditorMode = "visual" === select(editorStore).getEditorMode();
    const _showListViewByDefault = select(preferencesStore).get(
      "core",
      "showListViewByDefault"
    );
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(coreStore);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      stylesPath: getStylesPath(),
      showStylebook: getShowStylebook(),
      shouldResetNavigation: "edit-site/global-styles" !== getActiveComplementaryArea("core") || !_isVisualEditorMode,
      showListViewByDefault: _showListViewByDefault,
      hasRevisions: !!globalStyles?._links?.["version-history"]?.[0]?.count,
      activeComplementaryArea: select(interfaceStore).getActiveComplementaryArea("core"),
      editorSettings: select(editorStore).getEditorSettings()
    };
  }, []);
  const { setStylesPath, setShowStylebook, resetStylesNavigation } = unlock(
    useDispatch(editorStore)
  );
  const isMobileViewport = useViewportMatch("medium", "<");
  const isRevisionsOpened = stylesPath.startsWith("/revisions") && !showStylebook;
  const isRevisionsStyleBookOpened = stylesPath.startsWith("/revisions") && showStylebook;
  const previousActiveArea = usePrevious(activeComplementaryArea);
  useEffect(() => {
    if (activeComplementaryArea === "edit-site/global-styles" && previousActiveArea !== "edit-site/global-styles") {
      resetStylesNavigation();
    }
  }, [activeComplementaryArea, previousActiveArea, resetStylesNavigation]);
  useEffect(() => {
    if (shouldResetNavigation) {
      resetStylesNavigation();
    }
  }, [shouldResetNavigation, resetStylesNavigation]);
  const { setIsListViewOpened } = useDispatch(editorStore);
  const toggleRevisions = () => {
    setIsListViewOpened(false);
    if (isRevisionsOpened || isRevisionsStyleBookOpened) {
      setStylesPath("/");
    } else {
      setStylesPath("/revisions");
    }
  };
  const toggleStyleBook = () => {
    setIsListViewOpened(showStylebook && showListViewByDefault);
    setShowStylebook(!showStylebook);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DefaultSidebar,
      {
        className: "editor-global-styles-sidebar",
        identifier: "edit-site/global-styles",
        title: __("Styles"),
        icon: styles,
        closeLabel: __("Close Styles"),
        panelClassName: "editor-global-styles-sidebar__panel",
        header: /* @__PURE__ */ jsxs(
          Flex,
          {
            className: "editor-global-styles-sidebar__header",
            gap: 1,
            children: [
              /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx("h2", { className: "editor-global-styles-sidebar__header-title", children: __("Styles") }) }),
              /* @__PURE__ */ jsxs(
                Flex,
                {
                  justify: "flex-end",
                  gap: 1,
                  className: "editor-global-styles-sidebar__header-actions",
                  children: [
                    !isMobileViewport && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        icon: seen,
                        label: __("Style Book"),
                        isPressed: showStylebook,
                        accessibleWhenDisabled: true,
                        disabled: shouldResetNavigation,
                        onClick: toggleStyleBook,
                        size: "compact"
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        label: __("Revisions"),
                        icon: backup,
                        onClick: toggleRevisions,
                        accessibleWhenDisabled: true,
                        disabled: !hasRevisions,
                        isPressed: isRevisionsOpened || isRevisionsStyleBookOpened,
                        size: "compact"
                      }
                    ) }),
                    /* @__PURE__ */ jsx(
                      GlobalStylesActionMenu,
                      {
                        onChangePath: setStylesPath
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        children: /* @__PURE__ */ jsx(
          GlobalStylesUI,
          {
            path: stylesPath,
            onPathChange: setStylesPath,
            settings: editorSettings
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(WelcomeGuideStyles, {})
  ] });
}
export {
  GlobalStylesSidebar as default
};
//# sourceMappingURL=index.mjs.map

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

// packages/editor/src/components/global-styles-sidebar/index.js
var global_styles_sidebar_exports = {};
__export(global_styles_sidebar_exports, {
  default: () => GlobalStylesSidebar
});
module.exports = __toCommonJS(global_styles_sidebar_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_interface = require("@wordpress/interface");
var import_global_styles = __toESM(require("../global-styles/index.cjs"));
var import_menu = require("../global-styles/menu.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_default_sidebar = __toESM(require("./default-sidebar.cjs"));
var import_welcome_guide = __toESM(require("./welcome-guide.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function GlobalStylesSidebar() {
  const {
    shouldResetNavigation,
    stylesPath,
    showStylebook,
    showListViewByDefault,
    hasRevisions,
    activeComplementaryArea,
    editorSettings
  } = (0, import_data.useSelect)((select) => {
    const { getActiveComplementaryArea } = select(import_interface.store);
    const { getStylesPath, getShowStylebook } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    const _isVisualEditorMode = "visual" === select(import_store.store).getEditorMode();
    const _showListViewByDefault = select(import_preferences.store).get(
      "core",
      "showListViewByDefault"
    );
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      stylesPath: getStylesPath(),
      showStylebook: getShowStylebook(),
      shouldResetNavigation: "edit-site/global-styles" !== getActiveComplementaryArea("core") || !_isVisualEditorMode,
      showListViewByDefault: _showListViewByDefault,
      hasRevisions: !!globalStyles?._links?.["version-history"]?.[0]?.count,
      activeComplementaryArea: select(import_interface.store).getActiveComplementaryArea("core"),
      editorSettings: select(import_store.store).getEditorSettings()
    };
  }, []);
  const { setStylesPath, setShowStylebook, resetStylesNavigation } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const isRevisionsOpened = stylesPath.startsWith("/revisions") && !showStylebook;
  const isRevisionsStyleBookOpened = stylesPath.startsWith("/revisions") && showStylebook;
  const previousActiveArea = (0, import_compose.usePrevious)(activeComplementaryArea);
  (0, import_element.useEffect)(() => {
    if (activeComplementaryArea === "edit-site/global-styles" && previousActiveArea !== "edit-site/global-styles") {
      resetStylesNavigation();
    }
  }, [activeComplementaryArea, previousActiveArea, resetStylesNavigation]);
  (0, import_element.useEffect)(() => {
    if (shouldResetNavigation) {
      resetStylesNavigation();
    }
  }, [shouldResetNavigation, resetStylesNavigation]);
  const { setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_default_sidebar.default,
      {
        className: "editor-global-styles-sidebar",
        identifier: "edit-site/global-styles",
        title: (0, import_i18n.__)("Styles"),
        icon: import_icons.styles,
        closeLabel: (0, import_i18n.__)("Close Styles"),
        panelClassName: "editor-global-styles-sidebar__panel",
        header: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Flex,
          {
            className: "editor-global-styles-sidebar__header",
            gap: 1,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "editor-global-styles-sidebar__header-title", children: (0, import_i18n.__)("Styles") }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.Flex,
                {
                  justify: "flex-end",
                  gap: 1,
                  className: "editor-global-styles-sidebar__header-actions",
                  children: [
                    !isMobileViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        icon: import_icons.seen,
                        label: (0, import_i18n.__)("Style Book"),
                        isPressed: showStylebook,
                        accessibleWhenDisabled: true,
                        disabled: shouldResetNavigation,
                        onClick: toggleStyleBook,
                        size: "compact"
                      }
                    ) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.Button,
                      {
                        label: (0, import_i18n.__)("Revisions"),
                        icon: import_icons.backup,
                        onClick: toggleRevisions,
                        accessibleWhenDisabled: true,
                        disabled: !hasRevisions,
                        isPressed: isRevisionsOpened || isRevisionsStyleBookOpened,
                        size: "compact"
                      }
                    ) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_menu.GlobalStylesActionMenu,
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
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_global_styles.default,
          {
            path: stylesPath,
            onPathChange: setStylesPath,
            settings: editorSettings
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_welcome_guide.default, {})
  ] });
}
//# sourceMappingURL=index.cjs.map

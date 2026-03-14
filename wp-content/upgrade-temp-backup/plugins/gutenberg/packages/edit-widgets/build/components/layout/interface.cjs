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

// packages/edit-widgets/src/components/layout/interface.js
var interface_exports = {};
__export(interface_exports, {
  default: () => interface_default
});
module.exports = __toCommonJS(interface_exports);
var import_compose = require("@wordpress/compose");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_interface = require("@wordpress/interface");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_header = __toESM(require("../header/index.cjs"));
var import_widget_areas_block_editor_content = __toESM(require("../widget-areas-block-editor-content/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_secondary_sidebar = __toESM(require("../secondary-sidebar/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var interfaceLabels = {
  /* translators: accessibility text for the widgets screen top bar landmark region. */
  header: (0, import_i18n.__)("Widgets top bar"),
  /* translators: accessibility text for the widgets screen content landmark region. */
  body: (0, import_i18n.__)("Widgets and blocks"),
  /* translators: accessibility text for the widgets screen settings landmark region. */
  sidebar: (0, import_i18n.__)("Widgets settings"),
  /* translators: accessibility text for the widgets screen footer landmark region. */
  footer: (0, import_i18n.__)("Widgets footer")
};
function Interface({ blockEditorSettings }) {
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const isHugeViewport = (0, import_compose.useViewportMatch)("huge", ">=");
  const { setIsInserterOpened, setIsListViewOpened, closeGeneralSidebar } = (0, import_data.useDispatch)(import_store.store);
  const {
    hasBlockBreadCrumbsEnabled,
    hasSidebarEnabled,
    isInserterOpened,
    isListViewOpened
  } = (0, import_data.useSelect)(
    (select) => ({
      hasSidebarEnabled: !!select(
        import_interface.store
      ).getActiveComplementaryArea(import_store.store.name),
      isInserterOpened: !!select(import_store.store).isInserterOpened(),
      isListViewOpened: !!select(import_store.store).isListViewOpened(),
      hasBlockBreadCrumbsEnabled: !!select(import_preferences.store).get(
        "core/edit-widgets",
        "showBlockBreadcrumbs"
      )
    }),
    []
  );
  (0, import_element.useEffect)(() => {
    if (hasSidebarEnabled && !isHugeViewport) {
      setIsInserterOpened(false);
      setIsListViewOpened(false);
    }
  }, [hasSidebarEnabled, isHugeViewport]);
  (0, import_element.useEffect)(() => {
    if ((isInserterOpened || isListViewOpened) && !isHugeViewport) {
      closeGeneralSidebar();
    }
  }, [isInserterOpened, isListViewOpened, isHugeViewport]);
  const secondarySidebarLabel = isListViewOpened ? (0, import_i18n.__)("List View") : (0, import_i18n.__)("Block Library");
  const hasSecondarySidebar = isListViewOpened || isInserterOpened;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_interface.InterfaceSkeleton,
    {
      labels: {
        ...interfaceLabels,
        secondarySidebar: secondarySidebarLabel
      },
      header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_header.default, {}),
      secondarySidebar: hasSecondarySidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_secondary_sidebar.default, {}),
      sidebar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.ComplementaryArea.Slot, { scope: "core/edit-widgets" }),
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_widget_areas_block_editor_content.default,
        {
          blockEditorSettings
        }
      ) }),
      footer: hasBlockBreadCrumbsEnabled && !isMobileViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-widgets-layout__footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockBreadcrumb, { rootLabelText: (0, import_i18n.__)("Widgets") }) })
    }
  );
}
var interface_default = Interface;
//# sourceMappingURL=interface.cjs.map

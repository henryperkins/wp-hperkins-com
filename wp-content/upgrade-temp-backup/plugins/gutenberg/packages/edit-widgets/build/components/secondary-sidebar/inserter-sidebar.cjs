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

// packages/edit-widgets/src/components/secondary-sidebar/inserter-sidebar.js
var inserter_sidebar_exports = {};
__export(inserter_sidebar_exports, {
  default: () => InserterSidebar
});
module.exports = __toCommonJS(inserter_sidebar_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_use_widget_library_insertion_point = __toESM(require("../../hooks/use-widget-library-insertion-point.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function InserterSidebar() {
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const { rootClientId, insertionIndex } = (0, import_use_widget_library_insertion_point.default)();
  const { setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  const closeInserter = (0, import_element.useCallback)(() => {
    return setIsInserterOpened(false);
  }, [setIsInserterOpened]);
  const libraryRef = (0, import_element.useRef)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-widgets-layout__inserter-panel", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-widgets-layout__inserter-panel-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.__experimentalLibrary,
    {
      showInserterHelpPanel: true,
      shouldFocusBlock: isMobileViewport,
      rootClientId,
      __experimentalInsertionIndex: insertionIndex,
      ref: libraryRef,
      onClose: closeInserter
    }
  ) }) });
}
//# sourceMappingURL=inserter-sidebar.cjs.map

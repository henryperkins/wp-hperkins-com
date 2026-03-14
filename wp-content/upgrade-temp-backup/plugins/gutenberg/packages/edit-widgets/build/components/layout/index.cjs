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

// packages/edit-widgets/src/components/layout/index.js
var layout_exports = {};
__export(layout_exports, {
  default: () => layout_default
});
module.exports = __toCommonJS(layout_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_plugins = require("@wordpress/plugins");
var import_notices = require("@wordpress/notices");
var import_components = require("@wordpress/components");
var import_error_boundary = __toESM(require("../error-boundary/index.cjs"));
var import_widget_areas_block_editor_provider = __toESM(require("../widget-areas-block-editor-provider/index.cjs"));
var import_sidebar = __toESM(require("../sidebar/index.cjs"));
var import_interface = __toESM(require("./interface.cjs"));
var import_unsaved_changes_warning = __toESM(require("./unsaved-changes-warning.cjs"));
var import_welcome_guide = __toESM(require("../welcome-guide/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Layout({ blockEditorSettings }) {
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  function onPluginAreaError(name) {
    createErrorNotice(
      (0, import_i18n.sprintf)(
        /* translators: %s: plugin name */
        (0, import_i18n.__)(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  const navigateRegionsProps = (0, import_components.__unstableUseNavigateRegions)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_error_boundary.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: navigateRegionsProps.className,
      ...navigateRegionsProps,
      ref: navigateRegionsProps.ref,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_widget_areas_block_editor_provider.default,
        {
          blockEditorSettings,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.default, { blockEditorSettings }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugins.PluginArea, { onError: onPluginAreaError }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_unsaved_changes_warning.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_welcome_guide.default, {})
          ]
        }
      )
    }
  ) });
}
var layout_default = Layout;
//# sourceMappingURL=index.cjs.map

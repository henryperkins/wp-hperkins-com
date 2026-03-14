var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-widgets/src/components/sidebar/widget-areas.js
var widget_areas_exports = {};
__export(widget_areas_exports, {
  default: () => WidgetAreas
});
module.exports = __toCommonJS(widget_areas_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_dom = require("@wordpress/dom");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WidgetAreas({ selectedWidgetAreaId }) {
  const widgetAreas = (0, import_data.useSelect)(
    (select) => select(import_store.store).getWidgetAreas(),
    []
  );
  const selectedWidgetArea = (0, import_element.useMemo)(
    () => selectedWidgetAreaId && widgetAreas?.find(
      (widgetArea) => widgetArea.id === selectedWidgetAreaId
    ),
    [selectedWidgetAreaId, widgetAreas]
  );
  let description;
  if (!selectedWidgetArea) {
    description = (0, import_i18n.__)(
      // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
      "Widget Areas are global parts in your site\u2019s layout that can accept blocks. These vary by theme, but are typically parts like your Sidebar or Footer."
    );
  } else if (selectedWidgetAreaId === "wp_inactive_widgets") {
    description = (0, import_i18n.__)(
      "Blocks in this Widget Area will not be displayed in your site."
    );
  } else {
    description = selectedWidgetArea.description;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-widgets-widget-areas", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-widget-areas__top-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.blockDefault }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "p",
        {
          dangerouslySetInnerHTML: {
            __html: (0, import_dom.safeHTML)(description)
          }
        }
      ),
      widgetAreas?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
        "Your theme does not contain any Widget Areas."
      ) }),
      !selectedWidgetArea && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          href: (0, import_url.addQueryArgs)("customize.php", {
            "autofocus[panel]": "widgets",
            return: window.location.pathname
          }),
          variant: "tertiary",
          children: (0, import_i18n.__)("Manage with live preview")
        }
      )
    ] })
  ] }) });
}
//# sourceMappingURL=widget-areas.cjs.map

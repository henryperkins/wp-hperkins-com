"use strict";
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

// packages/fields/src/fields/ping-status/index.tsx
var ping_status_exports = {};
__export(ping_status_exports, {
  default: () => ping_status_default
});
module.exports = __toCommonJS(ping_status_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function PingStatusEdit({
  data,
  onChange
}) {
  const pingStatus = data?.ping_status ?? "open";
  const onTogglePingback = (checked) => {
    onChange({
      ...data,
      ping_status: checked ? "open" : "closed"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.CheckboxControl,
    {
      label: (0, import_i18n.__)("Enable pingbacks & trackbacks"),
      checked: pingStatus === "open",
      onChange: onTogglePingback,
      help: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ExternalLink,
        {
          href: (0, import_i18n.__)(
            "https://wordpress.org/documentation/article/trackbacks-and-pingbacks/"
          ),
          children: (0, import_i18n.__)("Learn more about pingbacks & trackbacks")
        }
      )
    }
  );
}
var pingStatusField = {
  id: "ping_status",
  label: (0, import_i18n.__)("Trackbacks & Pingbacks"),
  type: "text",
  Edit: PingStatusEdit,
  enableSorting: false,
  enableHiding: false,
  filterBy: false,
  elements: [
    {
      value: "open",
      label: (0, import_i18n.__)("Allow"),
      description: (0, import_i18n.__)(
        "Allow link notifications from other blogs (pingbacks and trackbacks) on new articles."
      )
    },
    {
      value: "closed",
      label: (0, import_i18n.__)("Don't allow"),
      description: (0, import_i18n.__)(
        "Don't allow link notifications from other blogs (pingbacks and trackbacks) on new articles."
      )
    }
  ]
};
var ping_status_default = pingStatusField;
//# sourceMappingURL=index.cjs.map

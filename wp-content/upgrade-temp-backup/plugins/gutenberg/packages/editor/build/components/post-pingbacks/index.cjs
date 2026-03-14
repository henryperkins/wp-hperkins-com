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

// packages/editor/src/components/post-pingbacks/index.js
var post_pingbacks_exports = {};
__export(post_pingbacks_exports, {
  default: () => post_pingbacks_default
});
module.exports = __toCommonJS(post_pingbacks_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostPingbacks() {
  const pingStatus = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("ping_status") ?? "open",
    []
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const onTogglePingback = () => editPost({
    ping_status: pingStatus === "open" ? "closed" : "open"
  });
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
var post_pingbacks_default = PostPingbacks;
//# sourceMappingURL=index.cjs.map

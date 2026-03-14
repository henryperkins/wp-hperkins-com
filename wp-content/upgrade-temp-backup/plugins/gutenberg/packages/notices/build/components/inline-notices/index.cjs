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

// packages/notices/src/components/inline-notices/index.tsx
var inline_notices_exports = {};
__export(inline_notices_exports, {
  default: () => InlineNotices
});
module.exports = __toCommonJS(inline_notices_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");

// packages/notices/src/components/inline-notices/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='51ef33823e']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "51ef33823e");
  style.appendChild(document.createTextNode(".components-notices__dismissible,.components-notices__pinned{color:#1e1e1e}.components-notices__dismissible .components-notice,.components-notices__pinned .components-notice{border-bottom:1px solid #0003;box-sizing:border-box;min-height:64px;padding:0 12px}.components-notices__dismissible .components-notice .components-notice__dismiss,.components-notices__pinned .components-notice .components-notice__dismiss{margin-top:12px}"));
  document.head.appendChild(style);
}

// packages/notices/src/components/inline-notices/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function InlineNotices({
  children,
  pinnedNoticesClassName,
  dismissibleNoticesClassName,
  context
}) {
  const notices = (0, import_data.useSelect)(
    (select) => select(import_store.store).getNotices(context),
    [context]
  );
  const { removeNotice } = (0, import_data.useDispatch)(import_store.store);
  const dismissibleNotices = notices.filter(
    ({ isDismissible, type }) => isDismissible && type === "default"
  );
  const nonDismissibleNotices = notices.filter(
    ({ isDismissible, type }) => !isDismissible && type === "default"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.NoticeList,
      {
        notices: nonDismissibleNotices,
        className: (0, import_clsx.default)(
          "components-notices__pinned",
          pinnedNoticesClassName
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.NoticeList,
      {
        notices: dismissibleNotices,
        className: (0, import_clsx.default)(
          "components-notices__dismissible",
          dismissibleNoticesClassName
        ),
        onRemove: (id) => removeNotice(id, context),
        children
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map

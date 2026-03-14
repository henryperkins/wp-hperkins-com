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

// packages/editor/src/components/preferences-modal/enable-publish-sidebar.js
var enable_publish_sidebar_exports = {};
__export(enable_publish_sidebar_exports, {
  default: () => EnablePublishSidebarOption
});
module.exports = __toCommonJS(enable_publish_sidebar_exports);
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PreferenceBaseOption } = (0, import_lock_unlock.unlock)(import_preferences.privateApis);
function EnablePublishSidebarOption(props) {
  const isChecked = (0, import_data.useSelect)((select) => {
    return select(import_store.store).isPublishSidebarEnabled();
  }, []);
  const { enablePublishSidebar, disablePublishSidebar } = (0, import_data.useDispatch)(import_store.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PreferenceBaseOption,
    {
      isChecked,
      onChange: (isEnabled) => isEnabled ? enablePublishSidebar() : disablePublishSidebar(),
      ...props
    }
  );
}
//# sourceMappingURL=enable-publish-sidebar.cjs.map

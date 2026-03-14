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

// packages/edit-site/src/components/sidebar-identity/index.js
var sidebar_identity_exports = {};
__export(sidebar_identity_exports, {
  default: () => SidebarIdentity
});
module.exports = __toCommonJS(sidebar_identity_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_dataviews = require("@wordpress/dataviews");
var import_fields = require("@wordpress/fields");
var import_jsx_runtime = require("react/jsx-runtime");
var fields = [
  {
    id: "site_logo",
    type: "media",
    label: (0, import_i18n.__)("Site Logo"),
    description: (0, import_i18n.__)(
      "Displays in your site's layout via the Site Logo block."
    ),
    placeholder: (0, import_i18n.__)("Choose logo"),
    Edit: import_fields.MediaEdit,
    setValue: ({ value }) => ({
      site_logo: value ?? 0
    })
  },
  {
    id: "site_icon",
    type: "media",
    label: (0, import_i18n.__)("Site Icon"),
    description: (0, import_i18n.__)(
      "Shown in browser tabs, bookmarks, and mobile apps. It should be square and at least 512 by 512 pixels."
    ),
    placeholder: (0, import_i18n.__)("Choose icon"),
    Edit: import_fields.MediaEdit,
    setValue: ({ value }) => ({
      site_icon: value ?? 0
    })
  }
];
var form = {
  layout: {
    type: "regular",
    labelPosition: "top"
  },
  fields: ["site_logo", "site_icon"]
};
function SidebarIdentity() {
  const data = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEditedEntityRecord("root", "site"),
    []
  );
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const onChange = (edits) => {
    editEntityRecord("root", "site", void 0, edits);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_admin_ui.Page, { title: (0, import_i18n.__)("Identity"), hasPadding: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_dataviews.DataForm,
    {
      data,
      fields,
      form,
      onChange
    }
  ) });
}
//# sourceMappingURL=index.cjs.map

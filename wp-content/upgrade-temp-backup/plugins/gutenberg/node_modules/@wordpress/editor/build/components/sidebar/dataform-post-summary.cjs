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

// packages/editor/src/components/sidebar/dataform-post-summary.js
var dataform_post_summary_exports = {};
__export(dataform_post_summary_exports, {
  default: () => DataFormPostSummary
});
module.exports = __toCommonJS(dataform_post_summary_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_dataviews = require("@wordpress/dataviews");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_post_card_panel = __toESM(require("../post-card-panel/index.cjs"));
var import_post_panel_section = __toESM(require("../post-panel-section/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_post_trash = __toESM(require("../post-trash/index.cjs"));
var import_post_fields = __toESM(require("../post-fields/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var form = {
  layout: {
    type: "panel"
  },
  fields: [
    {
      id: "featured_media",
      layout: {
        type: "regular",
        labelPosition: "none"
      }
    },
    {
      id: "status",
      label: (0, import_i18n.__)("Status"),
      children: [
        {
          id: "status",
          layout: { type: "regular", labelPosition: "none" }
        },
        "password"
      ]
    },
    "author",
    "date",
    "slug",
    "parent",
    {
      id: "discussion",
      label: (0, import_i18n.__)("Discussion"),
      children: [
        {
          id: "comment_status",
          layout: { type: "regular", labelPosition: "none" }
        },
        "ping_status"
      ]
    },
    "template"
  ]
};
function DataFormPostSummary({ onActionPerformed }) {
  const { postType, postId } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getCurrentPostId } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    return {
      postType: getCurrentPostType(),
      postId: getCurrentPostId()
    };
  }, []);
  const record = (0, import_data.useSelect)(
    (select) => {
      if (!postType || !postId) {
        return null;
      }
      return select(import_core_data.store).getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
    },
    [postType, postId]
  );
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const _fields = (0, import_post_fields.default)({ postType });
  const fields = (0, import_element.useMemo)(
    () => _fields?.map((field) => {
      if (field.id === "status") {
        return {
          ...field,
          elements: field.elements.filter(
            (element) => element.value !== "trash"
          )
        };
      }
      return field;
    }),
    [_fields]
  );
  const onChange = (edits) => {
    if (edits.status && edits.status !== "future" && record?.status === "future" && new Date(record.date) > /* @__PURE__ */ new Date()) {
      edits.date = null;
    }
    if (edits.status && edits.status === "private" && record?.password) {
      edits.password = "";
    }
    editEntityRecord("postType", postType, postId, edits);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_section.default, { className: "editor-post-summary", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_post_card_panel.default,
      {
        postType,
        postId,
        onActionPerformed
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dataviews.DataForm,
      {
        data: record,
        fields,
        form,
        onChange
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_trash.default, { onActionPerformed })
  ] }) });
}
//# sourceMappingURL=dataform-post-summary.cjs.map

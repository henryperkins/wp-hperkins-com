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

// packages/edit-site/src/components/welcome-guide/template.js
var template_exports = {};
__export(template_exports, {
  default: () => WelcomeGuideTemplate
});
module.exports = __toCommonJS(template_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_editor = require("@wordpress/editor");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideTemplate() {
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { isActive, hasPreviousEntity } = (0, import_data.useSelect)((select) => {
    const { getEditorSettings } = select(import_editor.store);
    const { get } = select(import_preferences.store);
    return {
      isActive: get("core/edit-site", "welcomeGuideTemplate"),
      hasPreviousEntity: !!getEditorSettings().onNavigateToPreviousEntityRecord
    };
  }, []);
  const isVisible = isActive && hasPreviousEntity;
  if (!isVisible) {
    return null;
  }
  const heading = (0, import_i18n.__)("Editing a template");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "edit-site-welcome-guide guide-template",
      contentLabel: heading,
      finishButtonText: (0, import_i18n.__)("Continue"),
      onFinish: () => toggle("core/edit-site", "welcomeGuideTemplate"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "video",
            {
              className: "edit-site-welcome-guide__video",
              autoPlay: true,
              loop: true,
              muted: true,
              width: "312",
              height: "240",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "source",
                {
                  src: "https://s.w.org/images/block-editor/editing-your-template.mp4",
                  type: "video/mp4"
                }
              )
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-site-welcome-guide__heading", children: heading }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-site-welcome-guide__text", children: (0, import_i18n.__)(
              "Note that the same template can be used by multiple pages, so any changes made here may affect other pages on the site. To switch back to editing the page content click the \u2018Back\u2019 button in the toolbar."
            ) })
          ] })
        }
      ]
    }
  );
}
//# sourceMappingURL=template.cjs.map

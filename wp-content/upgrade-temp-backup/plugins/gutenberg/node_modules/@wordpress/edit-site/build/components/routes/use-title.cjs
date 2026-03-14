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

// packages/edit-site/src/components/routes/use-title.js
var use_title_exports = {};
__export(use_title_exports, {
  default: () => useTitle
});
module.exports = __toCommonJS(use_title_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_a11y = require("@wordpress/a11y");
var import_html_entities = require("@wordpress/html-entities");
var import_router = require("@wordpress/router");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function useTitle(title) {
  const location = useLocation();
  const siteTitle = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityRecord("root", "site")?.title,
    []
  );
  const isInitialLocationRef = (0, import_element.useRef)(true);
  (0, import_element.useEffect)(() => {
    isInitialLocationRef.current = false;
  }, [location]);
  (0, import_element.useEffect)(() => {
    if (isInitialLocationRef.current) {
      return;
    }
    if (title && siteTitle) {
      const formattedTitle = (0, import_i18n.sprintf)(
        /* translators: Admin document title. 1: Admin screen name, 2: Network or site name. */
        (0, import_i18n.__)("%1$s \u2039 %2$s \u2039 Editor \u2014 WordPress"),
        (0, import_html_entities.decodeEntities)(title),
        (0, import_html_entities.decodeEntities)(siteTitle)
      );
      document.title = formattedTitle;
      (0, import_a11y.speak)(title, "assertive");
    }
  }, [title, siteTitle, location]);
}
//# sourceMappingURL=use-title.cjs.map

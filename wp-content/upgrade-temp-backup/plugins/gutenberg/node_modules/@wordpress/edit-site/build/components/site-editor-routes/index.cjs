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

// packages/edit-site/src/components/site-editor-routes/index.js
var site_editor_routes_exports = {};
__export(site_editor_routes_exports, {
  useRegisterSiteEditorRoutes: () => useRegisterSiteEditorRoutes
});
module.exports = __toCommonJS(site_editor_routes_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_home = require("./home.cjs");
var import_identity = require("./identity.cjs");
var import_styles = require("./styles.cjs");
var import_navigation = require("./navigation.cjs");
var import_navigation_item = require("./navigation-item.cjs");
var import_patterns = require("./patterns.cjs");
var import_pattern_item = require("./pattern-item.cjs");
var import_template_part_item = require("./template-part-item.cjs");
var import_templates = require("./templates.cjs");
var import_template_item = require("./template-item.cjs");
var import_pages = require("./pages.cjs");
var import_page_item = require("./page-item.cjs");
var import_attachment_item = require("./attachment-item.cjs");
var import_stylebook = require("./stylebook.cjs");
var import_notfound = require("./notfound.cjs");
var routes = [
  ...window?.__experimentalMediaEditor ? [import_attachment_item.attachmentItemRoute] : [],
  import_page_item.pageItemRoute,
  import_pages.pagesRoute,
  import_template_item.templateItemRoute,
  import_templates.templatesRoute,
  import_template_part_item.templatePartItemRoute,
  import_pattern_item.patternItemRoute,
  import_patterns.patternsRoute,
  import_navigation_item.navigationItemRoute,
  import_navigation.navigationRoute,
  import_identity.identityRoute,
  import_styles.stylesRoute,
  import_home.homeRoute,
  import_stylebook.stylebookRoute,
  import_notfound.notFoundRoute
];
function useRegisterSiteEditorRoutes() {
  const registry = (0, import_data.useRegistry)();
  const { registerRoute } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  (0, import_element.useEffect)(() => {
    registry.batch(() => {
      routes.forEach(registerRoute);
    });
  }, [registry, registerRoute]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRegisterSiteEditorRoutes
});
//# sourceMappingURL=index.cjs.map

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

// packages/editor/src/components/post-template/hooks.js
var hooks_exports = {};
__export(hooks_exports, {
  useAllowSwitchingTemplates: () => useAllowSwitchingTemplates,
  useAvailableTemplates: () => useAvailableTemplates,
  useCurrentTemplateSlug: () => useCurrentTemplateSlug,
  useEditedPostContext: () => useEditedPostContext
});
module.exports = __toCommonJS(hooks_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function useEditedPostContext() {
  return (0, import_data.useSelect)((select) => {
    const { getCurrentPostId, getCurrentPostType } = select(import_store.store);
    return {
      postId: getCurrentPostId(),
      postType: getCurrentPostType()
    };
  }, []);
}
function useAllowSwitchingTemplates() {
  const { postType, postId } = useEditedPostContext();
  return (0, import_data.useSelect)(
    (select) => {
      const { canUser, getEntityRecord, getEntityRecords } = select(import_core_data.store);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEntityRecord("root", "site") : void 0;
      const isPostsPage = +postId === siteSettings?.page_for_posts;
      const isFrontPage = postType === "page" && +postId === siteSettings?.page_on_front;
      const templates = isFrontPage ? getEntityRecords("postType", "wp_template", {
        per_page: -1
      }) : [];
      const hasFrontPage = isFrontPage && !!templates?.some(({ slug }) => slug === "front-page");
      return !isPostsPage && !hasFrontPage;
    },
    [postId, postType]
  );
}
function useTemplates(postType) {
  return (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityRecords("postType", "wp_template", {
      per_page: -1,
      post_type: postType
      // We look at the combined templates for now (old endpoint)
      // because posts only accept slugs for templates, not IDs.
    }),
    [postType]
  );
}
function useAvailableTemplates(postType) {
  const currentTemplateSlug = useCurrentTemplateSlug();
  const allowSwitchingTemplate = useAllowSwitchingTemplates();
  const templates = useTemplates(postType);
  return (0, import_element.useMemo)(
    () => allowSwitchingTemplate && templates?.filter(
      (template) => template.is_custom && template.slug !== currentTemplateSlug && !!template.content.raw
      // Skip empty templates.
    ),
    [templates, currentTemplateSlug, allowSwitchingTemplate]
  );
}
function useCurrentTemplateSlug() {
  const { postType, postId } = useEditedPostContext();
  const templates = useTemplates(postType);
  const entityTemplate = (0, import_data.useSelect)(
    (select) => {
      const post = select(import_core_data.store).getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
      return post?.template;
    },
    [postType, postId]
  );
  if (!entityTemplate) {
    return;
  }
  return templates?.find((template) => template.slug === entityTemplate)?.slug;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAllowSwitchingTemplates,
  useAvailableTemplates,
  useCurrentTemplateSlug,
  useEditedPostContext
});
//# sourceMappingURL=hooks.cjs.map

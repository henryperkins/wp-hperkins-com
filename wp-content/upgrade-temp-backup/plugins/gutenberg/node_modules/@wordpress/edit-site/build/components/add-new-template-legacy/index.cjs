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

// packages/edit-site/src/components/add-new-template-legacy/index.js
var add_new_template_legacy_exports = {};
__export(add_new_template_legacy_exports, {
  default: () => add_new_template_legacy_default
});
module.exports = __toCommonJS(add_new_template_legacy_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_html_entities = require("@wordpress/html-entities");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_router = require("@wordpress/router");
var import_dom = require("@wordpress/dom");
var import_constants = require("../../utils/constants.cjs");
var import_add_custom_template_modal_content = __toESM(require("./add-custom-template-modal-content.cjs"));
var import_utils = require("./utils.cjs");
var import_add_custom_generic_template_modal_content = __toESM(require("./add-custom-generic-template-modal-content.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var DEFAULT_TEMPLATE_SLUGS = [
  "front-page",
  "home",
  "single",
  "page",
  "index",
  "archive",
  "author",
  "category",
  "date",
  "tag",
  "search",
  "404"
];
var TEMPLATE_ICONS = {
  "front-page": import_icons.home,
  home: import_icons.verse,
  single: import_icons.pin,
  page: import_icons.page,
  archive: import_icons.archive,
  search: import_icons.search,
  404: import_icons.notFound,
  index: import_icons.list,
  category: import_icons.category,
  author: import_icons.commentAuthorAvatar,
  taxonomy: import_icons.blockMeta,
  date: import_icons.calendar,
  tag: import_icons.tag,
  attachment: import_icons.media
};
function TemplateListItem({
  title,
  direction,
  className,
  description,
  icon,
  onClick,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      className,
      onClick,
      label: description,
      showTooltip: !!description,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.Flex,
        {
          as: "span",
          spacing: 2,
          align: "center",
          justify: "center",
          style: { width: "100%" },
          direction,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-add-new-template__template-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.__experimentalVStack,
              {
                className: "edit-site-add-new-template__template-name",
                alignment: "center",
                spacing: 0,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.__experimentalText,
                    {
                      align: "center",
                      weight: 500,
                      lineHeight: 1.53846153846,
                      children: title
                    }
                  ),
                  children
                ]
              }
            )
          ]
        }
      )
    }
  );
}
var modalContentMap = {
  templatesList: 1,
  customTemplate: 2,
  customGenericTemplate: 3
};
function NewTemplateModal({ onClose }) {
  const [modalContent, setModalContent] = (0, import_element.useState)(
    modalContentMap.templatesList
  );
  const [entityForSuggestions, setEntityForSuggestions] = (0, import_element.useState)({});
  const [isSubmitting, setIsSubmitting] = (0, import_element.useState)(false);
  const missingTemplates = useMissingTemplates(
    setEntityForSuggestions,
    () => setModalContent(modalContentMap.customTemplate)
  );
  const history = useHistory();
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createErrorNotice, createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const containerRef = (0, import_element.useRef)(null);
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const TEMPLATE_SHORT_DESCRIPTIONS = {
    "front-page": homeUrl,
    date: (0, import_i18n.sprintf)(
      // translators: %s: The homepage url.
      (0, import_i18n.__)("E.g. %s"),
      homeUrl + "/" + (/* @__PURE__ */ new Date()).getFullYear()
    )
  };
  (0, import_element.useEffect)(() => {
    if (containerRef.current && modalContent === modalContentMap.templatesList) {
      const [firstFocusable] = import_dom.focus.focusable.find(
        containerRef.current
      );
      firstFocusable?.focus();
    }
  }, [modalContent]);
  async function createTemplate(template, isWPSuggestion = true) {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { title, description, slug } = template;
      const newTemplate = await saveEntityRecord(
        "postType",
        import_constants.TEMPLATE_POST_TYPE,
        {
          description,
          // Slugs need to be strings, so this is for template `404`
          slug: slug.toString(),
          status: "publish",
          title,
          // This adds a post meta field in template that is part of `is_custom` value calculation.
          is_wp_suggestion: isWPSuggestion
        },
        { throwOnError: true }
      );
      history.navigate(
        `/${import_constants.TEMPLATE_POST_TYPE}/${newTemplate.id}?canvas=edit`
      );
      createSuccessNotice(
        (0, import_i18n.sprintf)(
          // translators: %s: Title of the created post or template, e.g: "Hello world".
          (0, import_i18n.__)('"%s" successfully created.'),
          (0, import_html_entities.decodeEntities)(newTemplate.title?.rendered || title) || (0, import_i18n.__)("(no title)")
        ),
        {
          type: "snackbar"
        }
      );
    } catch (error) {
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("An error occurred while creating the template.");
      createErrorNotice(errorMessage, {
        type: "snackbar"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const onModalClose = () => {
    onClose();
    setModalContent(modalContentMap.templatesList);
  };
  let modalTitle = (0, import_i18n.__)("Add template");
  if (modalContent === modalContentMap.customTemplate) {
    modalTitle = (0, import_i18n.sprintf)(
      // translators: %s: Name of the post type e.g: "Post".
      (0, import_i18n.__)("Add template: %s"),
      entityForSuggestions.labels.singular_name
    );
  } else if (modalContent === modalContentMap.customGenericTemplate) {
    modalTitle = (0, import_i18n.__)("Create custom template");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      title: modalTitle,
      className: (0, import_clsx.default)("edit-site-add-new-template__modal", {
        "edit-site-add-new-template__modal_template_list": modalContent === modalContentMap.templatesList,
        "edit-site-custom-template-modal": modalContent === modalContentMap.customTemplate
      }),
      onRequestClose: onModalClose,
      overlayClassName: modalContent === modalContentMap.customGenericTemplate ? "edit-site-custom-generic-template__modal" : void 0,
      ref: containerRef,
      children: [
        modalContent === modalContentMap.templatesList && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalGrid,
          {
            columns: isMobile ? 2 : 3,
            gap: 4,
            align: "flex-start",
            justify: "center",
            className: "edit-site-add-new-template__template-list__contents",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { className: "edit-site-add-new-template__template-list__prompt", children: (0, import_i18n.__)(
                "Select what the new template should apply to:"
              ) }),
              missingTemplates.map((template) => {
                const { title, slug, onClick } = template;
                return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  TemplateListItem,
                  {
                    title,
                    direction: "column",
                    className: "edit-site-add-new-template__template-button",
                    description: TEMPLATE_SHORT_DESCRIPTIONS[slug],
                    icon: TEMPLATE_ICONS[slug] || import_icons.layout,
                    onClick: () => onClick ? onClick(template) : createTemplate(template)
                  },
                  slug
                );
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                TemplateListItem,
                {
                  title: (0, import_i18n.__)("Custom template"),
                  direction: "row",
                  className: "edit-site-add-new-template__custom-template-button",
                  icon: import_icons.pencil,
                  onClick: () => setModalContent(
                    modalContentMap.customGenericTemplate
                  ),
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.__experimentalText,
                    {
                      lineHeight: 1.53846153846,
                      children: (0, import_i18n.__)(
                        "A custom template can be manually applied to any post or page."
                      )
                    }
                  )
                }
              )
            ]
          }
        ),
        modalContent === modalContentMap.customTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_add_custom_template_modal_content.default,
          {
            onSelect: createTemplate,
            entityForSuggestions,
            onBack: () => setModalContent(modalContentMap.templatesList),
            containerRef
          }
        ),
        modalContent === modalContentMap.customGenericTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_add_custom_generic_template_modal_content.default,
          {
            createTemplate,
            onBack: () => setModalContent(modalContentMap.templatesList)
          }
        )
      ]
    }
  );
}
function NewTemplate() {
  const [showModal, setShowModal] = (0, import_element.useState)(false);
  const { postType } = (0, import_data.useSelect)((select) => {
    const { getPostType } = select(import_core_data.store);
    return {
      postType: getPostType(import_constants.TEMPLATE_POST_TYPE)
    };
  }, []);
  if (!postType) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        variant: "primary",
        onClick: () => setShowModal(true),
        label: postType.labels.add_new_item,
        __next40pxDefaultSize: true,
        children: postType.labels.add_new_item
      }
    ),
    showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewTemplateModal, { onClose: () => setShowModal(false) })
  ] });
}
function useMissingTemplates(setEntityForSuggestions, onClick) {
  const existingTemplates = (0, import_utils.useExistingTemplates)();
  const defaultTemplateTypes = (0, import_utils.useDefaultTemplateTypes)();
  const existingTemplateSlugs = (existingTemplates || []).map(
    ({ slug }) => slug
  );
  const missingDefaultTemplates = (defaultTemplateTypes || []).filter(
    (template) => DEFAULT_TEMPLATE_SLUGS.includes(template.slug) && !existingTemplateSlugs.includes(template.slug)
  );
  const onClickMenuItem = (_entityForSuggestions) => {
    onClick?.();
    setEntityForSuggestions(_entityForSuggestions);
  };
  const enhancedMissingDefaultTemplateTypes = [...missingDefaultTemplates];
  const { defaultTaxonomiesMenuItems, taxonomiesMenuItems } = (0, import_utils.useTaxonomiesMenuItems)(onClickMenuItem);
  const { defaultPostTypesMenuItems, postTypesMenuItems } = (0, import_utils.usePostTypeMenuItems)(onClickMenuItem);
  const authorMenuItem = (0, import_utils.useAuthorMenuItem)(onClickMenuItem);
  [
    ...defaultTaxonomiesMenuItems,
    ...defaultPostTypesMenuItems,
    authorMenuItem
  ].forEach((menuItem) => {
    if (!menuItem) {
      return;
    }
    const matchIndex = enhancedMissingDefaultTemplateTypes.findIndex(
      (template) => template.slug === menuItem.slug
    );
    if (matchIndex > -1) {
      enhancedMissingDefaultTemplateTypes[matchIndex] = menuItem;
    } else {
      enhancedMissingDefaultTemplateTypes.push(menuItem);
    }
  });
  enhancedMissingDefaultTemplateTypes?.sort((template1, template2) => {
    return DEFAULT_TEMPLATE_SLUGS.indexOf(template1.slug) - DEFAULT_TEMPLATE_SLUGS.indexOf(template2.slug);
  });
  const missingTemplates = [
    ...enhancedMissingDefaultTemplateTypes,
    ...(0, import_utils.usePostTypeArchiveMenuItems)(),
    ...postTypesMenuItems,
    ...taxonomiesMenuItems
  ];
  return missingTemplates;
}
var add_new_template_legacy_default = (0, import_element.memo)(NewTemplate);
//# sourceMappingURL=index.cjs.map

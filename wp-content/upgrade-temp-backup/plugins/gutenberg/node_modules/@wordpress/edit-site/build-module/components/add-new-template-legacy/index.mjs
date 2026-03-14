// packages/edit-site/src/components/add-new-template-legacy/index.js
import clsx from "clsx";
import {
  Button,
  Modal,
  __experimentalGrid as Grid,
  __experimentalText as Text,
  __experimentalVStack as VStack,
  Flex,
  Icon
} from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import { useState, memo, useRef, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useViewportMatch } from "@wordpress/compose";
import {
  archive,
  blockMeta,
  calendar,
  category,
  commentAuthorAvatar,
  pencil,
  home,
  layout,
  list,
  media,
  notFound,
  page,
  pin,
  verse,
  search,
  tag
} from "@wordpress/icons";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { focus } from "@wordpress/dom";
import { TEMPLATE_POST_TYPE } from "../../utils/constants.mjs";
import AddCustomTemplateModalContent from "./add-custom-template-modal-content.mjs";
import {
  useExistingTemplates,
  useDefaultTemplateTypes,
  useTaxonomiesMenuItems,
  usePostTypeMenuItems,
  useAuthorMenuItem,
  usePostTypeArchiveMenuItems
} from "./utils.mjs";
import AddCustomGenericTemplateModalContent from "./add-custom-generic-template-modal-content.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHistory } = unlock(routerPrivateApis);
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
  "front-page": home,
  home: verse,
  single: pin,
  page,
  archive,
  search,
  404: notFound,
  index: list,
  category,
  author: commentAuthorAvatar,
  taxonomy: blockMeta,
  date: calendar,
  tag,
  attachment: media
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
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      className,
      onClick,
      label: description,
      showTooltip: !!description,
      children: /* @__PURE__ */ jsxs(
        Flex,
        {
          as: "span",
          spacing: 2,
          align: "center",
          justify: "center",
          style: { width: "100%" },
          direction,
          children: [
            /* @__PURE__ */ jsx("div", { className: "edit-site-add-new-template__template-icon", children: /* @__PURE__ */ jsx(Icon, { icon }) }),
            /* @__PURE__ */ jsxs(
              VStack,
              {
                className: "edit-site-add-new-template__template-name",
                alignment: "center",
                spacing: 0,
                children: [
                  /* @__PURE__ */ jsx(
                    Text,
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
  const [modalContent, setModalContent] = useState(
    modalContentMap.templatesList
  );
  const [entityForSuggestions, setEntityForSuggestions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const missingTemplates = useMissingTemplates(
    setEntityForSuggestions,
    () => setModalContent(modalContentMap.customTemplate)
  );
  const history = useHistory();
  const { saveEntityRecord } = useDispatch(coreStore);
  const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);
  const containerRef = useRef(null);
  const isMobile = useViewportMatch("medium", "<");
  const homeUrl = useSelect((select) => {
    return select(coreStore).getEntityRecord("root", "__unstableBase")?.home;
  }, []);
  const TEMPLATE_SHORT_DESCRIPTIONS = {
    "front-page": homeUrl,
    date: sprintf(
      // translators: %s: The homepage url.
      __("E.g. %s"),
      homeUrl + "/" + (/* @__PURE__ */ new Date()).getFullYear()
    )
  };
  useEffect(() => {
    if (containerRef.current && modalContent === modalContentMap.templatesList) {
      const [firstFocusable] = focus.focusable.find(
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
        TEMPLATE_POST_TYPE,
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
        `/${TEMPLATE_POST_TYPE}/${newTemplate.id}?canvas=edit`
      );
      createSuccessNotice(
        sprintf(
          // translators: %s: Title of the created post or template, e.g: "Hello world".
          __('"%s" successfully created.'),
          decodeEntities(newTemplate.title?.rendered || title) || __("(no title)")
        ),
        {
          type: "snackbar"
        }
      );
    } catch (error) {
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : __("An error occurred while creating the template.");
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
  let modalTitle = __("Add template");
  if (modalContent === modalContentMap.customTemplate) {
    modalTitle = sprintf(
      // translators: %s: Name of the post type e.g: "Post".
      __("Add template: %s"),
      entityForSuggestions.labels.singular_name
    );
  } else if (modalContent === modalContentMap.customGenericTemplate) {
    modalTitle = __("Create custom template");
  }
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      title: modalTitle,
      className: clsx("edit-site-add-new-template__modal", {
        "edit-site-add-new-template__modal_template_list": modalContent === modalContentMap.templatesList,
        "edit-site-custom-template-modal": modalContent === modalContentMap.customTemplate
      }),
      onRequestClose: onModalClose,
      overlayClassName: modalContent === modalContentMap.customGenericTemplate ? "edit-site-custom-generic-template__modal" : void 0,
      ref: containerRef,
      children: [
        modalContent === modalContentMap.templatesList && /* @__PURE__ */ jsxs(
          Grid,
          {
            columns: isMobile ? 2 : 3,
            gap: 4,
            align: "flex-start",
            justify: "center",
            className: "edit-site-add-new-template__template-list__contents",
            children: [
              /* @__PURE__ */ jsx(Flex, { className: "edit-site-add-new-template__template-list__prompt", children: __(
                "Select what the new template should apply to:"
              ) }),
              missingTemplates.map((template) => {
                const { title, slug, onClick } = template;
                return /* @__PURE__ */ jsx(
                  TemplateListItem,
                  {
                    title,
                    direction: "column",
                    className: "edit-site-add-new-template__template-button",
                    description: TEMPLATE_SHORT_DESCRIPTIONS[slug],
                    icon: TEMPLATE_ICONS[slug] || layout,
                    onClick: () => onClick ? onClick(template) : createTemplate(template)
                  },
                  slug
                );
              }),
              /* @__PURE__ */ jsx(
                TemplateListItem,
                {
                  title: __("Custom template"),
                  direction: "row",
                  className: "edit-site-add-new-template__custom-template-button",
                  icon: pencil,
                  onClick: () => setModalContent(
                    modalContentMap.customGenericTemplate
                  ),
                  children: /* @__PURE__ */ jsx(
                    Text,
                    {
                      lineHeight: 1.53846153846,
                      children: __(
                        "A custom template can be manually applied to any post or page."
                      )
                    }
                  )
                }
              )
            ]
          }
        ),
        modalContent === modalContentMap.customTemplate && /* @__PURE__ */ jsx(
          AddCustomTemplateModalContent,
          {
            onSelect: createTemplate,
            entityForSuggestions,
            onBack: () => setModalContent(modalContentMap.templatesList),
            containerRef
          }
        ),
        modalContent === modalContentMap.customGenericTemplate && /* @__PURE__ */ jsx(
          AddCustomGenericTemplateModalContent,
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
  const [showModal, setShowModal] = useState(false);
  const { postType } = useSelect((select) => {
    const { getPostType } = select(coreStore);
    return {
      postType: getPostType(TEMPLATE_POST_TYPE)
    };
  }, []);
  if (!postType) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "primary",
        onClick: () => setShowModal(true),
        label: postType.labels.add_new_item,
        __next40pxDefaultSize: true,
        children: postType.labels.add_new_item
      }
    ),
    showModal && /* @__PURE__ */ jsx(NewTemplateModal, { onClose: () => setShowModal(false) })
  ] });
}
function useMissingTemplates(setEntityForSuggestions, onClick) {
  const existingTemplates = useExistingTemplates();
  const defaultTemplateTypes = useDefaultTemplateTypes();
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
  const { defaultTaxonomiesMenuItems, taxonomiesMenuItems } = useTaxonomiesMenuItems(onClickMenuItem);
  const { defaultPostTypesMenuItems, postTypesMenuItems } = usePostTypeMenuItems(onClickMenuItem);
  const authorMenuItem = useAuthorMenuItem(onClickMenuItem);
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
    ...usePostTypeArchiveMenuItems(),
    ...postTypesMenuItems,
    ...taxonomiesMenuItems
  ];
  return missingTemplates;
}
var add_new_template_legacy_default = memo(NewTemplate);
export {
  add_new_template_legacy_default as default
};
//# sourceMappingURL=index.mjs.map

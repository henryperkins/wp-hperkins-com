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

// packages/edit-site/src/components/add-new-template-legacy/utils.js
var utils_exports = {};
__export(utils_exports, {
  mapToIHasNameAndId: () => mapToIHasNameAndId,
  useAuthorMenuItem: () => useAuthorMenuItem,
  useDefaultTemplateTypes: () => useDefaultTemplateTypes,
  useExistingTemplates: () => useExistingTemplates,
  usePostTypeArchiveMenuItems: () => usePostTypeArchiveMenuItems,
  usePostTypeMenuItems: () => usePostTypeMenuItems,
  useTaxonomiesMenuItems: () => useTaxonomiesMenuItems
});
module.exports = __toCommonJS(utils_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_url = require("@wordpress/url");
var import_constants = require("../../utils/constants.cjs");
var EMPTY_OBJECT = {};
var getValueFromObjectPath = (object, path) => {
  let value = object;
  path.split(".").forEach((fieldName) => {
    value = value?.[fieldName];
  });
  return value;
};
function prefixSlug(prefix, slug) {
  return `${prefix}-${(0, import_url.safeDecodeURI)(slug)}`;
}
var mapToIHasNameAndId = (entities, path) => {
  return (entities || []).map((entity) => ({
    ...entity,
    name: (0, import_html_entities.decodeEntities)(getValueFromObjectPath(entity, path))
  }));
};
var useExistingTemplates = () => {
  return (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityRecords(
      "postType",
      import_constants.TEMPLATE_POST_TYPE,
      {
        per_page: -1
      }
    ),
    []
  );
};
var useDefaultTemplateTypes = () => {
  return (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.default_template_types || [],
    []
  );
};
var usePublicPostTypes = () => {
  const postTypes = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getPostTypes({ per_page: -1 }),
    []
  );
  return (0, import_element.useMemo)(() => {
    const excludedPostTypes = ["attachment"];
    return postTypes?.filter(
      ({ viewable, slug }) => viewable && !excludedPostTypes.includes(slug)
    ).sort((a, b) => {
      if (a.slug === "post" || b.slug === "post") {
        return 0;
      }
      return a.name.localeCompare(b.name);
    });
  }, [postTypes]);
};
var usePublicTaxonomies = () => {
  const taxonomies = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getTaxonomies({ per_page: -1 }),
    []
  );
  return (0, import_element.useMemo)(() => {
    return taxonomies?.filter(
      ({ visibility }) => visibility?.publicly_queryable
    );
  }, [taxonomies]);
};
function usePostTypeArchiveMenuItems() {
  const publicPostTypes = usePublicPostTypes();
  const postTypesWithArchives = (0, import_element.useMemo)(
    () => publicPostTypes?.filter((postType) => postType.has_archive),
    [publicPostTypes]
  );
  const existingTemplates = useExistingTemplates();
  const postTypeLabels = (0, import_element.useMemo)(
    () => publicPostTypes?.reduce((accumulator, { labels }) => {
      const singularName = labels.singular_name.toLowerCase();
      accumulator[singularName] = (accumulator[singularName] || 0) + 1;
      return accumulator;
    }, {}),
    [publicPostTypes]
  );
  const needsUniqueIdentifier = (0, import_element.useCallback)(
    ({ labels, slug }) => {
      const singularName = labels.singular_name.toLowerCase();
      return postTypeLabels[singularName] > 1 && singularName !== slug;
    },
    [postTypeLabels]
  );
  return (0, import_element.useMemo)(
    () => postTypesWithArchives?.filter(
      (postType) => !(existingTemplates || []).some(
        (existingTemplate) => existingTemplate.slug === "archive-" + postType.slug
      )
    ).map((postType) => {
      let title;
      if (needsUniqueIdentifier(postType)) {
        title = (0, import_i18n.sprintf)(
          // translators: %1s: Name of the post type e.g: "Post"; %2s: Slug of the post type e.g: "book".
          (0, import_i18n.__)("Archive: %1$s (%2$s)"),
          postType.labels.singular_name,
          postType.slug
        );
      } else {
        title = (0, import_i18n.sprintf)(
          // translators: %s: Name of the post type e.g: "Post".
          (0, import_i18n.__)("Archive: %s"),
          postType.labels.singular_name
        );
      }
      return {
        slug: "archive-" + postType.slug,
        description: (0, import_i18n.sprintf)(
          // translators: %s: Name of the post type e.g: "Post".
          (0, import_i18n.__)(
            "Displays an archive with the latest posts of type: %s."
          ),
          postType.labels.singular_name
        ),
        title,
        // `icon` is the `menu_icon` property of a post type. We
        // only handle `dashicons` for now, even if the `menu_icon`
        // also supports urls and svg as values.
        icon: typeof postType.icon === "string" && postType.icon.startsWith("dashicons-") ? postType.icon.slice(10) : import_icons.archive,
        templatePrefix: "archive"
      };
    }) || [],
    [postTypesWithArchives, existingTemplates, needsUniqueIdentifier]
  );
}
var usePostTypeMenuItems = (onClickMenuItem) => {
  const publicPostTypes = usePublicPostTypes();
  const existingTemplates = useExistingTemplates();
  const defaultTemplateTypes = useDefaultTemplateTypes();
  const templateLabels = (0, import_element.useMemo)(
    () => publicPostTypes?.reduce((accumulator, { labels }) => {
      const templateName = (labels.template_name || labels.singular_name).toLowerCase();
      accumulator[templateName] = (accumulator[templateName] || 0) + 1;
      return accumulator;
    }, {}),
    [publicPostTypes]
  );
  const needsUniqueIdentifier = (0, import_element.useCallback)(
    ({ labels, slug }) => {
      const templateName = (labels.template_name || labels.singular_name).toLowerCase();
      return templateLabels[templateName] > 1 && templateName !== slug;
    },
    [templateLabels]
  );
  const templatePrefixes = (0, import_element.useMemo)(
    () => publicPostTypes?.reduce((accumulator, { slug }) => {
      let suffix = slug;
      if (slug !== "page") {
        suffix = `single-${suffix}`;
      }
      accumulator[slug] = suffix;
      return accumulator;
    }, {}),
    [publicPostTypes]
  );
  const postTypesInfo = useEntitiesInfo("postType", templatePrefixes);
  const existingTemplateSlugs = (existingTemplates || []).map(
    ({ slug }) => slug
  );
  const menuItems = (publicPostTypes || []).reduce(
    (accumulator, postType) => {
      const { slug, labels, icon } = postType;
      const generalTemplateSlug = templatePrefixes[slug];
      const defaultTemplateType = defaultTemplateTypes?.find(
        ({ slug: _slug }) => _slug === generalTemplateSlug
      );
      const hasGeneralTemplate = existingTemplateSlugs?.includes(generalTemplateSlug);
      const _needsUniqueIdentifier = needsUniqueIdentifier(postType);
      let menuItemTitle = labels.template_name || (0, import_i18n.sprintf)(
        // translators: %s: Name of the post type e.g: "Post".
        (0, import_i18n.__)("Single item: %s"),
        labels.singular_name
      );
      if (_needsUniqueIdentifier) {
        menuItemTitle = labels.template_name ? (0, import_i18n.sprintf)(
          // translators: 1: Name of the template e.g: "Single Item: Post". 2: Slug of the post type e.g: "book".
          (0, import_i18n._x)("%1$s (%2$s)", "post type menu label"),
          labels.template_name,
          slug
        ) : (0, import_i18n.sprintf)(
          // translators: 1: Name of the post type e.g: "Post". 2: Slug of the post type e.g: "book".
          (0, import_i18n._x)(
            "Single item: %1$s (%2$s)",
            "post type menu label"
          ),
          labels.singular_name,
          slug
        );
      }
      const menuItem = defaultTemplateType ? {
        ...defaultTemplateType,
        templatePrefix: templatePrefixes[slug]
      } : {
        slug: generalTemplateSlug,
        title: menuItemTitle,
        description: (0, import_i18n.sprintf)(
          // translators: %s: Name of the post type e.g: "Post".
          (0, import_i18n.__)("Displays a single item: %s."),
          labels.singular_name
        ),
        // `icon` is the `menu_icon` property of a post type. We
        // only handle `dashicons` for now, even if the `menu_icon`
        // also supports urls and svg as values.
        icon: typeof icon === "string" && icon.startsWith("dashicons-") ? icon.slice(10) : import_icons.post,
        templatePrefix: templatePrefixes[slug]
      };
      const hasEntities = postTypesInfo?.[slug]?.hasEntities;
      if (hasEntities) {
        menuItem.onClick = (template) => {
          onClickMenuItem({
            type: "postType",
            slug,
            config: {
              recordNamePath: "title.rendered",
              queryArgs: ({ search }) => {
                return {
                  _fields: "id,title,slug,link",
                  orderBy: search ? "relevance" : "modified",
                  exclude: postTypesInfo[slug].existingEntitiesIds
                };
              },
              getSpecificTemplate: (suggestion) => {
                const templateSlug = prefixSlug(
                  templatePrefixes[slug],
                  suggestion.slug
                );
                return {
                  title: templateSlug,
                  slug: templateSlug,
                  templatePrefix: templatePrefixes[slug]
                };
              }
            },
            labels,
            hasGeneralTemplate,
            template
          });
        };
      }
      if (!hasGeneralTemplate || hasEntities) {
        accumulator.push(menuItem);
      }
      return accumulator;
    },
    []
  );
  const postTypesMenuItems = (0, import_element.useMemo)(
    () => menuItems.reduce(
      (accumulator, postType) => {
        const { slug } = postType;
        let key = "postTypesMenuItems";
        if (slug === "page") {
          key = "defaultPostTypesMenuItems";
        }
        accumulator[key].push(postType);
        return accumulator;
      },
      { defaultPostTypesMenuItems: [], postTypesMenuItems: [] }
    ),
    [menuItems]
  );
  return postTypesMenuItems;
};
var useTaxonomiesMenuItems = (onClickMenuItem) => {
  const publicTaxonomies = usePublicTaxonomies();
  const existingTemplates = useExistingTemplates();
  const defaultTemplateTypes = useDefaultTemplateTypes();
  const templatePrefixes = (0, import_element.useMemo)(
    () => publicTaxonomies?.reduce((accumulator, { slug }) => {
      let suffix = slug;
      if (!["category", "post_tag"].includes(slug)) {
        suffix = `taxonomy-${suffix}`;
      }
      if (slug === "post_tag") {
        suffix = `tag`;
      }
      accumulator[slug] = suffix;
      return accumulator;
    }, {}),
    [publicTaxonomies]
  );
  const taxonomyLabels = publicTaxonomies?.reduce(
    (accumulator, { labels }) => {
      const templateName = (labels.template_name || labels.singular_name).toLowerCase();
      accumulator[templateName] = (accumulator[templateName] || 0) + 1;
      return accumulator;
    },
    {}
  );
  const needsUniqueIdentifier = (labels, slug) => {
    if (["category", "post_tag"].includes(slug)) {
      return false;
    }
    const templateName = (labels.template_name || labels.singular_name).toLowerCase();
    return taxonomyLabels[templateName] > 1 && templateName !== slug;
  };
  const taxonomiesInfo = useEntitiesInfo("taxonomy", templatePrefixes);
  const existingTemplateSlugs = (existingTemplates || []).map(
    ({ slug }) => slug
  );
  const menuItems = (publicTaxonomies || []).reduce(
    (accumulator, taxonomy) => {
      const { slug, labels } = taxonomy;
      const generalTemplateSlug = templatePrefixes[slug];
      const defaultTemplateType = defaultTemplateTypes?.find(
        ({ slug: _slug }) => _slug === generalTemplateSlug
      );
      const hasGeneralTemplate = existingTemplateSlugs?.includes(generalTemplateSlug);
      const _needsUniqueIdentifier = needsUniqueIdentifier(
        labels,
        slug
      );
      let menuItemTitle = labels.template_name || labels.singular_name;
      if (_needsUniqueIdentifier) {
        menuItemTitle = labels.template_name ? (0, import_i18n.sprintf)(
          // translators: 1: Name of the template e.g: "Products by Category". 2: Slug of the taxonomy e.g: "product_cat".
          (0, import_i18n._x)("%1$s (%2$s)", "taxonomy template menu label"),
          labels.template_name,
          slug
        ) : (0, import_i18n.sprintf)(
          // translators: 1: Name of the taxonomy e.g: "Category". 2: Slug of the taxonomy e.g: "product_cat".
          (0, import_i18n._x)("%1$s (%2$s)", "taxonomy menu label"),
          labels.singular_name,
          slug
        );
      }
      const menuItem = defaultTemplateType ? {
        ...defaultTemplateType,
        templatePrefix: templatePrefixes[slug]
      } : {
        slug: generalTemplateSlug,
        title: menuItemTitle,
        description: (0, import_i18n.sprintf)(
          // translators: %s: Name of the taxonomy e.g: "Product Categories".
          (0, import_i18n.__)("Displays taxonomy: %s."),
          labels.singular_name
        ),
        icon: import_icons.blockMeta,
        templatePrefix: templatePrefixes[slug]
      };
      const hasEntities = taxonomiesInfo?.[slug]?.hasEntities;
      if (hasEntities) {
        menuItem.onClick = (template) => {
          onClickMenuItem({
            type: "taxonomy",
            slug,
            config: {
              queryArgs: ({ search }) => {
                return {
                  _fields: "id,name,slug,link",
                  orderBy: search ? "name" : "count",
                  exclude: taxonomiesInfo[slug].existingEntitiesIds
                };
              },
              getSpecificTemplate: (suggestion) => {
                const templateSlug = prefixSlug(
                  templatePrefixes[slug],
                  suggestion.slug
                );
                return {
                  title: templateSlug,
                  slug: templateSlug,
                  templatePrefix: templatePrefixes[slug]
                };
              }
            },
            labels,
            hasGeneralTemplate,
            template
          });
        };
      }
      if (!hasGeneralTemplate || hasEntities) {
        accumulator.push(menuItem);
      }
      return accumulator;
    },
    []
  );
  const taxonomiesMenuItems = (0, import_element.useMemo)(
    () => menuItems.reduce(
      (accumulator, taxonomy) => {
        const { slug } = taxonomy;
        let key = "taxonomiesMenuItems";
        if (["category", "tag"].includes(slug)) {
          key = "defaultTaxonomiesMenuItems";
        }
        accumulator[key].push(taxonomy);
        return accumulator;
      },
      { defaultTaxonomiesMenuItems: [], taxonomiesMenuItems: [] }
    ),
    [menuItems]
  );
  return taxonomiesMenuItems;
};
var USE_AUTHOR_MENU_ITEM_TEMPLATE_PREFIX = { user: "author" };
var USE_AUTHOR_MENU_ITEM_QUERY_PARAMETERS = { user: { who: "authors" } };
function useAuthorMenuItem(onClickMenuItem) {
  const existingTemplates = useExistingTemplates();
  const defaultTemplateTypes = useDefaultTemplateTypes();
  const authorInfo = useEntitiesInfo(
    "root",
    USE_AUTHOR_MENU_ITEM_TEMPLATE_PREFIX,
    USE_AUTHOR_MENU_ITEM_QUERY_PARAMETERS
  );
  let authorMenuItem = defaultTemplateTypes?.find(
    ({ slug }) => slug === "author"
  );
  if (!authorMenuItem) {
    authorMenuItem = {
      description: (0, import_i18n.__)(
        "Displays latest posts written by a single author."
      ),
      slug: "author",
      title: "Author"
    };
  }
  const hasGeneralTemplate = !!existingTemplates?.find(
    ({ slug }) => slug === "author"
  );
  if (authorInfo.user?.hasEntities) {
    authorMenuItem = { ...authorMenuItem, templatePrefix: "author" };
    authorMenuItem.onClick = (template) => {
      onClickMenuItem({
        type: "root",
        slug: "user",
        config: {
          queryArgs: ({ search }) => {
            return {
              _fields: "id,name,slug,link",
              orderBy: search ? "name" : "registered_date",
              exclude: authorInfo.user.existingEntitiesIds,
              who: "authors"
            };
          },
          getSpecificTemplate: (suggestion) => {
            const templateSlug = prefixSlug(
              "author",
              suggestion.slug
            );
            return {
              title: templateSlug,
              slug: templateSlug,
              templatePrefix: "author"
            };
          }
        },
        labels: {
          singular_name: (0, import_i18n.__)("Author"),
          search_items: (0, import_i18n.__)("Search Authors"),
          not_found: (0, import_i18n.__)("No authors found."),
          all_items: (0, import_i18n.__)("All Authors")
        },
        hasGeneralTemplate,
        template
      });
    };
  }
  if (!hasGeneralTemplate || authorInfo.user?.hasEntities) {
    return authorMenuItem;
  }
}
var useExistingTemplateSlugs = (templatePrefixes) => {
  const existingTemplates = useExistingTemplates();
  const existingSlugs = (0, import_element.useMemo)(() => {
    return Object.entries(templatePrefixes || {}).reduce(
      (accumulator, [slug, prefix]) => {
        const slugsWithTemplates = (existingTemplates || []).reduce(
          (_accumulator, existingTemplate) => {
            const _prefix = `${prefix}-`;
            if (existingTemplate.slug.startsWith(_prefix)) {
              _accumulator.push(
                existingTemplate.slug.substring(
                  _prefix.length
                )
              );
            }
            return _accumulator;
          },
          []
        );
        if (slugsWithTemplates.length) {
          accumulator[slug] = slugsWithTemplates;
        }
        return accumulator;
      },
      {}
    );
  }, [templatePrefixes, existingTemplates]);
  return existingSlugs;
};
var useTemplatesToExclude = (entityName, templatePrefixes, additionalQueryParameters = {}) => {
  const slugsToExcludePerEntity = useExistingTemplateSlugs(templatePrefixes);
  const recordsToExcludePerEntity = (0, import_data.useSelect)(
    (select) => {
      return Object.entries(slugsToExcludePerEntity || {}).reduce(
        (accumulator, [slug, slugsWithTemplates]) => {
          const entitiesWithTemplates = select(
            import_core_data.store
          ).getEntityRecords(entityName, slug, {
            _fields: "id",
            context: "view",
            slug: slugsWithTemplates,
            ...additionalQueryParameters[slug]
          });
          if (entitiesWithTemplates?.length) {
            accumulator[slug] = entitiesWithTemplates;
          }
          return accumulator;
        },
        {}
      );
    },
    [slugsToExcludePerEntity]
  );
  return recordsToExcludePerEntity;
};
var useEntitiesInfo = (entityName, templatePrefixes, additionalQueryParameters = EMPTY_OBJECT) => {
  const recordsToExcludePerEntity = useTemplatesToExclude(
    entityName,
    templatePrefixes,
    additionalQueryParameters
  );
  const entitiesHasRecords = (0, import_data.useSelect)(
    (select) => {
      return Object.keys(templatePrefixes || {}).reduce(
        (accumulator, slug) => {
          const existingEntitiesIds = recordsToExcludePerEntity?.[slug]?.map(
            ({ id }) => id
          ) || [];
          accumulator[slug] = !!select(
            import_core_data.store
          ).getEntityRecords(entityName, slug, {
            per_page: 1,
            _fields: "id",
            context: "view",
            exclude: existingEntitiesIds,
            ...additionalQueryParameters[slug]
          })?.length;
          return accumulator;
        },
        {}
      );
    },
    [
      templatePrefixes,
      recordsToExcludePerEntity,
      entityName,
      additionalQueryParameters
    ]
  );
  const entitiesInfo = (0, import_element.useMemo)(() => {
    return Object.keys(templatePrefixes || {}).reduce(
      (accumulator, slug) => {
        const existingEntitiesIds = recordsToExcludePerEntity?.[slug]?.map(
          ({ id }) => id
        ) || [];
        accumulator[slug] = {
          hasEntities: entitiesHasRecords[slug],
          existingEntitiesIds
        };
        return accumulator;
      },
      {}
    );
  }, [templatePrefixes, recordsToExcludePerEntity, entitiesHasRecords]);
  return entitiesInfo;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToIHasNameAndId,
  useAuthorMenuItem,
  useDefaultTemplateTypes,
  useExistingTemplates,
  usePostTypeArchiveMenuItems,
  usePostTypeMenuItems,
  useTaxonomiesMenuItems
});
//# sourceMappingURL=utils.cjs.map

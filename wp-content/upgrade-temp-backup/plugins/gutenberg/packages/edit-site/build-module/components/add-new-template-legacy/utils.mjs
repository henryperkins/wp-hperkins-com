// packages/edit-site/src/components/add-new-template-legacy/utils.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { useMemo, useCallback } from "@wordpress/element";
import { __, _x, sprintf } from "@wordpress/i18n";
import { blockMeta, post, archive } from "@wordpress/icons";
import { safeDecodeURI } from "@wordpress/url";
import { TEMPLATE_POST_TYPE } from "../../utils/constants.mjs";
var EMPTY_OBJECT = {};
var getValueFromObjectPath = (object, path) => {
  let value = object;
  path.split(".").forEach((fieldName) => {
    value = value?.[fieldName];
  });
  return value;
};
function prefixSlug(prefix, slug) {
  return `${prefix}-${safeDecodeURI(slug)}`;
}
var mapToIHasNameAndId = (entities, path) => {
  return (entities || []).map((entity) => ({
    ...entity,
    name: decodeEntities(getValueFromObjectPath(entity, path))
  }));
};
var useExistingTemplates = () => {
  return useSelect(
    (select) => select(coreStore).getEntityRecords(
      "postType",
      TEMPLATE_POST_TYPE,
      {
        per_page: -1
      }
    ),
    []
  );
};
var useDefaultTemplateTypes = () => {
  return useSelect(
    (select) => select(coreStore).getCurrentTheme()?.default_template_types || [],
    []
  );
};
var usePublicPostTypes = () => {
  const postTypes = useSelect(
    (select) => select(coreStore).getPostTypes({ per_page: -1 }),
    []
  );
  return useMemo(() => {
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
  const taxonomies = useSelect(
    (select) => select(coreStore).getTaxonomies({ per_page: -1 }),
    []
  );
  return useMemo(() => {
    return taxonomies?.filter(
      ({ visibility }) => visibility?.publicly_queryable
    );
  }, [taxonomies]);
};
function usePostTypeArchiveMenuItems() {
  const publicPostTypes = usePublicPostTypes();
  const postTypesWithArchives = useMemo(
    () => publicPostTypes?.filter((postType) => postType.has_archive),
    [publicPostTypes]
  );
  const existingTemplates = useExistingTemplates();
  const postTypeLabels = useMemo(
    () => publicPostTypes?.reduce((accumulator, { labels }) => {
      const singularName = labels.singular_name.toLowerCase();
      accumulator[singularName] = (accumulator[singularName] || 0) + 1;
      return accumulator;
    }, {}),
    [publicPostTypes]
  );
  const needsUniqueIdentifier = useCallback(
    ({ labels, slug }) => {
      const singularName = labels.singular_name.toLowerCase();
      return postTypeLabels[singularName] > 1 && singularName !== slug;
    },
    [postTypeLabels]
  );
  return useMemo(
    () => postTypesWithArchives?.filter(
      (postType) => !(existingTemplates || []).some(
        (existingTemplate) => existingTemplate.slug === "archive-" + postType.slug
      )
    ).map((postType) => {
      let title;
      if (needsUniqueIdentifier(postType)) {
        title = sprintf(
          // translators: %1s: Name of the post type e.g: "Post"; %2s: Slug of the post type e.g: "book".
          __("Archive: %1$s (%2$s)"),
          postType.labels.singular_name,
          postType.slug
        );
      } else {
        title = sprintf(
          // translators: %s: Name of the post type e.g: "Post".
          __("Archive: %s"),
          postType.labels.singular_name
        );
      }
      return {
        slug: "archive-" + postType.slug,
        description: sprintf(
          // translators: %s: Name of the post type e.g: "Post".
          __(
            "Displays an archive with the latest posts of type: %s."
          ),
          postType.labels.singular_name
        ),
        title,
        // `icon` is the `menu_icon` property of a post type. We
        // only handle `dashicons` for now, even if the `menu_icon`
        // also supports urls and svg as values.
        icon: typeof postType.icon === "string" && postType.icon.startsWith("dashicons-") ? postType.icon.slice(10) : archive,
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
  const templateLabels = useMemo(
    () => publicPostTypes?.reduce((accumulator, { labels }) => {
      const templateName = (labels.template_name || labels.singular_name).toLowerCase();
      accumulator[templateName] = (accumulator[templateName] || 0) + 1;
      return accumulator;
    }, {}),
    [publicPostTypes]
  );
  const needsUniqueIdentifier = useCallback(
    ({ labels, slug }) => {
      const templateName = (labels.template_name || labels.singular_name).toLowerCase();
      return templateLabels[templateName] > 1 && templateName !== slug;
    },
    [templateLabels]
  );
  const templatePrefixes = useMemo(
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
      let menuItemTitle = labels.template_name || sprintf(
        // translators: %s: Name of the post type e.g: "Post".
        __("Single item: %s"),
        labels.singular_name
      );
      if (_needsUniqueIdentifier) {
        menuItemTitle = labels.template_name ? sprintf(
          // translators: 1: Name of the template e.g: "Single Item: Post". 2: Slug of the post type e.g: "book".
          _x("%1$s (%2$s)", "post type menu label"),
          labels.template_name,
          slug
        ) : sprintf(
          // translators: 1: Name of the post type e.g: "Post". 2: Slug of the post type e.g: "book".
          _x(
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
        description: sprintf(
          // translators: %s: Name of the post type e.g: "Post".
          __("Displays a single item: %s."),
          labels.singular_name
        ),
        // `icon` is the `menu_icon` property of a post type. We
        // only handle `dashicons` for now, even if the `menu_icon`
        // also supports urls and svg as values.
        icon: typeof icon === "string" && icon.startsWith("dashicons-") ? icon.slice(10) : post,
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
  const postTypesMenuItems = useMemo(
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
  const templatePrefixes = useMemo(
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
        menuItemTitle = labels.template_name ? sprintf(
          // translators: 1: Name of the template e.g: "Products by Category". 2: Slug of the taxonomy e.g: "product_cat".
          _x("%1$s (%2$s)", "taxonomy template menu label"),
          labels.template_name,
          slug
        ) : sprintf(
          // translators: 1: Name of the taxonomy e.g: "Category". 2: Slug of the taxonomy e.g: "product_cat".
          _x("%1$s (%2$s)", "taxonomy menu label"),
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
        description: sprintf(
          // translators: %s: Name of the taxonomy e.g: "Product Categories".
          __("Displays taxonomy: %s."),
          labels.singular_name
        ),
        icon: blockMeta,
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
  const taxonomiesMenuItems = useMemo(
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
      description: __(
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
          singular_name: __("Author"),
          search_items: __("Search Authors"),
          not_found: __("No authors found."),
          all_items: __("All Authors")
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
  const existingSlugs = useMemo(() => {
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
  const recordsToExcludePerEntity = useSelect(
    (select) => {
      return Object.entries(slugsToExcludePerEntity || {}).reduce(
        (accumulator, [slug, slugsWithTemplates]) => {
          const entitiesWithTemplates = select(
            coreStore
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
  const entitiesHasRecords = useSelect(
    (select) => {
      return Object.keys(templatePrefixes || {}).reduce(
        (accumulator, slug) => {
          const existingEntitiesIds = recordsToExcludePerEntity?.[slug]?.map(
            ({ id }) => id
          ) || [];
          accumulator[slug] = !!select(
            coreStore
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
  const entitiesInfo = useMemo(() => {
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
export {
  mapToIHasNameAndId,
  useAuthorMenuItem,
  useDefaultTemplateTypes,
  useExistingTemplates,
  usePostTypeArchiveMenuItems,
  usePostTypeMenuItems,
  useTaxonomiesMenuItems
};
//# sourceMappingURL=utils.mjs.map

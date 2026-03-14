// packages/edit-site/src/components/page-templates/fields.js
import clsx from "clsx";
import {
  Icon,
  __experimentalHStack as HStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { __, _x } from "@wordpress/i18n";
import { useState, useMemo } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { parse } from "@wordpress/blocks";
import { BlockPreview } from "@wordpress/block-editor";
import {
  EditorProvider,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import {
  privateApis as corePrivateApis,
  store as coreStore
} from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useAddedBy } from "./hooks.mjs";
import { useDefaultTemplateTypes } from "../add-new-template/utils.mjs";
import usePatternSettings from "../page-patterns/use-pattern-settings.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
var { useEntityRecordsWithPermissions } = unlock(corePrivateApis);
var { useStyle } = unlock(editorPrivateApis);
function useAllDefaultTemplateTypes() {
  const defaultTemplateTypes = useDefaultTemplateTypes();
  const { records: staticRecords } = useEntityRecordsWithPermissions(
    "root",
    "registeredTemplate"
  );
  return [
    ...defaultTemplateTypes,
    ...staticRecords?.filter((record) => !record.is_custom).map((record) => {
      return {
        slug: record.slug,
        title: record.title.rendered,
        description: record.description
      };
    })
  ];
}
function PreviewField({ item }) {
  const settings = usePatternSettings();
  const backgroundColor = useStyle("color.background") ?? "white";
  const blocks = useMemo(() => {
    return parse(item.content.raw);
  }, [item.content.raw]);
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ jsx(EditorProvider, { post: item, settings, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "page-templates-preview-field",
      style: { backgroundColor },
      children: [
        isEmpty && __("Empty template"),
        !isEmpty && /* @__PURE__ */ jsx(BlockPreview.Async, { children: /* @__PURE__ */ jsx(BlockPreview, { blocks }) })
      ]
    }
  ) });
}
var previewField = {
  label: __("Preview"),
  id: "preview",
  render: PreviewField,
  enableSorting: false
};
var descriptionField = {
  label: __("Description"),
  id: "description",
  render: window?.__experimentalTemplateActivate ? function RenderDescription({ item }) {
    const defaultTemplateTypes = useAllDefaultTemplateTypes();
    const defaultTemplateType = defaultTemplateTypes.find(
      (type) => type.slug === item.slug
    );
    return item.description ? decodeEntities(item.description) : defaultTemplateType?.description;
  } : ({ item }) => {
    return item.description && decodeEntities(item.description);
  },
  enableSorting: false,
  enableGlobalSearch: true
};
function AuthorField({ item }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { text, icon, imageUrl } = useAddedBy(item.type, item.id);
  return /* @__PURE__ */ jsxs(HStack, { alignment: "left", spacing: 0, children: [
    imageUrl && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("fields-controls__author-avatar", {
          "is-loaded": isImageLoaded
        }),
        children: /* @__PURE__ */ jsx(
          "img",
          {
            onLoad: () => setIsImageLoaded(true),
            alt: "",
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ jsx("div", { className: "fields-controls__author-icon", children: /* @__PURE__ */ jsx(Icon, { icon }) }),
    /* @__PURE__ */ jsx("span", { className: "fields-controls__author-name", children: text })
  ] });
}
var authorField = {
  label: __("Author"),
  id: "author",
  getValue: ({ item }) => item.author_text ?? item.author,
  render: AuthorField
};
var activeField = {
  label: __("Status"),
  id: "active",
  type: "boolean",
  getValue: ({ item }) => item._isActive,
  render: function Render({ item }) {
    const activeLabel = item._isCustom ? _x("Active when used", "template") : _x("Active", "template");
    const activeIntent = item._isCustom ? "info" : "success";
    const isActive = item._isActive;
    return /* @__PURE__ */ jsx(Badge, { intent: isActive ? activeIntent : "default", children: isActive ? activeLabel : _x("Inactive", "template") });
  }
};
var useThemeField = () => {
  const activeTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme()
  );
  return useMemo(
    () => ({
      label: __("Compatible Theme"),
      id: "theme",
      getValue: ({ item }) => item.theme,
      render: function Render3({ item }) {
        if (item.theme === activeTheme.stylesheet) {
          return /* @__PURE__ */ jsx(Badge, { intent: "success", children: item.theme });
        }
        return /* @__PURE__ */ jsx(Badge, { intent: "error", children: item.theme });
      }
    }),
    [activeTheme]
  );
};
var slugField = {
  label: __("Template Type"),
  id: "slug",
  getValue: ({ item }) => item.slug,
  render: function Render2({ item }) {
    const defaultTemplateTypes = useAllDefaultTemplateTypes();
    const defaultTemplateType = defaultTemplateTypes.find(
      (type) => type.slug === item.slug
    );
    return defaultTemplateType?.title || _x("Custom", "template type");
  }
};
export {
  activeField,
  authorField,
  descriptionField,
  previewField,
  slugField,
  useThemeField
};
//# sourceMappingURL=fields.mjs.map

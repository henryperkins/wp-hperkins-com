// packages/edit-site/src/components/page-patterns/fields.js
import clsx from "clsx";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { __, _x } from "@wordpress/i18n";
import { useState, useMemo, useId } from "@wordpress/element";
import { BlockPreview } from "@wordpress/block-editor";
import { Icon } from "@wordpress/icons";
import { parse } from "@wordpress/blocks";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import {
  TEMPLATE_PART_POST_TYPE,
  PATTERN_SYNC_TYPES,
  OPERATOR_IS
} from "../../utils/constants.mjs";
import { useAddedBy } from "../page-templates/hooks.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useStyle } = unlock(editorPrivateApis);
function PreviewField({ item }) {
  const descriptionId = useId();
  const description = item.description || item?.excerpt?.raw;
  const isTemplatePart = item.type === TEMPLATE_PART_POST_TYPE;
  const backgroundColor = useStyle("color.background");
  const blocks = useMemo(() => {
    return item.blocks ?? parse(item.content.raw, {
      __unstableSkipMigrationLogs: true
    });
  }, [item?.content?.raw, item.blocks]);
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "page-patterns-preview-field",
      style: { backgroundColor },
      "aria-describedby": !!description ? descriptionId : void 0,
      children: [
        isEmpty && isTemplatePart && __("Empty template part"),
        isEmpty && !isTemplatePart && __("Empty pattern"),
        !isEmpty && /* @__PURE__ */ jsx(BlockPreview.Async, { children: /* @__PURE__ */ jsx(
          BlockPreview,
          {
            blocks,
            viewportWidth: item.viewportWidth
          }
        ) }),
        !!description && /* @__PURE__ */ jsx("div", { hidden: true, id: descriptionId, children: description })
      ]
    }
  );
}
var previewField = {
  label: __("Preview"),
  id: "preview",
  render: PreviewField,
  enableSorting: false
};
var SYNC_FILTERS = [
  {
    value: PATTERN_SYNC_TYPES.full,
    label: _x("Synced", "pattern (singular)"),
    description: __("Patterns that are kept in sync across the site.")
  },
  {
    value: PATTERN_SYNC_TYPES.unsynced,
    label: _x("Not synced", "pattern (singular)"),
    description: __(
      "Patterns that can be changed freely without affecting the site."
    )
  }
];
var patternStatusField = {
  label: __("Sync status"),
  id: "sync-status",
  render: ({ item }) => {
    const syncStatus = "wp_pattern_sync_status" in item ? item.wp_pattern_sync_status || PATTERN_SYNC_TYPES.full : PATTERN_SYNC_TYPES.unsynced;
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `edit-site-patterns__field-sync-status-${syncStatus}`,
        children: SYNC_FILTERS.find(({ value }) => value === syncStatus).label
      }
    );
  },
  elements: SYNC_FILTERS,
  filterBy: {
    operators: [OPERATOR_IS],
    isPrimary: true
  },
  enableSorting: false
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
var templatePartAuthorField = {
  label: __("Author"),
  id: "author",
  getValue: ({ item }) => item.author_text,
  render: AuthorField,
  filterBy: {
    isPrimary: true
  }
};
export {
  patternStatusField,
  previewField,
  templatePartAuthorField
};
//# sourceMappingURL=fields.mjs.map

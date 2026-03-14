// packages/editor/src/components/post-revisions-preview/diff-format-types.js
import { __ } from "@wordpress/i18n";
import { registerFormatType, unregisterFormatType } from "@wordpress/rich-text";
var DIFF_FORMAT_TYPES = [
  {
    name: "revision/diff-removed",
    title: __("Removed"),
    tagName: "del",
    className: "revision-diff-removed"
  },
  {
    name: "revision/diff-added",
    title: __("Added"),
    tagName: "ins",
    className: "revision-diff-added"
  },
  {
    name: "revision/diff-format-added",
    title: __("Format added"),
    tagName: "span",
    className: "revision-diff-format-added"
  },
  {
    name: "revision/diff-format-removed",
    title: __("Format removed"),
    tagName: "span",
    className: "revision-diff-format-removed"
  },
  {
    name: "revision/diff-format-changed",
    title: __("Format changed"),
    tagName: "span",
    className: "revision-diff-format-changed"
  }
];
function registerDiffFormatTypes() {
  for (const formatType of DIFF_FORMAT_TYPES) {
    registerFormatType(formatType.name, {
      ...formatType,
      attributes: { title: "title" },
      edit: () => null
    });
  }
}
function unregisterDiffFormatTypes() {
  for (const formatType of DIFF_FORMAT_TYPES) {
    unregisterFormatType(formatType.name);
  }
}
export {
  registerDiffFormatTypes,
  unregisterDiffFormatTypes
};
//# sourceMappingURL=diff-format-types.mjs.map

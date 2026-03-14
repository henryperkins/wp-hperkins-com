// packages/media-fields/src/caption/index.tsx
import { __ } from "@wordpress/i18n";
import { TextareaControl } from "@wordpress/components";
import { getRawContent } from "../utils/get-raw-content.mjs";
import { jsx } from "react/jsx-runtime";
var captionField = {
  id: "caption",
  type: "text",
  label: __("Caption"),
  getValue: ({ item }) => getRawContent(item?.caption),
  render: ({ item }) => getRawContent(item?.caption) || "-",
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ jsx(
      TextareaControl,
      {
        label: field.label,
        value: getRawContent(data.caption) || "",
        onChange: (value) => onChange({ caption: value }),
        rows: 2
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var caption_default = captionField;
export {
  caption_default as default
};
//# sourceMappingURL=index.mjs.map

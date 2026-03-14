// packages/media-fields/src/description/index.tsx
import { __ } from "@wordpress/i18n";
import { TextareaControl } from "@wordpress/components";
import { getRawContent } from "../utils/get-raw-content.mjs";
import { jsx } from "react/jsx-runtime";
var descriptionField = {
  id: "description",
  type: "text",
  label: __("Description"),
  getValue: ({ item }) => getRawContent(item?.description),
  render: ({ item }) => /* @__PURE__ */ jsx("div", { children: getRawContent(item?.description) || "-" }),
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ jsx(
      TextareaControl,
      {
        label: field.label,
        value: getRawContent(data.description) || "",
        onChange: (value) => onChange({ description: value }),
        rows: 5
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var description_default = descriptionField;
export {
  description_default as default
};
//# sourceMappingURL=index.mjs.map

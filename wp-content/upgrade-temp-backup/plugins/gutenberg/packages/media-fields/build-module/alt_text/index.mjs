// packages/media-fields/src/alt_text/index.tsx
import { __ } from "@wordpress/i18n";
import { TextareaControl } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var altTextField = {
  id: "alt_text",
  type: "text",
  label: __("Alt text"),
  isVisible: (item) => item?.media_type === "image",
  render: ({ item }) => item?.alt_text || "-",
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ jsx(
      TextareaControl,
      {
        label: field.label,
        value: data.alt_text || "",
        onChange: (value) => onChange({ alt_text: value }),
        rows: 2
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var alt_text_default = altTextField;
export {
  alt_text_default as default
};
//# sourceMappingURL=index.mjs.map

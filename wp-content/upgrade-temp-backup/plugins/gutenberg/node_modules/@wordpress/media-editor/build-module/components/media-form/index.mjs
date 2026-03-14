// packages/media-editor/src/components/media-form/index.tsx
import { DataForm } from "@wordpress/dataviews";
import { Spinner, __experimentalVStack as VStack } from "@wordpress/components";
import { useMediaEditorContext } from "../media-editor-provider/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function MediaForm({
  form: formOverrides,
  header
}) {
  const { media, fields, onChange } = useMediaEditorContext();
  if (!media || !onChange) {
    return /* @__PURE__ */ jsx("div", { className: "media-editor-form media-editor-form--loading", children: /* @__PURE__ */ jsx(Spinner, {}) });
  }
  const defaultForm = {
    layout: {
      type: "panel"
    },
    fields: fields.map((field) => {
      if (["title", "alt_text", "caption", "description"].includes(
        field.id
      )) {
        return {
          id: field.id,
          layout: {
            type: "regular",
            labelPosition: "top"
          }
        };
      }
      return field.id;
    })
  };
  const form = formOverrides || defaultForm;
  return /* @__PURE__ */ jsx("div", { className: "media-editor-form", children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    header,
    /* @__PURE__ */ jsx(
      DataForm,
      {
        data: media,
        fields,
        form,
        onChange
      }
    )
  ] }) });
}
export {
  MediaForm as default
};
//# sourceMappingURL=index.mjs.map

// packages/dataviews/src/components/dataviews-selection-checkbox/index.tsx
import { CheckboxControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function DataViewsSelectionCheckbox({
  selection,
  onChangeSelection,
  item,
  getItemId,
  titleField,
  disabled,
  ...extraProps
}) {
  const id = getItemId(item);
  const checked = !disabled && selection.includes(id);
  const selectionLabel = titleField?.getValue?.({ item }) || __("(no title)");
  return /* @__PURE__ */ jsx(
    CheckboxControl,
    {
      className: "dataviews-selection-checkbox",
      "aria-label": selectionLabel,
      "aria-disabled": disabled,
      checked,
      onChange: () => {
        if (disabled) {
          return;
        }
        onChangeSelection(
          selection.includes(id) ? selection.filter((itemId) => id !== itemId) : [...selection, id]
        );
      },
      ...extraProps
    }
  );
}
export {
  DataViewsSelectionCheckbox as default
};
//# sourceMappingURL=index.mjs.map

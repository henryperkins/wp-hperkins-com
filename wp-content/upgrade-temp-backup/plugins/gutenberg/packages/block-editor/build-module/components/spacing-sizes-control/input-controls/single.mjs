// packages/block-editor/src/components/spacing-sizes-control/input-controls/single.js
import SpacingInputControl from "./spacing-input-control.mjs";
import { LABELS, getPresetValueFromCustomValue } from "../utils.mjs";
import { jsx } from "react/jsx-runtime";
function SingleInputControl({
  minimumCustomValue,
  onChange,
  onMouseOut,
  onMouseOver,
  showSideInLabel,
  side,
  spacingSizes,
  type,
  values
}) {
  const createHandleOnChange = (currentSide) => (next) => {
    const nextValues = {
      ...Object.keys(values).reduce((acc, key) => {
        acc[key] = getPresetValueFromCustomValue(
          values[key],
          spacingSizes
        );
        return acc;
      }, {})
    };
    nextValues[currentSide] = next;
    onChange(nextValues);
  };
  return /* @__PURE__ */ jsx(
    SpacingInputControl,
    {
      label: LABELS[side],
      minimumCustomValue,
      onChange: createHandleOnChange(side),
      onMouseOut,
      onMouseOver,
      showSideInLabel,
      side,
      spacingSizes,
      type,
      value: values[side],
      withInputField: false
    }
  );
}
export {
  SingleInputControl as default
};
//# sourceMappingURL=single.mjs.map

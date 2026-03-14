// packages/block-editor/src/components/spacing-sizes-control/input-controls/axial.js
import SpacingInputControl from "./spacing-input-control.mjs";
import {
  LABELS,
  ICONS,
  getPresetValueFromCustomValue,
  hasAxisSupport
} from "../utils.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var groupedSides = ["vertical", "horizontal"];
function AxialInputControls({
  minimumCustomValue,
  onChange,
  onMouseOut,
  onMouseOver,
  sides,
  spacingSizes,
  type,
  values
}) {
  const createHandleOnChange = (side) => (next) => {
    if (!onChange) {
      return;
    }
    const nextValues = {
      ...Object.keys(values).reduce((acc, key) => {
        acc[key] = getPresetValueFromCustomValue(
          values[key],
          spacingSizes
        );
        return acc;
      }, {})
    };
    if (side === "vertical") {
      nextValues.top = next;
      nextValues.bottom = next;
    }
    if (side === "horizontal") {
      nextValues.left = next;
      nextValues.right = next;
    }
    onChange(nextValues);
  };
  const filteredSides = sides?.length ? groupedSides.filter((side) => hasAxisSupport(sides, side)) : groupedSides;
  return /* @__PURE__ */ jsx(Fragment, { children: filteredSides.map((side) => {
    const axisValue = side === "vertical" ? values.top : values.left;
    return /* @__PURE__ */ jsx(
      SpacingInputControl,
      {
        icon: ICONS[side],
        label: LABELS[side],
        minimumCustomValue,
        onChange: createHandleOnChange(side),
        onMouseOut,
        onMouseOver,
        side,
        spacingSizes,
        type,
        value: axisValue,
        withInputField: false
      },
      `spacing-sizes-control-${side}`
    );
  }) });
}
export {
  AxialInputControls as default
};
//# sourceMappingURL=axial.mjs.map

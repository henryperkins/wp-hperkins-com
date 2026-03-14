// packages/block-editor/src/components/spacing-sizes-control/index.js
import {
  BaseControl,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { _x, sprintf } from "@wordpress/i18n";
import useSpacingSizes from "./hooks/use-spacing-sizes.mjs";
import AxialInputControls from "./input-controls/axial.mjs";
import SeparatedInputControls from "./input-controls/separated.mjs";
import SingleInputControl from "./input-controls/single.mjs";
import LinkedButton from "./linked-button.mjs";
import {
  ALL_SIDES,
  DEFAULT_VALUES,
  LABELS,
  VIEWS,
  getInitialView
} from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function SpacingSizesControl({
  inputProps,
  label: labelProp,
  minimumCustomValue = 0,
  onChange,
  onMouseOut,
  onMouseOver,
  showSideInLabel = true,
  sides = ALL_SIDES,
  useSelect,
  values
}) {
  const spacingSizes = useSpacingSizes();
  const inputValues = values || DEFAULT_VALUES;
  const hasOneSide = sides?.length === 1;
  const hasOnlyAxialSides = sides?.includes("horizontal") && sides?.includes("vertical") && sides?.length === 2;
  const [view, setView] = useState(getInitialView(inputValues, sides));
  const toggleLinked = () => {
    setView(view === VIEWS.axial ? VIEWS.custom : VIEWS.axial);
  };
  const handleOnChange = (nextValue) => {
    const newValues = { ...values, ...nextValue };
    onChange(newValues);
  };
  const inputControlProps = {
    ...inputProps,
    minimumCustomValue,
    onChange: handleOnChange,
    onMouseOut,
    onMouseOver,
    sides,
    spacingSizes,
    type: labelProp,
    useSelect,
    values: inputValues
  };
  const renderControls = () => {
    if (view === VIEWS.axial) {
      return /* @__PURE__ */ jsx(AxialInputControls, { ...inputControlProps });
    }
    if (view === VIEWS.custom) {
      return /* @__PURE__ */ jsx(SeparatedInputControls, { ...inputControlProps });
    }
    return /* @__PURE__ */ jsx(
      SingleInputControl,
      {
        side: view,
        ...inputControlProps,
        showSideInLabel
      }
    );
  };
  const sideLabel = ALL_SIDES.includes(view) && showSideInLabel ? LABELS[view] : "";
  const label = sprintf(
    // translators: 1: The side of the block being modified (top, bottom, left etc.). 2. Type of spacing being modified (padding, margin, etc).
    _x("%1$s %2$s", "spacing"),
    labelProp,
    sideLabel
  ).trim();
  return /* @__PURE__ */ jsxs("fieldset", { className: "spacing-sizes-control", children: [
    /* @__PURE__ */ jsxs(HStack, { className: "spacing-sizes-control__header", children: [
      /* @__PURE__ */ jsx(
        BaseControl.VisualLabel,
        {
          as: "legend",
          className: "spacing-sizes-control__label",
          children: label
        }
      ),
      !hasOneSide && !hasOnlyAxialSides && /* @__PURE__ */ jsx(
        LinkedButton,
        {
          label: labelProp,
          onClick: toggleLinked,
          isLinked: view === VIEWS.axial
        }
      )
    ] }),
    /* @__PURE__ */ jsx(VStack, { spacing: 0.5, children: renderControls() })
  ] });
}
export {
  SpacingSizesControl as default
};
//# sourceMappingURL=index.mjs.map

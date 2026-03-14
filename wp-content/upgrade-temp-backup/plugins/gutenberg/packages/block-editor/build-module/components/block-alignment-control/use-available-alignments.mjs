// packages/block-editor/src/components/block-alignment-control/use-available-alignments.js
import { useSelect } from "@wordpress/data";
import { useLayout } from "../block-list/layout.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { getLayoutType } from "../../layouts/index.mjs";
var EMPTY_ARRAY = [];
var DEFAULT_CONTROLS = ["none", "left", "center", "right", "wide", "full"];
var WIDE_CONTROLS = ["wide", "full"];
function useAvailableAlignments(controls = DEFAULT_CONTROLS) {
  if (!controls.includes("none")) {
    controls = ["none", ...controls];
  }
  const isNoneOnly = controls.length === 1 && controls[0] === "none";
  const [wideControlsEnabled, themeSupportsLayout, isBlockBasedTheme] = useSelect(
    (select) => {
      if (isNoneOnly) {
        return [false, false, false];
      }
      const settings = select(blockEditorStore).getSettings();
      return [
        settings.alignWide ?? false,
        settings.supportsLayout,
        settings.__unstableIsBlockBasedTheme
      ];
    },
    [isNoneOnly]
  );
  const layout = useLayout();
  if (isNoneOnly) {
    return EMPTY_ARRAY;
  }
  const layoutType = getLayoutType(layout?.type);
  if (themeSupportsLayout) {
    const layoutAlignments = layoutType.getAlignments(
      layout,
      isBlockBasedTheme
    );
    const alignments2 = layoutAlignments.filter(
      (alignment) => controls.includes(alignment.name)
    );
    if (alignments2.length === 1 && alignments2[0].name === "none") {
      return EMPTY_ARRAY;
    }
    return alignments2;
  }
  if (layoutType.name !== "default" && layoutType.name !== "constrained") {
    return EMPTY_ARRAY;
  }
  const alignments = controls.filter((control) => {
    if (layout.alignments) {
      return layout.alignments.includes(control);
    }
    if (!wideControlsEnabled && WIDE_CONTROLS.includes(control)) {
      return false;
    }
    return DEFAULT_CONTROLS.includes(control);
  }).map((name) => ({ name }));
  if (alignments.length === 1 && alignments[0].name === "none") {
    return EMPTY_ARRAY;
  }
  return alignments;
}
export {
  useAvailableAlignments as default
};
//# sourceMappingURL=use-available-alignments.mjs.map

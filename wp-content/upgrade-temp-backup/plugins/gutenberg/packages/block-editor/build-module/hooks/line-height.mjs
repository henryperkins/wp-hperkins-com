// packages/block-editor/src/hooks/line-height.js
import { hasBlockSupport } from "@wordpress/blocks";
import LineHeightControl from "../components/line-height-control/index.mjs";
import { cleanEmptyObject } from "./utils.mjs";
import { useSettings } from "../components/use-settings/index.mjs";
import { jsx } from "react/jsx-runtime";
var LINE_HEIGHT_SUPPORT_KEY = "typography.lineHeight";
function LineHeightEdit(props) {
  const {
    attributes: { style },
    setAttributes
  } = props;
  const onChange = (newLineHeightValue) => {
    const newStyle = {
      ...style,
      typography: {
        ...style?.typography,
        lineHeight: newLineHeightValue
      }
    };
    setAttributes({ style: cleanEmptyObject(newStyle) });
  };
  return /* @__PURE__ */ jsx(
    LineHeightControl,
    {
      __unstableInputWidth: "100%",
      value: style?.typography?.lineHeight,
      onChange,
      size: "__unstable-large"
    }
  );
}
function useIsLineHeightDisabled({ name: blockName } = {}) {
  const [isEnabled] = useSettings("typography.lineHeight");
  return !isEnabled || !hasBlockSupport(blockName, LINE_HEIGHT_SUPPORT_KEY);
}
export {
  LINE_HEIGHT_SUPPORT_KEY,
  LineHeightEdit,
  useIsLineHeightDisabled
};
//# sourceMappingURL=line-height.mjs.map

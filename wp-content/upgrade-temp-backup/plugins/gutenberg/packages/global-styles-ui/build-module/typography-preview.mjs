// packages/global-styles-ui/src/typography-preview.tsx
import { useStyle } from "./hooks.mjs";
import { jsx } from "react/jsx-runtime";
function TypographyPreview({
  name,
  element,
  headingLevel
}) {
  let prefix = "";
  if (element === "heading") {
    prefix = `elements.${headingLevel}.`;
  } else if (element && element !== "text") {
    prefix = `elements.${element}.`;
  }
  const [fontFamily] = useStyle(prefix + "typography.fontFamily", name);
  const [gradientValue] = useStyle(prefix + "color.gradient", name);
  const [backgroundColor] = useStyle(prefix + "color.background", name);
  const [fallbackBackgroundColor] = useStyle("color.background");
  const [color] = useStyle(prefix + "color.text", name);
  const [fontSize] = useStyle(prefix + "typography.fontSize", name);
  const [fontStyle] = useStyle(prefix + "typography.fontStyle", name);
  const [fontWeight] = useStyle(prefix + "typography.fontWeight", name);
  const [letterSpacing] = useStyle(
    prefix + "typography.letterSpacing",
    name
  );
  const extraStyles = element === "link" ? {
    textDecoration: "underline"
  } : {};
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "global-styles-ui-typography-preview",
      style: {
        fontFamily: fontFamily ?? "serif",
        background: gradientValue ?? backgroundColor ?? fallbackBackgroundColor,
        color,
        fontSize,
        fontStyle,
        fontWeight,
        letterSpacing,
        ...extraStyles
      },
      children: "Aa"
    }
  );
}
export {
  TypographyPreview as default
};
//# sourceMappingURL=typography-preview.mjs.map

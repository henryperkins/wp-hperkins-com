// packages/block-library/src/button/save.js
import clsx from "clsx";
import {
  RichText,
  useBlockProps,
  __experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
  __experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
  __experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
  __experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
  __experimentalGetElementClassName,
  getTypographyClassesAndStyles
} from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const {
    tagName,
    type,
    fontSize,
    linkTarget,
    rel,
    style,
    text,
    title,
    url
  } = attributes;
  const TagName = tagName || "a";
  const isButtonTag = "button" === TagName;
  const buttonType = type || "button";
  const borderProps = getBorderClassesAndStyles(attributes);
  const colorProps = getColorClassesAndStyles(attributes);
  const spacingProps = getSpacingClassesAndStyles(attributes);
  const shadowProps = getShadowClassesAndStyles(attributes);
  const typographyProps = getTypographyClassesAndStyles(attributes);
  const buttonClasses = clsx(
    "wp-block-button__link",
    colorProps.className,
    borderProps.className,
    typographyProps.className,
    {
      // For backwards compatibility add style that isn't provided via
      // block support.
      "no-border-radius": style?.border?.radius === 0,
      [`has-custom-font-size`]: fontSize || style?.typography?.fontSize
    },
    __experimentalGetElementClassName("button")
  );
  const buttonStyle = {
    ...borderProps.style,
    ...colorProps.style,
    ...spacingProps.style,
    ...shadowProps.style,
    ...typographyProps.style,
    writingMode: void 0
  };
  return /* @__PURE__ */ jsx("div", { ...useBlockProps.save(), children: /* @__PURE__ */ jsx(
    RichText.Content,
    {
      tagName: TagName,
      type: isButtonTag ? buttonType : null,
      className: buttonClasses,
      href: isButtonTag ? null : url,
      title,
      style: buttonStyle,
      value: text,
      target: isButtonTag ? null : linkTarget,
      rel: isButtonTag ? null : rel
    }
  ) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map

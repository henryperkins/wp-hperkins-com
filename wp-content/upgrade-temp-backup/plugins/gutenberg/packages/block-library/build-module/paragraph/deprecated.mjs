// packages/block-library/src/paragraph/deprecated.js
import clsx from "clsx";
import { RawHTML } from "@wordpress/element";
import {
  getColorClassName,
  getFontSizeClass,
  RichText,
  useBlockProps
} from "@wordpress/block-editor";
import { isRTL } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var supports = {
  className: false
};
var blockAttributes = {
  align: {
    type: "string"
  },
  content: {
    type: "string",
    source: "html",
    selector: "p",
    default: ""
  },
  dropCap: {
    type: "boolean",
    default: false
  },
  placeholder: {
    type: "string"
  },
  textColor: {
    type: "string"
  },
  backgroundColor: {
    type: "string"
  },
  fontSize: {
    type: "string"
  },
  direction: {
    type: "string",
    enum: ["ltr", "rtl"]
  },
  style: {
    type: "object"
  }
};
var migrateCustomColorsAndFontSizes = (attributes) => {
  if (!attributes.customTextColor && !attributes.customBackgroundColor && !attributes.customFontSize) {
    return attributes;
  }
  const style2 = {};
  if (attributes.customTextColor || attributes.customBackgroundColor) {
    style2.color = {};
  }
  if (attributes.customTextColor) {
    style2.color.text = attributes.customTextColor;
  }
  if (attributes.customBackgroundColor) {
    style2.color.background = attributes.customBackgroundColor;
  }
  if (attributes.customFontSize) {
    style2.typography = { fontSize: attributes.customFontSize };
  }
  const {
    customTextColor,
    customBackgroundColor,
    customFontSize,
    ...restAttributes
  } = attributes;
  return {
    ...restAttributes,
    style: style2
  };
};
var migrateTextAlign = (attributes) => {
  const { align, ...restAttributes } = attributes;
  if (!align) {
    return attributes;
  }
  return {
    ...restAttributes,
    style: {
      ...attributes.style,
      typography: {
        ...attributes.style?.typography,
        textAlign: align
      }
    }
  };
};
var { style, ...restBlockAttributes } = blockAttributes;
var deprecated = [
  // Version with `align` attribute.
  {
    supports: {
      className: false,
      typography: {
        fontSize: true
      }
    },
    attributes: blockAttributes,
    isEligible(attributes) {
      return !!attributes.align || !!attributes.className?.match(
        /\bhas-text-align-(left|center|right)\b/
      );
    },
    save({ attributes }) {
      const { align, content, dropCap, direction } = attributes;
      const className = clsx({
        "has-drop-cap": align === (isRTL() ? "left" : "right") || align === "center" ? false : dropCap,
        [`has-text-align-${align}`]: align
      });
      return /* @__PURE__ */ jsx("p", { ...useBlockProps.save({ className, dir: direction }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
    },
    migrate: migrateTextAlign
  },
  // Version without drop cap on aligned text.
  {
    supports,
    attributes: {
      ...restBlockAttributes,
      customTextColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      customFontSize: {
        type: "number"
      }
    },
    migrate: migrateTextAlign,
    save({ attributes }) {
      const { align, content, dropCap, direction } = attributes;
      const className = clsx({
        "has-drop-cap": align === (isRTL() ? "left" : "right") || align === "center" ? false : dropCap,
        [`has-text-align-${align}`]: align
      });
      return /* @__PURE__ */ jsx("p", { ...useBlockProps.save({ className, dir: direction }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
    }
  },
  {
    supports,
    attributes: {
      ...restBlockAttributes,
      customTextColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      customFontSize: {
        type: "number"
      }
    },
    migrate(attributes) {
      return migrateCustomColorsAndFontSizes(
        migrateTextAlign(attributes)
      );
    },
    save({ attributes }) {
      const {
        align,
        content,
        dropCap,
        backgroundColor,
        textColor,
        customBackgroundColor,
        customTextColor,
        fontSize,
        customFontSize,
        direction
      } = attributes;
      const textClass = getColorClassName("color", textColor);
      const backgroundClass = getColorClassName(
        "background-color",
        backgroundColor
      );
      const fontSizeClass = getFontSizeClass(fontSize);
      const className = clsx({
        "has-text-color": textColor || customTextColor,
        "has-background": backgroundColor || customBackgroundColor,
        "has-drop-cap": dropCap,
        [`has-text-align-${align}`]: align,
        [fontSizeClass]: fontSizeClass,
        [textClass]: textClass,
        [backgroundClass]: backgroundClass
      });
      const styles = {
        backgroundColor: backgroundClass ? void 0 : customBackgroundColor,
        color: textClass ? void 0 : customTextColor,
        fontSize: fontSizeClass ? void 0 : customFontSize
      };
      return /* @__PURE__ */ jsx(
        RichText.Content,
        {
          tagName: "p",
          style: styles,
          className: className ? className : void 0,
          value: content,
          dir: direction
        }
      );
    }
  },
  {
    supports,
    attributes: {
      ...restBlockAttributes,
      customTextColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      customFontSize: {
        type: "number"
      }
    },
    migrate(attributes) {
      return migrateCustomColorsAndFontSizes(
        migrateTextAlign(attributes)
      );
    },
    save({ attributes }) {
      const {
        align,
        content,
        dropCap,
        backgroundColor,
        textColor,
        customBackgroundColor,
        customTextColor,
        fontSize,
        customFontSize,
        direction
      } = attributes;
      const textClass = getColorClassName("color", textColor);
      const backgroundClass = getColorClassName(
        "background-color",
        backgroundColor
      );
      const fontSizeClass = getFontSizeClass(fontSize);
      const className = clsx({
        "has-text-color": textColor || customTextColor,
        "has-background": backgroundColor || customBackgroundColor,
        "has-drop-cap": dropCap,
        [fontSizeClass]: fontSizeClass,
        [textClass]: textClass,
        [backgroundClass]: backgroundClass
      });
      const styles = {
        backgroundColor: backgroundClass ? void 0 : customBackgroundColor,
        color: textClass ? void 0 : customTextColor,
        fontSize: fontSizeClass ? void 0 : customFontSize,
        textAlign: align
      };
      return /* @__PURE__ */ jsx(
        RichText.Content,
        {
          tagName: "p",
          style: styles,
          className: className ? className : void 0,
          value: content,
          dir: direction
        }
      );
    }
  },
  {
    supports,
    attributes: {
      ...restBlockAttributes,
      customTextColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      customFontSize: {
        type: "number"
      },
      width: {
        type: "string"
      }
    },
    migrate(attributes) {
      return migrateCustomColorsAndFontSizes(
        migrateTextAlign(attributes)
      );
    },
    save({ attributes }) {
      const {
        width,
        align,
        content,
        dropCap,
        backgroundColor,
        textColor,
        customBackgroundColor,
        customTextColor,
        fontSize,
        customFontSize
      } = attributes;
      const textClass = getColorClassName("color", textColor);
      const backgroundClass = getColorClassName(
        "background-color",
        backgroundColor
      );
      const fontSizeClass = fontSize && `is-${fontSize}-text`;
      const className = clsx({
        [`align${width}`]: width,
        "has-background": backgroundColor || customBackgroundColor,
        "has-drop-cap": dropCap,
        [fontSizeClass]: fontSizeClass,
        [textClass]: textClass,
        [backgroundClass]: backgroundClass
      });
      const styles = {
        backgroundColor: backgroundClass ? void 0 : customBackgroundColor,
        color: textClass ? void 0 : customTextColor,
        fontSize: fontSizeClass ? void 0 : customFontSize,
        textAlign: align
      };
      return /* @__PURE__ */ jsx(
        RichText.Content,
        {
          tagName: "p",
          style: styles,
          className: className ? className : void 0,
          value: content
        }
      );
    }
  },
  {
    supports,
    attributes: {
      ...restBlockAttributes,
      fontSize: {
        type: "number"
      }
    },
    save({ attributes }) {
      const {
        width,
        align,
        content,
        dropCap,
        backgroundColor,
        textColor,
        fontSize
      } = attributes;
      const className = clsx({
        [`align${width}`]: width,
        "has-background": backgroundColor,
        "has-drop-cap": dropCap
      });
      const styles = {
        backgroundColor,
        color: textColor,
        fontSize,
        textAlign: align
      };
      return /* @__PURE__ */ jsx(
        "p",
        {
          style: styles,
          className: className ? className : void 0,
          children: content
        }
      );
    },
    migrate(attributes) {
      return migrateCustomColorsAndFontSizes(
        migrateTextAlign({
          ...attributes,
          customFontSize: Number.isFinite(attributes.fontSize) ? attributes.fontSize : void 0,
          customTextColor: attributes.textColor && "#" === attributes.textColor[0] ? attributes.textColor : void 0,
          customBackgroundColor: attributes.backgroundColor && "#" === attributes.backgroundColor[0] ? attributes.backgroundColor : void 0
        })
      );
    }
  },
  {
    supports,
    attributes: {
      ...blockAttributes,
      content: {
        type: "string",
        source: "html",
        default: ""
      }
    },
    save({ attributes }) {
      return /* @__PURE__ */ jsx(RawHTML, { children: attributes.content });
    },
    migrate: (attributes) => attributes
  }
];
var deprecated_default = deprecated;
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

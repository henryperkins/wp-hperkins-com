// packages/block-library/src/pullquote/deprecated.js
import clsx from "clsx";
import {
  getColorClassName,
  getColorObjectByAttributeValues,
  RichText,
  store as blockEditorStore,
  useBlockProps
} from "@wordpress/block-editor";
import { select } from "@wordpress/data";
import { SOLID_COLOR_CLASS } from "./shared.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var blockAttributes = {
  value: {
    type: "string",
    source: "html",
    selector: "blockquote",
    multiline: "p"
  },
  citation: {
    type: "string",
    source: "html",
    selector: "cite",
    default: ""
  },
  mainColor: {
    type: "string"
  },
  customMainColor: {
    type: "string"
  },
  textColor: {
    type: "string"
  },
  customTextColor: {
    type: "string"
  }
};
function parseBorderColor(styleString) {
  if (!styleString) {
    return;
  }
  const matches = styleString.match(/border-color:([^;]+)[;]?/);
  if (matches && matches[1]) {
    return matches[1];
  }
}
function multilineToInline(value) {
  value = value || `<p></p>`;
  const padded = `</p>${value}<p>`;
  const values = padded.split(`</p><p>`);
  values.shift();
  values.pop();
  return values.join("<br>");
}
var v5 = {
  attributes: {
    value: {
      type: "string",
      source: "html",
      selector: "blockquote",
      multiline: "p",
      role: "content"
    },
    citation: {
      type: "string",
      source: "html",
      selector: "cite",
      default: "",
      role: "content"
    },
    textAlign: {
      type: "string"
    }
  },
  supports: {
    anchor: true,
    align: ["left", "right", "wide", "full"],
    color: {
      gradients: true,
      background: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontWeight: true,
      __experimentalFontStyle: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalLetterSpacing: true,
      __experimentalDefaultControls: {
        fontSize: true,
        fontAppearance: true
      }
    },
    __experimentalBorder: {
      color: true,
      radius: true,
      style: true,
      width: true,
      __experimentalDefaultControls: {
        color: true,
        radius: true,
        style: true,
        width: true
      }
    },
    __experimentalStyle: {
      typography: {
        fontSize: "1.5em",
        lineHeight: "1.6"
      }
    }
  },
  save({ attributes }) {
    const { textAlign, citation, value } = attributes;
    const shouldShowCitation = !RichText.isEmpty(citation);
    return /* @__PURE__ */ jsx(
      "figure",
      {
        ...useBlockProps.save({
          className: clsx({
            [`has-text-align-${textAlign}`]: textAlign
          })
        }),
        children: /* @__PURE__ */ jsxs("blockquote", { children: [
          /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
          shouldShowCitation && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
        ] })
      }
    );
  },
  migrate({ value, ...attributes }) {
    return {
      value: multilineToInline(value),
      ...attributes
    };
  }
};
var v4 = {
  attributes: {
    ...blockAttributes
  },
  supports: {
    anchor: true,
    align: ["left", "right", "wide", "full"],
    color: {
      gradients: true,
      background: true,
      link: true
    },
    __experimentalBorder: {
      color: true,
      radius: true,
      style: true,
      width: true
    }
  },
  save({ attributes }) {
    const {
      mainColor,
      customMainColor,
      customTextColor,
      textColor,
      value,
      citation,
      className
    } = attributes;
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let figureClasses, figureStyles;
    if (isSolidColorStyle) {
      const backgroundClass = getColorClassName(
        "background-color",
        mainColor
      );
      figureClasses = clsx({
        "has-background": backgroundClass || customMainColor,
        [backgroundClass]: backgroundClass
      });
      figureStyles = {
        backgroundColor: backgroundClass ? void 0 : customMainColor
      };
    } else if (customMainColor) {
      figureStyles = {
        borderColor: customMainColor
      };
    }
    const blockquoteTextColorClass = getColorClassName(
      "color",
      textColor
    );
    const blockquoteClasses = clsx({
      "has-text-color": textColor || customTextColor,
      [blockquoteTextColorClass]: blockquoteTextColorClass
    });
    const blockquoteStyles = blockquoteTextColorClass ? void 0 : { color: customTextColor };
    return /* @__PURE__ */ jsx(
      "figure",
      {
        ...useBlockProps.save({
          className: figureClasses,
          style: figureStyles
        }),
        children: /* @__PURE__ */ jsxs(
          "blockquote",
          {
            className: blockquoteClasses,
            style: blockquoteStyles,
            children: [
              /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
              !RichText.isEmpty(citation) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
            ]
          }
        )
      }
    );
  },
  migrate({
    value,
    className,
    mainColor,
    customMainColor,
    customTextColor,
    ...attributes
  }) {
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let style;
    if (customMainColor) {
      if (!isSolidColorStyle) {
        style = {
          border: {
            color: customMainColor
          }
        };
      } else {
        style = {
          color: {
            background: customMainColor
          }
        };
      }
    }
    if (customTextColor && style) {
      style.color = {
        ...style.color,
        text: customTextColor
      };
    }
    return {
      value: multilineToInline(value),
      className,
      backgroundColor: isSolidColorStyle ? mainColor : void 0,
      borderColor: isSolidColorStyle ? void 0 : mainColor,
      textAlign: isSolidColorStyle ? "left" : void 0,
      ...attributes,
      style
    };
  }
};
var v3 = {
  attributes: {
    ...blockAttributes,
    // figureStyle is an attribute that never existed.
    // We are using it as a way to access the styles previously applied to the figure.
    figureStyle: {
      source: "attribute",
      selector: "figure",
      attribute: "style"
    }
  },
  save({ attributes }) {
    const {
      mainColor,
      customMainColor,
      textColor,
      customTextColor,
      value,
      citation,
      className,
      figureStyle
    } = attributes;
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let figureClasses, figureStyles;
    if (isSolidColorStyle) {
      const backgroundClass = getColorClassName(
        "background-color",
        mainColor
      );
      figureClasses = clsx({
        "has-background": backgroundClass || customMainColor,
        [backgroundClass]: backgroundClass
      });
      figureStyles = {
        backgroundColor: backgroundClass ? void 0 : customMainColor
      };
    } else if (customMainColor) {
      figureStyles = {
        borderColor: customMainColor
      };
    } else if (mainColor) {
      const borderColor = parseBorderColor(figureStyle);
      figureStyles = {
        borderColor
      };
    }
    const blockquoteTextColorClass = getColorClassName(
      "color",
      textColor
    );
    const blockquoteClasses = (textColor || customTextColor) && clsx("has-text-color", {
      [blockquoteTextColorClass]: blockquoteTextColorClass
    });
    const blockquoteStyles = blockquoteTextColorClass ? void 0 : { color: customTextColor };
    return /* @__PURE__ */ jsx("figure", { className: figureClasses, style: figureStyles, children: /* @__PURE__ */ jsxs(
      "blockquote",
      {
        className: blockquoteClasses,
        style: blockquoteStyles,
        children: [
          /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
          !RichText.isEmpty(citation) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
        ]
      }
    ) });
  },
  migrate({
    value,
    className,
    figureStyle,
    mainColor,
    customMainColor,
    customTextColor,
    ...attributes
  }) {
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let style;
    if (customMainColor) {
      if (!isSolidColorStyle) {
        style = {
          border: {
            color: customMainColor
          }
        };
      } else {
        style = {
          color: {
            background: customMainColor
          }
        };
      }
    }
    if (customTextColor && style) {
      style.color = {
        ...style.color,
        text: customTextColor
      };
    }
    if (!isSolidColorStyle && mainColor && figureStyle) {
      const borderColor = parseBorderColor(figureStyle);
      if (borderColor) {
        return {
          value: multilineToInline(value),
          ...attributes,
          className,
          // Block supports: Set style.border.color if a deprecated block has `mainColor`, inline border CSS and is not a solid color style.
          style: {
            border: {
              color: borderColor
            }
          }
        };
      }
    }
    return {
      value: multilineToInline(value),
      className,
      backgroundColor: isSolidColorStyle ? mainColor : void 0,
      borderColor: isSolidColorStyle ? void 0 : mainColor,
      textAlign: isSolidColorStyle ? "left" : void 0,
      ...attributes,
      style
    };
  }
};
var v2 = {
  attributes: blockAttributes,
  save({ attributes }) {
    const {
      mainColor,
      customMainColor,
      textColor,
      customTextColor,
      value,
      citation,
      className
    } = attributes;
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let figureClass, figureStyles;
    if (isSolidColorStyle) {
      figureClass = getColorClassName("background-color", mainColor);
      if (!figureClass) {
        figureStyles = {
          backgroundColor: customMainColor
        };
      }
    } else if (customMainColor) {
      figureStyles = {
        borderColor: customMainColor
      };
    } else if (mainColor) {
      const colors = select(blockEditorStore).getSettings().colors ?? [];
      const colorObject = getColorObjectByAttributeValues(
        colors,
        mainColor
      );
      figureStyles = {
        borderColor: colorObject.color
      };
    }
    const blockquoteTextColorClass = getColorClassName(
      "color",
      textColor
    );
    const blockquoteClasses = textColor || customTextColor ? clsx("has-text-color", {
      [blockquoteTextColorClass]: blockquoteTextColorClass
    }) : void 0;
    const blockquoteStyle = blockquoteTextColorClass ? void 0 : { color: customTextColor };
    return /* @__PURE__ */ jsx("figure", { className: figureClass, style: figureStyles, children: /* @__PURE__ */ jsxs(
      "blockquote",
      {
        className: blockquoteClasses,
        style: blockquoteStyle,
        children: [
          /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
          !RichText.isEmpty(citation) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
        ]
      }
    ) });
  },
  migrate({
    value,
    className,
    mainColor,
    customMainColor,
    customTextColor,
    ...attributes
  }) {
    const isSolidColorStyle = className?.includes(SOLID_COLOR_CLASS);
    let style = {};
    if (customMainColor) {
      if (!isSolidColorStyle) {
        style = {
          border: {
            color: customMainColor
          }
        };
      } else {
        style = {
          color: {
            background: customMainColor
          }
        };
      }
    }
    if (customTextColor && style) {
      style.color = {
        ...style.color,
        text: customTextColor
      };
    }
    return {
      value: multilineToInline(value),
      className,
      backgroundColor: isSolidColorStyle ? mainColor : void 0,
      borderColor: isSolidColorStyle ? void 0 : mainColor,
      textAlign: isSolidColorStyle ? "left" : void 0,
      ...attributes,
      style
    };
  }
};
var v1 = {
  attributes: {
    ...blockAttributes
  },
  save({ attributes }) {
    const { value, citation } = attributes;
    return /* @__PURE__ */ jsxs("blockquote", { children: [
      /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
      !RichText.isEmpty(citation) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
    ] });
  },
  migrate({ value, ...attributes }) {
    return {
      value: multilineToInline(value),
      ...attributes
    };
  }
};
var v0 = {
  attributes: {
    ...blockAttributes,
    citation: {
      type: "string",
      source: "html",
      selector: "footer"
    },
    align: {
      type: "string",
      default: "none"
    }
  },
  save({ attributes }) {
    const { value, citation, align } = attributes;
    return /* @__PURE__ */ jsxs("blockquote", { className: `align${align}`, children: [
      /* @__PURE__ */ jsx(RichText.Content, { value, multiline: true }),
      !RichText.isEmpty(citation) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "footer", value: citation })
    ] });
  },
  migrate({ value, ...attributes }) {
    return {
      value: multilineToInline(value),
      ...attributes
    };
  }
};
var deprecated_default = [v5, v4, v3, v2, v1, v0];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

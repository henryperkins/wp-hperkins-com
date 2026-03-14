// packages/block-library/src/heading/deprecated.js
import clsx from "clsx";
import {
  getColorClassName,
  RichText,
  useBlockProps
} from "@wordpress/block-editor";
import migrateTextAlignAttributeToBlockSupport from "../utils/migrate-text-align.mjs";
import { jsx } from "react/jsx-runtime";
var blockSupports = {
  className: false,
  anchor: true
};
var blockAttributes = {
  align: {
    type: "string"
  },
  content: {
    type: "string",
    source: "html",
    selector: "h1,h2,h3,h4,h5,h6",
    default: ""
  },
  level: {
    type: "number",
    default: 2
  },
  placeholder: {
    type: "string"
  }
};
var migrateCustomColors = (attributes) => {
  if (!attributes.customTextColor) {
    return attributes;
  }
  const style = {
    color: {
      text: attributes.customTextColor
    }
  };
  const { customTextColor, ...restAttributes } = attributes;
  return {
    ...restAttributes,
    style
  };
};
var TEXT_ALIGN_OPTIONS = ["left", "right", "center"];
var migrateTextAlign = (attributes) => {
  const { align, ...rest } = attributes;
  return TEXT_ALIGN_OPTIONS.includes(align) ? { ...rest, textAlign: align } : attributes;
};
var v1 = {
  supports: blockSupports,
  attributes: {
    ...blockAttributes,
    customTextColor: {
      type: "string"
    },
    textColor: {
      type: "string"
    }
  },
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  ),
  save({ attributes }) {
    const { align, level, content, textColor, customTextColor } = attributes;
    const tagName = "h" + level;
    const textClass = getColorClassName("color", textColor);
    const className = clsx({
      [textClass]: textClass
    });
    return /* @__PURE__ */ jsx(
      RichText.Content,
      {
        className: className ? className : void 0,
        tagName,
        style: {
          textAlign: align,
          color: textClass ? void 0 : customTextColor
        },
        value: content
      }
    );
  }
};
var v2 = {
  attributes: {
    ...blockAttributes,
    customTextColor: {
      type: "string"
    },
    textColor: {
      type: "string"
    }
  },
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  ),
  save({ attributes }) {
    const { align, content, customTextColor, level, textColor } = attributes;
    const tagName = "h" + level;
    const textClass = getColorClassName("color", textColor);
    const className = clsx({
      [textClass]: textClass,
      [`has-text-align-${align}`]: align
    });
    return /* @__PURE__ */ jsx(
      RichText.Content,
      {
        className: className ? className : void 0,
        tagName,
        style: {
          color: textClass ? void 0 : customTextColor
        },
        value: content
      }
    );
  },
  supports: blockSupports
};
var v3 = {
  supports: blockSupports,
  attributes: {
    ...blockAttributes,
    customTextColor: {
      type: "string"
    },
    textColor: {
      type: "string"
    }
  },
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  ),
  save({ attributes }) {
    const { align, content, customTextColor, level, textColor } = attributes;
    const tagName = "h" + level;
    const textClass = getColorClassName("color", textColor);
    const className = clsx({
      [textClass]: textClass,
      "has-text-color": textColor || customTextColor,
      [`has-text-align-${align}`]: align
    });
    return /* @__PURE__ */ jsx(
      RichText.Content,
      {
        className: className ? className : void 0,
        tagName,
        style: {
          color: textClass ? void 0 : customTextColor
        },
        value: content
      }
    );
  }
};
var v4 = {
  supports: {
    align: ["wide", "full"],
    anchor: true,
    className: false,
    color: { link: true },
    fontSize: true,
    lineHeight: true,
    __experimentalSelector: {
      "core/heading/h1": "h1",
      "core/heading/h2": "h2",
      "core/heading/h3": "h3",
      "core/heading/h4": "h4",
      "core/heading/h5": "h5",
      "core/heading/h6": "h6"
    },
    __unstablePasteTextInline: true
  },
  attributes: blockAttributes,
  isEligible: ({ align }) => TEXT_ALIGN_OPTIONS.includes(align),
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  ),
  save({ attributes }) {
    const { align, content, level } = attributes;
    const TagName = "h" + level;
    const className = clsx({
      [`has-text-align-${align}`]: align
    });
    return /* @__PURE__ */ jsx(TagName, { ...useBlockProps.save({ className }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
  }
};
var v5 = {
  supports: {
    align: ["wide", "full"],
    anchor: true,
    className: false,
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    spacing: {
      margin: true,
      padding: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalLetterSpacing: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalDefaultControls: {
        fontSize: true,
        fontAppearance: true,
        textTransform: true
      }
    },
    __experimentalSelector: "h1,h2,h3,h4,h5,h6",
    __unstablePasteTextInline: true,
    __experimentalSlashInserter: true
  },
  attributes: {
    textAlign: {
      type: "string"
    },
    content: {
      type: "string",
      source: "html",
      selector: "h1,h2,h3,h4,h5,h6",
      default: "",
      role: "content"
    },
    level: {
      type: "number",
      default: 2
    },
    placeholder: {
      type: "string"
    }
  },
  save({ attributes }) {
    const { textAlign, content, level } = attributes;
    const TagName = "h" + level;
    const className = clsx({
      [`has-text-align-${textAlign}`]: textAlign
    });
    return /* @__PURE__ */ jsx(TagName, { ...useBlockProps.save({ className }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
  },
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  )
};
var v6 = {
  supports: {
    align: ["wide", "full"],
    anchor: true,
    className: true,
    splitting: true,
    __experimentalBorder: {
      color: true,
      radius: true,
      style: true,
      width: true
    },
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    spacing: {
      margin: true,
      padding: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalLetterSpacing: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalWritingMode: true,
      fitText: true,
      __experimentalDefaultControls: {
        fontSize: true
      }
    },
    __unstablePasteTextInline: true,
    __experimentalSlashInserter: true,
    interactivity: {
      clientNavigation: true
    }
  },
  attributes: {
    textAlign: {
      type: "string"
    },
    content: {
      type: "string",
      source: "html",
      selector: "h1,h2,h3,h4,h5,h6",
      default: "",
      role: "content"
    },
    level: {
      type: "number",
      default: 2
    },
    levelOptions: {
      type: "array"
    },
    placeholder: {
      type: "string"
    }
  },
  save({ attributes }) {
    const { textAlign, content, level } = attributes;
    const TagName = "h" + level;
    const className = clsx({
      [`has-text-align-${textAlign}`]: textAlign
    });
    return /* @__PURE__ */ jsx(TagName, { ...useBlockProps.save({ className }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
  },
  migrate: (attributes) => migrateTextAlignAttributeToBlockSupport(
    migrateCustomColors(migrateTextAlign(attributes))
  ),
  isEligible(attributes) {
    return !!attributes.textAlign || !!attributes.className?.match(
      /\bhas-text-align-(left|center|right)\b/
    );
  }
};
var deprecated = [v6, v5, v4, v3, v2, v1];
var deprecated_default = deprecated;
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

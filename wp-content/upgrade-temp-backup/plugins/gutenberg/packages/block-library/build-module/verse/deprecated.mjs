// packages/block-library/src/verse/deprecated.js
import clsx from "clsx";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import migrateFontFamily from "../utils/migrate-font-family.mjs";
import migrateTextAlign from "../utils/migrate-text-align.mjs";
import { jsx } from "react/jsx-runtime";
var v1 = {
  attributes: {
    content: {
      type: "string",
      source: "html",
      selector: "pre",
      default: ""
    },
    textAlign: {
      type: "string"
    }
  },
  save({ attributes }) {
    const { textAlign, content } = attributes;
    return /* @__PURE__ */ jsx(
      RichText.Content,
      {
        tagName: "pre",
        style: { textAlign },
        value: content
      }
    );
  },
  migrate: migrateTextAlign
};
var v2 = {
  attributes: {
    content: {
      type: "string",
      source: "html",
      selector: "pre",
      default: "",
      __unstablePreserveWhiteSpace: true,
      role: "content"
    },
    textAlign: {
      type: "string"
    }
  },
  supports: {
    anchor: true,
    color: {
      gradients: true,
      link: true
    },
    typography: {
      fontSize: true,
      __experimentalFontFamily: true
    },
    spacing: {
      padding: true
    }
  },
  save({ attributes }) {
    const { textAlign, content } = attributes;
    const className = clsx({
      [`has-text-align-${textAlign}`]: textAlign
    });
    return /* @__PURE__ */ jsx("pre", { ...useBlockProps.save({ className }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
  },
  migrate(attributes) {
    return migrateTextAlign(migrateFontFamily(attributes));
  },
  isEligible({ style, textAlign }) {
    return style?.typography?.fontFamily || !!textAlign;
  }
};
var v3 = {
  attributes: {
    content: {
      type: "rich-text",
      source: "rich-text",
      selector: "pre",
      __unstablePreserveWhiteSpace: true,
      role: "content"
    },
    textAlign: {
      type: "string"
    }
  },
  supports: {
    anchor: true,
    background: {
      backgroundImage: true,
      backgroundSize: true
    },
    color: {
      gradients: true,
      link: true
    },
    dimensions: {
      minHeight: true
    },
    typography: {
      fontSize: true,
      __experimentalFontFamily: true,
      lineHeight: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalLetterSpacing: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalWritingMode: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    __experimentalBorder: {
      radius: true,
      width: true,
      color: true,
      style: true
    },
    interactivity: {
      clientNavigation: true
    }
  },
  save({ attributes }) {
    const { textAlign, content } = attributes;
    const className = clsx({
      [`has-text-align-${textAlign}`]: textAlign
    });
    return /* @__PURE__ */ jsx("pre", { ...useBlockProps.save({ className }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
  },
  migrate: migrateTextAlign,
  isEligible(attributes) {
    return !!attributes.textAlign || !!attributes.className?.match(
      /\bhas-text-align-(left|center|right)\b/
    );
  }
};
var deprecated_default = [v3, v2, v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

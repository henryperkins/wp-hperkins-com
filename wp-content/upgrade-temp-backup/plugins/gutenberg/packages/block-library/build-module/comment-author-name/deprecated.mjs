// packages/block-library/src/comment-author-name/deprecated.js
import migrateFontFamily from "../utils/migrate-font-family.mjs";
import migrateTextAlign from "../utils/migrate-text-align.mjs";
var v2 = {
  attributes: {
    isLink: {
      type: "boolean",
      default: true
    },
    linkTarget: {
      type: "string",
      default: "_self"
    },
    textAlign: {
      type: "string"
    }
  },
  usesContext: ["commentId"],
  supports: {
    html: false,
    spacing: {
      margin: true,
      padding: true
    },
    color: {
      gradients: true,
      link: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontWeight: true,
      __experimentalFontStyle: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalLetterSpacing: true
    },
    interactivity: {
      clientNavigation: true
    },
    __experimentalBorder: {
      radius: true,
      color: true,
      width: true,
      style: true
    }
  },
  save() {
    return null;
  },
  migrate: migrateTextAlign,
  isEligible(attributes) {
    return !!attributes.textAlign || !!attributes.className?.match(
      /\bhas-text-align-(left|center|right)\b/
    );
  }
};
var v1 = {
  attributes: {
    isLink: {
      type: "boolean",
      default: false
    },
    linkTarget: {
      type: "string",
      default: "_self"
    }
  },
  supports: {
    html: false,
    color: {
      gradients: true,
      link: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontWeight: true,
      __experimentalFontStyle: true,
      __experimentalTextTransform: true,
      __experimentalLetterSpacing: true
    }
  },
  save() {
    return null;
  },
  migrate: migrateFontFamily,
  isEligible({ style }) {
    return style?.typography?.fontFamily;
  }
};
var deprecated_default = [v2, v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

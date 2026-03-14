// packages/block-library/src/post-title/deprecated.js
import migrateFontFamily from "../utils/migrate-font-family.mjs";
import migrateTextAlign from "../utils/migrate-text-align.mjs";
var v2 = {
  attributes: {
    textAlign: {
      type: "string"
    },
    level: {
      type: "number",
      default: 2
    },
    levelOptions: {
      type: "array"
    },
    isLink: {
      type: "boolean",
      default: false
    },
    rel: {
      type: "string",
      attribute: "rel",
      default: ""
    },
    linkTarget: {
      type: "string",
      default: "_self"
    }
  },
  supports: {
    anchor: true,
    align: ["wide", "full"],
    html: false,
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true,
        link: true
      }
    },
    spacing: {
      padding: true,
      margin: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalTextTransform: true,
      __experimentalTextDecoration: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalLetterSpacing: true,
      __experimentalDefaultControls: {
        fontSize: true
      }
    },
    interactivity: {
      clientNavigation: true
    },
    __experimentalBorder: {
      radius: true,
      color: true,
      width: true,
      style: true,
      __experimentalDefaultControls: {
        radius: true,
        color: true,
        width: true,
        style: true
      }
    }
  },
  migrate: migrateTextAlign,
  isEligible(attributes) {
    return !!attributes.textAlign || !!attributes.className?.match(
      /\bhas-text-align-(left|center|right)\b/
    );
  },
  save: () => null
};
var v1 = {
  attributes: {
    textAlign: {
      type: "string"
    },
    level: {
      type: "number",
      default: 2
    },
    isLink: {
      type: "boolean",
      default: false
    },
    rel: {
      type: "string",
      attribute: "rel",
      default: ""
    },
    linkTarget: {
      type: "string",
      default: "_self"
    }
  },
  supports: {
    align: ["wide", "full"],
    html: false,
    color: {
      gradients: true,
      link: true
    },
    spacing: {
      margin: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalFontWeight: true,
      __experimentalFontStyle: true,
      __experimentalTextTransform: true
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

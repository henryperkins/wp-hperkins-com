// packages/block-library/src/site-tagline/deprecated.js
import migrateFontFamily from "../utils/migrate-font-family.mjs";
import migrateTextAlign from "../utils/migrate-text-align.mjs";
var v2 = {
  attributes: {
    textAlign: {
      type: "string"
    },
    level: {
      type: "number"
    },
    levelOptions: {
      type: "array",
      default: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  supports: {
    anchor: true,
    reusable: false,
    html: false,
    color: {
      gradients: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    spacing: {
      margin: true,
      padding: true,
      __experimentalDefaultControls: {
        margin: false,
        padding: false
      }
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
      __experimentalWritingMode: true,
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
      style: true
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
    }
  },
  supports: {
    align: ["wide", "full"],
    html: false,
    color: {
      gradients: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontFamily: true,
      __experimentalTextTransform: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
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

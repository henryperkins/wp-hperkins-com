// packages/block-library/src/comment-content/deprecated.js
import migrateTextAlign from "../utils/migrate-text-align.mjs";
var v1 = {
  attributes: {
    textAlign: {
      type: "string"
    }
  },
  usesContext: ["commentId"],
  supports: {
    anchor: true,
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
    __experimentalBorder: {
      radius: true,
      color: true,
      width: true,
      style: true
    },
    spacing: {
      padding: ["horizontal", "vertical"]
    },
    html: false
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
var deprecated_default = [v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

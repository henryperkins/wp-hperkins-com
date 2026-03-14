// packages/block-library/src/navigation/deprecated.js
import { InnerBlocks } from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import migrateFontFamily from "../utils/migrate-font-family.mjs";
import { jsx } from "react/jsx-runtime";
var TYPOGRAPHY_PRESET_DEPRECATION_MAP = {
  fontStyle: "var:preset|font-style|",
  fontWeight: "var:preset|font-weight|",
  textDecoration: "var:preset|text-decoration|",
  textTransform: "var:preset|text-transform|"
};
var migrateIdToRef = ({ navigationMenuId, ...attributes }) => {
  return {
    ...attributes,
    ref: navigationMenuId
  };
};
var migrateWithLayout = (attributes) => {
  if (!!attributes.layout) {
    return attributes;
  }
  const { itemsJustification, orientation, ...updatedAttributes } = attributes;
  if (itemsJustification || orientation) {
    Object.assign(updatedAttributes, {
      layout: {
        type: "flex",
        ...itemsJustification && {
          justifyContent: itemsJustification
        },
        ...orientation && { orientation }
      }
    });
  }
  return updatedAttributes;
};
var migrateOpenSubmenusOnClick = (attributes) => {
  const { openSubmenusOnClick, ...restAttributes } = attributes;
  if (openSubmenusOnClick === null || openSubmenusOnClick === void 0) {
    return attributes;
  }
  return {
    ...restAttributes,
    submenuVisibility: restAttributes.submenuVisibility ?? (openSubmenusOnClick ? "click" : "hover")
  };
};
var v7 = {
  attributes: {
    ref: {
      type: "number"
    },
    textColor: {
      type: "string"
    },
    customTextColor: {
      type: "string"
    },
    rgbTextColor: {
      type: "string"
    },
    backgroundColor: {
      type: "string"
    },
    customBackgroundColor: {
      type: "string"
    },
    rgbBackgroundColor: {
      type: "string"
    },
    showSubmenuIcon: {
      type: "boolean",
      default: true
    },
    openSubmenusOnClick: {
      type: "boolean",
      default: false
    },
    overlayMenu: {
      type: "string",
      default: "mobile"
    },
    icon: {
      type: "string",
      default: "handle"
    },
    hasIcon: {
      type: "boolean",
      default: true
    },
    __unstableLocation: {
      type: "string"
    },
    overlayBackgroundColor: {
      type: "string"
    },
    customOverlayBackgroundColor: {
      type: "string"
    },
    overlayTextColor: {
      type: "string"
    },
    customOverlayTextColor: {
      type: "string"
    },
    maxNestingLevel: {
      type: "number",
      default: 5
    },
    templateLock: {
      type: ["string", "boolean"],
      enum: ["all", "insert", "contentOnly", false]
    }
  },
  supports: {
    align: ["wide", "full"],
    anchor: true,
    html: false,
    inserter: true,
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalTextTransform: true,
      __experimentalFontFamily: true,
      __experimentalLetterSpacing: true,
      __experimentalTextDecoration: true,
      __experimentalSkipSerialization: ["textDecoration"],
      __experimentalDefaultControls: {
        fontSize: true
      }
    },
    spacing: {
      blockGap: true,
      units: ["px", "em", "rem", "vh", "vw"],
      __experimentalDefaultControls: {
        blockGap: true
      }
    },
    layout: {
      allowSwitching: false,
      allowInheriting: false,
      allowVerticalAlignment: false,
      allowSizingOnChildren: true,
      default: {
        type: "flex"
      }
    },
    interactivity: true,
    renaming: false
  },
  save() {
    return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
  },
  isEligible: ({ openSubmenusOnClick }) => openSubmenusOnClick !== null && openSubmenusOnClick !== void 0,
  migrate: migrateOpenSubmenusOnClick
};
var v6 = {
  attributes: {
    navigationMenuId: {
      type: "number"
    },
    textColor: {
      type: "string"
    },
    customTextColor: {
      type: "string"
    },
    rgbTextColor: {
      type: "string"
    },
    backgroundColor: {
      type: "string"
    },
    customBackgroundColor: {
      type: "string"
    },
    rgbBackgroundColor: {
      type: "string"
    },
    showSubmenuIcon: {
      type: "boolean",
      default: true
    },
    overlayMenu: {
      type: "string",
      default: "mobile"
    },
    __unstableLocation: {
      type: "string"
    },
    overlayBackgroundColor: {
      type: "string"
    },
    customOverlayBackgroundColor: {
      type: "string"
    },
    overlayTextColor: {
      type: "string"
    },
    customOverlayTextColor: {
      type: "string"
    }
  },
  supports: {
    align: ["wide", "full"],
    anchor: true,
    html: false,
    inserter: true,
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalTextTransform: true,
      __experimentalFontFamily: true,
      __experimentalTextDecoration: true,
      __experimentalDefaultControls: {
        fontSize: true
      }
    },
    spacing: {
      blockGap: true,
      units: ["px", "em", "rem", "vh", "vw"],
      __experimentalDefaultControls: {
        blockGap: true
      }
    },
    layout: {
      allowSwitching: false,
      allowInheriting: false,
      default: {
        type: "flex"
      }
    }
  },
  save() {
    return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
  },
  isEligible: ({ navigationMenuId }) => !!navigationMenuId,
  migrate: migrateIdToRef
};
var v5 = {
  attributes: {
    navigationMenuId: {
      type: "number"
    },
    orientation: {
      type: "string",
      default: "horizontal"
    },
    textColor: {
      type: "string"
    },
    customTextColor: {
      type: "string"
    },
    rgbTextColor: {
      type: "string"
    },
    backgroundColor: {
      type: "string"
    },
    customBackgroundColor: {
      type: "string"
    },
    rgbBackgroundColor: {
      type: "string"
    },
    itemsJustification: {
      type: "string"
    },
    showSubmenuIcon: {
      type: "boolean",
      default: true
    },
    openSubmenusOnClick: {
      type: "boolean",
      default: false
    },
    overlayMenu: {
      type: "string",
      default: "never"
    },
    __unstableLocation: {
      type: "string"
    },
    overlayBackgroundColor: {
      type: "string"
    },
    customOverlayBackgroundColor: {
      type: "string"
    },
    overlayTextColor: {
      type: "string"
    },
    customOverlayTextColor: {
      type: "string"
    }
  },
  supports: {
    align: ["wide", "full"],
    anchor: true,
    html: false,
    inserter: true,
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalTextTransform: true,
      __experimentalFontFamily: true,
      __experimentalTextDecoration: true,
      __experimentalDefaultControls: {
        fontSize: true
      }
    },
    spacing: {
      blockGap: true,
      units: ["px", "em", "rem", "vh", "vw"],
      __experimentalDefaultControls: {
        blockGap: true
      }
    }
  },
  save() {
    return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
  },
  isEligible: ({ itemsJustification, orientation }) => !!itemsJustification || !!orientation,
  migrate: compose(
    migrateIdToRef,
    migrateWithLayout,
    migrateOpenSubmenusOnClick
  )
};
var v4 = {
  attributes: {
    orientation: {
      type: "string",
      default: "horizontal"
    },
    textColor: {
      type: "string"
    },
    customTextColor: {
      type: "string"
    },
    rgbTextColor: {
      type: "string"
    },
    backgroundColor: {
      type: "string"
    },
    customBackgroundColor: {
      type: "string"
    },
    rgbBackgroundColor: {
      type: "string"
    },
    itemsJustification: {
      type: "string"
    },
    showSubmenuIcon: {
      type: "boolean",
      default: true
    },
    openSubmenusOnClick: {
      type: "boolean",
      default: false
    },
    overlayMenu: {
      type: "string",
      default: "never"
    },
    __unstableLocation: {
      type: "string"
    },
    overlayBackgroundColor: {
      type: "string"
    },
    customOverlayBackgroundColor: {
      type: "string"
    },
    overlayTextColor: {
      type: "string"
    },
    customOverlayTextColor: {
      type: "string"
    }
  },
  supports: {
    align: ["wide", "full"],
    anchor: true,
    html: false,
    inserter: true,
    typography: {
      fontSize: true,
      lineHeight: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalTextTransform: true,
      __experimentalFontFamily: true,
      __experimentalTextDecoration: true
    },
    spacing: {
      blockGap: true,
      units: ["px", "em", "rem", "vh", "vw"],
      __experimentalDefaultControls: {
        blockGap: true
      }
    }
  },
  save() {
    return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
  },
  migrate: compose(
    migrateIdToRef,
    migrateWithLayout,
    migrateFontFamily,
    migrateOpenSubmenusOnClick
  ),
  isEligible({ style }) {
    return style?.typography?.fontFamily;
  }
};
var migrateIsResponsive = function(attributes) {
  delete attributes.isResponsive;
  return {
    ...attributes,
    overlayMenu: "mobile"
  };
};
var migrateTypographyPresets = function(attributes) {
  return {
    ...attributes,
    style: {
      ...attributes.style,
      typography: Object.fromEntries(
        Object.entries(attributes.style.typography ?? {}).map(
          ([key, value]) => {
            const prefix = TYPOGRAPHY_PRESET_DEPRECATION_MAP[key];
            if (prefix && value.startsWith(prefix)) {
              const newValue = value.slice(prefix.length);
              if ("textDecoration" === key && "strikethrough" === newValue) {
                return [key, "line-through"];
              }
              return [key, newValue];
            }
            return [key, value];
          }
        )
      )
    }
  };
};
var deprecated = [
  v7,
  v6,
  v5,
  v4,
  // Remove `isResponsive` attribute.
  {
    attributes: {
      orientation: {
        type: "string",
        default: "horizontal"
      },
      textColor: {
        type: "string"
      },
      customTextColor: {
        type: "string"
      },
      rgbTextColor: {
        type: "string"
      },
      backgroundColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      rgbBackgroundColor: {
        type: "string"
      },
      itemsJustification: {
        type: "string"
      },
      showSubmenuIcon: {
        type: "boolean",
        default: true
      },
      openSubmenusOnClick: {
        type: "boolean",
        default: false
      },
      isResponsive: {
        type: "boolean",
        default: "false"
      },
      __unstableLocation: {
        type: "string"
      },
      overlayBackgroundColor: {
        type: "string"
      },
      customOverlayBackgroundColor: {
        type: "string"
      },
      overlayTextColor: {
        type: "string"
      },
      customOverlayTextColor: {
        type: "string"
      }
    },
    supports: {
      align: ["wide", "full"],
      anchor: true,
      html: false,
      inserter: true,
      typography: {
        fontSize: true,
        lineHeight: true,
        __experimentalFontStyle: true,
        __experimentalFontWeight: true,
        __experimentalTextTransform: true,
        __experimentalFontFamily: true,
        __experimentalTextDecoration: true
      }
    },
    isEligible(attributes) {
      return attributes.isResponsive;
    },
    migrate: compose(
      migrateIdToRef,
      migrateWithLayout,
      migrateFontFamily,
      migrateIsResponsive,
      migrateOpenSubmenusOnClick
    ),
    save() {
      return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
    }
  },
  {
    attributes: {
      orientation: {
        type: "string"
      },
      textColor: {
        type: "string"
      },
      customTextColor: {
        type: "string"
      },
      rgbTextColor: {
        type: "string"
      },
      backgroundColor: {
        type: "string"
      },
      customBackgroundColor: {
        type: "string"
      },
      rgbBackgroundColor: {
        type: "string"
      },
      itemsJustification: {
        type: "string"
      },
      showSubmenuIcon: {
        type: "boolean",
        default: true
      }
    },
    supports: {
      align: ["wide", "full"],
      anchor: true,
      html: false,
      inserter: true,
      fontSize: true,
      __experimentalFontStyle: true,
      __experimentalFontWeight: true,
      __experimentalTextTransform: true,
      color: true,
      __experimentalFontFamily: true,
      __experimentalTextDecoration: true
    },
    save() {
      return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
    },
    isEligible(attributes) {
      if (!attributes.style || !attributes.style.typography) {
        return false;
      }
      for (const styleAttribute in TYPOGRAPHY_PRESET_DEPRECATION_MAP) {
        const attributeValue = attributes.style.typography[styleAttribute];
        if (attributeValue && attributeValue.startsWith(
          TYPOGRAPHY_PRESET_DEPRECATION_MAP[styleAttribute]
        )) {
          return true;
        }
      }
      return false;
    },
    migrate: compose(
      migrateIdToRef,
      migrateWithLayout,
      migrateFontFamily,
      migrateTypographyPresets
    )
  },
  {
    attributes: {
      className: {
        type: "string"
      },
      textColor: {
        type: "string"
      },
      rgbTextColor: {
        type: "string"
      },
      backgroundColor: {
        type: "string"
      },
      rgbBackgroundColor: {
        type: "string"
      },
      fontSize: {
        type: "string"
      },
      customFontSize: {
        type: "number"
      },
      itemsJustification: {
        type: "string"
      },
      showSubmenuIcon: {
        type: "boolean"
      }
    },
    isEligible(attribute) {
      return attribute.rgbTextColor || attribute.rgbBackgroundColor;
    },
    supports: {
      align: ["wide", "full"],
      anchor: true,
      html: false,
      inserter: true
    },
    migrate: compose(migrateIdToRef, (attributes) => {
      const { rgbTextColor, rgbBackgroundColor, ...restAttributes } = attributes;
      return {
        ...restAttributes,
        customTextColor: attributes.textColor ? void 0 : attributes.rgbTextColor,
        customBackgroundColor: attributes.backgroundColor ? void 0 : attributes.rgbBackgroundColor
      };
    }),
    save() {
      return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
    }
  }
];
var deprecated_default = deprecated;
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

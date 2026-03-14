"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/button-block-appender/index.js
var button_block_appender_exports = {};
__export(button_block_appender_exports, {
  ButtonBlockerAppender: () => ButtonBlockerAppender,
  default: () => button_block_appender_default
});
module.exports = __toCommonJS(button_block_appender_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_inserter = __toESM(require("../inserter/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function ButtonBlockAppender({ rootClientId, className, onFocus, tabIndex, onSelect }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_inserter.default,
    {
      position: "bottom center",
      rootClientId,
      __experimentalIsQuick: true,
      onSelectOrClose: (...args) => {
        if (onSelect && typeof onSelect === "function") {
          onSelect(...args);
        }
      },
      renderToggle: ({
        onToggle,
        disabled,
        isOpen,
        blockTitle,
        hasSingleBlockType,
        appenderLabel
      }) => {
        const isToggleButton = !hasSingleBlockType;
        let label;
        if (appenderLabel) {
          label = appenderLabel;
        } else if (hasSingleBlockType) {
          label = (0, import_i18n.sprintf)(
            // translators: %s: the name of the block when there is only one
            (0, import_i18n._x)("Add %s", "directly add the only allowed block"),
            blockTitle.toLowerCase()
          );
        } else {
          label = (0, import_i18n._x)(
            "Add block",
            "Generic label for block inserter button"
          );
        }
        return (
          // Disable reason: There shouldn't be a case where this button is disabled but not visually hidden.
          // eslint-disable-next-line @wordpress/components-no-unsafe-button-disabled
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              ref,
              onFocus,
              tabIndex,
              className: (0, import_clsx.default)(
                className,
                "block-editor-button-block-appender"
              ),
              onClick: onToggle,
              "aria-haspopup": isToggleButton ? "true" : void 0,
              "aria-expanded": isToggleButton ? isOpen : void 0,
              disabled,
              label,
              showTooltip: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.plus })
            }
          )
        );
      },
      isAppender: true
    }
  );
}
var ButtonBlockerAppender = (0, import_element.forwardRef)((props, ref) => {
  (0, import_deprecated.default)(`wp.blockEditor.ButtonBlockerAppender`, {
    alternative: "wp.blockEditor.ButtonBlockAppender",
    since: "5.9"
  });
  return ButtonBlockAppender(props, ref);
});
var button_block_appender_default = (0, import_element.forwardRef)(ButtonBlockAppender);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ButtonBlockerAppender
});
//# sourceMappingURL=index.cjs.map

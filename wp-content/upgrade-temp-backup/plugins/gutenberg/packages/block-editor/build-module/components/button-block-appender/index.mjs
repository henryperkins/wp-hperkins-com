// packages/block-editor/src/components/button-block-appender/index.js
import clsx from "clsx";
import { Button } from "@wordpress/components";
import { forwardRef } from "@wordpress/element";
import { _x, sprintf } from "@wordpress/i18n";
import { Icon, plus } from "@wordpress/icons";
import deprecated from "@wordpress/deprecated";
import Inserter from "../inserter/index.mjs";
import { jsx } from "react/jsx-runtime";
function ButtonBlockAppender({ rootClientId, className, onFocus, tabIndex, onSelect }, ref) {
  return /* @__PURE__ */ jsx(
    Inserter,
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
          label = sprintf(
            // translators: %s: the name of the block when there is only one
            _x("Add %s", "directly add the only allowed block"),
            blockTitle.toLowerCase()
          );
        } else {
          label = _x(
            "Add block",
            "Generic label for block inserter button"
          );
        }
        return (
          // Disable reason: There shouldn't be a case where this button is disabled but not visually hidden.
          // eslint-disable-next-line @wordpress/components-no-unsafe-button-disabled
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              ref,
              onFocus,
              tabIndex,
              className: clsx(
                className,
                "block-editor-button-block-appender"
              ),
              onClick: onToggle,
              "aria-haspopup": isToggleButton ? "true" : void 0,
              "aria-expanded": isToggleButton ? isOpen : void 0,
              disabled,
              label,
              showTooltip: true,
              children: /* @__PURE__ */ jsx(Icon, { icon: plus })
            }
          )
        );
      },
      isAppender: true
    }
  );
}
var ButtonBlockerAppender = forwardRef((props, ref) => {
  deprecated(`wp.blockEditor.ButtonBlockerAppender`, {
    alternative: "wp.blockEditor.ButtonBlockAppender",
    since: "5.9"
  });
  return ButtonBlockAppender(props, ref);
});
var button_block_appender_default = forwardRef(ButtonBlockAppender);
export {
  ButtonBlockerAppender,
  button_block_appender_default as default
};
//# sourceMappingURL=index.mjs.map

// packages/block-editor/src/components/inner-blocks/button-block-appender.js
import clsx from "clsx";
import BaseButtonBlockAppender from "../button-block-appender/index.mjs";
import { useBlockEditContext } from "../block-edit/context.mjs";
import { jsx } from "react/jsx-runtime";
function ButtonBlockAppender({
  showSeparator,
  isFloating,
  onAddBlock,
  isToggle
}) {
  const { clientId } = useBlockEditContext();
  return /* @__PURE__ */ jsx(
    BaseButtonBlockAppender,
    {
      className: clsx({
        "block-list-appender__toggle": isToggle
      }),
      rootClientId: clientId,
      showSeparator,
      isFloating,
      onAddBlock
    }
  );
}
export {
  ButtonBlockAppender as default
};
//# sourceMappingURL=button-block-appender.mjs.map

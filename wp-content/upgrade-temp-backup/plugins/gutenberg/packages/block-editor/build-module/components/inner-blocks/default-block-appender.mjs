// packages/block-editor/src/components/inner-blocks/default-block-appender.js
import BaseDefaultBlockAppender from "../default-block-appender/index.mjs";
import { useBlockEditContext } from "../block-edit/context.mjs";
import { jsx } from "react/jsx-runtime";
function DefaultBlockAppender() {
  const { clientId } = useBlockEditContext();
  return /* @__PURE__ */ jsx(BaseDefaultBlockAppender, { rootClientId: clientId });
}
export {
  DefaultBlockAppender as default
};
//# sourceMappingURL=default-block-appender.mjs.map

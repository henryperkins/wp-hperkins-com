// packages/block-editor/src/components/provider/selection-context.js
import { createContext } from "@wordpress/element";
var noop = () => {
};
var SelectionContext = createContext({
  getSelection: () => void 0,
  onChangeSelection: noop
});
export {
  SelectionContext
};
//# sourceMappingURL=selection-context.mjs.map

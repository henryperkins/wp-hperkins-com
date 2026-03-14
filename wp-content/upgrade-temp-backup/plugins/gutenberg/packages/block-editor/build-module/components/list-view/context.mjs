// packages/block-editor/src/components/list-view/context.js
import { createContext, useContext } from "@wordpress/element";
var ListViewContext = createContext({});
ListViewContext.displayName = "ListViewContext";
var useListViewContext = () => useContext(ListViewContext);
export {
  ListViewContext,
  useListViewContext
};
//# sourceMappingURL=context.mjs.map

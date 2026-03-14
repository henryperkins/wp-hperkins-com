// packages/global-styles-ui/src/context.ts
import { createContext } from "@wordpress/element";
var GlobalStylesContext = createContext({
  user: { styles: {}, settings: {} },
  base: { styles: {}, settings: {} },
  merged: { styles: {}, settings: {} },
  onChange: () => {
  },
  fontLibraryEnabled: false
});
export {
  GlobalStylesContext
};
//# sourceMappingURL=context.mjs.map

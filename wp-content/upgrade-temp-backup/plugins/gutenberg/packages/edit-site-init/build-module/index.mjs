// packages/edit-site-init/src/index.ts
import {
  home,
  styles,
  navigation,
  page,
  symbol,
  symbolFilled,
  layout
} from "@wordpress/icons";
import { dispatch } from "@wordpress/data";
import { store as bootStore } from "@wordpress/boot";
async function init() {
  const menuIcons = {
    home: { icon: home },
    styles: { icon: styles },
    navigation: { icon: navigation },
    pages: { icon: page },
    templateParts: { icon: symbolFilled },
    patterns: { icon: symbol },
    templates: { icon: layout }
  };
  Object.entries(menuIcons).forEach(([id, { icon }]) => {
    dispatch(bootStore).updateMenuItem(id, { icon });
  });
}
export {
  init
};
//# sourceMappingURL=index.mjs.map

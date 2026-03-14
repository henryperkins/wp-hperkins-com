// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/navigation-menu-editor.js
import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { BlockEditorProvider } from "@wordpress/block-editor";
import { createBlock } from "@wordpress/blocks";
import { __experimentalFetchLinkSuggestions as fetchLinkSuggestions } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
import NavigationMenuContent from "../sidebar-navigation-screen-navigation-menus/navigation-menu-content.mjs";
import { jsx } from "react/jsx-runtime";
var noop = () => {
};
function NavigationMenuEditor({ navigationMenuId }) {
  const { storedSettings } = useSelect((select) => {
    const { getSettings } = unlock(select(editSiteStore));
    return {
      storedSettings: getSettings()
    };
  }, []);
  const settings = useMemo(() => {
    return {
      ...storedSettings,
      __experimentalFetchLinkSuggestions: (search, searchOptions) => fetchLinkSuggestions(search, searchOptions, storedSettings)
    };
  }, [storedSettings]);
  const blocks = useMemo(() => {
    if (!navigationMenuId) {
      return [];
    }
    return [createBlock("core/navigation", { ref: navigationMenuId })];
  }, [navigationMenuId]);
  if (!navigationMenuId || !blocks?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    BlockEditorProvider,
    {
      settings,
      value: blocks,
      onChange: noop,
      onInput: noop,
      children: /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar-navigation-screen-navigation-menus__content", children: /* @__PURE__ */ jsx(NavigationMenuContent, { rootClientId: blocks[0].clientId }) })
    }
  );
}
export {
  NavigationMenuEditor as default
};
//# sourceMappingURL=navigation-menu-editor.mjs.map

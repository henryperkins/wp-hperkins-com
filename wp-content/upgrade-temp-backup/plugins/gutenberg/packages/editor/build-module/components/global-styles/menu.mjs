// packages/editor/src/components/global-styles/menu.js
import { DropdownMenu, MenuGroup, MenuItem } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as preferencesStore } from "@wordpress/preferences";
import { moreVertical } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { useGlobalStyles } from "./hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function GlobalStylesActionMenu({
  hideWelcomeGuide = false,
  onChangePath
}) {
  const { user, setUser } = useGlobalStyles();
  const canReset = !!user && (Object.keys(user?.styles ?? {}).length > 0 || Object.keys(user?.settings ?? {}).length > 0);
  const onReset = () => {
    setUser({ styles: {}, settings: {} });
  };
  const { toggle } = useDispatch(preferencesStore);
  const { canEditCSS } = useSelect((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(coreStore);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      canEditCSS: !!globalStyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const loadCustomCSS = () => {
    onChangePath("/css");
  };
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moreVertical,
      label: __("More"),
      toggleProps: { size: "compact" },
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(MenuGroup, { children: [
          canEditCSS && /* @__PURE__ */ jsx(MenuItem, { onClick: loadCustomCSS, children: __("Additional CSS") }),
          !hideWelcomeGuide && /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                toggle(
                  "core/edit-site",
                  "welcomeGuideStyles"
                );
                onClose();
              },
              children: __("Welcome Guide")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
          {
            onClick: () => {
              onReset();
              onClose();
            },
            disabled: !canReset,
            children: __("Reset styles")
          }
        ) })
      ] })
    }
  );
}
export {
  GlobalStylesActionMenu
};
//# sourceMappingURL=menu.mjs.map

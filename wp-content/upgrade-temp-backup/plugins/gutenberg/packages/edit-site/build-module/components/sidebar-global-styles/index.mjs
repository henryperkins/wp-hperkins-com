// packages/edit-site/src/components/sidebar-global-styles/index.js
import { Page } from "@wordpress/admin-ui";
import { __ } from "@wordpress/i18n";
import { useMemo, useState } from "@wordpress/element";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { useViewportMatch } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { Button, __experimentalHStack as HStack } from "@wordpress/components";
import { addQueryArgs, removeQueryArgs } from "@wordpress/url";
import { seen } from "@wordpress/icons";
import { store as editSiteStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { GlobalStylesUIWrapper, GlobalStylesActionMenu } = unlock(editorPrivateApis);
var { useLocation, useHistory } = unlock(routerPrivateApis);
var GlobalStylesPageActions = ({
  isStyleBookOpened,
  setIsStyleBookOpened,
  path,
  onChangeSection
}) => {
  const history = useHistory();
  return /* @__PURE__ */ jsxs(HStack, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        isPressed: isStyleBookOpened,
        icon: seen,
        label: __("Style Book"),
        onClick: () => {
          setIsStyleBookOpened(!isStyleBookOpened);
          const updatedPath = !isStyleBookOpened ? addQueryArgs(path, { preview: "stylebook" }) : removeQueryArgs(path, "preview");
          history.navigate(updatedPath);
        },
        size: "compact"
      }
    ),
    /* @__PURE__ */ jsx(
      GlobalStylesActionMenu,
      {
        hideWelcomeGuide: true,
        onChangePath: onChangeSection
      }
    )
  ] });
};
var useSection = () => {
  const { path, query } = useLocation();
  const history = useHistory();
  return useMemo(() => {
    return [
      query.section ?? "/",
      (updatedSection) => {
        history.navigate(
          addQueryArgs(path, {
            section: updatedSection
          })
        );
      }
    ];
  }, [path, query.section, history]);
};
function SidebarGlobalStyles() {
  const { path } = useLocation();
  const [isStyleBookOpened, setIsStyleBookOpened] = useState(
    path.includes("preview=stylebook")
  );
  const isMobileViewport = useViewportMatch("medium", "<");
  const [section, onChangeSection] = useSection();
  const settings = useSelect(
    (select) => select(editSiteStore).getSettings(),
    []
  );
  return /* @__PURE__ */ jsx(
    Page,
    {
      actions: !isMobileViewport ? /* @__PURE__ */ jsx(
        GlobalStylesPageActions,
        {
          isStyleBookOpened,
          setIsStyleBookOpened,
          path,
          onChangeSection
        }
      ) : null,
      className: "edit-site-styles",
      title: __("Styles"),
      children: /* @__PURE__ */ jsx(
        GlobalStylesUIWrapper,
        {
          path: section,
          onPathChange: onChangeSection,
          settings
        }
      )
    }
  );
}
export {
  SidebarGlobalStyles as default,
  useSection
};
//# sourceMappingURL=index.mjs.map

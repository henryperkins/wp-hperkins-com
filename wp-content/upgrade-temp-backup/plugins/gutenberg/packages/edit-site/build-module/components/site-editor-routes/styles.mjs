// packages/edit-site/src/components/site-editor-routes/styles.js
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { addQueryArgs } from "@wordpress/url";
import Editor from "../editor/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import SidebarNavigationScreenGlobalStyles from "../sidebar-navigation-screen-global-styles/index.mjs";
import SidebarGlobalStyles from "../sidebar-global-styles/index.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation, useHistory } = unlock(routerPrivateApis);
var { StyleBookPreview } = unlock(editorPrivateApis);
function MobileGlobalStylesUI() {
  const { query = {} } = useLocation();
  const { canvas } = query;
  if (canvas === "edit") {
    return /* @__PURE__ */ jsx(Editor, {});
  }
  return /* @__PURE__ */ jsx(SidebarGlobalStyles, {});
}
function StylesPreviewArea() {
  const { path, query } = useLocation();
  const history = useHistory();
  const isStylebook = query.preview === "stylebook";
  const section = query.section ?? "/";
  const onChangeSection = (updatedSection) => {
    history.navigate(
      addQueryArgs(path, {
        section: updatedSection
      })
    );
  };
  if (isStylebook) {
    return /* @__PURE__ */ jsx(
      StyleBookPreview,
      {
        path: section,
        onPathChange: onChangeSection
      }
    );
  }
  return /* @__PURE__ */ jsx(Editor, {});
}
var stylesRoute = {
  name: "styles",
  path: "/styles",
  areas: {
    content: /* @__PURE__ */ jsx(SidebarGlobalStyles, {}),
    sidebar: /* @__PURE__ */ jsx(SidebarNavigationScreenGlobalStyles, { backPath: "/" }),
    preview: /* @__PURE__ */ jsx(StylesPreviewArea, {}),
    mobile: /* @__PURE__ */ jsx(MobileGlobalStylesUI, {})
  },
  widths: {
    content: 380
  }
};
export {
  stylesRoute
};
//# sourceMappingURL=styles.mjs.map

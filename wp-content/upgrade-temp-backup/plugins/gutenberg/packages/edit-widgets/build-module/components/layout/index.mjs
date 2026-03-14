// packages/edit-widgets/src/components/layout/index.js
import { __, sprintf } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { PluginArea } from "@wordpress/plugins";
import { store as noticesStore } from "@wordpress/notices";
import { __unstableUseNavigateRegions as useNavigateRegions } from "@wordpress/components";
import ErrorBoundary from "../error-boundary/index.mjs";
import WidgetAreasBlockEditorProvider from "../widget-areas-block-editor-provider/index.mjs";
import Sidebar from "../sidebar/index.mjs";
import Interface from "./interface.mjs";
import UnsavedChangesWarning from "./unsaved-changes-warning.mjs";
import WelcomeGuide from "../welcome-guide/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Layout({ blockEditorSettings }) {
  const { createErrorNotice } = useDispatch(noticesStore);
  function onPluginAreaError(name) {
    createErrorNotice(
      sprintf(
        /* translators: %s: plugin name */
        __(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  const navigateRegionsProps = useNavigateRegions();
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(
    "div",
    {
      className: navigateRegionsProps.className,
      ...navigateRegionsProps,
      ref: navigateRegionsProps.ref,
      children: /* @__PURE__ */ jsxs(
        WidgetAreasBlockEditorProvider,
        {
          blockEditorSettings,
          children: [
            /* @__PURE__ */ jsx(Interface, { blockEditorSettings }),
            /* @__PURE__ */ jsx(Sidebar, {}),
            /* @__PURE__ */ jsx(PluginArea, { onError: onPluginAreaError }),
            /* @__PURE__ */ jsx(UnsavedChangesWarning, {}),
            /* @__PURE__ */ jsx(WelcomeGuide, {})
          ]
        }
      )
    }
  ) });
}
var layout_default = Layout;
export {
  layout_default as default
};
//# sourceMappingURL=index.mjs.map

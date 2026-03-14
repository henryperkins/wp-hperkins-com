// packages/editor/src/components/preferences-modal/enable-publish-sidebar.js
import { useDispatch, useSelect } from "@wordpress/data";
import { privateApis as preferencesPrivateApis } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { PreferenceBaseOption } = unlock(preferencesPrivateApis);
function EnablePublishSidebarOption(props) {
  const isChecked = useSelect((select) => {
    return select(editorStore).isPublishSidebarEnabled();
  }, []);
  const { enablePublishSidebar, disablePublishSidebar } = useDispatch(editorStore);
  return /* @__PURE__ */ jsx(
    PreferenceBaseOption,
    {
      isChecked,
      onChange: (isEnabled) => isEnabled ? enablePublishSidebar() : disablePublishSidebar(),
      ...props
    }
  );
}
export {
  EnablePublishSidebarOption as default
};
//# sourceMappingURL=enable-publish-sidebar.mjs.map

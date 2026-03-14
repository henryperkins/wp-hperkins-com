// packages/edit-post/src/components/preferences-modal/enable-panel.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { privateApis as preferencesPrivateApis } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { PreferenceBaseOption } = unlock(preferencesPrivateApis);
function EnablePanelOption(props) {
  const { toggleEditorPanelEnabled } = useDispatch(editorStore);
  const { isChecked, isRemoved } = useSelect(
    (select) => {
      const { isEditorPanelEnabled, isEditorPanelRemoved } = select(editorStore);
      return {
        isChecked: isEditorPanelEnabled(props.panelName),
        isRemoved: isEditorPanelRemoved(props.panelName)
      };
    },
    [props.panelName]
  );
  if (isRemoved) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    PreferenceBaseOption,
    {
      isChecked,
      onChange: () => toggleEditorPanelEnabled(props.panelName),
      ...props
    }
  );
}
export {
  EnablePanelOption as default
};
//# sourceMappingURL=enable-panel.mjs.map

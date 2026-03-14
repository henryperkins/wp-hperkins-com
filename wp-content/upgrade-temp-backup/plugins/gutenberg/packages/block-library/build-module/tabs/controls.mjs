// packages/block-library/src/tabs/controls.js
import AddTabToolbarControl from "../tab/add-tab-toolbar-control.mjs";
import RemoveTabToolbarControl from "../tab/remove-tab-toolbar-control.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Controls({ clientId }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId: clientId }),
    /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId: clientId })
  ] });
}
export {
  Controls as default
};
//# sourceMappingURL=controls.mjs.map

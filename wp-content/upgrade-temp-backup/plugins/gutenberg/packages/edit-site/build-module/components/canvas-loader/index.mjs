// packages/edit-site/src/components/canvas-loader/index.js
import {
  privateApis as componentsPrivateApis,
  ProgressBar
} from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { Theme } = unlock(componentsPrivateApis);
var { useStyle } = unlock(editorPrivateApis);
function CanvasLoader({ id }) {
  const textColor = useStyle("color.text");
  const backgroundColor = useStyle("color.background");
  const { elapsed, total } = useSelect((select) => {
    const selectorsByStatus = select(coreStore).countSelectorsByStatus();
    const resolving = selectorsByStatus.resolving ?? 0;
    const finished = selectorsByStatus.finished ?? 0;
    return {
      elapsed: finished,
      total: finished + resolving
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "edit-site-canvas-loader", children: /* @__PURE__ */ jsx(Theme, { accent: textColor, background: backgroundColor, children: /* @__PURE__ */ jsx(ProgressBar, { id, max: total, value: elapsed }) }) });
}
export {
  CanvasLoader as default
};
//# sourceMappingURL=index.mjs.map

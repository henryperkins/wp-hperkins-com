// packages/block-editor/src/components/inspector-controls/fill.js
import {
  __experimentalStyleProvider as StyleProvider,
  __experimentalToolsPanelContext as ToolsPanelContext
} from "@wordpress/components";
import warning from "@wordpress/warning";
import deprecated from "@wordpress/deprecated";
import { useEffect, useContext } from "@wordpress/element";
import {
  useBlockEditContext,
  mayDisplayControlsKey,
  mayDisplayPatternEditingControlsKey,
  isInListViewBlockSupportTreeKey
} from "../block-edit/context.mjs";
import groups from "./groups.mjs";
import { ListViewContentFill } from "./list-view-content-popover.mjs";
import { jsx } from "react/jsx-runtime";
var PATTERN_EDITING_GROUPS = ["content", "list"];
var TEMPLATE_PART_GROUPS = ["default", "settings", "advanced"];
function InspectorControlsFill({
  children,
  group = "default",
  __experimentalGroup,
  resetAllFilter
}) {
  if (__experimentalGroup) {
    deprecated(
      "`__experimentalGroup` property in `InspectorControlsFill`",
      {
        since: "6.2",
        version: "6.4",
        alternative: "`group`"
      }
    );
    group = __experimentalGroup;
  }
  const context = useBlockEditContext();
  const Fill = groups[group]?.Fill;
  if (!Fill) {
    warning(`Unknown InspectorControls group "${group}" provided.`);
    return null;
  }
  if (context[mayDisplayPatternEditingControlsKey]) {
    const isTemplatePart = context.name === "core/template-part";
    const isTemplatePartGroup = TEMPLATE_PART_GROUPS.includes(group);
    const isPatternEditingGroup = PATTERN_EDITING_GROUPS.includes(group);
    const canShowGroup = isTemplatePart && isTemplatePartGroup || isPatternEditingGroup;
    if (!canShowGroup) {
      return null;
    }
  }
  if (!context[mayDisplayPatternEditingControlsKey] && !context[mayDisplayControlsKey]) {
    return null;
  }
  if (group === "content" && !!context[isInListViewBlockSupportTreeKey] && !!context[mayDisplayPatternEditingControlsKey]) {
    if (context[mayDisplayControlsKey]) {
      return /* @__PURE__ */ jsx(StyleProvider, { document, children: /* @__PURE__ */ jsx(ListViewContentFill, { children }) });
    }
    return null;
  }
  return /* @__PURE__ */ jsx(StyleProvider, { document, children: /* @__PURE__ */ jsx(Fill, { children: (fillProps) => {
    return /* @__PURE__ */ jsx(
      ToolsPanelInspectorControl,
      {
        fillProps,
        children,
        resetAllFilter
      }
    );
  } }) });
}
function RegisterResetAll({ resetAllFilter, children }) {
  const { registerResetAllFilter, deregisterResetAllFilter } = useContext(ToolsPanelContext);
  useEffect(() => {
    if (resetAllFilter && registerResetAllFilter && deregisterResetAllFilter) {
      registerResetAllFilter(resetAllFilter);
      return () => {
        deregisterResetAllFilter(resetAllFilter);
      };
    }
  }, [resetAllFilter, registerResetAllFilter, deregisterResetAllFilter]);
  return children;
}
function ToolsPanelInspectorControl({ children, resetAllFilter, fillProps }) {
  const { forwardedContext = [] } = fillProps;
  const innerMarkup = /* @__PURE__ */ jsx(RegisterResetAll, { resetAllFilter, children });
  return forwardedContext.reduce(
    (inner, [Provider, props]) => /* @__PURE__ */ jsx(Provider, { ...props, children: inner }),
    innerMarkup
  );
}
export {
  InspectorControlsFill as default
};
//# sourceMappingURL=fill.mjs.map

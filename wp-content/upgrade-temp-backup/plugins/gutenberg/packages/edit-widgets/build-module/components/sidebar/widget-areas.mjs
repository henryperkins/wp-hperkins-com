// packages/edit-widgets/src/components/sidebar/widget-areas.js
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { blockDefault } from "@wordpress/icons";
import { BlockIcon } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { safeHTML } from "@wordpress/dom";
import { store as editWidgetsStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function WidgetAreas({ selectedWidgetAreaId }) {
  const widgetAreas = useSelect(
    (select) => select(editWidgetsStore).getWidgetAreas(),
    []
  );
  const selectedWidgetArea = useMemo(
    () => selectedWidgetAreaId && widgetAreas?.find(
      (widgetArea) => widgetArea.id === selectedWidgetAreaId
    ),
    [selectedWidgetAreaId, widgetAreas]
  );
  let description;
  if (!selectedWidgetArea) {
    description = __(
      // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
      "Widget Areas are global parts in your site\u2019s layout that can accept blocks. These vary by theme, but are typically parts like your Sidebar or Footer."
    );
  } else if (selectedWidgetAreaId === "wp_inactive_widgets") {
    description = __(
      "Blocks in this Widget Area will not be displayed in your site."
    );
  } else {
    description = selectedWidgetArea.description;
  }
  return /* @__PURE__ */ jsx("div", { className: "edit-widgets-widget-areas", children: /* @__PURE__ */ jsxs("div", { className: "edit-widgets-widget-areas__top-container", children: [
    /* @__PURE__ */ jsx(BlockIcon, { icon: blockDefault }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "p",
        {
          dangerouslySetInnerHTML: {
            __html: safeHTML(description)
          }
        }
      ),
      widgetAreas?.length === 0 && /* @__PURE__ */ jsx("p", { children: __(
        "Your theme does not contain any Widget Areas."
      ) }),
      !selectedWidgetArea && /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          href: addQueryArgs("customize.php", {
            "autofocus[panel]": "widgets",
            return: window.location.pathname
          }),
          variant: "tertiary",
          children: __("Manage with live preview")
        }
      )
    ] })
  ] }) });
}
export {
  WidgetAreas as default
};
//# sourceMappingURL=widget-areas.mjs.map

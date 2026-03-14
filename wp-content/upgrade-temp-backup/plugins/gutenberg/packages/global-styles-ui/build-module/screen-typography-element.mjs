// packages/global-styles-ui/src/screen-typography-element.tsx
import { __, _x } from "@wordpress/i18n";
import {
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  __experimentalSpacer as Spacer
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import TypographyPanel from "./typography-panel.mjs";
import { ScreenHeader } from "./screen-header.mjs";
import TypographyPreview from "./typography-preview.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var elements = {
  text: {
    description: __("Manage the fonts used on the site."),
    title: __("Text")
  },
  link: {
    description: __("Manage the fonts and typography used on the links."),
    title: __("Links")
  },
  heading: {
    description: __("Manage the fonts and typography used on headings."),
    title: __("Headings")
  },
  caption: {
    description: __("Manage the fonts and typography used on captions."),
    title: __("Captions")
  },
  button: {
    description: __("Manage the fonts and typography used on buttons."),
    title: __("Buttons")
  }
};
function ScreenTypographyElement({ element }) {
  const [headingLevel, setHeadingLevel] = useState("heading");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: elements[element].title,
        description: elements[element].description
      }
    ),
    /* @__PURE__ */ jsx(Spacer, { marginX: 4, children: /* @__PURE__ */ jsx(
      TypographyPreview,
      {
        element,
        headingLevel
      }
    ) }),
    element === "heading" && /* @__PURE__ */ jsx(Spacer, { marginX: 4, marginBottom: "1em", children: /* @__PURE__ */ jsxs(
      ToggleGroupControl,
      {
        label: __("Select heading level"),
        hideLabelFromVision: true,
        value: headingLevel,
        onChange: (value) => setHeadingLevel(value),
        isBlock: true,
        size: "__unstable-large",
        children: [
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "heading",
              showTooltip: true,
              "aria-label": __("All headings"),
              label: _x("All", "heading levels")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h1",
              showTooltip: true,
              "aria-label": __("Heading 1"),
              label: __("H1")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h2",
              showTooltip: true,
              "aria-label": __("Heading 2"),
              label: __("H2")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h3",
              showTooltip: true,
              "aria-label": __("Heading 3"),
              label: __("H3")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h4",
              showTooltip: true,
              "aria-label": __("Heading 4"),
              label: __("H4")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h5",
              showTooltip: true,
              "aria-label": __("Heading 5"),
              label: __("H5")
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "h6",
              showTooltip: true,
              "aria-label": __("Heading 6"),
              label: __("H6")
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      TypographyPanel,
      {
        element,
        headingLevel
      }
    )
  ] });
}
var screen_typography_element_default = ScreenTypographyElement;
export {
  screen_typography_element_default as default
};
//# sourceMappingURL=screen-typography-element.mjs.map

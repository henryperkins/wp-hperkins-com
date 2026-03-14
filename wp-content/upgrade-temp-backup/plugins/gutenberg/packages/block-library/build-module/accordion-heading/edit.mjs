// packages/block-library/src/accordion-heading/edit.js
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import {
  useBlockProps,
  __experimentalGetSpacingClassesAndStyles as useSpacingProps,
  RichText,
  getTypographyClassesAndStyles as useTypographyProps,
  useSettings,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";
import { jsx, jsxs } from "react/jsx-runtime";
function Edit({ attributes, setAttributes, context }) {
  const { title } = attributes;
  const {
    "core/accordion-icon-position": iconPosition,
    "core/accordion-show-icon": showIcon,
    "core/accordion-heading-level": headingLevel
  } = context;
  const TagName = "h" + headingLevel;
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  useEffect(() => {
    if (iconPosition !== void 0 && showIcon !== void 0) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        iconPosition,
        showIcon
      });
    }
  }, [
    iconPosition,
    showIcon,
    setAttributes,
    __unstableMarkNextChangeAsNotPersistent
  ]);
  const [fluidTypographySettings, layout] = useSettings(
    "typography.fluid",
    "layout"
  );
  const typographyProps = useTypographyProps(attributes, {
    typography: {
      fluid: fluidTypographySettings
    },
    layout: {
      wideSize: layout?.wideSize
    }
  });
  const blockProps = useBlockProps();
  const spacingProps = useSpacingProps(attributes);
  return /* @__PURE__ */ jsx(TagName, { ...blockProps, children: /* @__PURE__ */ jsxs(
    "button",
    {
      className: "wp-block-accordion-heading__toggle",
      style: spacingProps.style,
      tabIndex: "-1",
      children: [
        showIcon && iconPosition === "left" && /* @__PURE__ */ jsx(
          "span",
          {
            className: "wp-block-accordion-heading__toggle-icon",
            "aria-hidden": "true",
            children: "+"
          }
        ),
        /* @__PURE__ */ jsx(
          RichText,
          {
            withoutInteractiveFormatting: true,
            disableLineBreaks: true,
            tagName: "span",
            value: title,
            onChange: (newTitle) => setAttributes({ title: newTitle }),
            placeholder: __("Accordion title"),
            className: "wp-block-accordion-heading__toggle-title",
            style: {
              letterSpacing: typographyProps.style.letterSpacing,
              textDecoration: typographyProps.style.textDecoration
            }
          }
        ),
        showIcon && iconPosition === "right" && /* @__PURE__ */ jsx(
          "span",
          {
            className: "wp-block-accordion-heading__toggle-icon",
            "aria-hidden": "true",
            children: "+"
          }
        )
      ]
    }
  ) });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map

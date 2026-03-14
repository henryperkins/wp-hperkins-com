"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/dataviews/src/components/dataform-layouts/card/index.tsx
var card_exports = {};
__export(card_exports, {
  default: () => FormCardField
});
module.exports = __toCommonJS(card_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import__ = require("../index.cjs");
var import_dataform_context = __toESM(require("../../dataform-context/index.cjs"));
var import_data_form_layout = require("../data-form-layout.cjs");
var import_normalize_form = require("../normalize-form.cjs");
var import_get_summary_fields = require("../get-summary-fields.cjs");
var import_use_report_validity = __toESM(require("../../../hooks/use-report-validity.cjs"));
var import_validation_badge = __toESM(require("../validation-badge.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function isSummaryFieldVisible(summaryField, summaryConfig, isOpen) {
  if (!summaryConfig || Array.isArray(summaryConfig) && summaryConfig.length === 0) {
    return false;
  }
  const summaryConfigArray = Array.isArray(summaryConfig) ? summaryConfig : [summaryConfig];
  const fieldConfig = summaryConfigArray.find((config) => {
    if (typeof config === "string") {
      return config === summaryField.id;
    }
    if (typeof config === "object" && "id" in config) {
      return config.id === summaryField.id;
    }
    return false;
  });
  if (!fieldConfig) {
    return false;
  }
  if (typeof fieldConfig === "string") {
    return true;
  }
  if (typeof fieldConfig === "object" && "visibility" in fieldConfig) {
    return fieldConfig.visibility === "always" || fieldConfig.visibility === "when-collapsed" && !isOpen;
  }
  return true;
}
function FormCardField({
  data,
  field,
  onChange,
  hideLabelFromVision,
  markWhenOptional,
  validity
}) {
  const { fields } = (0, import_element.useContext)(import_dataform_context.default);
  const layout = field.layout;
  const cardBodyRef = (0, import_element.useRef)(null);
  const instanceId = (0, import_compose.useInstanceId)(FormCardField);
  const bodyId = `dataforms-layouts-card-card-body-${instanceId}`;
  const titleId = `dataforms-layouts-card-card-title-${instanceId}`;
  const form = (0, import_element.useMemo)(
    () => ({
      layout: import_normalize_form.DEFAULT_LAYOUT,
      fields: field.children ?? []
    }),
    [field]
  );
  const { isOpened, isCollapsible } = layout;
  const [internalIsOpen, setIsOpen] = (0, import_element.useState)(isOpened);
  const [touched, setTouched] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    setIsOpen(isOpened);
  }, [isOpened]);
  const toggle = (0, import_element.useCallback)(() => {
    setIsOpen((prev) => {
      if (prev) {
        setTouched(true);
      }
      return !prev;
    });
  }, []);
  const isOpen = isCollapsible ? internalIsOpen : true;
  const handleBlur = (0, import_element.useCallback)(() => {
    setTouched(true);
  }, [setTouched]);
  (0, import_use_report_validity.default)(cardBodyRef, isOpen && touched);
  const summaryFields = (0, import_get_summary_fields.getSummaryFields)(layout.summary, fields);
  const visibleSummaryFields = summaryFields.filter(
    (summaryField) => isSummaryFieldVisible(summaryField, layout.summary, isOpen)
  );
  const validationBadge = touched && layout.isCollapsible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_validation_badge.default, { validity }) : null;
  const sizeCard = {
    blockStart: "medium",
    blockEnd: "medium",
    inlineStart: "medium",
    inlineEnd: "medium"
  };
  let label = field.label;
  let withHeader;
  let bodyContent;
  if (field.children) {
    withHeader = !!label && layout.withHeader;
    bodyContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      field.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataforms-layouts-card__field-description", children: field.description }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_data_form_layout.DataFormLayout,
        {
          data,
          form,
          onChange,
          validity: validity?.children
        }
      )
    ] });
  } else {
    const fieldDefinition = fields.find(
      (fieldDef) => fieldDef.id === field.id
    );
    if (!fieldDefinition || !fieldDefinition.Edit) {
      return null;
    }
    const SingleFieldLayout = (0, import__.getFormFieldLayout)("regular")?.component;
    if (!SingleFieldLayout) {
      return null;
    }
    label = fieldDefinition.label;
    withHeader = !!label && layout.withHeader;
    bodyContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SingleFieldLayout,
      {
        data,
        field,
        onChange,
        hideLabelFromVision: hideLabelFromVision || withHeader,
        markWhenOptional,
        validity
      }
    );
  }
  const sizeCardBody = {
    blockStart: withHeader ? "none" : "medium",
    blockEnd: "medium",
    inlineStart: "medium",
    inlineEnd: "medium"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Card, { className: "dataforms-layouts-card__field", size: sizeCard, children: [
    withHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.CardHeader,
      {
        className: "dataforms-layouts-card__field-header",
        onClick: isCollapsible ? toggle : void 0,
        style: {
          cursor: isCollapsible ? "pointer" : void 0
        },
        isBorderless: true,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              style: {
                // Match the expand/collapse button's height to avoid layout
                // differences when that button is not displayed.
                height: isCollapsible ? void 0 : "40px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "span",
                  {
                    id: titleId,
                    className: "dataforms-layouts-card__field-header-label",
                    children: label
                  }
                ),
                validationBadge,
                visibleSummaryFields.length > 0 && layout.withHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataforms-layouts-card__field-summary", children: visibleSummaryFields.map(
                  (summaryField) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    summaryField.render,
                    {
                      item: data,
                      field: summaryField
                    },
                    summaryField.id
                  )
                ) })
              ]
            }
          ),
          isCollapsible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              icon: isOpen ? import_icons.chevronUp : import_icons.chevronDown,
              "aria-expanded": isOpen,
              "aria-controls": bodyId,
              "aria-labelledby": titleId
            }
          )
        ]
      }
    ),
    (isOpen || !withHeader) && // If it doesn't have a header, keep it open.
    // Otherwise, the card will not be visible.
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.CardBody,
      {
        id: bodyId,
        size: sizeCardBody,
        className: "dataforms-layouts-card__field-control",
        ref: cardBodyRef,
        onBlur: handleBlur,
        children: bodyContent
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map

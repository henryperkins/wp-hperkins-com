// packages/dataviews/src/components/dataform-layouts/card/index.tsx
import {
  Button,
  Card,
  CardBody,
  CardHeader as OriginalCardHeader
} from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "@wordpress/element";
import { chevronDown, chevronUp } from "@wordpress/icons";
import { getFormFieldLayout } from "../index.mjs";
import DataFormContext from "../../dataform-context/index.mjs";
import { DataFormLayout } from "../data-form-layout.mjs";
import { DEFAULT_LAYOUT } from "../normalize-form.mjs";
import { getSummaryFields } from "../get-summary-fields.mjs";
import useReportValidity from "../../../hooks/use-report-validity.mjs";
import ValidationBadge from "../validation-badge.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const { fields } = useContext(DataFormContext);
  const layout = field.layout;
  const cardBodyRef = useRef(null);
  const instanceId = useInstanceId(FormCardField);
  const bodyId = `dataforms-layouts-card-card-body-${instanceId}`;
  const titleId = `dataforms-layouts-card-card-title-${instanceId}`;
  const form = useMemo(
    () => ({
      layout: DEFAULT_LAYOUT,
      fields: field.children ?? []
    }),
    [field]
  );
  const { isOpened, isCollapsible } = layout;
  const [internalIsOpen, setIsOpen] = useState(isOpened);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    setIsOpen(isOpened);
  }, [isOpened]);
  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setTouched(true);
      }
      return !prev;
    });
  }, []);
  const isOpen = isCollapsible ? internalIsOpen : true;
  const handleBlur = useCallback(() => {
    setTouched(true);
  }, [setTouched]);
  useReportValidity(cardBodyRef, isOpen && touched);
  const summaryFields = getSummaryFields(layout.summary, fields);
  const visibleSummaryFields = summaryFields.filter(
    (summaryField) => isSummaryFieldVisible(summaryField, layout.summary, isOpen)
  );
  const validationBadge = touched && layout.isCollapsible ? /* @__PURE__ */ jsx(ValidationBadge, { validity }) : null;
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
    bodyContent = /* @__PURE__ */ jsxs(Fragment, { children: [
      field.description && /* @__PURE__ */ jsx("div", { className: "dataforms-layouts-card__field-description", children: field.description }),
      /* @__PURE__ */ jsx(
        DataFormLayout,
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
    const SingleFieldLayout = getFormFieldLayout("regular")?.component;
    if (!SingleFieldLayout) {
      return null;
    }
    label = fieldDefinition.label;
    withHeader = !!label && layout.withHeader;
    bodyContent = /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs(Card, { className: "dataforms-layouts-card__field", size: sizeCard, children: [
    withHeader && /* @__PURE__ */ jsxs(
      OriginalCardHeader,
      {
        className: "dataforms-layouts-card__field-header",
        onClick: isCollapsible ? toggle : void 0,
        style: {
          cursor: isCollapsible ? "pointer" : void 0
        },
        isBorderless: true,
        children: [
          /* @__PURE__ */ jsxs(
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
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    id: titleId,
                    className: "dataforms-layouts-card__field-header-label",
                    children: label
                  }
                ),
                validationBadge,
                visibleSummaryFields.length > 0 && layout.withHeader && /* @__PURE__ */ jsx("div", { className: "dataforms-layouts-card__field-summary", children: visibleSummaryFields.map(
                  (summaryField) => /* @__PURE__ */ jsx(
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
          isCollapsible && /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              icon: isOpen ? chevronUp : chevronDown,
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
    /* @__PURE__ */ jsx(
      CardBody,
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
export {
  FormCardField as default
};
//# sourceMappingURL=index.mjs.map

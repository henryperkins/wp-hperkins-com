// packages/block-library/src/navigation/edit/overlay-template-part-selector.js
import { useMemo, useState, useCallback } from "@wordpress/element";
import { useInstanceId } from "@wordpress/compose";
import { useEntityRecords, store as coreStore } from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";
import {
  SelectControl,
  Button,
  FlexBlock,
  FlexItem,
  __experimentalHStack as HStack,
  __experimentalText as Text
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { store as noticesStore } from "@wordpress/notices";
import { plus } from "@wordpress/icons";
import { createTemplatePartId } from "../../template-part/edit/utils/create-template-part-id.mjs";
import useCreateOverlayTemplatePart from "./use-create-overlay.mjs";
import DeletedOverlayWarning from "./deleted-overlay-warning.mjs";
import { NAVIGATION_OVERLAY_TEMPLATE_PART_AREA } from "../constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function OverlayTemplatePartSelector({
  overlay,
  overlayMenu,
  setAttributes,
  onNavigateToEntityRecord,
  isCreatingOverlay,
  setIsCreatingOverlay
}) {
  const headingId = useInstanceId(
    OverlayTemplatePartSelector,
    "wp-block-navigation__overlay-selector-heading"
  );
  const {
    records: templateParts,
    isResolving,
    hasResolved
  } = useEntityRecords("postType", "wp_template_part", {
    per_page: -1
  });
  const { createErrorNotice } = useDispatch(noticesStore);
  const currentTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme()?.stylesheet,
    []
  );
  const [localIsCreating, setLocalIsCreating] = useState(false);
  const isCreating = isCreatingOverlay !== void 0 ? isCreatingOverlay : localIsCreating;
  const setIsCreating = setIsCreatingOverlay !== void 0 ? setIsCreatingOverlay : setLocalIsCreating;
  const overlayTemplateParts = useMemo(() => {
    if (!templateParts) {
      return [];
    }
    return templateParts.filter(
      (templatePart) => templatePart.area === NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
    );
  }, [templateParts]);
  const createOverlayTemplatePart = useCreateOverlayTemplatePart(overlayTemplateParts);
  const selectedTemplatePart = useMemo(() => {
    if (!overlay || !overlayTemplateParts) {
      return null;
    }
    return overlayTemplateParts.find(
      (templatePart) => templatePart.slug === overlay
    );
  }, [overlay, overlayTemplateParts]);
  const options = useMemo(() => {
    const baseOptions = [
      {
        label: __("Default"),
        value: ""
      }
    ];
    if (!hasResolved || isResolving) {
      return baseOptions;
    }
    const templatePartOptions = overlayTemplateParts.map(
      (templatePart) => {
        const label = templatePart.title?.rendered ? decodeEntities(templatePart.title.rendered) : templatePart.slug;
        return {
          label,
          value: templatePart.slug
        };
      }
    );
    if (overlay && !selectedTemplatePart) {
      templatePartOptions.unshift({
        label: sprintf(
          /* translators: %s: Overlay slug. */
          __("%s (missing)"),
          overlay
        ),
        value: overlay
      });
    }
    return [...baseOptions, ...templatePartOptions];
  }, [
    overlayTemplateParts,
    hasResolved,
    isResolving,
    overlay,
    selectedTemplatePart
  ]);
  const handleSelectChange = (value) => {
    setAttributes({
      overlay: value || void 0
    });
  };
  const handleEditClick = () => {
    if (!overlay || !selectedTemplatePart || !onNavigateToEntityRecord) {
      return;
    }
    const theme = selectedTemplatePart.theme || currentTheme;
    const templatePartId = createTemplatePartId(theme, overlay);
    const params = {
      postId: templatePartId,
      postType: "wp_template_part"
    };
    if (overlayMenu === "mobile") {
      params.viewport = "mobile";
    }
    onNavigateToEntityRecord(params);
  };
  const handleCreateOverlay = useCallback(async () => {
    try {
      setIsCreating(true);
      const templatePart = await createOverlayTemplatePart();
      setAttributes({
        overlay: templatePart.slug
      });
      if (onNavigateToEntityRecord) {
        const theme = templatePart.theme || currentTheme;
        const templatePartId = createTemplatePartId(
          theme,
          templatePart.slug
        );
        const params = {
          postId: templatePartId,
          postType: "wp_template_part"
        };
        if (overlayMenu === "mobile") {
          params.viewport = "mobile";
        }
        onNavigateToEntityRecord(params);
      } else {
        setIsCreating(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error && "code" in error && error.message && error.code !== "unknown_error" ? error.message : __("An error occurred while creating the overlay.");
      createErrorNotice(errorMessage, { type: "snackbar" });
      setIsCreating(false);
    }
  }, [
    createOverlayTemplatePart,
    setAttributes,
    onNavigateToEntityRecord,
    createErrorNotice,
    currentTheme,
    setIsCreating,
    overlayMenu
  ]);
  const handleClearOverlay = useCallback(() => {
    setAttributes({ overlay: void 0 });
  }, [setAttributes]);
  const isCreateButtonDisabled = isResolving || isCreating;
  const isOverlayMissing = useMemo(() => {
    return overlay && hasResolved && !isResolving && !selectedTemplatePart;
  }, [overlay, hasResolved, isResolving, selectedTemplatePart]);
  const helpText = useMemo(() => {
    if (overlayTemplateParts.length === 0 && hasResolved) {
      return __("No overlays found.");
    }
    return __("Select an overlay for navigation.");
  }, [overlayTemplateParts.length, hasResolved]);
  const editButtonLabel = useMemo(() => {
    return selectedTemplatePart ? sprintf(
      /* translators: %s: Overlay title. */
      __("Edit overlay: %s"),
      selectedTemplatePart.title?.rendered ? decodeEntities(selectedTemplatePart.title.rendered) : selectedTemplatePart.slug
    ) : __("Edit overlay");
  }, [selectedTemplatePart]);
  return /* @__PURE__ */ jsxs("div", { className: "wp-block-navigation__overlay-selector", children: [
    /* @__PURE__ */ jsx(
      "h3",
      {
        id: headingId,
        className: "wp-block-navigation__overlay-selector-header",
        children: __("Overlay template")
      }
    ),
    hasResolved && (overlayTemplateParts.length === 0 || isCreating && overlayTemplateParts.length === 1) ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: handleCreateOverlay,
        disabled: isCreateButtonDisabled,
        accessibleWhenDisabled: true,
        isBusy: isCreating,
        className: "wp-block-navigation__overlay-create-button-prominent",
        children: __("Create overlay")
      }
    ) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "small",
          icon: plus,
          onClick: handleCreateOverlay,
          disabled: isCreateButtonDisabled,
          accessibleWhenDisabled: true,
          isBusy: isCreating,
          label: __("Create new overlay template"),
          showTooltip: true,
          className: "wp-block-navigation__overlay-create-button"
        }
      ),
      /* @__PURE__ */ jsxs(
        HStack,
        {
          alignment: "flex-start",
          className: "wp-block-navigation__overlay-selector-controls",
          children: [
            /* @__PURE__ */ jsx(FlexBlock, { children: /* @__PURE__ */ jsx(
              SelectControl,
              {
                __next40pxDefaultSize: true,
                label: __("Overlay template"),
                hideLabelFromVision: true,
                "aria-labelledby": headingId,
                value: overlay || "",
                options,
                onChange: handleSelectChange,
                disabled: isResolving,
                accessibleWhenDisabled: true,
                help: helpText
              }
            ) }),
            overlay && hasResolved && selectedTemplatePart && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                onClick: handleEditClick,
                disabled: !onNavigateToEntityRecord,
                accessibleWhenDisabled: true,
                label: editButtonLabel,
                showTooltip: true,
                className: "wp-block-navigation__overlay-edit-button",
                children: __("Edit")
              }
            ) })
          ]
        }
      ),
      isOverlayMissing && /* @__PURE__ */ jsx(
        DeletedOverlayWarning,
        {
          onClear: handleClearOverlay,
          onCreate: handleCreateOverlay,
          isCreating
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      HStack,
      {
        alignment: "flex-start",
        className: "wp-block-navigation__overlay-help-text-wrapper",
        children: /* @__PURE__ */ jsx(
          Text,
          {
            variant: "muted",
            isBlock: true,
            className: "wp-block-navigation__overlay-help-text",
            children: __(
              "An overlay template allows you to customize the appearance of the dialog that opens when the menu button is pressed."
            )
          }
        )
      }
    )
  ] });
}
export {
  OverlayTemplatePartSelector as default
};
//# sourceMappingURL=overlay-template-part-selector.mjs.map

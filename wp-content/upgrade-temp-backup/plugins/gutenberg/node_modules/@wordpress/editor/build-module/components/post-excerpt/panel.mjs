// packages/editor/src/components/post-excerpt/panel.js
import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  __experimentalText as Text,
  Dropdown,
  Button,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo, useState } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import PostExcerptForm from "./index.mjs";
import PostExcerptCheck from "./check.mjs";
import PluginPostExcerpt from "./plugin.mjs";
import { TEMPLATE_ORIGINS } from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { getTemplateInfo } from "../../utils/get-template-info.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var PANEL_NAME = "post-excerpt";
function ExcerptPanel() {
  const { isOpened, isEnabled, postType } = useSelect((select) => {
    const {
      isEditorPanelOpened,
      isEditorPanelEnabled,
      getCurrentPostType
    } = select(editorStore);
    return {
      isOpened: isEditorPanelOpened(PANEL_NAME),
      isEnabled: isEditorPanelEnabled(PANEL_NAME),
      postType: getCurrentPostType()
    };
  }, []);
  const { toggleEditorPanelOpened } = useDispatch(editorStore);
  const toggleExcerptPanel = () => toggleEditorPanelOpened(PANEL_NAME);
  if (!isEnabled) {
    return null;
  }
  const shouldUseDescriptionLabel = [
    "wp_template",
    "wp_template_part",
    "wp_block"
  ].includes(postType);
  return /* @__PURE__ */ jsx(
    PanelBody,
    {
      title: shouldUseDescriptionLabel ? __("Description") : __("Excerpt"),
      opened: isOpened,
      onToggle: toggleExcerptPanel,
      children: /* @__PURE__ */ jsx(PluginPostExcerpt.Slot, { children: (fills) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(PostExcerptForm, {}),
        fills
      ] }) })
    }
  );
}
function PostExcerptPanel() {
  return /* @__PURE__ */ jsx(PostExcerptCheck, { children: /* @__PURE__ */ jsx(ExcerptPanel, {}) });
}
function PrivatePostExcerptPanel() {
  return /* @__PURE__ */ jsx(PostExcerptCheck, { children: /* @__PURE__ */ jsx(PrivateExcerpt, {}) });
}
function PrivateExcerpt() {
  const { shouldRender, excerpt, shouldBeUsedAsDescription, allowEditing } = useSelect((select) => {
    const {
      getCurrentPostType,
      getCurrentPostId,
      getEditedPostAttribute,
      isEditorPanelEnabled
    } = select(editorStore);
    const postType = getCurrentPostType();
    const isTemplateOrTemplatePart = [
      "wp_template",
      "wp_template_part"
    ].includes(postType);
    const isPattern = postType === "wp_block";
    const _shouldBeUsedAsDescription = isTemplateOrTemplatePart || isPattern;
    const _usedAttribute = isTemplateOrTemplatePart ? "description" : "excerpt";
    const _excerpt = getEditedPostAttribute(_usedAttribute);
    const template = isTemplateOrTemplatePart && select(coreStore).getEntityRecord(
      "postType",
      postType,
      getCurrentPostId()
    );
    const fallback = !_excerpt && isTemplateOrTemplatePart ? getTemplateInfo({
      template,
      templateTypes: select(coreStore).getCurrentTheme()?.default_template_types
    })?.description : void 0;
    const _shouldRender = isEditorPanelEnabled(PANEL_NAME) || _shouldBeUsedAsDescription;
    return {
      excerpt: _excerpt ?? fallback,
      shouldRender: _shouldRender,
      shouldBeUsedAsDescription: _shouldBeUsedAsDescription,
      // If we should render, allow editing for all post types that are not used as description.
      // For the rest allow editing only for user generated entities.
      allowEditing: _shouldRender && (!_shouldBeUsedAsDescription || isPattern || template && template.source === TEMPLATE_ORIGINS.custom && !template.has_theme_file && template.is_custom)
    };
  }, []);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const label = shouldBeUsedAsDescription ? __("Description") : __("Excerpt");
  const popoverProps = useMemo(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": label,
      headerTitle: label,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor, label]
  );
  if (!shouldRender) {
    return false;
  }
  const excerptText = !!excerpt && /* @__PURE__ */ jsx(Text, { align: "left", numberOfLines: 4, truncate: allowEditing, children: decodeEntities(excerpt) });
  if (!allowEditing) {
    return excerptText;
  }
  const excerptPlaceholder = shouldBeUsedAsDescription ? __("Add a description\u2026") : __("Add an excerpt\u2026");
  const triggerEditLabel = shouldBeUsedAsDescription ? __("Edit description") : __("Edit excerpt");
  return /* @__PURE__ */ jsxs(VStack, { children: [
    excerptText,
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        className: "editor-post-excerpt__dropdown",
        contentClassName: "editor-post-excerpt__dropdown__content",
        popoverProps,
        focusOnMount: true,
        ref: setPopoverAnchor,
        renderToggle: ({ onToggle }) => /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            onClick: onToggle,
            variant: "link",
            children: excerptText ? triggerEditLabel : excerptPlaceholder
          }
        ),
        renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            InspectorPopoverHeader,
            {
              title: label,
              onClose
            }
          ),
          /* @__PURE__ */ jsx(VStack, { spacing: 4, children: /* @__PURE__ */ jsx(PluginPostExcerpt.Slot, { children: (fills) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              PostExcerptForm,
              {
                hideLabelFromVision: true,
                updateOnBlur: true
              }
            ),
            fills
          ] }) }) })
        ] })
      }
    )
  ] });
}
export {
  PrivatePostExcerptPanel,
  PostExcerptPanel as default
};
//# sourceMappingURL=panel.mjs.map

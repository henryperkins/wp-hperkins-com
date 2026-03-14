// packages/format-library/src/link/inline.js
import { useMemo, createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { Popover } from "@wordpress/components";
import { prependHTTPS } from "@wordpress/url";
import {
  create,
  insert,
  isCollapsed,
  applyFormat,
  removeFormat,
  slice,
  replace,
  split,
  concat,
  useAnchor
} from "@wordpress/rich-text";
import {
  LinkControl,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useDispatch, useSelect } from "@wordpress/data";
import { createLinkFormat, isValidHref, getFormatBoundary } from "./utils.mjs";
import { link as settings } from "./index.mjs";
import CSSClassesSettingComponent from "./css-classes-setting.mjs";
import { jsx } from "react/jsx-runtime";
var LINK_SETTINGS = [
  ...LinkControl.DEFAULT_LINK_SETTINGS,
  {
    id: "nofollow",
    title: __("Mark as nofollow")
  },
  {
    id: "cssClasses",
    title: __("Additional CSS class(es)"),
    render: (setting, value, onChange) => {
      return /* @__PURE__ */ jsx(
        CSSClassesSettingComponent,
        {
          setting,
          value,
          onChange
        }
      );
    }
  }
];
function InlineLinkUI({
  isActive,
  activeAttributes,
  value,
  onChange,
  onFocusOutside,
  stopAddingLink,
  contentRef,
  focusOnMount
}) {
  const richLinkTextValue = getRichTextValueFromSelection(value, isActive);
  const richTextText = richLinkTextValue.text;
  const { selectionChange } = useDispatch(blockEditorStore);
  const { createPageEntity, userCanCreatePages, selectionStart } = useSelect(
    (select) => {
      const { getSettings, getSelectionStart } = select(blockEditorStore);
      const _settings = getSettings();
      return {
        createPageEntity: _settings.__experimentalCreatePageEntity,
        userCanCreatePages: _settings.__experimentalUserCanCreatePages,
        selectionStart: getSelectionStart()
      };
    },
    []
  );
  const linkValue = useMemo(
    () => ({
      url: activeAttributes.url,
      type: activeAttributes.type,
      id: activeAttributes.id,
      opensInNewTab: activeAttributes.target === "_blank",
      nofollow: activeAttributes.rel?.includes("nofollow"),
      title: richTextText,
      cssClasses: activeAttributes.class
    }),
    [
      activeAttributes.class,
      activeAttributes.id,
      activeAttributes.rel,
      activeAttributes.target,
      activeAttributes.type,
      activeAttributes.url,
      richTextText
    ]
  );
  function removeLink() {
    const newValue = removeFormat(value, "core/link");
    onChange(newValue);
    stopAddingLink();
    speak(__("Link removed."), "assertive");
  }
  function onChangeLink(nextValue) {
    const hasLink = linkValue?.url;
    const isNewLink = !hasLink;
    nextValue = {
      ...linkValue,
      ...nextValue
    };
    const newUrl = prependHTTPS(nextValue.url);
    const linkFormat = createLinkFormat({
      url: newUrl,
      type: nextValue.type,
      id: nextValue.id !== void 0 && nextValue.id !== null ? String(nextValue.id) : void 0,
      opensInNewWindow: nextValue.opensInNewTab,
      nofollow: nextValue.nofollow,
      cssClasses: nextValue.cssClasses
    });
    const newText = nextValue.title || newUrl;
    let newValue;
    if (isCollapsed(value) && !isActive) {
      const inserted = insert(value, newText);
      newValue = applyFormat(
        inserted,
        linkFormat,
        value.start,
        value.start + newText.length
      );
      onChange(newValue);
      stopAddingLink();
      selectionChange({
        clientId: selectionStart.clientId,
        identifier: selectionStart.attributeKey,
        start: value.start + newText.length + 1
      });
      return;
    } else if (newText === richTextText) {
      const boundary = getFormatBoundary(value, {
        type: "core/link"
      });
      newValue = applyFormat(
        value,
        linkFormat,
        boundary.start,
        boundary.end
      );
    } else {
      newValue = create({ text: newText });
      newValue = applyFormat(newValue, linkFormat, 0, newText.length);
      const boundary = getFormatBoundary(value, {
        type: "core/link"
      });
      const [valBefore, valAfter] = split(
        value,
        boundary.start,
        boundary.start
      );
      const newValAfter = replace(valAfter, richTextText, newValue);
      newValue = concat(valBefore, newValAfter);
    }
    onChange(newValue);
    if (!isNewLink) {
      stopAddingLink();
    }
    if (!isValidHref(newUrl)) {
      speak(
        __(
          "Warning: the link has been inserted but may have errors. Please test it."
        ),
        "assertive"
      );
    } else if (isActive) {
      speak(__("Link edited."), "assertive");
    } else {
      speak(__("Link inserted."), "assertive");
    }
  }
  const popoverAnchor = useAnchor({
    editableContentElement: contentRef.current,
    settings: {
      ...settings,
      isActive
    }
  });
  async function handleCreate(pageTitle) {
    const page = await createPageEntity({
      title: pageTitle,
      status: "draft"
    });
    return {
      id: page.id,
      type: page.type,
      title: page.title.rendered,
      url: page.link,
      kind: "post-type"
    };
  }
  function createButtonText(searchTerm) {
    return createInterpolateElement(
      sprintf(
        /* translators: %s: search term. */
        __("Create page: <mark>%s</mark>"),
        searchTerm
      ),
      { mark: /* @__PURE__ */ jsx("mark", {}) }
    );
  }
  return /* @__PURE__ */ jsx(
    Popover,
    {
      anchor: popoverAnchor,
      animate: false,
      onClose: stopAddingLink,
      onFocusOutside,
      placement: "bottom",
      offset: 8,
      shift: true,
      focusOnMount,
      constrainTabbing: true,
      children: /* @__PURE__ */ jsx(
        LinkControl,
        {
          value: linkValue,
          onChange: onChangeLink,
          onRemove: removeLink,
          hasRichPreviews: true,
          createSuggestion: createPageEntity && handleCreate,
          withCreateSuggestion: userCanCreatePages,
          createSuggestionButtonText: createButtonText,
          hasTextControl: true,
          settings: LINK_SETTINGS,
          showInitialSuggestions: true,
          suggestionsQuery: {
            // always show Pages as initial suggestions
            initialSuggestionsSearchOptions: {
              type: "post",
              subtype: "page",
              perPage: 20
            }
          }
        }
      )
    }
  );
}
function getRichTextValueFromSelection(value, isActive) {
  let textStart = value.start;
  let textEnd = value.end;
  if (isActive) {
    const boundary = getFormatBoundary(value, {
      type: "core/link"
    });
    textStart = boundary.start;
    textEnd = boundary.end;
  }
  return slice(value, textStart, textEnd);
}
var inline_default = InlineLinkUI;
export {
  inline_default as default
};
//# sourceMappingURL=inline.mjs.map

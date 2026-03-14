// packages/editor/src/components/post-template/swap-template-button.js
import { useMemo, useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { __experimentalBlockPatternsList as BlockPatternsList } from "@wordpress/block-editor";
import { MenuItem, Modal, SearchControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { parse } from "@wordpress/blocks";
import { useAvailableTemplates, useEditedPostContext } from "./hooks.mjs";
import { searchTemplates } from "../../utils/search-templates.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SwapTemplateButton({ onClick }) {
  const [showModal, setShowModal] = useState(false);
  const { postType, postId } = useEditedPostContext();
  const availableTemplates = useAvailableTemplates(postType);
  const { editEntityRecord } = useDispatch(coreStore);
  const onTemplateSelect = async (template) => {
    editEntityRecord(
      "postType",
      postType,
      postId,
      { template: template.name },
      { undoIgnore: true }
    );
    setShowModal(false);
    onClick();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MenuItem,
      {
        disabled: !availableTemplates?.length,
        accessibleWhenDisabled: true,
        onClick: () => setShowModal(true),
        children: __("Change template")
      }
    ),
    showModal && /* @__PURE__ */ jsx(
      Modal,
      {
        title: __("Choose a template"),
        onRequestClose: () => setShowModal(false),
        overlayClassName: "editor-post-template__swap-template-modal",
        isFullScreen: true,
        children: /* @__PURE__ */ jsx("div", { className: "editor-post-template__swap-template-modal-content", children: /* @__PURE__ */ jsx(
          TemplatesList,
          {
            postType,
            onSelect: onTemplateSelect
          }
        ) })
      }
    )
  ] });
}
function TemplatesList({ postType, onSelect }) {
  const [searchValue, setSearchValue] = useState("");
  const availableTemplates = useAvailableTemplates(postType);
  const templatesAsPatterns = useMemo(
    () => availableTemplates.map((template) => ({
      name: template.slug,
      blocks: parse(template.content.raw),
      title: decodeEntities(template.title.rendered),
      id: template.id
    })),
    [availableTemplates]
  );
  const filteredBlockTemplates = useMemo(() => {
    return searchTemplates(templatesAsPatterns, searchValue);
  }, [templatesAsPatterns, searchValue]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SearchControl,
      {
        onChange: setSearchValue,
        value: searchValue,
        label: __("Search"),
        placeholder: __("Search"),
        className: "editor-post-template__swap-template-search"
      }
    ),
    /* @__PURE__ */ jsx(
      BlockPatternsList,
      {
        label: __("Templates"),
        blockPatterns: filteredBlockTemplates,
        onClickPattern: onSelect
      }
    )
  ] });
}
export {
  SwapTemplateButton as default
};
//# sourceMappingURL=swap-template-button.mjs.map

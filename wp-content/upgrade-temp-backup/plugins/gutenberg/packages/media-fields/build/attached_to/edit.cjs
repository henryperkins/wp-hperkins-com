"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/media-fields/src/attached_to/edit.tsx
var edit_exports = {};
__export(edit_exports, {
  default: () => MediaAttachedToEdit
});
module.exports = __toCommonJS(edit_exports);
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_get_rendered_content = require("../utils/get-rendered-content.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MediaAttachedToEdit({
  data,
  onChange
}) {
  const defaultPost = !!data.post && !!data?._embedded?.["wp:attached-to"]?.[0] ? [
    {
      label: (0, import_get_rendered_content.getRenderedContent)(
        data._embedded?.["wp:attached-to"]?.[0]?.title
      ),
      value: data.post.toString()
    }
  ] : [];
  const [options, setOptions] = (0, import_element.useState)(defaultPost);
  const [searchResults, setSearchResults] = (0, import_element.useState)(
    []
  );
  const [isLoading, setIsLoading] = (0, import_element.useState)(false);
  const [value, setValue] = (0, import_element.useState)(
    data?.post?.toString() ?? null
  );
  const postTypes = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getPostTypes(),
    []
  );
  const handleDetach = () => {
    onChange({
      post: 0,
      _embedded: { ...data?._embedded, "wp:attached-to": void 0 }
    });
    setOptions([]);
  };
  const onValueChange = async (filterValue) => {
    setIsLoading(true);
    const results = await (0, import_core_data.__experimentalFetchLinkSuggestions)(
      filterValue,
      /*
       * @TODO `fetchLinkSuggestions()` should accept `perPage` as an option argument.
       * `isInitialSuggestions` limits the result to 3, otherwise it's hardcoded to 20.
       */
      { type: "post", isInitialSuggestions: true },
      {}
    );
    setSearchResults(results);
    const mappedSuggestions = results.map((result) => {
      return {
        label: result.title,
        value: result.id.toString()
      };
    });
    setOptions(mappedSuggestions);
    setIsLoading(false);
  };
  const handleSelectOption = (selectedPostId) => {
    if (!selectedPostId) {
      handleDetach();
      return;
    }
    setValue(selectedPostId);
    if (selectedPostId) {
      const selectedPost = searchResults.find(
        (result) => result.id === Number(selectedPostId)
      );
      if (selectedPost && postTypes) {
        const postType = postTypes.find(
          (_postType) => _postType.slug === selectedPost?.type
        );
        const attachedTo = {
          ...postType && { type: postType.slug },
          id: Number(selectedPostId),
          title: {
            raw: selectedPost.title,
            rendered: selectedPost.title
          }
        };
        onChange({
          post: Number(selectedPostId),
          _embedded: {
            ...data?._embedded,
            "wp:attached-to": [attachedTo]
          }
        });
      }
    }
  };
  const help = !!data.post ? (0, import_element.createInterpolateElement)(
    (0, import_i18n.__)(
      "Search for a post or page to attach this media to or <button>detach current</button>."
    ),
    {
      button: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          onClick: handleDetach,
          variant: "link",
          accessibleWhenDisabled: true
        }
      )
    }
  ) : (0, import_i18n.__)("Search for a post or page to attach this media to.");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ComboboxControl,
    {
      className: "dataviews-media-field__attached-to",
      __next40pxDefaultSize: true,
      isLoading,
      label: (0, import_i18n.__)("Attached to"),
      help,
      value,
      options,
      onFilterValueChange: (0, import_compose.debounce)(
        (filterValue) => onValueChange(filterValue),
        300
      ),
      onChange: handleSelectOption,
      hideLabelFromVision: true
    }
  );
}
//# sourceMappingURL=edit.cjs.map

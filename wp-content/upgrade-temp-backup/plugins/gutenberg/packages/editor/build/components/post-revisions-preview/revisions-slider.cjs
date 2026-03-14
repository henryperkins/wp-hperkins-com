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

// packages/editor/src/components/post-revisions-preview/revisions-slider.js
var revisions_slider_exports = {};
__export(revisions_slider_exports, {
  default: () => revisions_slider_default
});
module.exports = __toCommonJS(revisions_slider_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_date = require("@wordpress/date");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function RevisionsSlider() {
  const { revisions, isLoading, currentRevisionId, revisionKey } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPostId, getCurrentPostType } = select(import_store.store);
      const { getRevisions, isResolving, getEntityConfig } = select(import_core_data.store);
      const postId = getCurrentPostId();
      const postType = getCurrentPostType();
      if (!postId || !postType) {
        return {};
      }
      const entityConfig = getEntityConfig("postType", postType);
      const query = { per_page: -1, context: "edit" };
      return {
        revisions: getRevisions("postType", postType, postId, query),
        isLoading: isResolving("getRevisions", [
          "postType",
          postType,
          postId,
          query
        ]),
        currentRevisionId: (0, import_lock_unlock.unlock)(
          select(import_store.store)
        ).getCurrentRevisionId(),
        revisionKey: entityConfig?.revisionKey || "id"
      };
    },
    []
  );
  const { setCurrentRevisionId } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const sortedRevisions = (0, import_element.useMemo)(() => {
    return revisions?.slice().sort((a, b) => new Date(a.date) - new Date(b.date)) ?? [];
  }, [revisions]);
  const selectedIndex = sortedRevisions.findIndex(
    (r) => r[revisionKey] === currentRevisionId
  );
  const handleSliderChange = (index) => {
    const revision = sortedRevisions[index];
    if (revision) {
      setCurrentRevisionId(revision[revisionKey]);
    }
  };
  const dateSettings = (0, import_date.getSettings)();
  const renderTooltipContent = (index) => {
    const revision = sortedRevisions[index];
    if (!revision) {
      return index;
    }
    return (0, import_date.dateI18n)(dateSettings.formats.datetime, revision.date);
  };
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {});
  }
  if (!sortedRevisions.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-revisions-header__no-revisions", children: (0, import_i18n.__)("No revisions found.") });
  }
  if (sortedRevisions.length === 1) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-revisions-header__no-revisions", children: (0, import_i18n.__)("Only one revision found.") });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.RangeControl,
    {
      __next40pxDefaultSize: true,
      className: "editor-revisions-header__slider",
      hideLabelFromVision: true,
      label: (0, import_i18n.__)("Revision"),
      max: sortedRevisions.length - 1,
      min: 0,
      marks: true,
      onChange: handleSliderChange,
      renderTooltipContent,
      value: selectedIndex,
      withInputField: false
    }
  );
}
var revisions_slider_default = RevisionsSlider;
//# sourceMappingURL=revisions-slider.cjs.map

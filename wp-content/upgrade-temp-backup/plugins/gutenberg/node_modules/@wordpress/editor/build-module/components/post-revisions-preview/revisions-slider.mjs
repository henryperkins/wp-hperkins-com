// packages/editor/src/components/post-revisions-preview/revisions-slider.js
import { useMemo } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { RangeControl, Spinner } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { dateI18n, getSettings as getDateSettings } from "@wordpress/date";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function RevisionsSlider() {
  const { revisions, isLoading, currentRevisionId, revisionKey } = useSelect(
    (select) => {
      const { getCurrentPostId, getCurrentPostType } = select(editorStore);
      const { getRevisions, isResolving, getEntityConfig } = select(coreStore);
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
        currentRevisionId: unlock(
          select(editorStore)
        ).getCurrentRevisionId(),
        revisionKey: entityConfig?.revisionKey || "id"
      };
    },
    []
  );
  const { setCurrentRevisionId } = unlock(useDispatch(editorStore));
  const sortedRevisions = useMemo(() => {
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
  const dateSettings = getDateSettings();
  const renderTooltipContent = (index) => {
    const revision = sortedRevisions[index];
    if (!revision) {
      return index;
    }
    return dateI18n(dateSettings.formats.datetime, revision.date);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Spinner, {});
  }
  if (!sortedRevisions.length) {
    return /* @__PURE__ */ jsx("span", { className: "editor-revisions-header__no-revisions", children: __("No revisions found.") });
  }
  if (sortedRevisions.length === 1) {
    return /* @__PURE__ */ jsx("span", { className: "editor-revisions-header__no-revisions", children: __("Only one revision found.") });
  }
  return /* @__PURE__ */ jsx(
    RangeControl,
    {
      __next40pxDefaultSize: true,
      className: "editor-revisions-header__slider",
      hideLabelFromVision: true,
      label: __("Revision"),
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
export {
  revisions_slider_default as default
};
//# sourceMappingURL=revisions-slider.mjs.map

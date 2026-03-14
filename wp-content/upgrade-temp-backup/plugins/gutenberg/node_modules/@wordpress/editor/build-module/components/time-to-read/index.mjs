// packages/editor/src/components/time-to-read/index.js
import { useSelect } from "@wordpress/data";
import { _x, _n, __, sprintf } from "@wordpress/i18n";
import { count as wordCount } from "@wordpress/wordcount";
import { createInterpolateElement } from "@wordpress/element";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var AVERAGE_READING_RATE = 189;
function TimeToRead() {
  const content = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("content"),
    []
  );
  const wordCountType = _x("words", "Word count type. Do not translate!");
  const minutesToRead = Math.round(
    wordCount(content, wordCountType) / AVERAGE_READING_RATE
  );
  const minutesToReadString = minutesToRead === 0 ? createInterpolateElement(__("<span>< 1</span> minute"), {
    span: /* @__PURE__ */ jsx("span", {})
  }) : createInterpolateElement(
    sprintf(
      /* translators: %s: the number of minutes to read the post. */
      _n(
        "<span>%s</span> minute",
        "<span>%s</span> minutes",
        minutesToRead
      ),
      minutesToRead
    ),
    {
      span: /* @__PURE__ */ jsx("span", {})
    }
  );
  return /* @__PURE__ */ jsx("span", { className: "time-to-read", children: minutesToReadString });
}
export {
  TimeToRead as default
};
//# sourceMappingURL=index.mjs.map

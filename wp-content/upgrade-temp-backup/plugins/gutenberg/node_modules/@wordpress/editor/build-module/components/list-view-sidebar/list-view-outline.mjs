// packages/editor/src/components/list-view-sidebar/list-view-outline.js
import { __experimentalText as Text } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import CharacterCount from "../character-count/index.mjs";
import WordCount from "../word-count/index.mjs";
import TimeToRead from "../time-to-read/index.mjs";
import DocumentOutline from "../document-outline/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ListViewOutline() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "editor-list-view-sidebar__outline", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { children: __("Characters:") }),
        /* @__PURE__ */ jsx(Text, { children: /* @__PURE__ */ jsx(CharacterCount, {}) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { children: __("Words:") }),
        /* @__PURE__ */ jsx(WordCount, {})
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { children: __("Time to read:") }),
        /* @__PURE__ */ jsx(TimeToRead, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(DocumentOutline, {})
  ] });
}
export {
  ListViewOutline as default
};
//# sourceMappingURL=list-view-outline.mjs.map

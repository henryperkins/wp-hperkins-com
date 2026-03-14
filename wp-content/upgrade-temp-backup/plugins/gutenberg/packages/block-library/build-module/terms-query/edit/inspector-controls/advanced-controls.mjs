// packages/block-library/src/terms-query/edit/inspector-controls/advanced-controls.js
import { __ } from "@wordpress/i18n";
import {
  InspectorControls,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { unlock } from "../../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { HTMLElementControl } = unlock(blockEditorPrivateApis);
function AdvancedControls({
  TagName,
  setAttributes,
  clientId
}) {
  return /* @__PURE__ */ jsx(InspectorControls, { group: "advanced", children: /* @__PURE__ */ jsx(
    HTMLElementControl,
    {
      tagName: TagName,
      onChange: (value) => setAttributes({ tagName: value }),
      clientId,
      options: [
        { label: __("Default (<div>)"), value: "div" },
        { label: "<main>", value: "main" },
        { label: "<section>", value: "section" },
        { label: "<aside>", value: "aside" }
      ]
    }
  ) });
}
export {
  AdvancedControls as default
};
//# sourceMappingURL=advanced-controls.mjs.map

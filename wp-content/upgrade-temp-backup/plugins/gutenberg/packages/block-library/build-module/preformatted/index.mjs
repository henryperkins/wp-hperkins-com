// packages/block-library/src/preformatted/index.js
import { __ } from "@wordpress/i18n";
import { preformatted as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      /* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
      // translators: Sample content for the Preformatted block. Can be replaced with a more locale-adequate work.
      content: __(
        "EXT. XANADU - FAINT DAWN - 1940 (MINIATURE)\nWindow, very small in the distance, illuminated.\nAll around this is an almost totally black screen. Now, as the camera moves slowly towards the window which is almost a postage stamp in the frame, other forms appear;"
      )
      /* eslint-enable @wordpress/i18n-no-collapsible-whitespace */
    }
  },
  transforms,
  edit,
  save,
  merge(attributes, attributesToMerge) {
    return {
      content: attributes.content + "\n\n" + attributesToMerge.content
    };
  }
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "content",
      label: __("Content"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["content"]
  };
}
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map

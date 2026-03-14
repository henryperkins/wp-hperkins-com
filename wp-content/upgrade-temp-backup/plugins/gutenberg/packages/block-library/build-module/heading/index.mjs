// packages/block-library/src/heading/index.js
import { heading as icon } from "@wordpress/icons";
import { __, sprintf } from "@wordpress/i18n";
import {
  privateApis as blocksPrivateApis,
  getBlockType,
  unregisterBlockVariation
} from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import variations from "./variations.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      content: __("Code is Poetry"),
      level: 2,
      style: {
        typography: {
          textAlign: "center"
        }
      }
    }
  },
  __experimentalLabel(attributes, { context }) {
    const { content, level } = attributes;
    const customName = attributes?.metadata?.name;
    const hasContent = content?.trim().length > 0;
    if (context === "list-view" && (customName || hasContent)) {
      return customName || content;
    }
    if (context === "breadcrumb" && customName) {
      return customName;
    }
    if (context === "accessibility") {
      return !hasContent ? sprintf(
        /* translators: accessibility text. %s: heading level. */
        __("Level %s. Empty."),
        level
      ) : sprintf(
        /* translators: accessibility text. 1: heading level. 2: heading content. */
        __("Level %1$s. %2$s"),
        level,
        content
      );
    }
  },
  transforms,
  deprecated,
  merge(attributes, attributesToMerge) {
    return {
      content: (attributes.content || "") + (attributesToMerge.content || "")
    };
  },
  edit,
  save,
  variations
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
var init = () => {
  const block = initBlock({ name, metadata, settings });
  const levelOptions = getBlockType(name)?.attributes?.levelOptions?.default;
  if (levelOptions) {
    [1, 2, 3, 4, 5, 6].forEach((level) => {
      if (!levelOptions.includes(level)) {
        unregisterBlockVariation(name, `h${level}`);
      }
    });
  }
  return block;
};
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map

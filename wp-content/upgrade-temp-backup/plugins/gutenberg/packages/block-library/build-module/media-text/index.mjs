// packages/block-library/src/media-text/index.js
import { __ } from "@wordpress/i18n";
import { mediaAndText as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
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
    viewportWidth: 601,
    // Columns collapse "@media (max-width: 600px)".
    attributes: {
      mediaType: "image",
      mediaUrl: "https://s.w.org/images/core/5.3/Biologia_Centrali-Americana_-_Cantorchilus_semibadius_1902.jpg"
    },
    innerBlocks: [
      {
        name: "core/paragraph",
        attributes: {
          content: __(
            "The wren<br>Earns his living<br>Noiselessly."
          )
        }
      },
      {
        name: "core/paragraph",
        attributes: {
          content: __("\u2014 Kobayashi Issa (\u4E00\u8336)")
        }
      }
    ]
  },
  transforms,
  edit,
  save,
  deprecated
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "media",
      label: __("Media"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        allowedTypes: ["image", "video"],
        multiple: false
      },
      getValue: ({ item }) => ({
        id: item.mediaId,
        url: item.mediaUrl,
        mediaType: item.mediaType,
        link: item.mediaLink
      }),
      setValue: ({ value }) => ({
        mediaId: value.id,
        mediaUrl: value.url,
        mediaType: value.mediaType,
        mediaLink: value.link
      })
    },
    {
      id: "link",
      label: __("Link"),
      type: "url",
      Edit: "link",
      // TODO: replace with custom component
      getValue: ({ item }) => ({
        url: item.href,
        rel: item.rel,
        linkTarget: item.linkTarget
      }),
      setValue: ({ value }) => ({
        href: value.url,
        rel: value.rel,
        linkTarget: value.linkTarget
      })
    }
  ];
  settings[formKey] = {
    fields: ["media", "link"]
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

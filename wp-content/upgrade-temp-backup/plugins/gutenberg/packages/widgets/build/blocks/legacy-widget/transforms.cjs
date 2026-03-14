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

// packages/widgets/src/blocks/legacy-widget/transforms.js
var transforms_exports = {};
__export(transforms_exports, {
  default: () => transforms_default
});
module.exports = __toCommonJS(transforms_exports);
var import_blocks = require("@wordpress/blocks");
var legacyWidgetTransforms = [
  {
    block: "core/calendar",
    widget: "calendar"
  },
  {
    block: "core/search",
    widget: "search"
  },
  {
    block: "core/html",
    widget: "custom_html",
    transform: ({ content }) => ({
      content
    })
  },
  {
    block: "core/archives",
    widget: "archives",
    transform: ({ count, dropdown }) => {
      return {
        displayAsDropdown: !!dropdown,
        showPostCounts: !!count
      };
    }
  },
  {
    block: "core/latest-posts",
    widget: "recent-posts",
    transform: ({ show_date: displayPostDate, number }) => {
      return {
        displayPostDate: !!displayPostDate,
        postsToShow: number
      };
    }
  },
  {
    block: "core/latest-comments",
    widget: "recent-comments",
    transform: ({ number }) => {
      return {
        commentsToShow: number
      };
    }
  },
  {
    block: "core/tag-cloud",
    widget: "tag_cloud",
    transform: ({ taxonomy, count }) => {
      return {
        showTagCounts: !!count,
        taxonomy
      };
    }
  },
  {
    block: "core/categories",
    widget: "categories",
    transform: ({ count, dropdown, hierarchical }) => {
      return {
        displayAsDropdown: !!dropdown,
        showPostCounts: !!count,
        showHierarchy: !!hierarchical
      };
    }
  },
  {
    block: "core/audio",
    widget: "media_audio",
    transform: ({ url, preload, loop, attachment_id: id }) => {
      return {
        src: url,
        id,
        preload,
        loop
      };
    }
  },
  {
    block: "core/video",
    widget: "media_video",
    transform: ({ url, preload, loop, attachment_id: id }) => {
      return {
        src: url,
        id,
        preload,
        loop
      };
    }
  },
  {
    block: "core/image",
    widget: "media_image",
    transform: ({
      alt,
      attachment_id: id,
      caption,
      height,
      link_classes: linkClass,
      link_rel: rel,
      link_target_blank: targetBlack,
      link_type: linkDestination,
      link_url: link,
      size: sizeSlug,
      url,
      width
    }) => {
      return {
        alt,
        caption,
        height,
        id,
        link,
        linkClass,
        linkDestination,
        linkTarget: targetBlack ? "_blank" : void 0,
        rel,
        sizeSlug,
        url,
        width
      };
    }
  },
  {
    block: "core/gallery",
    widget: "media_gallery",
    transform: ({ ids, link_type: linkTo, size, number }) => {
      return {
        ids,
        columns: number,
        linkTo,
        sizeSlug: size,
        images: ids.map((id) => ({
          id
        }))
      };
    }
  },
  {
    block: "core/rss",
    widget: "rss",
    transform: ({
      url,
      show_author: displayAuthor,
      show_date: displayDate,
      show_summary: displayExcerpt,
      items
    }) => {
      return {
        feedURL: url,
        displayAuthor: !!displayAuthor,
        displayDate: !!displayDate,
        displayExcerpt: !!displayExcerpt,
        itemsToShow: items
      };
    }
  }
].map(({ block, widget, transform }) => {
  return {
    type: "block",
    blocks: [block],
    isMatch: ({ idBase, instance }) => {
      return idBase === widget && !!instance?.raw;
    },
    transform: ({ instance }) => {
      const transformedBlock = (0, import_blocks.createBlock)(
        block,
        transform ? transform(instance.raw) : void 0
      );
      if (!instance.raw?.title) {
        return transformedBlock;
      }
      return [
        (0, import_blocks.createBlock)("core/heading", {
          content: instance.raw.title
        }),
        transformedBlock
      ];
    }
  };
});
var transforms = {
  to: legacyWidgetTransforms
};
var transforms_default = transforms;
//# sourceMappingURL=transforms.cjs.map

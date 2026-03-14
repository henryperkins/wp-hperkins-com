"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name5 in all)
    __defProp(target, name5, { get: all[name5], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/index.js
var index_exports = {};
__export(index_exports, {
  __experimentalGetCoreBlocks: () => __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks: () => __experimentalRegisterExperimentalCoreBlocks,
  privateApis: () => import_private_apis.privateApis,
  registerCoreBlocks: () => registerCoreBlocks
});
module.exports = __toCommonJS(index_exports);
var import_blocks = require("@wordpress/blocks");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_server_side_render = require("@wordpress/server-side-render");
var import_i18n = require("@wordpress/i18n");
var import_html_renderer = __toESM(require("./utils/html-renderer.cjs"));
var accordion = __toESM(require("./accordion/index.cjs"));
var accordionItem = __toESM(require("./accordion-item/index.cjs"));
var accordionHeading = __toESM(require("./accordion-heading/index.cjs"));
var accordionPanel = __toESM(require("./accordion-panel/index.cjs"));
var archives = __toESM(require("./archives/index.cjs"));
var avatar = __toESM(require("./avatar/index.cjs"));
var audio = __toESM(require("./audio/index.cjs"));
var breadcrumbs = __toESM(require("./breadcrumbs/index.cjs"));
var button = __toESM(require("./button/index.cjs"));
var buttons = __toESM(require("./buttons/index.cjs"));
var calendar = __toESM(require("./calendar/index.cjs"));
var categories = __toESM(require("./categories/index.cjs"));
var classic = __toESM(require("./freeform/index.cjs"));
var code = __toESM(require("./code/index.cjs"));
var column = __toESM(require("./column/index.cjs"));
var columns = __toESM(require("./columns/index.cjs"));
var comments = __toESM(require("./comments/index.cjs"));
var commentAuthorAvatar = __toESM(require("./comment-author-avatar/index.cjs"));
var commentAuthorName = __toESM(require("./comment-author-name/index.cjs"));
var commentContent = __toESM(require("./comment-content/index.cjs"));
var commentDate = __toESM(require("./comment-date/index.cjs"));
var commentEditLink = __toESM(require("./comment-edit-link/index.cjs"));
var commentReplyLink = __toESM(require("./comment-reply-link/index.cjs"));
var commentTemplate = __toESM(require("./comment-template/index.cjs"));
var commentsPaginationPrevious = __toESM(require("./comments-pagination-previous/index.cjs"));
var commentsPagination = __toESM(require("./comments-pagination/index.cjs"));
var commentsPaginationNext = __toESM(require("./comments-pagination-next/index.cjs"));
var commentsPaginationNumbers = __toESM(require("./comments-pagination-numbers/index.cjs"));
var commentsTitle = __toESM(require("./comments-title/index.cjs"));
var cover = __toESM(require("./cover/index.cjs"));
var details = __toESM(require("./details/index.cjs"));
var embed = __toESM(require("./embed/index.cjs"));
var file = __toESM(require("./file/index.cjs"));
var form = __toESM(require("./form/index.cjs"));
var formInput = __toESM(require("./form-input/index.cjs"));
var formSubmitButton = __toESM(require("./form-submit-button/index.cjs"));
var formSubmissionNotification = __toESM(require("./form-submission-notification/index.cjs"));
var gallery = __toESM(require("./gallery/index.cjs"));
var group = __toESM(require("./group/index.cjs"));
var heading = __toESM(require("./heading/index.cjs"));
var homeLink = __toESM(require("./home-link/index.cjs"));
var html = __toESM(require("./html/index.cjs"));
var icon = __toESM(require("./icon/index.cjs"));
var image = __toESM(require("./image/index.cjs"));
var latestComments = __toESM(require("./latest-comments/index.cjs"));
var latestPosts = __toESM(require("./latest-posts/index.cjs"));
var list = __toESM(require("./list/index.cjs"));
var math = __toESM(require("./math/index.cjs"));
var listItem = __toESM(require("./list-item/index.cjs"));
var logInOut = __toESM(require("./loginout/index.cjs"));
var mediaText = __toESM(require("./media-text/index.cjs"));
var missing = __toESM(require("./missing/index.cjs"));
var more = __toESM(require("./more/index.cjs"));
var navigation = __toESM(require("./navigation/index.cjs"));
var navigationLink = __toESM(require("./navigation-link/index.cjs"));
var navigationSubmenu = __toESM(require("./navigation-submenu/index.cjs"));
var nextpage = __toESM(require("./nextpage/index.cjs"));
var navigationOverlayClose = __toESM(require("./navigation-overlay-close/index.cjs"));
var pattern = __toESM(require("./pattern/index.cjs"));
var pageList = __toESM(require("./page-list/index.cjs"));
var pageListItem = __toESM(require("./page-list-item/index.cjs"));
var paragraph = __toESM(require("./paragraph/index.cjs"));
var playlist = __toESM(require("./playlist/index.cjs"));
var playlistTrack = __toESM(require("./playlist-track/index.cjs"));
var postAuthor = __toESM(require("./post-author/index.cjs"));
var postAuthorName = __toESM(require("./post-author-name/index.cjs"));
var postAuthorBiography = __toESM(require("./post-author-biography/index.cjs"));
var postComment = __toESM(require("./post-comment/index.cjs"));
var postCommentsCount = __toESM(require("./post-comments-count/index.cjs"));
var postCommentsForm = __toESM(require("./post-comments-form/index.cjs"));
var postCommentsLink = __toESM(require("./post-comments-link/index.cjs"));
var postContent = __toESM(require("./post-content/index.cjs"));
var postDate = __toESM(require("./post-date/index.cjs"));
var postExcerpt = __toESM(require("./post-excerpt/index.cjs"));
var postFeaturedImage = __toESM(require("./post-featured-image/index.cjs"));
var postNavigationLink = __toESM(require("./post-navigation-link/index.cjs"));
var postTemplate = __toESM(require("./post-template/index.cjs"));
var postTerms = __toESM(require("./post-terms/index.cjs"));
var postTimeToRead = __toESM(require("./post-time-to-read/index.cjs"));
var postTitle = __toESM(require("./post-title/index.cjs"));
var preformatted = __toESM(require("./preformatted/index.cjs"));
var pullquote = __toESM(require("./pullquote/index.cjs"));
var query = __toESM(require("./query/index.cjs"));
var queryNoResults = __toESM(require("./query-no-results/index.cjs"));
var queryPagination = __toESM(require("./query-pagination/index.cjs"));
var queryPaginationNext = __toESM(require("./query-pagination-next/index.cjs"));
var queryPaginationNumbers = __toESM(require("./query-pagination-numbers/index.cjs"));
var queryPaginationPrevious = __toESM(require("./query-pagination-previous/index.cjs"));
var queryTitle = __toESM(require("./query-title/index.cjs"));
var queryTotal = __toESM(require("./query-total/index.cjs"));
var quote = __toESM(require("./quote/index.cjs"));
var reusableBlock = __toESM(require("./block/index.cjs"));
var readMore = __toESM(require("./read-more/index.cjs"));
var rss = __toESM(require("./rss/index.cjs"));
var search = __toESM(require("./search/index.cjs"));
var separator = __toESM(require("./separator/index.cjs"));
var shortcode = __toESM(require("./shortcode/index.cjs"));
var siteLogo = __toESM(require("./site-logo/index.cjs"));
var siteTagline = __toESM(require("./site-tagline/index.cjs"));
var siteTitle = __toESM(require("./site-title/index.cjs"));
var socialLink = __toESM(require("./social-link/index.cjs"));
var socialLinks = __toESM(require("./social-links/index.cjs"));
var spacer = __toESM(require("./spacer/index.cjs"));
var tab = __toESM(require("./tab/index.cjs"));
var tabPanel = __toESM(require("./tab-panel/index.cjs"));
var table = __toESM(require("./table/index.cjs"));
var tableOfContents = __toESM(require("./table-of-contents/index.cjs"));
var tabs = __toESM(require("./tabs/index.cjs"));
var tabsMenu = __toESM(require("./tabs-menu/index.cjs"));
var tabsMenuItem = __toESM(require("./tabs-menu-item/index.cjs"));
var tagCloud = __toESM(require("./tag-cloud/index.cjs"));
var templatePart = __toESM(require("./template-part/index.cjs"));
var termCount = __toESM(require("./term-count/index.cjs"));
var termDescription = __toESM(require("./term-description/index.cjs"));
var termName = __toESM(require("./term-name/index.cjs"));
var termsQuery = __toESM(require("./terms-query/index.cjs"));
var termTemplate = __toESM(require("./term-template/index.cjs"));
var textColumns = __toESM(require("./text-columns/index.cjs"));
var verse = __toESM(require("./verse/index.cjs"));
var video = __toESM(require("./video/index.cjs"));
var footnotes = __toESM(require("./footnotes/index.cjs"));
var import_is_block_metadata_experimental = __toESM(require("./utils/is-block-metadata-experimental.cjs"));
var import_lock_unlock = require("./lock-unlock.cjs");
var import_private_apis = require("./private-apis.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var getAllBlocks = () => {
  const blocks = [
    // Common blocks are grouped at the top to prioritize their display
    // in various contexts — like the inserter and auto-complete components.
    paragraph,
    image,
    heading,
    gallery,
    list,
    listItem,
    quote,
    // Register all remaining core blocks.
    accordion,
    accordionItem,
    accordionHeading,
    accordionPanel,
    archives,
    audio,
    button,
    buttons,
    calendar,
    categories,
    code,
    column,
    columns,
    commentAuthorAvatar,
    cover,
    details,
    embed,
    file,
    group,
    html,
    math,
    latestComments,
    latestPosts,
    mediaText,
    missing,
    more,
    nextpage,
    pageList,
    pageListItem,
    pattern,
    preformatted,
    pullquote,
    reusableBlock,
    rss,
    search,
    separator,
    shortcode,
    socialLink,
    socialLinks,
    spacer,
    table,
    tagCloud,
    textColumns,
    verse,
    video,
    footnotes,
    // theme blocks
    navigation,
    navigationLink,
    navigationSubmenu,
    siteLogo,
    siteTitle,
    siteTagline,
    query,
    templatePart,
    avatar,
    postTitle,
    postExcerpt,
    postFeaturedImage,
    postContent,
    postAuthor,
    postAuthorName,
    postComment,
    postCommentsCount,
    postCommentsLink,
    postDate,
    postTerms,
    postNavigationLink,
    postTemplate,
    postTimeToRead,
    queryPagination,
    queryPaginationNext,
    queryPaginationNumbers,
    queryPaginationPrevious,
    queryNoResults,
    queryTotal,
    readMore,
    comments,
    commentAuthorName,
    commentContent,
    commentDate,
    commentEditLink,
    commentReplyLink,
    commentTemplate,
    commentsTitle,
    commentsPagination,
    commentsPaginationNext,
    commentsPaginationNumbers,
    commentsPaginationPrevious,
    postCommentsForm,
    tableOfContents,
    homeLink,
    icon,
    logInOut,
    navigationOverlayClose,
    termCount,
    termDescription,
    termName,
    termsQuery,
    termTemplate,
    queryTitle,
    postAuthorBiography,
    breadcrumbs
  ];
  if (window?.__experimentalEnableFormBlocks) {
    blocks.push(form);
    blocks.push(formInput);
    blocks.push(formSubmitButton);
    blocks.push(formSubmissionNotification);
  }
  if (window?.__experimentalEnableBlockExperiments) {
    blocks.push(tab);
    blocks.push(tabs);
    blocks.push(tabsMenu);
    blocks.push(tabsMenuItem);
    blocks.push(tabPanel);
    blocks.push(playlist);
    blocks.push(playlistTrack);
  }
  if (window?.wp?.oldEditor && (window?.wp?.needsClassicBlock || !window?.__experimentalDisableTinymce || !!new URLSearchParams(window?.location?.search).get(
    "requiresTinymce"
  ))) {
    blocks.push(classic);
  }
  return blocks.filter(Boolean);
};
var __experimentalGetCoreBlocks = () => getAllBlocks().filter(
  ({ metadata }) => !(0, import_is_block_metadata_experimental.default)(metadata)
);
var registerCoreBlocks = (blocks = __experimentalGetCoreBlocks()) => {
  blocks.forEach(({ init }) => init());
  if (window.__unstableAutoRegisterBlocks) {
    window.__unstableAutoRegisterBlocks.forEach((blockName) => {
      const bootstrappedBlockType = (0, import_lock_unlock.unlock)(
        (0, import_data.select)(import_blocks.store)
      ).getBootstrappedBlockType(blockName);
      (0, import_blocks.registerBlockType)(blockName, {
        // Use all metadata from PHP registration,
        // but fall back title to block name if not provided,
        // ensure minimum apiVersion 3 for block wrapper support,
        // and override with a ServerSideRender-based edit function.
        ...bootstrappedBlockType,
        title: bootstrappedBlockType?.title || blockName,
        ...(bootstrappedBlockType?.apiVersion ?? 0) < 3 && {
          apiVersion: 3
        },
        // Inspector controls are rendered by the auto-register hook in block-editor
        edit: function Edit({ attributes }) {
          const disabledRef = (0, import_compose.useDisabled)();
          const blockProps = (0, import_block_editor.useBlockProps)({ ref: disabledRef });
          const { content, status, error } = (0, import_server_side_render.useServerSideRender)({
            block: blockName,
            attributes
          });
          if (status === "loading") {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: (0, import_i18n.__)("Loading\u2026") });
          }
          if (status === "error") {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: (0, import_i18n.sprintf)(
              /* translators: %s: error message describing the problem */
              (0, import_i18n.__)("Error loading block: %s"),
              error
            ) });
          }
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_html_renderer.default,
            {
              wrapperProps: blockProps,
              html: content
            }
          );
        },
        save: () => null
      });
    });
  }
  (0, import_blocks.setDefaultBlockName)(paragraph.name);
  if (window.wp && window.wp.oldEditor && blocks.some(({ name: name5 }) => name5 === classic.name)) {
    (0, import_blocks.setFreeformContentHandlerName)(classic.name);
  }
  (0, import_blocks.setUnregisteredTypeHandlerName)(missing.name);
  (0, import_blocks.setGroupingBlockName)(group.name);
};
var __experimentalRegisterExperimentalCoreBlocks = globalThis.IS_GUTENBERG_PLUGIN ? ({ enableFSEBlocks } = {}) => {
  const enabledExperiments = [enableFSEBlocks ? "fse" : null];
  getAllBlocks().filter(
    ({ metadata }) => (0, import_is_block_metadata_experimental.default)(metadata)
  ).filter(
    ({ metadata: { __experimental } }) => __experimental === true || enabledExperiments.includes(__experimental)
  ).forEach(({ init }) => init());
} : void 0;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks,
  privateApis,
  registerCoreBlocks
});
//# sourceMappingURL=index.cjs.map

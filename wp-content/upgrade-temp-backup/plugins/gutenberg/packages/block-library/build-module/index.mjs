// packages/block-library/src/index.js
import {
  setDefaultBlockName,
  setFreeformContentHandlerName,
  setUnregisteredTypeHandlerName,
  setGroupingBlockName,
  registerBlockType,
  store as blocksStore
} from "@wordpress/blocks";
import { useDisabled } from "@wordpress/compose";
import { select } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { useServerSideRender } from "@wordpress/server-side-render";
import { __, sprintf } from "@wordpress/i18n";
import HtmlRenderer from "./utils/html-renderer.mjs";
import * as accordion from "./accordion/index.mjs";
import * as accordionItem from "./accordion-item/index.mjs";
import * as accordionHeading from "./accordion-heading/index.mjs";
import * as accordionPanel from "./accordion-panel/index.mjs";
import * as archives from "./archives/index.mjs";
import * as avatar from "./avatar/index.mjs";
import * as audio from "./audio/index.mjs";
import * as breadcrumbs from "./breadcrumbs/index.mjs";
import * as button from "./button/index.mjs";
import * as buttons from "./buttons/index.mjs";
import * as calendar from "./calendar/index.mjs";
import * as categories from "./categories/index.mjs";
import * as classic from "./freeform/index.mjs";
import * as code from "./code/index.mjs";
import * as column from "./column/index.mjs";
import * as columns from "./columns/index.mjs";
import * as comments from "./comments/index.mjs";
import * as commentAuthorAvatar from "./comment-author-avatar/index.mjs";
import * as commentAuthorName from "./comment-author-name/index.mjs";
import * as commentContent from "./comment-content/index.mjs";
import * as commentDate from "./comment-date/index.mjs";
import * as commentEditLink from "./comment-edit-link/index.mjs";
import * as commentReplyLink from "./comment-reply-link/index.mjs";
import * as commentTemplate from "./comment-template/index.mjs";
import * as commentsPaginationPrevious from "./comments-pagination-previous/index.mjs";
import * as commentsPagination from "./comments-pagination/index.mjs";
import * as commentsPaginationNext from "./comments-pagination-next/index.mjs";
import * as commentsPaginationNumbers from "./comments-pagination-numbers/index.mjs";
import * as commentsTitle from "./comments-title/index.mjs";
import * as cover from "./cover/index.mjs";
import * as details from "./details/index.mjs";
import * as embed from "./embed/index.mjs";
import * as file from "./file/index.mjs";
import * as form from "./form/index.mjs";
import * as formInput from "./form-input/index.mjs";
import * as formSubmitButton from "./form-submit-button/index.mjs";
import * as formSubmissionNotification from "./form-submission-notification/index.mjs";
import * as gallery from "./gallery/index.mjs";
import * as group from "./group/index.mjs";
import * as heading from "./heading/index.mjs";
import * as homeLink from "./home-link/index.mjs";
import * as html from "./html/index.mjs";
import * as icon from "./icon/index.mjs";
import * as image from "./image/index.mjs";
import * as latestComments from "./latest-comments/index.mjs";
import * as latestPosts from "./latest-posts/index.mjs";
import * as list from "./list/index.mjs";
import * as math from "./math/index.mjs";
import * as listItem from "./list-item/index.mjs";
import * as logInOut from "./loginout/index.mjs";
import * as mediaText from "./media-text/index.mjs";
import * as missing from "./missing/index.mjs";
import * as more from "./more/index.mjs";
import * as navigation from "./navigation/index.mjs";
import * as navigationLink from "./navigation-link/index.mjs";
import * as navigationSubmenu from "./navigation-submenu/index.mjs";
import * as nextpage from "./nextpage/index.mjs";
import * as navigationOverlayClose from "./navigation-overlay-close/index.mjs";
import * as pattern from "./pattern/index.mjs";
import * as pageList from "./page-list/index.mjs";
import * as pageListItem from "./page-list-item/index.mjs";
import * as paragraph from "./paragraph/index.mjs";
import * as playlist from "./playlist/index.mjs";
import * as playlistTrack from "./playlist-track/index.mjs";
import * as postAuthor from "./post-author/index.mjs";
import * as postAuthorName from "./post-author-name/index.mjs";
import * as postAuthorBiography from "./post-author-biography/index.mjs";
import * as postComment from "./post-comment/index.mjs";
import * as postCommentsCount from "./post-comments-count/index.mjs";
import * as postCommentsForm from "./post-comments-form/index.mjs";
import * as postCommentsLink from "./post-comments-link/index.mjs";
import * as postContent from "./post-content/index.mjs";
import * as postDate from "./post-date/index.mjs";
import * as postExcerpt from "./post-excerpt/index.mjs";
import * as postFeaturedImage from "./post-featured-image/index.mjs";
import * as postNavigationLink from "./post-navigation-link/index.mjs";
import * as postTemplate from "./post-template/index.mjs";
import * as postTerms from "./post-terms/index.mjs";
import * as postTimeToRead from "./post-time-to-read/index.mjs";
import * as postTitle from "./post-title/index.mjs";
import * as preformatted from "./preformatted/index.mjs";
import * as pullquote from "./pullquote/index.mjs";
import * as query from "./query/index.mjs";
import * as queryNoResults from "./query-no-results/index.mjs";
import * as queryPagination from "./query-pagination/index.mjs";
import * as queryPaginationNext from "./query-pagination-next/index.mjs";
import * as queryPaginationNumbers from "./query-pagination-numbers/index.mjs";
import * as queryPaginationPrevious from "./query-pagination-previous/index.mjs";
import * as queryTitle from "./query-title/index.mjs";
import * as queryTotal from "./query-total/index.mjs";
import * as quote from "./quote/index.mjs";
import * as reusableBlock from "./block/index.mjs";
import * as readMore from "./read-more/index.mjs";
import * as rss from "./rss/index.mjs";
import * as search from "./search/index.mjs";
import * as separator from "./separator/index.mjs";
import * as shortcode from "./shortcode/index.mjs";
import * as siteLogo from "./site-logo/index.mjs";
import * as siteTagline from "./site-tagline/index.mjs";
import * as siteTitle from "./site-title/index.mjs";
import * as socialLink from "./social-link/index.mjs";
import * as socialLinks from "./social-links/index.mjs";
import * as spacer from "./spacer/index.mjs";
import * as tab from "./tab/index.mjs";
import * as tabPanel from "./tab-panel/index.mjs";
import * as table from "./table/index.mjs";
import * as tableOfContents from "./table-of-contents/index.mjs";
import * as tabs from "./tabs/index.mjs";
import * as tabsMenu from "./tabs-menu/index.mjs";
import * as tabsMenuItem from "./tabs-menu-item/index.mjs";
import * as tagCloud from "./tag-cloud/index.mjs";
import * as templatePart from "./template-part/index.mjs";
import * as termCount from "./term-count/index.mjs";
import * as termDescription from "./term-description/index.mjs";
import * as termName from "./term-name/index.mjs";
import * as termsQuery from "./terms-query/index.mjs";
import * as termTemplate from "./term-template/index.mjs";
import * as textColumns from "./text-columns/index.mjs";
import * as verse from "./verse/index.mjs";
import * as video from "./video/index.mjs";
import * as footnotes from "./footnotes/index.mjs";
import isBlockMetadataExperimental from "./utils/is-block-metadata-experimental.mjs";
import { unlock } from "./lock-unlock.mjs";
import { privateApis } from "./private-apis.mjs";
import { jsx } from "react/jsx-runtime";
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
  ({ metadata }) => !isBlockMetadataExperimental(metadata)
);
var registerCoreBlocks = (blocks = __experimentalGetCoreBlocks()) => {
  blocks.forEach(({ init }) => init());
  if (window.__unstableAutoRegisterBlocks) {
    window.__unstableAutoRegisterBlocks.forEach((blockName) => {
      const bootstrappedBlockType = unlock(
        select(blocksStore)
      ).getBootstrappedBlockType(blockName);
      registerBlockType(blockName, {
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
          const disabledRef = useDisabled();
          const blockProps = useBlockProps({ ref: disabledRef });
          const { content, status, error } = useServerSideRender({
            block: blockName,
            attributes
          });
          if (status === "loading") {
            return /* @__PURE__ */ jsx("div", { ...blockProps, children: __("Loading\u2026") });
          }
          if (status === "error") {
            return /* @__PURE__ */ jsx("div", { ...blockProps, children: sprintf(
              /* translators: %s: error message describing the problem */
              __("Error loading block: %s"),
              error
            ) });
          }
          return /* @__PURE__ */ jsx(
            HtmlRenderer,
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
  setDefaultBlockName(paragraph.name);
  if (window.wp && window.wp.oldEditor && blocks.some(({ name: name5 }) => name5 === classic.name)) {
    setFreeformContentHandlerName(classic.name);
  }
  setUnregisteredTypeHandlerName(missing.name);
  setGroupingBlockName(group.name);
};
var __experimentalRegisterExperimentalCoreBlocks = globalThis.IS_GUTENBERG_PLUGIN ? ({ enableFSEBlocks } = {}) => {
  const enabledExperiments = [enableFSEBlocks ? "fse" : null];
  getAllBlocks().filter(
    ({ metadata }) => isBlockMetadataExperimental(metadata)
  ).filter(
    ({ metadata: { __experimental } }) => __experimental === true || enabledExperiments.includes(__experimental)
  ).forEach(({ init }) => init());
} : void 0;
export {
  __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks,
  privateApis,
  registerCoreBlocks
};
//# sourceMappingURL=index.mjs.map

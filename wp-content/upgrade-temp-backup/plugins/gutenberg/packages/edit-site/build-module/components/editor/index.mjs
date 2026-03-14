// packages/edit-site/src/components/editor/index.js
import clsx from "clsx";
import { useDispatch, useSelect } from "@wordpress/data";
import { Button, __unstableMotion as motion } from "@wordpress/components";
import { useInstanceId, useReducedMotion } from "@wordpress/compose";
import {
  EditorKeyboardShortcutsRegister,
  privateApis as editorPrivateApis,
  store as editorStore
} from "@wordpress/editor";
import { __, sprintf } from "@wordpress/i18n";
import { store as coreDataStore } from "@wordpress/core-data";
import { privateApis as blockLibraryPrivateApis } from "@wordpress/block-library";
import { useCallback } from "@wordpress/element";
import { store as noticesStore } from "@wordpress/notices";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { decodeEntities } from "@wordpress/html-entities";
import { Icon, arrowUpLeft } from "@wordpress/icons";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { addQueryArgs } from "@wordpress/url";
import WelcomeGuide from "../welcome-guide/index.mjs";
import CanvasLoader from "../canvas-loader/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useSpecificEditorSettings } from "../block-editor/use-site-editor-settings.mjs";
import PluginTemplateSettingPanel from "../plugin-template-setting-panel/index.mjs";
import { isPreviewingTheme } from "../../utils/is-previewing-theme.mjs";
import SaveButton from "../save-button/index.mjs";
import SavePanel from "../save-panel/index.mjs";
import SiteEditorMoreMenu from "../more-menu/index.mjs";
import SiteIcon from "../site-icon/index.mjs";
import useEditorIframeProps from "../block-editor/use-editor-iframe-props.mjs";
import { ViewportSync } from "../block-editor/use-viewport-sync.mjs";
import useEditorTitle from "./use-editor-title.mjs";
import { useIsSiteEditorLoading } from "../layout/hooks.mjs";
import { useAdaptEditorToCanvas } from "./use-adapt-editor-to-canvas.mjs";
import {
  useResolveEditedEntity,
  useSyncDeprecatedEntityIntoState
} from "./use-resolve-edited-entity.mjs";
import SitePreview from "./site-preview.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Editor, BackButton } = unlock(editorPrivateApis);
var { useHistory, useLocation } = unlock(routerPrivateApis);
var { BlockKeyboardShortcuts } = unlock(blockLibraryPrivateApis);
var toggleHomeIconVariants = {
  edit: {
    opacity: 0,
    scale: 0.2
  },
  hover: {
    opacity: 1,
    scale: 1,
    clipPath: "inset( 22% round 2px )"
  }
};
var siteIconVariants = {
  edit: {
    clipPath: "inset(0% round 0px)"
  },
  hover: {
    clipPath: "inset( 22% round 2px )"
  },
  tap: {
    clipPath: "inset(0% round 0px)"
  }
};
function getListPathForPostType(postType) {
  switch (postType) {
    case "navigation":
      return "/navigation";
    case "wp_block":
      return "/pattern?postType=wp_block";
    case "wp_template_part":
      return "/pattern?postType=wp_template_part";
    case "wp_template":
      return "/template";
    case "page":
      return "/page";
    case "post":
      return "/";
  }
  throw "Unknown post type";
}
function getNavigationPath(location, postType) {
  const { path, name } = location;
  if ([
    "pattern-item",
    "template-part-item",
    "page-item",
    "template-item",
    "static-template-item",
    "post-item"
  ].includes(name)) {
    return getListPathForPostType(postType);
  }
  return addQueryArgs(path, { canvas: void 0 });
}
function EditSiteEditor({ isHomeRoute = false }) {
  const disableMotion = useReducedMotion();
  const location = useLocation();
  const history = useHistory();
  const { canvas = "view" } = location.query;
  const isLoading = useIsSiteEditorLoading();
  useAdaptEditorToCanvas(canvas);
  const entity = useResolveEditedEntity();
  useSyncDeprecatedEntityIntoState(entity);
  const { postType, postId, context } = entity;
  const { isBlockBasedTheme, hasSiteIcon } = useSelect((select) => {
    const { getCurrentTheme, getEntityRecord } = select(coreDataStore);
    const siteData = getEntityRecord("root", "__unstableBase", void 0);
    return {
      isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
      hasSiteIcon: !!siteData?.site_icon_url
    };
  }, []);
  const postWithTemplate = !!context?.postId;
  useEditorTitle(
    postWithTemplate ? context.postType : postType,
    postWithTemplate ? context.postId : postId
  );
  const _isPreviewingTheme = isPreviewingTheme();
  const iframeProps = useEditorIframeProps();
  const isEditMode = canvas === "edit";
  const loadingProgressId = useInstanceId(
    CanvasLoader,
    "edit-site-editor__loading-progress"
  );
  const editorSettings = useSpecificEditorSettings();
  const { resetZoomLevel } = unlock(useDispatch(blockEditorStore));
  const { setCurrentRevisionId } = unlock(useDispatch(editorStore));
  const { createSuccessNotice } = useDispatch(noticesStore);
  const onActionPerformed = useCallback(
    (actionId, items) => {
      switch (actionId) {
        case "move-to-trash":
        case "delete-post":
          {
            history.navigate(
              getListPathForPostType(
                postWithTemplate ? context.postType : postType
              )
            );
          }
          break;
        case "duplicate-post":
          {
            const newItem = items[0];
            const _title = typeof newItem.title === "string" ? newItem.title : newItem.title?.rendered;
            createSuccessNotice(
              sprintf(
                // translators: %s: Title of the created post or template, e.g: "Hello world".
                __('"%s" successfully created.'),
                decodeEntities(_title) || __("(no title)")
              ),
              {
                type: "snackbar",
                id: "duplicate-post-action",
                actions: [
                  {
                    label: __("Edit"),
                    onClick: () => {
                      history.navigate(
                        `/${newItem.type}/${newItem.id}?canvas=edit`
                      );
                    }
                  }
                ]
              }
            );
          }
          break;
      }
    },
    [
      postType,
      context?.postType,
      postWithTemplate,
      history,
      createSuccessNotice
    ]
  );
  const isReady = !isLoading;
  const transition = {
    duration: disableMotion ? 0 : 0.2
  };
  return !isBlockBasedTheme && isHomeRoute ? /* @__PURE__ */ jsx(SitePreview, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(EditorKeyboardShortcutsRegister, {}),
    isEditMode && /* @__PURE__ */ jsx(BlockKeyboardShortcuts, {}),
    !isReady ? /* @__PURE__ */ jsx(CanvasLoader, { id: loadingProgressId }) : null,
    isEditMode && isReady && /* @__PURE__ */ jsx(
      WelcomeGuide,
      {
        postType: postWithTemplate ? context.postType : postType
      }
    ),
    isReady && /* @__PURE__ */ jsxs(
      Editor,
      {
        postType: postWithTemplate ? context.postType : postType,
        postId: postWithTemplate ? context.postId : postId,
        templateId: postWithTemplate ? postId : void 0,
        settings: editorSettings,
        className: "edit-site-editor__editor-interface",
        customSaveButton: _isPreviewingTheme && /* @__PURE__ */ jsx(SaveButton, { size: "compact" }),
        customSavePanel: _isPreviewingTheme && /* @__PURE__ */ jsx(SavePanel, {}),
        iframeProps,
        onActionPerformed,
        extraSidebarPanels: !postWithTemplate && /* @__PURE__ */ jsx(PluginTemplateSettingPanel.Slot, {}),
        children: [
          isEditMode && /* @__PURE__ */ jsx(ViewportSync, {}),
          isEditMode && /* @__PURE__ */ jsx(BackButton, { children: ({ length }) => length <= 1 && /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "edit-site-editor__view-mode-toggle",
              transition,
              animate: "edit",
              initial: "edit",
              whileHover: "hover",
              whileTap: "tap",
              children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    __next40pxDefaultSize: true,
                    label: __("Open Navigation"),
                    showTooltip: true,
                    tooltipPosition: "middle right",
                    onClick: () => {
                      resetZoomLevel();
                      setCurrentRevisionId(null);
                      history.navigate(
                        getNavigationPath(
                          location,
                          postWithTemplate ? context.postType : postType
                        ),
                        {
                          transition: "canvas-mode-view-transition"
                        }
                      );
                    },
                    children: /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        variants: siteIconVariants,
                        children: /* @__PURE__ */ jsx(SiteIcon, { className: "edit-site-editor__view-mode-toggle-icon" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    className: clsx(
                      "edit-site-editor__back-icon",
                      {
                        "has-site-icon": hasSiteIcon
                      }
                    ),
                    variants: toggleHomeIconVariants,
                    children: /* @__PURE__ */ jsx(Icon, { icon: arrowUpLeft })
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(SiteEditorMoreMenu, {})
        ]
      }
    )
  ] });
}
export {
  EditSiteEditor as default
};
//# sourceMappingURL=index.mjs.map

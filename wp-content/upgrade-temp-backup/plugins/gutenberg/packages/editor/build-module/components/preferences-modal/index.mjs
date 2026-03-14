// packages/editor/src/components/preferences-modal/index.js
import { __ } from "@wordpress/i18n";
import { useViewportMatch } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import {
  store as preferencesStore,
  privateApis as preferencesPrivateApis
} from "@wordpress/preferences";
import { store as interfaceStore } from "@wordpress/interface";
import EnablePanelOption from "./enable-panel.mjs";
import EnablePluginDocumentSettingPanelOption from "./enable-plugin-document-setting-panel.mjs";
import EnablePublishSidebarOption from "./enable-publish-sidebar.mjs";
import BlockVisibility from "../block-visibility/index.mjs";
import PostTaxonomies from "../post-taxonomies/index.mjs";
import PostFeaturedImageCheck from "../post-featured-image/check.mjs";
import PostExcerptCheck from "../post-excerpt/check.mjs";
import PageAttributesCheck from "../page-attributes/check.mjs";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  PreferencesModal,
  PreferencesModalTabs,
  PreferencesModalSection,
  PreferenceToggleControl
} = unlock(preferencesPrivateApis);
function EditorPreferencesModal({ extraSections = {} }) {
  const isActive = useSelect((select) => {
    return select(interfaceStore).isModalActive("editor/preferences");
  }, []);
  const { closeModal } = useDispatch(interfaceStore);
  if (!isActive) {
    return null;
  }
  return /* @__PURE__ */ jsx(PreferencesModal, { closeModal, children: /* @__PURE__ */ jsx(PreferencesModalContents, { extraSections }) });
}
function PreferencesModalContents({ extraSections = {} }) {
  const isLargeViewport = useViewportMatch("medium");
  const showBlockBreadcrumbsOption = useSelect(
    (select) => {
      const { getEditorSettings } = select(editorStore);
      const { get } = select(preferencesStore);
      const isRichEditingEnabled = getEditorSettings().richEditingEnabled;
      const isDistractionFreeEnabled = get("core", "distractionFree");
      return !isDistractionFreeEnabled && isLargeViewport && isRichEditingEnabled;
    },
    [isLargeViewport]
  );
  const { setIsListViewOpened, setIsInserterOpened } = useDispatch(editorStore);
  const { set: setPreference } = useDispatch(preferencesStore);
  const sections = useMemo(
    () => [
      {
        name: "general",
        tabLabel: __("General"),
        content: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            PreferencesModalSection,
            {
              title: __("Interface"),
              children: [
                /* @__PURE__ */ jsx(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "showListViewByDefault",
                    help: __(
                      "Opens the List View panel by default."
                    ),
                    label: __("Always open List View")
                  }
                ),
                showBlockBreadcrumbsOption && /* @__PURE__ */ jsx(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "showBlockBreadcrumbs",
                    help: __(
                      "Display the block hierarchy trail at the bottom of the editor."
                    ),
                    label: __("Show block breadcrumbs")
                  }
                ),
                /* @__PURE__ */ jsx(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "allowRightClickOverrides",
                    help: __(
                      "Allows contextual List View menus via right-click, overriding browser defaults."
                    ),
                    label: __(
                      "Allow right-click contextual menus"
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "enableChoosePatternModal",
                    help: __(
                      "Pick from starter content when creating a new page."
                    ),
                    label: __("Show starter patterns")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            PreferencesModalSection,
            {
              title: __("Document settings"),
              description: __(
                "Select what settings are shown in the document panel."
              ),
              children: [
                /* @__PURE__ */ jsx(EnablePluginDocumentSettingPanelOption.Slot, {}),
                /* @__PURE__ */ jsx(
                  PostTaxonomies,
                  {
                    taxonomyWrapper: (content, taxonomy) => /* @__PURE__ */ jsx(
                      EnablePanelOption,
                      {
                        label: taxonomy.labels.menu_name,
                        panelName: `taxonomy-panel-${taxonomy.slug}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(PostFeaturedImageCheck, { children: /* @__PURE__ */ jsx(
                  EnablePanelOption,
                  {
                    label: __("Featured image"),
                    panelName: "featured-image"
                  }
                ) }),
                /* @__PURE__ */ jsx(PostExcerptCheck, { children: /* @__PURE__ */ jsx(
                  EnablePanelOption,
                  {
                    label: __("Excerpt"),
                    panelName: "post-excerpt"
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  PostTypeSupportCheck,
                  {
                    supportKeys: ["comments", "trackbacks"],
                    children: /* @__PURE__ */ jsx(
                      EnablePanelOption,
                      {
                        label: __("Discussion"),
                        panelName: "discussion-panel"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(PageAttributesCheck, { children: /* @__PURE__ */ jsx(
                  EnablePanelOption,
                  {
                    label: __("Page attributes"),
                    panelName: "page-attributes"
                  }
                ) })
              ]
            }
          ),
          isLargeViewport && /* @__PURE__ */ jsx(
            PreferencesModalSection,
            {
              title: __("Publishing"),
              children: /* @__PURE__ */ jsx(
                EnablePublishSidebarOption,
                {
                  help: __(
                    "Review settings, such as visibility and tags."
                  ),
                  label: __(
                    "Enable pre-publish checks"
                  )
                }
              )
            }
          ),
          extraSections?.general
        ] })
      },
      {
        name: "appearance",
        tabLabel: __("Appearance"),
        content: /* @__PURE__ */ jsxs(
          PreferencesModalSection,
          {
            title: __("Appearance"),
            description: __(
              "Customize the editor interface to suit your needs."
            ),
            children: [
              /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "fixedToolbar",
                  onToggle: () => setPreference(
                    "core",
                    "distractionFree",
                    false
                  ),
                  help: __(
                    "Access all block and document tools in a single place."
                  ),
                  label: __("Top toolbar")
                }
              ),
              /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "distractionFree",
                  onToggle: () => {
                    setPreference(
                      "core",
                      "fixedToolbar",
                      true
                    );
                    setIsInserterOpened(false);
                    setIsListViewOpened(false);
                  },
                  help: __(
                    "Reduce visual distractions by hiding the toolbar and other elements to focus on writing."
                  ),
                  label: __("Distraction free")
                }
              ),
              /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "focusMode",
                  help: __(
                    "Highlights the current block and fades other content."
                  ),
                  label: __("Spotlight mode")
                }
              ),
              extraSections?.appearance
            ]
          }
        )
      },
      {
        name: "accessibility",
        tabLabel: __("Accessibility"),
        content: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            PreferencesModalSection,
            {
              title: __("Navigation"),
              description: __(
                "Optimize the editing experience for enhanced control."
              ),
              children: /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "keepCaretInsideBlock",
                  help: __(
                    "Keeps the text cursor within blocks while navigating with arrow keys, preventing it from moving to other blocks and enhancing accessibility for keyboard users."
                  ),
                  label: __(
                    "Contain text cursor inside block"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            PreferencesModalSection,
            {
              title: __("Interface"),
              children: /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "showIconLabels",
                  label: __("Show button text labels"),
                  help: __(
                    "Show text instead of icons on buttons across the interface."
                  )
                }
              )
            }
          )
        ] })
      },
      {
        name: "blocks",
        tabLabel: __("Blocks"),
        content: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(PreferencesModalSection, { title: __("Inserter"), children: /* @__PURE__ */ jsx(
            PreferenceToggleControl,
            {
              scope: "core",
              featureName: "mostUsedBlocks",
              help: __(
                "Adds a category with the most frequently used blocks in the inserter."
              ),
              label: __("Show most used blocks")
            }
          ) }),
          /* @__PURE__ */ jsx(
            PreferencesModalSection,
            {
              title: __("Manage block visibility"),
              description: __(
                "Disable blocks that you don't want to appear in the inserter. They can always be toggled back on later."
              ),
              children: /* @__PURE__ */ jsx(BlockVisibility, {})
            }
          )
        ] })
      },
      window.__clientSideMediaProcessing && {
        name: "media",
        tabLabel: __("Media"),
        content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
          PreferencesModalSection,
          {
            title: __("General"),
            description: __(
              "Customize options related to the media upload flow."
            ),
            children: [
              /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core/media",
                  featureName: "optimizeOnUpload",
                  help: __(
                    "Compress media items before uploading to the server."
                  ),
                  label: __("Pre-upload compression")
                }
              ),
              /* @__PURE__ */ jsx(
                PreferenceToggleControl,
                {
                  scope: "core/media",
                  featureName: "requireApproval",
                  help: __(
                    "Require approval step when optimizing existing media."
                  ),
                  label: __("Approval step")
                }
              )
            ]
          }
        ) })
      }
    ].filter(Boolean),
    [
      showBlockBreadcrumbsOption,
      extraSections,
      setIsInserterOpened,
      setIsListViewOpened,
      setPreference,
      isLargeViewport
    ]
  );
  return /* @__PURE__ */ jsx(PreferencesModalTabs, { sections });
}
export {
  EditorPreferencesModal as default
};
//# sourceMappingURL=index.mjs.map

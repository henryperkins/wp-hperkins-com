"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/preferences-modal/index.js
var preferences_modal_exports = {};
__export(preferences_modal_exports, {
  default: () => EditorPreferencesModal
});
module.exports = __toCommonJS(preferences_modal_exports);
var import_i18n = require("@wordpress/i18n");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
var import_enable_panel = __toESM(require("./enable-panel.cjs"));
var import_enable_plugin_document_setting_panel = __toESM(require("./enable-plugin-document-setting-panel.cjs"));
var import_enable_publish_sidebar = __toESM(require("./enable-publish-sidebar.cjs"));
var import_block_visibility = __toESM(require("../block-visibility/index.cjs"));
var import_post_taxonomies = __toESM(require("../post-taxonomies/index.cjs"));
var import_check = __toESM(require("../post-featured-image/check.cjs"));
var import_check2 = __toESM(require("../post-excerpt/check.cjs"));
var import_check3 = __toESM(require("../page-attributes/check.cjs"));
var import_post_type_support_check = __toESM(require("../post-type-support-check/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  PreferencesModal,
  PreferencesModalTabs,
  PreferencesModalSection,
  PreferenceToggleControl
} = (0, import_lock_unlock.unlock)(import_preferences.privateApis);
function EditorPreferencesModal({ extraSections = {} }) {
  const isActive = (0, import_data.useSelect)((select) => {
    return select(import_interface.store).isModalActive("editor/preferences");
  }, []);
  const { closeModal } = (0, import_data.useDispatch)(import_interface.store);
  if (!isActive) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModal, { closeModal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModalContents, { extraSections }) });
}
function PreferencesModalContents({ extraSections = {} }) {
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const showBlockBreadcrumbsOption = (0, import_data.useSelect)(
    (select) => {
      const { getEditorSettings } = select(import_store.store);
      const { get } = select(import_preferences.store);
      const isRichEditingEnabled = getEditorSettings().richEditingEnabled;
      const isDistractionFreeEnabled = get("core", "distractionFree");
      return !isDistractionFreeEnabled && isLargeViewport && isRichEditingEnabled;
    },
    [isLargeViewport]
  );
  const { setIsListViewOpened, setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const sections = (0, import_element.useMemo)(
    () => [
      {
        name: "general",
        tabLabel: (0, import_i18n.__)("General"),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Interface"),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "showListViewByDefault",
                    help: (0, import_i18n.__)(
                      "Opens the List View panel by default."
                    ),
                    label: (0, import_i18n.__)("Always open List View")
                  }
                ),
                showBlockBreadcrumbsOption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "showBlockBreadcrumbs",
                    help: (0, import_i18n.__)(
                      "Display the block hierarchy trail at the bottom of the editor."
                    ),
                    label: (0, import_i18n.__)("Show block breadcrumbs")
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "allowRightClickOverrides",
                    help: (0, import_i18n.__)(
                      "Allows contextual List View menus via right-click, overriding browser defaults."
                    ),
                    label: (0, import_i18n.__)(
                      "Allow right-click contextual menus"
                    )
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  PreferenceToggleControl,
                  {
                    scope: "core",
                    featureName: "enableChoosePatternModal",
                    help: (0, import_i18n.__)(
                      "Pick from starter content when creating a new page."
                    ),
                    label: (0, import_i18n.__)("Show starter patterns")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Document settings"),
              description: (0, import_i18n.__)(
                "Select what settings are shown in the document panel."
              ),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_enable_plugin_document_setting_panel.default.Slot, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_post_taxonomies.default,
                  {
                    taxonomyWrapper: (content, taxonomy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_enable_panel.default,
                      {
                        label: taxonomy.labels.menu_name,
                        panelName: `taxonomy-panel-${taxonomy.slug}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_enable_panel.default,
                  {
                    label: (0, import_i18n.__)("Featured image"),
                    panelName: "featured-image"
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check2.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_enable_panel.default,
                  {
                    label: (0, import_i18n.__)("Excerpt"),
                    panelName: "post-excerpt"
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_post_type_support_check.default,
                  {
                    supportKeys: ["comments", "trackbacks"],
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_enable_panel.default,
                      {
                        label: (0, import_i18n.__)("Discussion"),
                        panelName: "discussion-panel"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check3.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_enable_panel.default,
                  {
                    label: (0, import_i18n.__)("Page attributes"),
                    panelName: "page-attributes"
                  }
                ) })
              ]
            }
          ),
          isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Publishing"),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_enable_publish_sidebar.default,
                {
                  help: (0, import_i18n.__)(
                    "Review settings, such as visibility and tags."
                  ),
                  label: (0, import_i18n.__)(
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
        tabLabel: (0, import_i18n.__)("Appearance"),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          PreferencesModalSection,
          {
            title: (0, import_i18n.__)("Appearance"),
            description: (0, import_i18n.__)(
              "Customize the editor interface to suit your needs."
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "fixedToolbar",
                  onToggle: () => setPreference(
                    "core",
                    "distractionFree",
                    false
                  ),
                  help: (0, import_i18n.__)(
                    "Access all block and document tools in a single place."
                  ),
                  label: (0, import_i18n.__)("Top toolbar")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                  help: (0, import_i18n.__)(
                    "Reduce visual distractions by hiding the toolbar and other elements to focus on writing."
                  ),
                  label: (0, import_i18n.__)("Distraction free")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "focusMode",
                  help: (0, import_i18n.__)(
                    "Highlights the current block and fades other content."
                  ),
                  label: (0, import_i18n.__)("Spotlight mode")
                }
              ),
              extraSections?.appearance
            ]
          }
        )
      },
      {
        name: "accessibility",
        tabLabel: (0, import_i18n.__)("Accessibility"),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Navigation"),
              description: (0, import_i18n.__)(
                "Optimize the editing experience for enhanced control."
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "keepCaretInsideBlock",
                  help: (0, import_i18n.__)(
                    "Keeps the text cursor within blocks while navigating with arrow keys, preventing it from moving to other blocks and enhancing accessibility for keyboard users."
                  ),
                  label: (0, import_i18n.__)(
                    "Contain text cursor inside block"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Interface"),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core",
                  featureName: "showIconLabels",
                  label: (0, import_i18n.__)("Show button text labels"),
                  help: (0, import_i18n.__)(
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
        tabLabel: (0, import_i18n.__)("Blocks"),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModalSection, { title: (0, import_i18n.__)("Inserter"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            PreferenceToggleControl,
            {
              scope: "core",
              featureName: "mostUsedBlocks",
              help: (0, import_i18n.__)(
                "Adds a category with the most frequently used blocks in the inserter."
              ),
              label: (0, import_i18n.__)("Show most used blocks")
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            PreferencesModalSection,
            {
              title: (0, import_i18n.__)("Manage block visibility"),
              description: (0, import_i18n.__)(
                "Disable blocks that you don't want to appear in the inserter. They can always be toggled back on later."
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_visibility.default, {})
            }
          )
        ] })
      },
      window.__clientSideMediaProcessing && {
        name: "media",
        tabLabel: (0, import_i18n.__)("Media"),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          PreferencesModalSection,
          {
            title: (0, import_i18n.__)("General"),
            description: (0, import_i18n.__)(
              "Customize options related to the media upload flow."
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core/media",
                  featureName: "optimizeOnUpload",
                  help: (0, import_i18n.__)(
                    "Compress media items before uploading to the server."
                  ),
                  label: (0, import_i18n.__)("Pre-upload compression")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PreferenceToggleControl,
                {
                  scope: "core/media",
                  featureName: "requireApproval",
                  help: (0, import_i18n.__)(
                    "Require approval step when optimizing existing media."
                  ),
                  label: (0, import_i18n.__)("Approval step")
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModalTabs, { sections });
}
//# sourceMappingURL=index.cjs.map

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

// packages/global-styles-ui/src/font-library/installed-fonts.tsx
var installed_fonts_exports = {};
__export(installed_fonts_exports, {
  default: () => installed_fonts_default
});
module.exports = __toCommonJS(installed_fonts_exports);
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_context = require("./context.cjs");
var import_font_card = __toESM(require("./font-card.cjs"));
var import_library_font_variant = __toESM(require("./library-font-variant.cjs"));
var import_sort_font_faces = require("./utils/sort-font-faces.cjs");
var import_utils = require("./utils/index.cjs");
var import_hooks = require("../hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function InstalledFonts() {
  const {
    baseCustomFonts,
    libraryFontSelected,
    handleSetLibraryFontSelected,
    uninstallFontFamily,
    isResolvingLibrary,
    isInstalling,
    saveFontFamilies,
    getFontFacesActivated
  } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const [fontFamilies, setFontFamilies] = (0, import_hooks.useSetting)("typography.fontFamilies");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = (0, import_element.useState)(false);
  const [notice, setNotice] = (0, import_element.useState)(null);
  const [baseFontFamilies] = (0, import_hooks.useSetting)("typography.fontFamilies", void 0, "base");
  const globalStylesId = (0, import_data.useSelect)((select) => {
    const { __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    return __experimentalGetCurrentGlobalStylesId();
  }, []);
  const globalStyles = (0, import_core_data.useEntityRecord)(
    "root",
    "globalStyles",
    globalStylesId
  );
  const fontFamiliesHasChanges = !!globalStyles?.edits?.settings?.typography?.fontFamilies;
  const themeFonts = fontFamilies?.theme ? fontFamilies.theme.map((f) => (0, import_utils.setUIValuesNeeded)(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const themeFontsSlugs = new Set(themeFonts.map((f) => f.slug));
  const baseThemeFonts = baseFontFamilies?.theme ? themeFonts.concat(
    baseFontFamilies.theme.filter((f) => !themeFontsSlugs.has(f.slug)).map((f) => (0, import_utils.setUIValuesNeeded)(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name))
  ) : [];
  const customFontFamilyId = libraryFontSelected?.source === "custom" && libraryFontSelected?.id;
  const canUserDelete = (0, import_data.useSelect)(
    (select) => {
      const { canUser } = select(import_core_data.store);
      return customFontFamilyId && canUser("delete", {
        kind: "postType",
        name: "wp_font_family",
        id: customFontFamilyId
      });
    },
    [customFontFamilyId]
  );
  const shouldDisplayDeleteButton = !!libraryFontSelected && libraryFontSelected?.source !== "theme" && canUserDelete;
  const handleUninstallClick = () => {
    setIsConfirmDeleteOpen(true);
  };
  const handleUpdate = async () => {
    setNotice(null);
    try {
      await saveFontFamilies(fontFamilies);
      setNotice({
        type: "success",
        message: (0, import_i18n.__)("Font family updated successfully.")
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: (0, import_i18n.sprintf)(
          /* translators: %s: error message */
          (0, import_i18n.__)("There was an error updating the font family. %s"),
          error.message
        )
      });
    }
  };
  const getFontFacesToDisplay = (font) => {
    if (!font) {
      return [];
    }
    if (!font.fontFace || !font.fontFace.length) {
      return [
        {
          fontFamily: font.fontFamily,
          fontStyle: "normal",
          fontWeight: "400"
        }
      ];
    }
    return (0, import_sort_font_faces.sortFontFaces)(font.fontFace);
  };
  const getFontCardVariantsText = (font) => {
    const variantsInstalled = font?.fontFace && (font?.fontFace?.length ?? 0) > 0 ? font.fontFace.length : 1;
    const variantsActive = getFontFacesActivated(
      font.slug,
      font.source
    ).length;
    return (0, import_i18n.sprintf)(
      /* translators: 1: Active font variants, 2: Total font variants. */
      (0, import_i18n.__)("%1$d/%2$d variants active"),
      variantsActive,
      variantsInstalled
    );
  };
  (0, import_element.useEffect)(() => {
    handleSetLibraryFontSelected(libraryFontSelected);
  }, []);
  const activeFontsCount = libraryFontSelected ? getFontFacesActivated(
    libraryFontSelected.slug,
    libraryFontSelected.source
  ).length : 0;
  const selectedFontsCount = libraryFontSelected?.fontFace?.length ?? (libraryFontSelected?.fontFamily ? 1 : 0);
  const isIndeterminate = activeFontsCount > 0 && activeFontsCount !== selectedFontsCount;
  const isSelectAllChecked = activeFontsCount === selectedFontsCount;
  const toggleSelectAll = () => {
    if (!libraryFontSelected || !libraryFontSelected?.source) {
      return;
    }
    const initialFonts = fontFamilies?.[libraryFontSelected.source]?.filter(
      (f) => f.slug !== libraryFontSelected.slug
    ) ?? [];
    const newFonts = isSelectAllChecked ? initialFonts : [...initialFonts, libraryFontSelected];
    setFontFamilies({
      ...fontFamilies,
      [libraryFontSelected.source]: newFonts
    });
    if (libraryFontSelected.fontFace) {
      libraryFontSelected.fontFace.forEach((face) => {
        if (isSelectAllChecked) {
          (0, import_utils.unloadFontFaceInBrowser)(face, "all");
        } else {
          const displaySrc = (0, import_utils.getDisplaySrcFromFontFace)(
            face?.src ?? ""
          );
          if (displaySrc) {
            (0, import_utils.loadFontFaceInBrowser)(face, displaySrc, "all");
          }
        }
      });
    }
  };
  const hasFonts = baseThemeFonts.length > 0 || baseCustomFonts.length > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-library__tabpanel-layout", children: [
    isResolvingLibrary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ProgressBar, {}) }),
    !isResolvingLibrary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.Navigator,
        {
          initialPath: libraryFontSelected ? "/fontFamily" : "/",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Navigator.Screen, { path: "/", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "8", children: [
              notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Notice,
                {
                  status: notice.type,
                  onRemove: () => setNotice(null),
                  children: notice.message
                }
              ),
              !hasFonts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)("No fonts installed.") }),
              baseThemeFonts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                  className: "font-library__fonts-title",
                  /* translators: Heading for a list of fonts provided by the theme. */
                  children: (0, import_i18n._x)("Theme", "font source")
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: baseThemeFonts.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          import_font_card.default,
                          {
                            font,
                            navigatorPath: "/fontFamily",
                            variantsText: getFontCardVariantsText(
                              font
                            ),
                            onClick: () => {
                              setNotice(null);
                              handleSetLibraryFontSelected(
                                font
                              );
                            }
                          }
                        )
                      },
                      font.slug
                    ))
                  }
                )
              ] }),
              baseCustomFonts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                  className: "font-library__fonts-title",
                  /* translators: Heading for a list of fonts installed by the user. */
                  children: (0, import_i18n._x)("Custom", "font source")
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: baseCustomFonts.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          import_font_card.default,
                          {
                            font,
                            navigatorPath: "/fontFamily",
                            variantsText: getFontCardVariantsText(
                              font
                            ),
                            onClick: () => {
                              setNotice(null);
                              handleSetLibraryFontSelected(
                                font
                              );
                            }
                          }
                        )
                      },
                      font.slug
                    ))
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Navigator.Screen, { path: "/fontFamily", children: [
              libraryFontSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ConfirmDeleteDialog,
                {
                  font: libraryFontSelected,
                  isOpen: isConfirmDeleteOpen,
                  setIsOpen: setIsConfirmDeleteOpen,
                  setNotice,
                  uninstallFontFamily,
                  handleSetLibraryFontSelected
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { justify: "flex-start", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Navigator.BackButton,
                  {
                    icon: (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft,
                    size: "small",
                    onClick: () => {
                      handleSetLibraryFontSelected(
                        void 0
                      );
                      setNotice(null);
                    },
                    label: (0, import_i18n.__)("Back")
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.__experimentalHeading,
                  {
                    level: 2,
                    size: 13,
                    className: "global-styles-ui-header",
                    children: libraryFontSelected?.name
                  }
                )
              ] }),
              notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 1 }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Notice,
                  {
                    status: notice.type,
                    onRemove: () => setNotice(null),
                    children: notice.message
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 1 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)(
                "Choose font variants. Keep in mind that too many variants could make your site slower."
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 0, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.CheckboxControl,
                  {
                    className: "font-library__select-all",
                    label: (0, import_i18n.__)("Select all"),
                    checked: isSelectAllChecked,
                    onChange: toggleSelectAll,
                    indeterminate: isIndeterminate
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 8 }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: libraryFontSelected && getFontFacesToDisplay(
                      libraryFontSelected
                    ).map((face, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          import_library_font_variant.default,
                          {
                            font: libraryFontSelected,
                            face
                          },
                          `face${i}`
                        )
                      },
                      `face${i}`
                    ))
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-end", className: "font-library__footer", children: [
        isInstalling && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ProgressBar, {}),
        shouldDisplayDeleteButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            isDestructive: true,
            variant: "tertiary",
            onClick: handleUninstallClick,
            children: (0, import_i18n.__)("Delete")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            onClick: handleUpdate,
            disabled: !fontFamiliesHasChanges,
            accessibleWhenDisabled: true,
            children: (0, import_i18n.__)("Update")
          }
        )
      ] })
    ] })
  ] });
}
function ConfirmDeleteDialog({
  font,
  isOpen,
  setIsOpen,
  setNotice,
  uninstallFontFamily,
  handleSetLibraryFontSelected
}) {
  const navigator = (0, import_components.useNavigator)();
  const handleConfirmUninstall = async () => {
    setNotice(null);
    setIsOpen(false);
    try {
      await uninstallFontFamily(font);
      navigator.goBack();
      handleSetLibraryFontSelected(void 0);
      setNotice({
        type: "success",
        message: (0, import_i18n.__)("Font family uninstalled successfully.")
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: (0, import_i18n.__)("There was an error uninstalling the font family.") + error.message
      });
    }
  };
  const handleCancelUninstall = () => {
    setIsOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen,
      cancelButtonText: (0, import_i18n.__)("Cancel"),
      confirmButtonText: (0, import_i18n.__)("Delete"),
      onCancel: handleCancelUninstall,
      onConfirm: handleConfirmUninstall,
      size: "medium",
      children: font && (0, import_i18n.sprintf)(
        /* translators: %s: Name of the font. */
        (0, import_i18n.__)(
          'Are you sure you want to delete "%s" font and all its variants and assets?'
        ),
        font.name
      )
    }
  );
}
var installed_fonts_default = InstalledFonts;
//# sourceMappingURL=installed-fonts.cjs.map

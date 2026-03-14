// packages/global-styles-ui/src/font-library/installed-fonts.tsx
import {
  Button,
  __experimentalConfirmDialog as ConfirmDialog,
  __experimentalHStack as HStack,
  __experimentalHeading as Heading,
  Navigator,
  useNavigator,
  __experimentalSpacer as Spacer,
  __experimentalText as Text,
  __experimentalVStack as VStack,
  Flex,
  Notice,
  ProgressBar,
  CheckboxControl
} from "@wordpress/components";
import { useEntityRecord, store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useContext, useEffect, useState } from "@wordpress/element";
import { __, _x, sprintf, isRTL } from "@wordpress/i18n";
import { chevronLeft, chevronRight } from "@wordpress/icons";
import { FontLibraryContext } from "./context.mjs";
import FontCard from "./font-card.mjs";
import LibraryFontVariant from "./library-font-variant.mjs";
import { sortFontFaces } from "./utils/sort-font-faces.mjs";
import {
  setUIValuesNeeded,
  loadFontFaceInBrowser,
  unloadFontFaceInBrowser,
  getDisplaySrcFromFontFace
} from "./utils/index.mjs";
import { useSetting } from "../hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  } = useContext(FontLibraryContext);
  const [fontFamilies, setFontFamilies] = useSetting("typography.fontFamilies");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [baseFontFamilies] = useSetting("typography.fontFamilies", void 0, "base");
  const globalStylesId = useSelect((select) => {
    const { __experimentalGetCurrentGlobalStylesId } = select(coreStore);
    return __experimentalGetCurrentGlobalStylesId();
  }, []);
  const globalStyles = useEntityRecord(
    "root",
    "globalStyles",
    globalStylesId
  );
  const fontFamiliesHasChanges = !!globalStyles?.edits?.settings?.typography?.fontFamilies;
  const themeFonts = fontFamilies?.theme ? fontFamilies.theme.map((f) => setUIValuesNeeded(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const themeFontsSlugs = new Set(themeFonts.map((f) => f.slug));
  const baseThemeFonts = baseFontFamilies?.theme ? themeFonts.concat(
    baseFontFamilies.theme.filter((f) => !themeFontsSlugs.has(f.slug)).map((f) => setUIValuesNeeded(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name))
  ) : [];
  const customFontFamilyId = libraryFontSelected?.source === "custom" && libraryFontSelected?.id;
  const canUserDelete = useSelect(
    (select) => {
      const { canUser } = select(coreStore);
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
        message: __("Font family updated successfully.")
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: sprintf(
          /* translators: %s: error message */
          __("There was an error updating the font family. %s"),
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
    return sortFontFaces(font.fontFace);
  };
  const getFontCardVariantsText = (font) => {
    const variantsInstalled = font?.fontFace && (font?.fontFace?.length ?? 0) > 0 ? font.fontFace.length : 1;
    const variantsActive = getFontFacesActivated(
      font.slug,
      font.source
    ).length;
    return sprintf(
      /* translators: 1: Active font variants, 2: Total font variants. */
      __("%1$d/%2$d variants active"),
      variantsActive,
      variantsInstalled
    );
  };
  useEffect(() => {
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
          unloadFontFaceInBrowser(face, "all");
        } else {
          const displaySrc = getDisplaySrcFromFontFace(
            face?.src ?? ""
          );
          if (displaySrc) {
            loadFontFaceInBrowser(face, displaySrc, "all");
          }
        }
      });
    }
  };
  const hasFonts = baseThemeFonts.length > 0 || baseCustomFonts.length > 0;
  return /* @__PURE__ */ jsxs("div", { className: "font-library__tabpanel-layout", children: [
    isResolvingLibrary && /* @__PURE__ */ jsx("div", { className: "font-library__loading", children: /* @__PURE__ */ jsx(ProgressBar, {}) }),
    !isResolvingLibrary && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        Navigator,
        {
          initialPath: libraryFontSelected ? "/fontFamily" : "/",
          children: [
            /* @__PURE__ */ jsx(Navigator.Screen, { path: "/", children: /* @__PURE__ */ jsxs(VStack, { spacing: "8", children: [
              notice && /* @__PURE__ */ jsx(
                Notice,
                {
                  status: notice.type,
                  onRemove: () => setNotice(null),
                  children: notice.message
                }
              ),
              !hasFonts && /* @__PURE__ */ jsx(Text, { as: "p", children: __("No fonts installed.") }),
              baseThemeFonts.length > 0 && /* @__PURE__ */ jsxs(VStack, { children: [
                /* @__PURE__ */ jsx("h2", {
                  className: "font-library__fonts-title",
                  /* translators: Heading for a list of fonts provided by the theme. */
                  children: _x("Theme", "font source")
                }),
                /* @__PURE__ */ jsx(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: baseThemeFonts.map((font) => /* @__PURE__ */ jsx(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ jsx(
                          FontCard,
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
              baseCustomFonts.length > 0 && /* @__PURE__ */ jsxs(VStack, { children: [
                /* @__PURE__ */ jsx("h2", {
                  className: "font-library__fonts-title",
                  /* translators: Heading for a list of fonts installed by the user. */
                  children: _x("Custom", "font source")
                }),
                /* @__PURE__ */ jsx(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: baseCustomFonts.map((font) => /* @__PURE__ */ jsx(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ jsx(
                          FontCard,
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
            /* @__PURE__ */ jsxs(Navigator.Screen, { path: "/fontFamily", children: [
              libraryFontSelected && /* @__PURE__ */ jsx(
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
              /* @__PURE__ */ jsxs(Flex, { justify: "flex-start", children: [
                /* @__PURE__ */ jsx(
                  Navigator.BackButton,
                  {
                    icon: isRTL() ? chevronRight : chevronLeft,
                    size: "small",
                    onClick: () => {
                      handleSetLibraryFontSelected(
                        void 0
                      );
                      setNotice(null);
                    },
                    label: __("Back")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Heading,
                  {
                    level: 2,
                    size: 13,
                    className: "global-styles-ui-header",
                    children: libraryFontSelected?.name
                  }
                )
              ] }),
              notice && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Spacer, { margin: 1 }),
                /* @__PURE__ */ jsx(
                  Notice,
                  {
                    status: notice.type,
                    onRemove: () => setNotice(null),
                    children: notice.message
                  }
                ),
                /* @__PURE__ */ jsx(Spacer, { margin: 1 })
              ] }),
              /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
              /* @__PURE__ */ jsx(Text, { children: __(
                "Choose font variants. Keep in mind that too many variants could make your site slower."
              ) }),
              /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
              /* @__PURE__ */ jsxs(VStack, { spacing: 0, children: [
                /* @__PURE__ */ jsx(
                  CheckboxControl,
                  {
                    className: "font-library__select-all",
                    label: __("Select all"),
                    checked: isSelectAllChecked,
                    onChange: toggleSelectAll,
                    indeterminate: isIndeterminate
                  }
                ),
                /* @__PURE__ */ jsx(Spacer, { margin: 8 }),
                /* @__PURE__ */ jsx(
                  "ul",
                  {
                    role: "list",
                    className: "font-library__fonts-list",
                    children: libraryFontSelected && getFontFacesToDisplay(
                      libraryFontSelected
                    ).map((face, i) => /* @__PURE__ */ jsx(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ jsx(
                          LibraryFontVariant,
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
      /* @__PURE__ */ jsxs(HStack, { justify: "flex-end", className: "font-library__footer", children: [
        isInstalling && /* @__PURE__ */ jsx(ProgressBar, {}),
        shouldDisplayDeleteButton && /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            isDestructive: true,
            variant: "tertiary",
            onClick: handleUninstallClick,
            children: __("Delete")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            onClick: handleUpdate,
            disabled: !fontFamiliesHasChanges,
            accessibleWhenDisabled: true,
            children: __("Update")
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
  const navigator = useNavigator();
  const handleConfirmUninstall = async () => {
    setNotice(null);
    setIsOpen(false);
    try {
      await uninstallFontFamily(font);
      navigator.goBack();
      handleSetLibraryFontSelected(void 0);
      setNotice({
        type: "success",
        message: __("Font family uninstalled successfully.")
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: __("There was an error uninstalling the font family.") + error.message
      });
    }
  };
  const handleCancelUninstall = () => {
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen,
      cancelButtonText: __("Cancel"),
      confirmButtonText: __("Delete"),
      onCancel: handleCancelUninstall,
      onConfirm: handleConfirmUninstall,
      size: "medium",
      children: font && sprintf(
        /* translators: %s: Name of the font. */
        __(
          'Are you sure you want to delete "%s" font and all its variants and assets?'
        ),
        font.name
      )
    }
  );
}
var installed_fonts_default = InstalledFonts;
export {
  installed_fonts_default as default
};
//# sourceMappingURL=installed-fonts.mjs.map

// packages/global-styles-ui/src/font-library/font-collection.tsx
import {
  useContext,
  useEffect,
  useState,
  useMemo,
  createInterpolateElement
} from "@wordpress/element";
import {
  __experimentalSpacer as Spacer,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  Navigator,
  __experimentalHeading as Heading,
  Notice,
  SelectControl,
  Flex,
  Button,
  DropdownMenu,
  SearchControl,
  ProgressBar,
  CheckboxControl
} from "@wordpress/components";
import { debounce } from "@wordpress/compose";
import { sprintf, __, _x, isRTL } from "@wordpress/i18n";
import {
  moreVertical,
  next,
  previous,
  chevronLeft,
  chevronRight
} from "@wordpress/icons";
import { useEntityRecord } from "@wordpress/core-data";
import { FontLibraryContext } from "./context.mjs";
import FontCard from "./font-card.mjs";
import filterFonts from "./utils/filter-fonts.mjs";
import { toggleFont } from "./utils/toggleFont.mjs";
import {
  getFontsOutline,
  isFontFontFaceInOutline
} from "./utils/fonts-outline.mjs";
import GoogleFontsConfirmDialog from "./google-fonts-confirm-dialog.mjs";
import { downloadFontFaceAssets } from "./utils/index.mjs";
import { sortFontFaces } from "./utils/sort-font-faces.mjs";
import CollectionFontVariant from "./collection-font-variant.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_CATEGORY = {
  slug: "all",
  name: _x("All", "font categories")
};
var LOCAL_STORAGE_ITEM = "wp-font-library-google-fonts-permission";
var MIN_WINDOW_HEIGHT = 500;
function FontCollection({ slug }) {
  const requiresPermission = slug === "google-fonts";
  const getGoogleFontsPermissionFromStorage = () => {
    return window.localStorage.getItem(LOCAL_STORAGE_ITEM) === "true";
  };
  const [selectedFont, setSelectedFont] = useState(
    null
  );
  const [notice, setNotice] = useState(null);
  const [fontsToInstall, setFontsToInstall] = useState(
    []
  );
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [renderConfirmDialog, setRenderConfirmDialog] = useState(
    requiresPermission && !getGoogleFontsPermissionFromStorage()
  );
  const { installFonts, isInstalling } = useContext(FontLibraryContext);
  const { record: selectedCollection, isResolving: isLoading } = useEntityRecord("root", "fontCollection", slug);
  useEffect(() => {
    const handleStorage = () => {
      setRenderConfirmDialog(
        requiresPermission && !getGoogleFontsPermissionFromStorage()
      );
    };
    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [slug, requiresPermission]);
  const revokeAccess = () => {
    window.localStorage.setItem(LOCAL_STORAGE_ITEM, "false");
    window.dispatchEvent(new Event("storage"));
  };
  useEffect(() => {
    setSelectedFont(null);
  }, [slug]);
  useEffect(() => {
    setFontsToInstall([]);
  }, [selectedFont]);
  const collectionFonts = useMemo(
    () => selectedCollection?.font_families ?? [],
    [selectedCollection]
  );
  const collectionCategories = selectedCollection?.categories ?? [];
  const categories = [DEFAULT_CATEGORY, ...collectionCategories];
  const fonts = useMemo(
    () => filterFonts(collectionFonts, filters),
    [collectionFonts, filters]
  );
  const windowHeight = Math.max(window.innerHeight, MIN_WINDOW_HEIGHT);
  const pageSize = Math.floor((windowHeight - 417) / 61);
  const totalPages = Math.ceil(fonts.length / pageSize);
  const itemsStart = (page - 1) * pageSize;
  const itemsLimit = page * pageSize;
  const items = fonts.slice(itemsStart, itemsLimit);
  const handleCategoryFilter = (category) => {
    setFilters({ ...filters, category });
    setPage(1);
  };
  const handleUpdateSearchInput = (value) => {
    setFilters({ ...filters, search: value });
    setPage(1);
  };
  const debouncedUpdateSearchInput = debounce(handleUpdateSearchInput, 300);
  const handleToggleVariant = (font, face) => {
    const newFontsToInstall = toggleFont(font, face, fontsToInstall);
    setFontsToInstall(newFontsToInstall);
  };
  const fontToInstallOutline = getFontsOutline(fontsToInstall);
  const resetFontsToInstall = () => {
    setFontsToInstall([]);
  };
  const selectFontCount = fontsToInstall.length > 0 ? fontsToInstall[0]?.fontFace?.length ?? 0 : 0;
  const isIndeterminate = selectFontCount > 0 && selectFontCount !== selectedFont?.fontFace?.length;
  const isSelectAllChecked = selectFontCount === selectedFont?.fontFace?.length;
  const toggleSelectAll = () => {
    const newFonts = [];
    if (!isSelectAllChecked && selectedFont) {
      newFonts.push(selectedFont);
    }
    setFontsToInstall(newFonts);
  };
  const handleInstall = async () => {
    setNotice(null);
    const fontFamily = fontsToInstall[0];
    try {
      if (fontFamily?.fontFace) {
        await Promise.all(
          fontFamily.fontFace.map(async (fontFace) => {
            if (fontFace.src) {
              fontFace.file = await downloadFontFaceAssets(
                fontFace.src
              );
            }
          })
        );
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: __(
          "Error installing the fonts, could not be downloaded."
        )
      });
      return;
    }
    try {
      await installFonts([fontFamily]);
      setNotice({
        type: "success",
        message: __("Fonts were installed successfully.")
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message
      });
    }
    resetFontsToInstall();
  };
  const getSortedFontFaces = (fontFamily) => {
    if (!fontFamily) {
      return [];
    }
    if (!fontFamily.fontFace || !fontFamily.fontFace.length) {
      return [
        {
          fontFamily: fontFamily.fontFamily,
          fontStyle: "normal",
          fontWeight: "400"
        }
      ];
    }
    return sortFontFaces(fontFamily.fontFace);
  };
  if (renderConfirmDialog) {
    return /* @__PURE__ */ jsx(GoogleFontsConfirmDialog, {});
  }
  const ActionsComponent = () => {
    if (slug !== "google-fonts" || renderConfirmDialog || selectedFont) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        icon: moreVertical,
        label: __("Actions"),
        popoverProps: {
          position: "bottom left"
        },
        controls: [
          {
            title: __("Revoke access to Google Fonts"),
            onClick: revokeAccess
          }
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "font-library__tabpanel-layout", children: [
    isLoading && /* @__PURE__ */ jsx("div", { className: "font-library__loading", children: /* @__PURE__ */ jsx(ProgressBar, {}) }),
    !isLoading && selectedCollection && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        Navigator,
        {
          initialPath: "/",
          className: "font-library__tabpanel-layout",
          children: [
            /* @__PURE__ */ jsxs(Navigator.Screen, { path: "/", children: [
              /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
                /* @__PURE__ */ jsxs(VStack, { children: [
                  /* @__PURE__ */ jsx(Heading, { level: 2, size: 13, children: selectedCollection.name }),
                  /* @__PURE__ */ jsx(Text, { children: selectedCollection.description })
                ] }),
                /* @__PURE__ */ jsx(ActionsComponent, {})
              ] }),
              /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
              /* @__PURE__ */ jsxs(HStack, { spacing: 4, justify: "space-between", children: [
                /* @__PURE__ */ jsx(
                  SearchControl,
                  {
                    value: filters.search,
                    placeholder: __("Font name\u2026"),
                    label: __("Search"),
                    onChange: debouncedUpdateSearchInput,
                    hideLabelFromVision: false
                  }
                ),
                /* @__PURE__ */ jsx(
                  SelectControl,
                  {
                    __next40pxDefaultSize: true,
                    label: __("Category"),
                    value: filters.category,
                    onChange: handleCategoryFilter,
                    children: categories && categories.map((category) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: category.slug,
                        children: category.name
                      },
                      category.slug
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
              !!selectedCollection?.font_families?.length && !fonts.length && /* @__PURE__ */ jsx(Text, { children: __(
                "No fonts found. Try with a different search term."
              ) }),
              /* @__PURE__ */ jsx("div", { className: "font-library__fonts-grid__main", children: /* @__PURE__ */ jsx(
                "ul",
                {
                  role: "list",
                  className: "font-library__fonts-list",
                  children: items.map((font) => /* @__PURE__ */ jsx(
                    "li",
                    {
                      className: "font-library__fonts-list-item",
                      children: /* @__PURE__ */ jsx(
                        FontCard,
                        {
                          font: font.font_family_settings,
                          navigatorPath: "/fontFamily",
                          onClick: () => {
                            setSelectedFont(
                              font.font_family_settings
                            );
                          }
                        }
                      )
                    },
                    font.font_family_settings.slug
                  ))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs(Navigator.Screen, { path: "/fontFamily", children: [
              /* @__PURE__ */ jsxs(Flex, { justify: "flex-start", children: [
                /* @__PURE__ */ jsx(
                  Navigator.BackButton,
                  {
                    icon: isRTL() ? chevronRight : chevronLeft,
                    size: "small",
                    onClick: () => {
                      setSelectedFont(null);
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
                    children: selectedFont?.name
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
              /* @__PURE__ */ jsx(Text, { children: __("Select font variants to install.") }),
              /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
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
              /* @__PURE__ */ jsx(VStack, { spacing: 0, children: /* @__PURE__ */ jsx(
                "ul",
                {
                  role: "list",
                  className: "font-library__fonts-list",
                  children: selectedFont && getSortedFontFaces(selectedFont).map(
                    (face, i) => /* @__PURE__ */ jsx(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ jsx(
                          CollectionFontVariant,
                          {
                            font: selectedFont,
                            face,
                            handleToggleVariant,
                            selected: isFontFontFaceInOutline(
                              selectedFont.slug,
                              selectedFont.fontFace ? face : null,
                              // If the font has no fontFace, we want to check if the font is in the outline
                              fontToInstallOutline
                            )
                          }
                        )
                      },
                      `face${i}`
                    )
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(Spacer, { margin: 16 })
            ] })
          ]
        }
      ),
      selectedFont && /* @__PURE__ */ jsx(
        Flex,
        {
          justify: "flex-end",
          className: "font-library__footer",
          children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: handleInstall,
              isBusy: isInstalling,
              disabled: fontsToInstall.length === 0 || isInstalling,
              accessibleWhenDisabled: true,
              children: __("Install")
            }
          )
        }
      ),
      !selectedFont && /* @__PURE__ */ jsxs(
        HStack,
        {
          expanded: false,
          className: "font-library__footer",
          justify: "end",
          spacing: 6,
          children: [
            /* @__PURE__ */ jsx(
              HStack,
              {
                justify: "flex-start",
                expanded: false,
                spacing: 1,
                className: "font-library__page-selection",
                children: createInterpolateElement(
                  sprintf(
                    // translators: 1: Current page number, 2: Total number of pages.
                    _x(
                      "<div>Page</div>%1$s<div>of %2$d</div>",
                      "paging"
                    ),
                    "<CurrentPage />",
                    totalPages
                  ),
                  {
                    div: /* @__PURE__ */ jsx("div", { "aria-hidden": true }),
                    CurrentPage: /* @__PURE__ */ jsx(
                      SelectControl,
                      {
                        "aria-label": __(
                          "Current page"
                        ),
                        value: page.toString(),
                        options: [
                          ...Array(totalPages)
                        ].map((e, i) => {
                          return {
                            label: (i + 1).toString(),
                            value: (i + 1).toString()
                          };
                        }),
                        onChange: (newPage) => setPage(
                          parseInt(newPage)
                        ),
                        size: "small",
                        variant: "minimal"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs(HStack, { expanded: false, spacing: 1, children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => setPage(page - 1),
                  disabled: page === 1,
                  accessibleWhenDisabled: true,
                  label: __("Previous page"),
                  icon: isRTL() ? next : previous,
                  showTooltip: true,
                  size: "compact",
                  tooltipPosition: "top"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => setPage(page + 1),
                  disabled: page === totalPages,
                  accessibleWhenDisabled: true,
                  label: __("Next page"),
                  icon: isRTL() ? previous : next,
                  showTooltip: true,
                  size: "compact",
                  tooltipPosition: "top"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
var font_collection_default = FontCollection;
export {
  font_collection_default as default
};
//# sourceMappingURL=font-collection.mjs.map

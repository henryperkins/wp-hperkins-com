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

// packages/global-styles-ui/src/font-library/font-collection.tsx
var font_collection_exports = {};
__export(font_collection_exports, {
  default: () => font_collection_default
});
module.exports = __toCommonJS(font_collection_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_context = require("./context.cjs");
var import_font_card = __toESM(require("./font-card.cjs"));
var import_filter_fonts = __toESM(require("./utils/filter-fonts.cjs"));
var import_toggleFont = require("./utils/toggleFont.cjs");
var import_fonts_outline = require("./utils/fonts-outline.cjs");
var import_google_fonts_confirm_dialog = __toESM(require("./google-fonts-confirm-dialog.cjs"));
var import_utils = require("./utils/index.cjs");
var import_sort_font_faces = require("./utils/sort-font-faces.cjs");
var import_collection_font_variant = __toESM(require("./collection-font-variant.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_CATEGORY = {
  slug: "all",
  name: (0, import_i18n._x)("All", "font categories")
};
var LOCAL_STORAGE_ITEM = "wp-font-library-google-fonts-permission";
var MIN_WINDOW_HEIGHT = 500;
function FontCollection({ slug }) {
  const requiresPermission = slug === "google-fonts";
  const getGoogleFontsPermissionFromStorage = () => {
    return window.localStorage.getItem(LOCAL_STORAGE_ITEM) === "true";
  };
  const [selectedFont, setSelectedFont] = (0, import_element.useState)(
    null
  );
  const [notice, setNotice] = (0, import_element.useState)(null);
  const [fontsToInstall, setFontsToInstall] = (0, import_element.useState)(
    []
  );
  const [page, setPage] = (0, import_element.useState)(1);
  const [filters, setFilters] = (0, import_element.useState)({});
  const [renderConfirmDialog, setRenderConfirmDialog] = (0, import_element.useState)(
    requiresPermission && !getGoogleFontsPermissionFromStorage()
  );
  const { installFonts, isInstalling } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const { record: selectedCollection, isResolving: isLoading } = (0, import_core_data.useEntityRecord)("root", "fontCollection", slug);
  (0, import_element.useEffect)(() => {
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
  (0, import_element.useEffect)(() => {
    setSelectedFont(null);
  }, [slug]);
  (0, import_element.useEffect)(() => {
    setFontsToInstall([]);
  }, [selectedFont]);
  const collectionFonts = (0, import_element.useMemo)(
    () => selectedCollection?.font_families ?? [],
    [selectedCollection]
  );
  const collectionCategories = selectedCollection?.categories ?? [];
  const categories = [DEFAULT_CATEGORY, ...collectionCategories];
  const fonts = (0, import_element.useMemo)(
    () => (0, import_filter_fonts.default)(collectionFonts, filters),
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
  const debouncedUpdateSearchInput = (0, import_compose.debounce)(handleUpdateSearchInput, 300);
  const handleToggleVariant = (font, face) => {
    const newFontsToInstall = (0, import_toggleFont.toggleFont)(font, face, fontsToInstall);
    setFontsToInstall(newFontsToInstall);
  };
  const fontToInstallOutline = (0, import_fonts_outline.getFontsOutline)(fontsToInstall);
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
              fontFace.file = await (0, import_utils.downloadFontFaceAssets)(
                fontFace.src
              );
            }
          })
        );
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: (0, import_i18n.__)(
          "Error installing the fonts, could not be downloaded."
        )
      });
      return;
    }
    try {
      await installFonts([fontFamily]);
      setNotice({
        type: "success",
        message: (0, import_i18n.__)("Fonts were installed successfully.")
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
    return (0, import_sort_font_faces.sortFontFaces)(fontFamily.fontFace);
  };
  if (renderConfirmDialog) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_google_fonts_confirm_dialog.default, {});
  }
  const ActionsComponent = () => {
    if (slug !== "google-fonts" || renderConfirmDialog || selectedFont) {
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        icon: import_icons.moreVertical,
        label: (0, import_i18n.__)("Actions"),
        popoverProps: {
          position: "bottom left"
        },
        controls: [
          {
            title: (0, import_i18n.__)("Revoke access to Google Fonts"),
            onClick: revokeAccess
          }
        ]
      }
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-library__tabpanel-layout", children: [
    isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ProgressBar, {}) }),
    !isLoading && selectedCollection && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.Navigator,
        {
          initialPath: "/",
          className: "font-library__tabpanel-layout",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Navigator.Screen, { path: "/", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHeading, { level: 2, size: 13, children: selectedCollection.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: selectedCollection.description })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionsComponent, {})
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 4, justify: "space-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.SearchControl,
                  {
                    value: filters.search,
                    placeholder: (0, import_i18n.__)("Font name\u2026"),
                    label: (0, import_i18n.__)("Search"),
                    onChange: debouncedUpdateSearchInput,
                    hideLabelFromVision: false
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.SelectControl,
                  {
                    __next40pxDefaultSize: true,
                    label: (0, import_i18n.__)("Category"),
                    value: filters.category,
                    onChange: handleCategoryFilter,
                    children: categories && categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
              !!selectedCollection?.font_families?.length && !fonts.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)(
                "No fonts found. Try with a different search term."
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__fonts-grid__main", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "ul",
                {
                  role: "list",
                  className: "font-library__fonts-list",
                  children: items.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "li",
                    {
                      className: "font-library__fonts-list-item",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_font_card.default,
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Navigator.Screen, { path: "/fontFamily", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { justify: "flex-start", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Navigator.BackButton,
                  {
                    icon: (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft,
                    size: "small",
                    onClick: () => {
                      setSelectedFont(null);
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
                    children: selectedFont?.name
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Select font variants to install.") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 0, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "ul",
                {
                  role: "list",
                  className: "font-library__fonts-list",
                  children: selectedFont && getSortedFontFaces(selectedFont).map(
                    (face, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "li",
                      {
                        className: "font-library__fonts-list-item",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          import_collection_font_variant.default,
                          {
                            font: selectedFont,
                            face,
                            handleToggleVariant,
                            selected: (0, import_fonts_outline.isFontFontFaceInOutline)(
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 16 })
            ] })
          ]
        }
      ),
      selectedFont && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Flex,
        {
          justify: "flex-end",
          className: "font-library__footer",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: handleInstall,
              isBusy: isInstalling,
              disabled: fontsToInstall.length === 0 || isInstalling,
              accessibleWhenDisabled: true,
              children: (0, import_i18n.__)("Install")
            }
          )
        }
      ),
      !selectedFont && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.__experimentalHStack,
        {
          expanded: false,
          className: "font-library__footer",
          justify: "end",
          spacing: 6,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalHStack,
              {
                justify: "flex-start",
                expanded: false,
                spacing: 1,
                className: "font-library__page-selection",
                children: (0, import_element.createInterpolateElement)(
                  (0, import_i18n.sprintf)(
                    // translators: 1: Current page number, 2: Total number of pages.
                    (0, import_i18n._x)(
                      "<div>Page</div>%1$s<div>of %2$d</div>",
                      "paging"
                    ),
                    "<CurrentPage />",
                    totalPages
                  ),
                  {
                    div: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { "aria-hidden": true }),
                    CurrentPage: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.SelectControl,
                      {
                        "aria-label": (0, import_i18n.__)(
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { expanded: false, spacing: 1, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  onClick: () => setPage(page - 1),
                  disabled: page === 1,
                  accessibleWhenDisabled: true,
                  label: (0, import_i18n.__)("Previous page"),
                  icon: (0, import_i18n.isRTL)() ? import_icons.next : import_icons.previous,
                  showTooltip: true,
                  size: "compact",
                  tooltipPosition: "top"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  onClick: () => setPage(page + 1),
                  disabled: page === totalPages,
                  accessibleWhenDisabled: true,
                  label: (0, import_i18n.__)("Next page"),
                  icon: (0, import_i18n.isRTL)() ? import_icons.previous : import_icons.next,
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
//# sourceMappingURL=font-collection.cjs.map

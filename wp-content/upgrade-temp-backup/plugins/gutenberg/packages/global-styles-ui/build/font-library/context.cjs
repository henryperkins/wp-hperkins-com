"use strict";
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

// packages/global-styles-ui/src/font-library/context.tsx
var context_exports = {};
__export(context_exports, {
  FontLibraryContext: () => FontLibraryContext,
  default: () => context_default
});
module.exports = __toCommonJS(context_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_api = require("./api.cjs");
var import_utils = require("./utils/index.cjs");
var import_set_immutably = require("./utils/set-immutably.cjs");
var import_toggleFont = require("./utils/toggleFont.cjs");
var import_hooks = require("../hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var FontLibraryContext = (0, import_element.createContext)(
  {}
);
FontLibraryContext.displayName = "FontLibraryContext";
function FontLibraryProvider({ children }) {
  const registry = (0, import_data.useRegistry)();
  const { saveEntityRecord, deleteEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { globalStylesId } = (0, import_data.useSelect)((select) => {
    const { __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    return { globalStylesId: __experimentalGetCurrentGlobalStylesId() };
  }, []);
  const globalStyles = (0, import_core_data.useEntityRecord)(
    "root",
    "globalStyles",
    globalStylesId
  );
  const [isInstalling, setIsInstalling] = (0, import_element.useState)(false);
  const { records: libraryPosts = [], isResolving: isResolvingLibrary } = (0, import_core_data.useEntityRecords)(
    "postType",
    "wp_font_family",
    {
      _embed: true
    }
  );
  const libraryFonts = (libraryPosts || []).map((fontFamilyPost) => {
    return {
      id: fontFamilyPost.id,
      ...fontFamilyPost.font_family_settings || {},
      fontFace: fontFamilyPost?._embedded?.font_faces?.map(
        (face) => face.font_face_settings
      ) || []
    };
  }) || [];
  const [fontFamilies, setFontFamilies] = (0, import_hooks.useSetting)("typography.fontFamilies");
  const saveFontFamilies = async (fonts) => {
    if (!globalStyles.record) {
      return;
    }
    const updatedGlobalStyles = globalStyles.record;
    const finalGlobalStyles = (0, import_set_immutably.setImmutably)(
      updatedGlobalStyles ?? {},
      ["settings", "typography", "fontFamilies"],
      fonts
    );
    await saveEntityRecord("root", "globalStyles", finalGlobalStyles);
  };
  const [modalTabOpen, setModalTabOpen] = (0, import_element.useState)("");
  const [libraryFontSelected, setLibraryFontSelected] = (0, import_element.useState)(void 0);
  const themeFonts = fontFamilies?.theme ? fontFamilies.theme.map((f) => (0, import_utils.setUIValuesNeeded)(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const customFonts = fontFamilies?.custom ? fontFamilies.custom.map((f) => (0, import_utils.setUIValuesNeeded)(f, { source: "custom" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const baseCustomFonts = libraryFonts ? libraryFonts.map((f) => (0, import_utils.setUIValuesNeeded)(f, { source: "custom" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  (0, import_element.useEffect)(() => {
    if (!modalTabOpen) {
      setLibraryFontSelected(void 0);
    }
  }, [modalTabOpen]);
  const handleSetLibraryFontSelected = (font) => {
    if (!font) {
      setLibraryFontSelected(void 0);
      return;
    }
    const fonts = font.source === "theme" ? themeFonts : baseCustomFonts;
    const fontSelected = fonts.find((f) => f.slug === font.slug);
    setLibraryFontSelected({
      ...fontSelected || font,
      source: font.source
    });
  };
  const [loadedFontUrls] = (0, import_element.useState)(/* @__PURE__ */ new Set());
  const getAvailableFontsOutline = (availableFontFamilies) => {
    const outline = availableFontFamilies.reduce(
      (acc, font) => {
        const availableFontFaces = font?.fontFace && font.fontFace?.length > 0 ? font?.fontFace.map(
          (face) => `${face.fontStyle ?? ""}${face.fontWeight ?? ""}`
        ) : ["normal400"];
        acc[font.slug] = availableFontFaces;
        return acc;
      },
      {}
    );
    return outline;
  };
  const getActivatedFontsOutline = (source) => {
    switch (source) {
      case "theme":
        return getAvailableFontsOutline(themeFonts);
      case "custom":
      default:
        return getAvailableFontsOutline(customFonts);
    }
  };
  const isFontActivated = (slug, style, weight, source) => {
    if (!style && !weight) {
      return !!getActivatedFontsOutline(source)[slug];
    }
    return !!getActivatedFontsOutline(source)[slug]?.includes(
      (style ?? "") + (weight ?? "")
    );
  };
  const getFontFacesActivated = (slug, source) => {
    return getActivatedFontsOutline(source)[slug] || [];
  };
  async function installFonts(fontFamiliesToInstall) {
    setIsInstalling(true);
    try {
      const fontFamiliesToActivate = [];
      let installationErrors = [];
      for (const fontFamilyToInstall of fontFamiliesToInstall) {
        let isANewFontFamily = false;
        const fontFamilyRecords = await (0, import_data.resolveSelect)(
          import_core_data.store
        ).getEntityRecords(
          "postType",
          "wp_font_family",
          {
            slug: fontFamilyToInstall.slug,
            per_page: 1,
            _embed: true
          }
        );
        const fontFamilyPost = fontFamilyRecords && fontFamilyRecords.length > 0 ? fontFamilyRecords[0] : null;
        let installedFontFamily = fontFamilyPost ? {
          id: fontFamilyPost.id,
          ...fontFamilyPost.font_family_settings,
          fontFace: (fontFamilyPost?._embedded?.font_faces ?? []).map(
            (face) => face.font_face_settings
          ) || []
        } : null;
        if (!installedFontFamily) {
          isANewFontFamily = true;
          installedFontFamily = await (0, import_api.fetchInstallFontFamily)(
            (0, import_utils.makeFontFamilyFormData)(fontFamilyToInstall),
            registry
          );
        }
        const alreadyInstalledFontFaces = installedFontFamily.fontFace && fontFamilyToInstall.fontFace ? installedFontFamily.fontFace.filter(
          (fontFaceToInstall) => fontFaceToInstall && fontFamilyToInstall.fontFace && (0, import_utils.checkFontFaceInstalled)(
            fontFaceToInstall,
            fontFamilyToInstall.fontFace
          )
        ) : [];
        if (installedFontFamily.fontFace && fontFamilyToInstall.fontFace) {
          fontFamilyToInstall.fontFace = fontFamilyToInstall.fontFace.filter(
            (fontFaceToInstall) => !(0, import_utils.checkFontFaceInstalled)(
              fontFaceToInstall,
              installedFontFamily.fontFace
            )
          );
        }
        let successfullyInstalledFontFaces = [];
        let unsuccessfullyInstalledFontFaces = [];
        if (fontFamilyToInstall?.fontFace?.length ?? 0 > 0) {
          const response = await (0, import_utils.batchInstallFontFaces)(
            // @ts-expect-error - Type mismatch: WpFontFamily.id can be number | string, but batchInstallFontFaces expects only string.
            installedFontFamily.id,
            (0, import_utils.makeFontFacesFormData)(
              fontFamilyToInstall
            ),
            registry
          );
          successfullyInstalledFontFaces = response?.successes;
          unsuccessfullyInstalledFontFaces = response?.errors;
        }
        if (successfullyInstalledFontFaces?.length > 0 || alreadyInstalledFontFaces?.length > 0) {
          installedFontFamily.fontFace = [
            ...successfullyInstalledFontFaces
          ];
          fontFamiliesToActivate.push(installedFontFamily);
        }
        if (installedFontFamily && !fontFamilyToInstall?.fontFace?.length) {
          fontFamiliesToActivate.push(installedFontFamily);
        }
        if (isANewFontFamily && (fontFamilyToInstall?.fontFace?.length ?? 0) > 0 && successfullyInstalledFontFaces?.length === 0) {
          await deleteEntityRecord(
            "postType",
            "wp_font_family",
            installedFontFamily.id,
            { force: true }
          );
        }
        installationErrors = installationErrors.concat(
          unsuccessfullyInstalledFontFaces
        );
      }
      const installationErrorMessages = installationErrors.reduce(
        (unique, item) => unique.includes(item.message) ? unique : [...unique, item.message],
        []
      );
      if (fontFamiliesToActivate.length > 0) {
        const activeFonts = activateCustomFontFamilies(
          // @ts-expect-error - Type mismatch: items may have id as number | string, but FontFamily.id should be string | undefined.
          fontFamiliesToActivate
        );
        await saveFontFamilies(activeFonts);
      }
      if (installationErrorMessages.length > 0) {
        const installError = new Error((0, import_i18n.__)("There was an error installing fonts."));
        installError.installationErrors = installationErrorMessages;
        throw installError;
      }
    } finally {
      setIsInstalling(false);
    }
  }
  async function uninstallFontFamily(fontFamilyToUninstall) {
    if (!fontFamilyToUninstall?.id) {
      throw new Error((0, import_i18n.__)("Font family to uninstall is not defined."));
    }
    try {
      await deleteEntityRecord(
        "postType",
        "wp_font_family",
        fontFamilyToUninstall.id,
        { force: true }
      );
      const activeFonts = deactivateFontFamily(fontFamilyToUninstall);
      await saveFontFamilies(activeFonts);
      return { deleted: true };
    } catch (error) {
      console.error(
        `There was an error uninstalling the font family:`,
        error
      );
      throw error;
    }
  }
  const deactivateFontFamily = (font) => {
    const initialCustomFonts = fontFamilies?.[font.source ?? ""] ?? [];
    const newCustomFonts = initialCustomFonts.filter(
      (f) => f.slug !== font.slug
    );
    const activeFonts = {
      ...fontFamilies,
      [font.source ?? ""]: newCustomFonts
    };
    setFontFamilies(activeFonts);
    if (font.fontFace) {
      font.fontFace.forEach((face) => {
        (0, import_utils.unloadFontFaceInBrowser)(face, "all");
      });
    }
    return activeFonts;
  };
  const activateCustomFontFamilies = (fontsToAdd) => {
    const fontsToActivate = cleanFontsForSave(fontsToAdd);
    const activeFonts = {
      ...fontFamilies,
      // Merge the existing custom fonts with the new fonts.
      custom: (0, import_utils.mergeFontFamilies)(fontFamilies?.custom, fontsToActivate)
    };
    setFontFamilies(activeFonts);
    loadFontsInBrowser(fontsToActivate);
    return activeFonts;
  };
  const cleanFontsForSave = (fonts) => {
    return fonts.map(({ id: _familyDbId, fontFace, ...font }) => ({
      ...font,
      ...fontFace && fontFace.length > 0 ? {
        fontFace: fontFace.map(
          ({ id: _faceDbId, ...face }) => face
        )
      } : {}
    }));
  };
  const loadFontsInBrowser = (fonts) => {
    fonts.forEach((font) => {
      if (font.fontFace) {
        font.fontFace.forEach((face) => {
          const displaySrc = (0, import_utils.getDisplaySrcFromFontFace)(
            face?.src ?? ""
          );
          if (displaySrc) {
            (0, import_utils.loadFontFaceInBrowser)(face, displaySrc, "all");
          }
        });
      }
    });
  };
  const toggleActivateFont = (font, face) => {
    const initialFonts = fontFamilies?.[font.source ?? ""] ?? [];
    const newFonts = (0, import_toggleFont.toggleFont)(font, face, initialFonts);
    setFontFamilies({
      ...fontFamilies,
      [font.source ?? ""]: newFonts
    });
    const isFaceActivated = isFontActivated(
      font.slug,
      face?.fontStyle ?? "",
      face?.fontWeight ?? "",
      font.source ?? "custom"
    );
    if (face && isFaceActivated) {
      (0, import_utils.unloadFontFaceInBrowser)(face, "all");
    } else {
      const displaySrc = (0, import_utils.getDisplaySrcFromFontFace)(face?.src ?? "");
      if (face && displaySrc) {
        (0, import_utils.loadFontFaceInBrowser)(face, displaySrc, "all");
      }
    }
  };
  const loadFontFaceAsset = async (fontFace) => {
    if (!fontFace.src) {
      return;
    }
    const src = (0, import_utils.getDisplaySrcFromFontFace)(fontFace.src);
    if (!src || loadedFontUrls.has(src)) {
      return;
    }
    (0, import_utils.loadFontFaceInBrowser)(fontFace, src, "document");
    loadedFontUrls.add(src);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    FontLibraryContext.Provider,
    {
      value: {
        libraryFontSelected,
        handleSetLibraryFontSelected,
        fontFamilies: fontFamilies ?? {},
        baseCustomFonts,
        isFontActivated,
        getFontFacesActivated,
        loadFontFaceAsset,
        installFonts,
        uninstallFontFamily,
        toggleActivateFont,
        getAvailableFontsOutline,
        modalTabOpen,
        setModalTabOpen,
        saveFontFamilies,
        isResolvingLibrary,
        isInstalling
      },
      children
    }
  );
}
var context_default = FontLibraryProvider;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FontLibraryContext
});
//# sourceMappingURL=context.cjs.map

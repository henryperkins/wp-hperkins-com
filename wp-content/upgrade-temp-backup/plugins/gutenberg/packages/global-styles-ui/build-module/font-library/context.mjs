// packages/global-styles-ui/src/font-library/context.tsx
import { createContext, useState, useEffect } from "@wordpress/element";
import {
  useSelect,
  useDispatch,
  resolveSelect,
  useRegistry
} from "@wordpress/data";
import {
  useEntityRecord,
  useEntityRecords,
  store as coreStore
} from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { fetchInstallFontFamily } from "./api.mjs";
import {
  setUIValuesNeeded,
  mergeFontFamilies,
  loadFontFaceInBrowser,
  unloadFontFaceInBrowser,
  getDisplaySrcFromFontFace,
  makeFontFacesFormData,
  makeFontFamilyFormData,
  batchInstallFontFaces,
  checkFontFaceInstalled
} from "./utils/index.mjs";
import { setImmutably } from "./utils/set-immutably.mjs";
import { toggleFont } from "./utils/toggleFont.mjs";
import { useSetting } from "../hooks.mjs";
import { jsx } from "react/jsx-runtime";
var FontLibraryContext = createContext(
  {}
);
FontLibraryContext.displayName = "FontLibraryContext";
function FontLibraryProvider({ children }) {
  const registry = useRegistry();
  const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
  const { globalStylesId } = useSelect((select) => {
    const { __experimentalGetCurrentGlobalStylesId } = select(coreStore);
    return { globalStylesId: __experimentalGetCurrentGlobalStylesId() };
  }, []);
  const globalStyles = useEntityRecord(
    "root",
    "globalStyles",
    globalStylesId
  );
  const [isInstalling, setIsInstalling] = useState(false);
  const { records: libraryPosts = [], isResolving: isResolvingLibrary } = useEntityRecords(
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
  const [fontFamilies, setFontFamilies] = useSetting("typography.fontFamilies");
  const saveFontFamilies = async (fonts) => {
    if (!globalStyles.record) {
      return;
    }
    const updatedGlobalStyles = globalStyles.record;
    const finalGlobalStyles = setImmutably(
      updatedGlobalStyles ?? {},
      ["settings", "typography", "fontFamilies"],
      fonts
    );
    await saveEntityRecord("root", "globalStyles", finalGlobalStyles);
  };
  const [modalTabOpen, setModalTabOpen] = useState("");
  const [libraryFontSelected, setLibraryFontSelected] = useState(void 0);
  const themeFonts = fontFamilies?.theme ? fontFamilies.theme.map((f) => setUIValuesNeeded(f, { source: "theme" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const customFonts = fontFamilies?.custom ? fontFamilies.custom.map((f) => setUIValuesNeeded(f, { source: "custom" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const baseCustomFonts = libraryFonts ? libraryFonts.map((f) => setUIValuesNeeded(f, { source: "custom" })).sort((a, b) => a.name.localeCompare(b.name)) : [];
  useEffect(() => {
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
  const [loadedFontUrls] = useState(/* @__PURE__ */ new Set());
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
        const fontFamilyRecords = await resolveSelect(
          coreStore
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
          installedFontFamily = await fetchInstallFontFamily(
            makeFontFamilyFormData(fontFamilyToInstall),
            registry
          );
        }
        const alreadyInstalledFontFaces = installedFontFamily.fontFace && fontFamilyToInstall.fontFace ? installedFontFamily.fontFace.filter(
          (fontFaceToInstall) => fontFaceToInstall && fontFamilyToInstall.fontFace && checkFontFaceInstalled(
            fontFaceToInstall,
            fontFamilyToInstall.fontFace
          )
        ) : [];
        if (installedFontFamily.fontFace && fontFamilyToInstall.fontFace) {
          fontFamilyToInstall.fontFace = fontFamilyToInstall.fontFace.filter(
            (fontFaceToInstall) => !checkFontFaceInstalled(
              fontFaceToInstall,
              installedFontFamily.fontFace
            )
          );
        }
        let successfullyInstalledFontFaces = [];
        let unsuccessfullyInstalledFontFaces = [];
        if (fontFamilyToInstall?.fontFace?.length ?? 0 > 0) {
          const response = await batchInstallFontFaces(
            // @ts-expect-error - Type mismatch: WpFontFamily.id can be number | string, but batchInstallFontFaces expects only string.
            installedFontFamily.id,
            makeFontFacesFormData(
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
        const installError = new Error(__("There was an error installing fonts."));
        installError.installationErrors = installationErrorMessages;
        throw installError;
      }
    } finally {
      setIsInstalling(false);
    }
  }
  async function uninstallFontFamily(fontFamilyToUninstall) {
    if (!fontFamilyToUninstall?.id) {
      throw new Error(__("Font family to uninstall is not defined."));
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
        unloadFontFaceInBrowser(face, "all");
      });
    }
    return activeFonts;
  };
  const activateCustomFontFamilies = (fontsToAdd) => {
    const fontsToActivate = cleanFontsForSave(fontsToAdd);
    const activeFonts = {
      ...fontFamilies,
      // Merge the existing custom fonts with the new fonts.
      custom: mergeFontFamilies(fontFamilies?.custom, fontsToActivate)
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
          const displaySrc = getDisplaySrcFromFontFace(
            face?.src ?? ""
          );
          if (displaySrc) {
            loadFontFaceInBrowser(face, displaySrc, "all");
          }
        });
      }
    });
  };
  const toggleActivateFont = (font, face) => {
    const initialFonts = fontFamilies?.[font.source ?? ""] ?? [];
    const newFonts = toggleFont(font, face, initialFonts);
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
      unloadFontFaceInBrowser(face, "all");
    } else {
      const displaySrc = getDisplaySrcFromFontFace(face?.src ?? "");
      if (face && displaySrc) {
        loadFontFaceInBrowser(face, displaySrc, "all");
      }
    }
  };
  const loadFontFaceAsset = async (fontFace) => {
    if (!fontFace.src) {
      return;
    }
    const src = getDisplaySrcFromFontFace(fontFace.src);
    if (!src || loadedFontUrls.has(src)) {
      return;
    }
    loadFontFaceInBrowser(fontFace, src, "document");
    loadedFontUrls.add(src);
  };
  return /* @__PURE__ */ jsx(
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
export {
  FontLibraryContext,
  context_default as default
};
//# sourceMappingURL=context.mjs.map

// packages/global-styles-ui/src/font-library/upload-fonts.tsx
import { __ } from "@wordpress/i18n";
import {
  __experimentalText as Text,
  __experimentalVStack as VStack,
  Button,
  DropZone,
  Notice,
  FormFileUpload,
  FlexItem,
  ProgressBar
} from "@wordpress/components";
import { useContext, useState } from "@wordpress/element";
import { ALLOWED_FILE_EXTENSIONS } from "./utils/constants.mjs";
import { FontLibraryContext } from "./context.mjs";
import { Font } from "./lib/lib-font.browser.mjs";
import makeFamiliesFromFaces from "./utils/make-families-from-faces.mjs";
import { loadFontFaceInBrowser } from "./utils/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function UploadFonts() {
  const { installFonts } = useContext(FontLibraryContext);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState(null);
  const handleDropZone = (files) => {
    handleFilesUpload(files);
  };
  const onFilesUpload = (event) => {
    handleFilesUpload(event.target.files);
  };
  const handleFilesUpload = async (files) => {
    if (!files) {
      return;
    }
    setNotice(null);
    setIsUploading(true);
    const uniqueFilenames = /* @__PURE__ */ new Set();
    const selectedFiles = [...files];
    let hasInvalidFiles = false;
    const checkFilesPromises = selectedFiles.map(async (file) => {
      const isFont = await isFontFile(file);
      if (!isFont) {
        hasInvalidFiles = true;
        return null;
      }
      if (uniqueFilenames.has(file.name)) {
        return null;
      }
      const fileExtension = (((file.name ?? "").split(".") ?? []).pop() ?? "").toLowerCase();
      if (ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
        uniqueFilenames.add(file.name);
        return file;
      }
      return null;
    });
    const allowedFiles = (await Promise.all(checkFilesPromises)).filter((file) => null !== file);
    if (allowedFiles.length > 0) {
      loadFiles(allowedFiles);
    } else {
      const message = hasInvalidFiles ? __("Sorry, you are not allowed to upload this file type.") : __("No fonts found to install.");
      setNotice({
        type: "error",
        message
      });
      setIsUploading(false);
    }
  };
  const loadFiles = async (files) => {
    const fontFacesLoaded = await Promise.all(
      files.map(async (fontFile) => {
        const fontFaceData = await getFontFaceMetadata(fontFile);
        await loadFontFaceInBrowser(
          fontFaceData,
          fontFaceData.file,
          "all"
        );
        return fontFaceData;
      })
    );
    handleInstall(fontFacesLoaded);
  };
  async function isFontFile(file) {
    const font = new Font("Uploaded Font");
    try {
      const buffer = await readFileAsArrayBuffer(file);
      await font.fromDataBuffer(buffer, "font");
      return true;
    } catch (error) {
      return false;
    }
  }
  async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }
  const getFontFaceMetadata = async (fontFile) => {
    const buffer = await readFileAsArrayBuffer(fontFile);
    const fontObj = new Font("Uploaded Font");
    fontObj.fromDataBuffer(buffer, fontFile.name);
    const onloadEvent = await new Promise(
      (resolve) => fontObj.onload = resolve
    );
    const font = onloadEvent.detail.font;
    const { name } = font.opentype.tables;
    const fontName = name.get(16) || name.get(1);
    const isItalic = name.get(2).toLowerCase().includes("italic");
    const fontWeight = font.opentype.tables["OS/2"].usWeightClass || "normal";
    const isVariable = !!font.opentype.tables.fvar;
    const weightAxis = isVariable && font.opentype.tables.fvar.axes.find(
      ({ tag }) => tag === "wght"
    );
    const weightRange = weightAxis ? `${weightAxis.minValue} ${weightAxis.maxValue}` : null;
    return {
      file: fontFile,
      fontFamily: fontName,
      fontStyle: isItalic ? "italic" : "normal",
      fontWeight: weightRange || fontWeight
    };
  };
  const handleInstall = async (fontFaces) => {
    const fontFamilies = makeFamiliesFromFaces(fontFaces);
    try {
      await installFonts(fontFamilies);
      setNotice({
        type: "success",
        message: __("Fonts were installed successfully.")
      });
    } catch (error) {
      const typedError = error;
      setNotice({
        type: "error",
        message: typedError.message,
        errors: typedError?.installationErrors
      });
    }
    setIsUploading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "font-library__tabpanel-layout", children: [
    /* @__PURE__ */ jsx(DropZone, { onFilesDrop: handleDropZone }),
    /* @__PURE__ */ jsxs(VStack, { className: "font-library__local-fonts", justify: "start", children: [
      notice && /* @__PURE__ */ jsxs(
        Notice,
        {
          status: notice.type,
          __unstableHTML: true,
          onRemove: () => setNotice(null),
          children: [
            notice.message,
            notice.errors && /* @__PURE__ */ jsx("ul", { children: notice.errors.map((error, index) => /* @__PURE__ */ jsx("li", { children: error }, index)) })
          ]
        }
      ),
      isUploading && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx("div", { className: "font-library__upload-area", children: /* @__PURE__ */ jsx(ProgressBar, {}) }) }),
      !isUploading && /* @__PURE__ */ jsx(
        FormFileUpload,
        {
          accept: ALLOWED_FILE_EXTENSIONS.map(
            (ext) => `.${ext}`
          ).join(","),
          multiple: true,
          onChange: onFilesUpload,
          render: ({ openFileDialog }) => /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              className: "font-library__upload-area",
              onClick: openFileDialog,
              children: __("Upload font")
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(Text, { className: "font-library__upload-area__text", children: __(
        "Uploaded fonts appear in your library and can be used in your theme. Supported formats: .ttf, .otf, .woff, and .woff2."
      ) })
    ] })
  ] });
}
var upload_fonts_default = UploadFonts;
export {
  upload_fonts_default as default
};
//# sourceMappingURL=upload-fonts.mjs.map

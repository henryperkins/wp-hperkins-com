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

// packages/global-styles-ui/src/font-library/upload-fonts.tsx
var upload_fonts_exports = {};
__export(upload_fonts_exports, {
  default: () => upload_fonts_default
});
module.exports = __toCommonJS(upload_fonts_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_constants = require("./utils/constants.cjs");
var import_context = require("./context.cjs");
var import_lib_font = require("./lib/lib-font.browser.cjs");
var import_make_families_from_faces = __toESM(require("./utils/make-families-from-faces.cjs"));
var import_utils = require("./utils/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function UploadFonts() {
  const { installFonts } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const [isUploading, setIsUploading] = (0, import_element.useState)(false);
  const [notice, setNotice] = (0, import_element.useState)(null);
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
      if (import_constants.ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
        uniqueFilenames.add(file.name);
        return file;
      }
      return null;
    });
    const allowedFiles = (await Promise.all(checkFilesPromises)).filter((file) => null !== file);
    if (allowedFiles.length > 0) {
      loadFiles(allowedFiles);
    } else {
      const message = hasInvalidFiles ? (0, import_i18n.__)("Sorry, you are not allowed to upload this file type.") : (0, import_i18n.__)("No fonts found to install.");
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
        await (0, import_utils.loadFontFaceInBrowser)(
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
    const font = new import_lib_font.Font("Uploaded Font");
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
    const fontObj = new import_lib_font.Font("Uploaded Font");
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
    const fontFamilies = (0, import_make_families_from_faces.default)(fontFaces);
    try {
      await installFonts(fontFamilies);
      setNotice({
        type: "success",
        message: (0, import_i18n.__)("Fonts were installed successfully.")
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-library__tabpanel-layout", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.DropZone, { onFilesDrop: handleDropZone }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { className: "font-library__local-fonts", justify: "start", children: [
      notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.Notice,
        {
          status: notice.type,
          __unstableHTML: true,
          onRemove: () => setNotice(null),
          children: [
            notice.message,
            notice.errors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: notice.errors.map((error, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: error }, index)) })
          ]
        }
      ),
      isUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__upload-area", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ProgressBar, {}) }) }),
      !isUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.FormFileUpload,
        {
          accept: import_constants.ALLOWED_FILE_EXTENSIONS.map(
            (ext) => `.${ext}`
          ).join(","),
          multiple: true,
          onChange: onFilesUpload,
          render: ({ openFileDialog }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              className: "font-library__upload-area",
              onClick: openFileDialog,
              children: (0, import_i18n.__)("Upload font")
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "font-library__upload-area__text", children: (0, import_i18n.__)(
        "Uploaded fonts appear in your library and can be used in your theme. Supported formats: .ttf, .otf, .woff, and .woff2."
      ) })
    ] })
  ] });
}
var upload_fonts_default = UploadFonts;
//# sourceMappingURL=upload-fonts.cjs.map

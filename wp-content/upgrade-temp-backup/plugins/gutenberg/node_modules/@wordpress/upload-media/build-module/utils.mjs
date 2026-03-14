// packages/upload-media/src/utils.ts
import { getFilename } from "@wordpress/url";
import { _x } from "@wordpress/i18n";
function convertBlobToFile(fileOrBlob) {
  if (fileOrBlob instanceof File) {
    return fileOrBlob;
  }
  if ("name" in fileOrBlob && typeof fileOrBlob.name === "string") {
    return new File([fileOrBlob], fileOrBlob.name, {
      type: fileOrBlob.type,
      lastModified: fileOrBlob.lastModified
    });
  }
  const ext = fileOrBlob.type.split("/")[1];
  const mediaType = "application/pdf" === fileOrBlob.type ? "document" : fileOrBlob.type.split("/")[0];
  return new File([fileOrBlob], `${mediaType}.${ext}`, {
    type: fileOrBlob.type
  });
}
function renameFile(file, name) {
  return new File([file], name, {
    type: file.type,
    lastModified: file.lastModified
  });
}
function cloneFile(file) {
  return renameFile(file, file.name);
}
function getFileExtension(file) {
  return file.includes(".") ? file.split(".").pop() || null : null;
}
function getFileBasename(name) {
  return name.includes(".") ? name.split(".").slice(0, -1).join(".") : name;
}
function getFileNameFromUrl(url) {
  return getFilename(url) || _x("unnamed", "file name");
}
export {
  cloneFile,
  convertBlobToFile,
  getFileBasename,
  getFileExtension,
  getFileNameFromUrl,
  renameFile
};
//# sourceMappingURL=utils.mjs.map

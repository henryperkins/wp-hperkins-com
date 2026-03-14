// packages/upload-media/src/upload-error.ts
var UploadError = class extends Error {
  code;
  file;
  constructor({ code, message, file, cause }) {
    super(message, { cause });
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.file = file;
  }
};
export {
  UploadError
};
//# sourceMappingURL=upload-error.mjs.map

// packages/upload-media/src/image-file.ts
var ImageFile = class extends File {
  width = 0;
  height = 0;
  originalWidth = 0;
  originalHeight = 0;
  get wasResized() {
    return (this.originalWidth || 0) > this.width || (this.originalHeight || 0) > this.height;
  }
  constructor(file, width, height, originalWidth, originalHeight) {
    super([file], file.name, {
      type: file.type,
      lastModified: file.lastModified
    });
    this.width = width;
    this.height = height;
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;
  }
};
export {
  ImageFile
};
//# sourceMappingURL=image-file.mjs.map

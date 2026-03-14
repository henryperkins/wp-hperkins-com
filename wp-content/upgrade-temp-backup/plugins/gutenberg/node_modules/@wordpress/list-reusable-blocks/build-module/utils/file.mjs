// packages/list-reusable-blocks/src/utils/file.js
function readTextFile(file) {
  const reader = new window.FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsText(file);
  });
}
export {
  readTextFile
};
//# sourceMappingURL=file.mjs.map

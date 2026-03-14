// packages/block-library/src/navigation-link/shared/select-label-text.js
function selectLabelText(ref) {
  ref.current.focus();
  const { ownerDocument } = ref.current;
  const { defaultView } = ownerDocument;
  const selection = defaultView.getSelection();
  const range = ownerDocument.createRange();
  range.selectNodeContents(ref.current);
  selection.removeAllRanges();
  selection.addRange(range);
}
export {
  selectLabelText
};
//# sourceMappingURL=select-label-text.mjs.map

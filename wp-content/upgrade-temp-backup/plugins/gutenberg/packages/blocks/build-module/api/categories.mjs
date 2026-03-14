// packages/blocks/src/api/categories.js
import { dispatch, select } from "@wordpress/data";
import { store as blocksStore } from "../store/index.mjs";
function getCategories() {
  return select(blocksStore).getCategories();
}
function setCategories(categories) {
  dispatch(blocksStore).setCategories(categories);
}
function updateCategory(slug, category) {
  dispatch(blocksStore).updateCategory(slug, category);
}
export {
  getCategories,
  setCategories,
  updateCategory
};
//# sourceMappingURL=categories.mjs.map

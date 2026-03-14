// packages/editor/src/components/post-author/constants.js
var BASE_QUERY = {
  _fields: "id,name",
  context: "view"
  // Allows non-admins to perform requests.
};
var AUTHORS_QUERY = {
  who: "authors",
  per_page: 100,
  ...BASE_QUERY
};
export {
  AUTHORS_QUERY,
  BASE_QUERY
};
//# sourceMappingURL=constants.mjs.map

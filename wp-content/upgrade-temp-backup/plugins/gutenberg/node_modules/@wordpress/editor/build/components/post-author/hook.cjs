"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-author/hook.js
var hook_exports = {};
__export(hook_exports, {
  useAuthorsQuery: () => useAuthorsQuery
});
module.exports = __toCommonJS(hook_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_constants = require("./constants.cjs");
function useAuthorsQuery(search) {
  const { authorId, authors, postAuthor, isLoading } = (0, import_data.useSelect)(
    (select) => {
      const { getUser, getUsers, isResolving } = select(import_core_data.store);
      const { getEditedPostAttribute } = select(import_store.store);
      const _authorId = getEditedPostAttribute("author");
      const query = { ...import_constants.AUTHORS_QUERY };
      if (search) {
        query.search = search;
        query.search_columns = ["name"];
      }
      return {
        authorId: _authorId,
        authors: getUsers(query),
        postAuthor: getUser(_authorId, import_constants.BASE_QUERY),
        isLoading: isResolving("getUsers", [query])
      };
    },
    [search]
  );
  const authorOptions = (0, import_element.useMemo)(() => {
    const fetchedAuthors = (authors ?? []).map((author) => {
      return {
        value: author.id,
        label: (0, import_html_entities.decodeEntities)(author.name)
      };
    });
    const foundAuthor = fetchedAuthors.findIndex(
      ({ value }) => postAuthor?.id === value
    );
    let currentAuthor = [];
    if (foundAuthor < 0 && postAuthor) {
      currentAuthor = [
        {
          value: postAuthor.id,
          label: (0, import_html_entities.decodeEntities)(postAuthor.name)
        }
      ];
    } else if (foundAuthor < 0 && !postAuthor) {
      currentAuthor = [
        {
          value: 0,
          label: (0, import_i18n.__)("(No author)")
        }
      ];
    }
    return [...currentAuthor, ...fetchedAuthors];
  }, [authors, postAuthor]);
  return { authorId, authorOptions, postAuthor, isLoading };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAuthorsQuery
});
//# sourceMappingURL=hook.cjs.map

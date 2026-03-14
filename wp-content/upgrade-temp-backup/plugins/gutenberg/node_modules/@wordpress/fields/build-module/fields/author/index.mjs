// packages/fields/src/fields/author/index.tsx
import { __ } from "@wordpress/i18n";
import { resolveSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import AuthorView from "./author-view.mjs";
var authorField = {
  label: __("Author"),
  id: "author",
  type: "integer",
  getElements: async () => {
    const authors = await resolveSelect(coreDataStore).getEntityRecords(
      "root",
      "user",
      {
        per_page: -1,
        who: "authors",
        _fields: "id,name",
        context: "view"
      }
    ) ?? [];
    return authors.map(({ id, name }) => ({
      value: id,
      label: name
    }));
  },
  setValue: ({ value }) => ({ author: Number(value) }),
  render: AuthorView,
  sort: (a, b, direction) => {
    const nameA = a._embedded?.author?.[0]?.name || "";
    const nameB = b._embedded?.author?.[0]?.name || "";
    return direction === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  },
  filterBy: {
    operators: ["isAny", "isNone"]
  }
};
var author_default = authorField;
export {
  author_default as default
};
//# sourceMappingURL=index.mjs.map

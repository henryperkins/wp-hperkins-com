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

// packages/editor/src/utils/terms.js
var terms_exports = {};
__export(terms_exports, {
  buildTermsTree: () => buildTermsTree,
  unescapeString: () => unescapeString,
  unescapeTerm: () => unescapeTerm,
  unescapeTerms: () => unescapeTerms
});
module.exports = __toCommonJS(terms_exports);
var import_html_entities = require("@wordpress/html-entities");
function buildTermsTree(flatTerms) {
  const flatTermsWithParentAndChildren = flatTerms.map((term) => {
    return {
      children: [],
      parent: void 0,
      ...term
    };
  });
  if (flatTermsWithParentAndChildren.some(
    ({ parent }) => parent === void 0
  )) {
    return flatTermsWithParentAndChildren;
  }
  const termsByParent = flatTermsWithParentAndChildren.reduce(
    (acc, term) => {
      const { parent } = term;
      if (!acc[parent]) {
        acc[parent] = [];
      }
      acc[parent].push(term);
      return acc;
    },
    {}
  );
  const fillWithChildren = (terms) => {
    return terms.map((term) => {
      const children = termsByParent[term.id];
      return {
        ...term,
        children: children && children.length ? fillWithChildren(children) : []
      };
    });
  };
  return fillWithChildren(termsByParent["0"] || []);
}
var unescapeString = (arg) => {
  return (0, import_html_entities.decodeEntities)(arg);
};
var unescapeTerm = (term) => {
  return {
    ...term,
    name: unescapeString(term.name)
  };
};
var unescapeTerms = (terms) => {
  return (terms ?? []).map(unescapeTerm);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildTermsTree,
  unescapeString,
  unescapeTerm,
  unescapeTerms
});
//# sourceMappingURL=terms.cjs.map

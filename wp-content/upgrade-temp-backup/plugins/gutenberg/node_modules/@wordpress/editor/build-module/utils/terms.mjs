// packages/editor/src/utils/terms.js
import { decodeEntities } from "@wordpress/html-entities";
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
  return decodeEntities(arg);
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
export {
  buildTermsTree,
  unescapeString,
  unescapeTerm,
  unescapeTerms
};
//# sourceMappingURL=terms.mjs.map

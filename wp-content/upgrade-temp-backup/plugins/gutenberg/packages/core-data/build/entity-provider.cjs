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

// packages/core-data/src/entity-provider.js
var entity_provider_exports = {};
__export(entity_provider_exports, {
  default: () => EntityProvider
});
module.exports = __toCommonJS(entity_provider_exports);
var import_element = require("@wordpress/element");
var import_entity_context = require("./entity-context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function EntityProvider({
  kind,
  type: name,
  id,
  revisionId,
  children
}) {
  const parent = (0, import_element.useContext)(import_entity_context.EntityContext);
  const childContext = (0, import_element.useMemo)(
    () => ({
      ...parent,
      ...kind && {
        [kind]: {
          ...parent?.[kind],
          [name]: id
        }
      },
      ...revisionId !== void 0 && { revisionId }
    }),
    [parent, kind, name, id, revisionId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_entity_context.EntityContext.Provider, { value: childContext, children });
}
//# sourceMappingURL=entity-provider.cjs.map

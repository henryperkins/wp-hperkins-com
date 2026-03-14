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

// packages/abilities/src/index.ts
var index_exports = {};
__export(index_exports, {
  executeAbility: () => import_api.executeAbility,
  getAbilities: () => import_api.getAbilities,
  getAbility: () => import_api.getAbility,
  getAbilityCategories: () => import_api.getAbilityCategories,
  getAbilityCategory: () => import_api.getAbilityCategory,
  registerAbility: () => import_api.registerAbility,
  registerAbilityCategory: () => import_api.registerAbilityCategory,
  store: () => import_store.store,
  unregisterAbility: () => import_api.unregisterAbility,
  unregisterAbilityCategory: () => import_api.unregisterAbilityCategory,
  validateValueFromSchema: () => import_validation.validateValueFromSchema
});
module.exports = __toCommonJS(index_exports);
var import_api = require("./api.cjs");
var import_store = require("./store/index.cjs");
var import_validation = require("./validation.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  executeAbility,
  getAbilities,
  getAbility,
  getAbilityCategories,
  getAbilityCategory,
  registerAbility,
  registerAbilityCategory,
  store,
  unregisterAbility,
  unregisterAbilityCategory,
  validateValueFromSchema
});
//# sourceMappingURL=index.cjs.map

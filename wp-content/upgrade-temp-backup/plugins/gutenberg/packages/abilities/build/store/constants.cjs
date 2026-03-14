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

// packages/abilities/src/store/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ABILITY_NAME_PATTERN: () => ABILITY_NAME_PATTERN,
  CATEGORY_SLUG_PATTERN: () => CATEGORY_SLUG_PATTERN,
  REGISTER_ABILITY: () => REGISTER_ABILITY,
  REGISTER_ABILITY_CATEGORY: () => REGISTER_ABILITY_CATEGORY,
  STORE_NAME: () => STORE_NAME,
  UNREGISTER_ABILITY: () => UNREGISTER_ABILITY,
  UNREGISTER_ABILITY_CATEGORY: () => UNREGISTER_ABILITY_CATEGORY
});
module.exports = __toCommonJS(constants_exports);
var STORE_NAME = "core/abilities";
var ABILITY_NAME_PATTERN = /^[a-z0-9-]+(?:\/[a-z0-9-]+){1,3}$/;
var CATEGORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var REGISTER_ABILITY = "REGISTER_ABILITY";
var UNREGISTER_ABILITY = "UNREGISTER_ABILITY";
var REGISTER_ABILITY_CATEGORY = "REGISTER_ABILITY_CATEGORY";
var UNREGISTER_ABILITY_CATEGORY = "UNREGISTER_ABILITY_CATEGORY";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ABILITY_NAME_PATTERN,
  CATEGORY_SLUG_PATTERN,
  REGISTER_ABILITY,
  REGISTER_ABILITY_CATEGORY,
  STORE_NAME,
  UNREGISTER_ABILITY,
  UNREGISTER_ABILITY_CATEGORY
});
//# sourceMappingURL=constants.cjs.map

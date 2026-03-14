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

// packages/editor/src/components/post-fields/index.ts
var post_fields_exports = {};
__export(post_fields_exports, {
  default: () => post_fields_default
});
module.exports = __toCommonJS(post_fields_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
function usePostFields({
  postType
}) {
  const { registerPostTypeSchema } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  (0, import_element.useEffect)(() => {
    registerPostTypeSchema(postType);
  }, [registerPostTypeSchema, postType]);
  const { fields } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityFields } = (0, import_lock_unlock.unlock)(select(import_store.store));
      return {
        fields: getEntityFields("postType", postType)
      };
    },
    [postType]
  );
  return fields;
}
var post_fields_default = usePostFields;
//# sourceMappingURL=index.cjs.map

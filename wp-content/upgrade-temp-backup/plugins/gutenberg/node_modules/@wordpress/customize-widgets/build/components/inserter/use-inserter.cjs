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

// packages/customize-widgets/src/components/inserter/use-inserter.js
var use_inserter_exports = {};
__export(use_inserter_exports, {
  default: () => useInserter
});
module.exports = __toCommonJS(use_inserter_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
function useInserter(inserter) {
  const isInserterOpened = (0, import_data.useSelect)(
    (select) => select(import_store.store).isInserterOpened(),
    []
  );
  const { setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (isInserterOpened) {
      inserter.open();
    } else {
      inserter.close();
    }
  }, [inserter, isInserterOpened]);
  return [
    isInserterOpened,
    (0, import_element.useCallback)(
      (updater) => {
        let isOpen = updater;
        if (typeof updater === "function") {
          isOpen = updater(
            (0, import_data.select)(import_store.store).isInserterOpened()
          );
        }
        setIsInserterOpened(isOpen);
      },
      [setIsInserterOpened]
    )
  ];
}
//# sourceMappingURL=use-inserter.cjs.map

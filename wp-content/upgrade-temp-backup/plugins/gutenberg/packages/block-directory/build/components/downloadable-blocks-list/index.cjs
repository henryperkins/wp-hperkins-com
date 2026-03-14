var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-directory/src/components/downloadable-blocks-list/index.js
var downloadable_blocks_list_exports = {};
__export(downloadable_blocks_list_exports, {
  default: () => downloadable_blocks_list_default
});
module.exports = __toCommonJS(downloadable_blocks_list_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_downloadable_block_list_item = __toESM(require("../downloadable-block-list-item/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function DownloadableBlocksList({ items, onHover = noop, onSelect }) {
  const { installBlockType } = (0, import_data.useDispatch)(import_store.store);
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Composite,
    {
      role: "listbox",
      className: "block-directory-downloadable-blocks-list",
      "aria-label": (0, import_i18n.__)("Blocks available for install"),
      children: items.map((item) => {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_downloadable_block_list_item.default,
          {
            onClick: () => {
              if ((0, import_blocks.getBlockType)(item.name)) {
                onSelect(item);
              } else {
                installBlockType(item).then((success) => {
                  if (success) {
                    onSelect(item);
                  }
                });
              }
              onHover(null);
            },
            onHover,
            item
          },
          item.id
        );
      })
    }
  );
}
var downloadable_blocks_list_default = DownloadableBlocksList;
//# sourceMappingURL=index.cjs.map

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

// packages/customize-widgets/src/controls/sidebar-control.js
var sidebar_control_exports = {};
__export(sidebar_control_exports, {
  default: () => getSidebarControl
});
module.exports = __toCommonJS(sidebar_control_exports);
var import_data = require("@wordpress/data");
var import_sidebar_adapter = __toESM(require("../components/sidebar-block-editor/sidebar-adapter.cjs"));
var import_inserter_outer_section = __toESM(require("./inserter-outer-section.cjs"));
var import_store = require("../store/index.cjs");
var getInserterId = (controlId) => `widgets-inserter-${controlId}`;
function getSidebarControl() {
  const {
    wp: { customize }
  } = window;
  return class SidebarControl extends customize.Control {
    constructor(...args) {
      super(...args);
      this.subscribers = /* @__PURE__ */ new Set();
    }
    ready() {
      const InserterOuterSection = (0, import_inserter_outer_section.default)();
      this.inserter = new InserterOuterSection(
        getInserterId(this.id),
        {}
      );
      customize.section.add(this.inserter);
      this.sectionInstance = customize.section(this.section());
      this.inspector = this.sectionInstance.inspector;
      this.sidebarAdapter = new import_sidebar_adapter.default(this.setting, customize);
    }
    subscribe(callback) {
      this.subscribers.add(callback);
      return () => {
        this.subscribers.delete(callback);
      };
    }
    onChangeSectionExpanded(expanded, args) {
      if (!args.unchanged) {
        if (!expanded) {
          (0, import_data.dispatch)(import_store.store).setIsInserterOpened(
            false
          );
        }
        this.subscribers.forEach(
          (subscriber) => subscriber(expanded, args)
        );
      }
    }
  };
}
//# sourceMappingURL=sidebar-control.cjs.map

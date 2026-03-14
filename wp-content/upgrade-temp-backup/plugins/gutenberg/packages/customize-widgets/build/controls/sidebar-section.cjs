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

// packages/customize-widgets/src/controls/sidebar-section.js
var sidebar_section_exports = {};
__export(sidebar_section_exports, {
  default: () => getSidebarSection
});
module.exports = __toCommonJS(sidebar_section_exports);
var import_i18n = require("@wordpress/i18n");
var import_inspector_section = __toESM(require("./inspector-section.cjs"));
var getInspectorSectionId = (sidebarId) => `widgets-inspector-${sidebarId}`;
function getSidebarSection() {
  const {
    wp: { customize }
  } = window;
  const reduceMotionMediaQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let isReducedMotion = reduceMotionMediaQuery.matches;
  reduceMotionMediaQuery.addEventListener("change", (event) => {
    isReducedMotion = event.matches;
  });
  return class SidebarSection extends customize.Section {
    ready() {
      const InspectorSection = (0, import_inspector_section.default)();
      this.inspector = new InspectorSection(
        getInspectorSectionId(this.id),
        {
          title: (0, import_i18n.__)("Block Settings"),
          parentSection: this,
          customizeAction: [
            (0, import_i18n.__)("Customizing"),
            (0, import_i18n.__)("Widgets"),
            this.params.title
          ].join(" \u25B8 ")
        }
      );
      customize.section.add(this.inspector);
      this.contentContainer[0].classList.add(
        "customize-widgets__sidebar-section"
      );
    }
    hasSubSectionOpened() {
      return this.inspector.expanded();
    }
    onChangeExpanded(expanded, _args) {
      const controls = this.controls();
      const args = {
        ..._args,
        completeCallback() {
          controls.forEach((control) => {
            control.onChangeSectionExpanded?.(expanded, args);
          });
          _args.completeCallback?.();
        }
      };
      if (args.manualTransition) {
        if (expanded) {
          this.contentContainer.addClass(["busy", "open"]);
          this.contentContainer.removeClass("is-sub-section-open");
          this.contentContainer.closest(".wp-full-overlay").addClass("section-open");
        } else {
          this.contentContainer.addClass([
            "busy",
            "is-sub-section-open"
          ]);
          this.contentContainer.closest(".wp-full-overlay").addClass("section-open");
          this.contentContainer.removeClass("open");
        }
        const handleTransitionEnd = () => {
          this.contentContainer.removeClass("busy");
          args.completeCallback();
        };
        if (isReducedMotion) {
          handleTransitionEnd();
        } else {
          this.contentContainer.one(
            "transitionend",
            handleTransitionEnd
          );
        }
      } else {
        super.onChangeExpanded(expanded, args);
      }
    }
  };
}
//# sourceMappingURL=sidebar-section.cjs.map

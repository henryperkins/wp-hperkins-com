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

// packages/widgets/src/blocks/legacy-widget/edit/form.js
var form_exports = {};
__export(form_exports, {
  default: () => Form
});
module.exports = __toCommonJS(form_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_control = __toESM(require("./control.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Form({
  title,
  isVisible,
  id,
  idBase,
  instance,
  isWide,
  onChangeInstance,
  onChangeHasPreview
}) {
  const ref = (0, import_element.useRef)();
  const isMediumLargeViewport = (0, import_compose.useViewportMatch)("small");
  const outgoingInstances = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const incomingInstances = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  (0, import_element.useEffect)(() => {
    if (incomingInstances.current.has(instance)) {
      incomingInstances.current.delete(instance);
      return;
    }
    const control = new import_control.default({
      id,
      idBase,
      instance,
      onChangeInstance(nextInstance) {
        outgoingInstances.current.add(instance);
        incomingInstances.current.add(nextInstance);
        onChangeInstance(nextInstance);
      },
      onChangeHasPreview,
      onError(error) {
        window.console.error(error);
        createNotice(
          "error",
          (0, import_i18n.sprintf)(
            /* translators: %s: the name of the affected block. */
            (0, import_i18n.__)(
              'The "%s" block was affected by errors and may not function properly. Check the developer tools for more details.'
            ),
            idBase || id
          )
        );
      }
    });
    ref.current.appendChild(control.element);
    return () => {
      if (outgoingInstances.current.has(instance)) {
        outgoingInstances.current.delete(instance);
        return;
      }
      control.destroy();
    };
  }, [
    id,
    idBase,
    instance,
    onChangeInstance,
    onChangeHasPreview,
    isMediumLargeViewport
  ]);
  if (isWide && isMediumLargeViewport) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: (0, import_clsx.default)({
          "wp-block-legacy-widget__container": isVisible
        }),
        children: [
          isVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "wp-block-legacy-widget__edit-form-title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Popover,
            {
              focusOnMount: false,
              placement: "right",
              offset: 32,
              resize: false,
              flip: false,
              shift: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "div",
                {
                  ref,
                  className: "wp-block-legacy-widget__edit-form",
                  hidden: !isVisible
                }
              )
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref,
      className: "wp-block-legacy-widget__edit-form",
      hidden: !isVisible,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "wp-block-legacy-widget__edit-form-title", children: title })
    }
  );
}
//# sourceMappingURL=form.cjs.map

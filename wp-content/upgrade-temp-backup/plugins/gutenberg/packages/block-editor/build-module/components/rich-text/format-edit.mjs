// packages/block-editor/src/components/rich-text/format-edit.js
import { getActiveFormat, getActiveObject } from "@wordpress/rich-text";
import { useContext, useMemo } from "@wordpress/element";
import BlockContext from "../block-context/index.mjs";
import { jsx } from "react/jsx-runtime";
import { createElement } from "react";
var DEFAULT_BLOCK_CONTEXT = {};
var usesContextKey = /* @__PURE__ */ Symbol("usesContext");
function Edit({
  onChange,
  onFocus,
  value,
  forwardedRef,
  settings,
  isVisible
}) {
  const {
    name,
    edit: EditFunction,
    [usesContextKey]: usesContext
  } = settings;
  const blockContext = useContext(BlockContext);
  const context = useMemo(() => {
    return usesContext ? Object.fromEntries(
      Object.entries(blockContext).filter(
        ([key]) => usesContext.includes(key)
      )
    ) : DEFAULT_BLOCK_CONTEXT;
  }, [usesContext, blockContext]);
  if (!EditFunction) {
    return null;
  }
  const activeFormat = getActiveFormat(value, name);
  const isActive = activeFormat !== void 0;
  const activeObject = getActiveObject(value);
  const isObjectActive = activeObject !== void 0 && activeObject.type === name;
  return /* @__PURE__ */ jsx(
    EditFunction,
    {
      isActive,
      isVisible,
      activeAttributes: isActive ? activeFormat.attributes || {} : {},
      isObjectActive,
      activeObjectAttributes: isObjectActive ? activeObject.attributes || {} : {},
      value,
      onChange,
      onFocus,
      contentRef: forwardedRef,
      context
    },
    name
  );
}
function FormatEdit({ formatTypes, ...props }) {
  return formatTypes.map((settings) => /* @__PURE__ */ createElement(Edit, { settings, ...props, key: settings.name }));
}
export {
  FormatEdit as default,
  usesContextKey
};
//# sourceMappingURL=format-edit.mjs.map

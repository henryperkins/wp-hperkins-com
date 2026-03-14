// packages/block-editor/src/components/block-bindings/source-fields-list.js
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import { getBlockBindingsSource } from "@wordpress/blocks";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useContext, useMemo } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import useBlockBindingsUtils from "./use-block-bindings-utils.mjs";
import { unlock } from "../../lock-unlock.mjs";
import BlockContext from "../block-context/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
function BlockBindingsSourceFieldsListItem({
  args,
  attribute,
  field,
  source,
  sourceKey
}) {
  const itemBindings = useMemo(
    () => ({
      source: sourceKey,
      args: field.args || {
        key: field.key
      }
    }),
    [field.args, field.key, sourceKey]
  );
  const blockContext = useContext(BlockContext);
  const values = useSelect(
    (select) => source.getValues({
      select,
      context: blockContext,
      bindings: {
        [attribute]: itemBindings
      }
    }),
    [attribute, blockContext, itemBindings, source]
  );
  const { updateBlockBindings } = useBlockBindingsUtils();
  return /* @__PURE__ */ jsxs(
    Menu.CheckboxItem,
    {
      onChange: () => {
        const isCurrentlySelected = fastDeepEqual(args, field.args) ?? // Deprecate key dependency in 7.0.
        field.key === args?.key;
        if (isCurrentlySelected) {
          updateBlockBindings({
            [attribute]: void 0
          });
        } else {
          updateBlockBindings({
            [attribute]: itemBindings
          });
        }
      },
      name: attribute + "-binding",
      value: values[attribute],
      checked: fastDeepEqual(args, field.args) ?? // Deprecate key dependency in 7.0.
      field.key === args?.key,
      children: [
        /* @__PURE__ */ jsx(Menu.ItemLabel, { children: field.label }),
        /* @__PURE__ */ jsx(Menu.ItemHelpText, { children: values[attribute] })
      ]
    }
  );
}
function BlockBindingsSourceFieldsList({
  args,
  attribute,
  sourceKey,
  fields
}) {
  const isMobile = useViewportMatch("medium", "<");
  if (!fields || fields.length === 0) {
    return null;
  }
  const source = getBlockBindingsSource(sourceKey);
  return /* @__PURE__ */ jsxs(
    Menu,
    {
      placement: isMobile ? "bottom-start" : "left-start",
      children: [
        /* @__PURE__ */ jsx(Menu.SubmenuTriggerItem, { children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: source.label }) }),
        /* @__PURE__ */ jsx(Menu.Popover, { gutter: 8, children: /* @__PURE__ */ jsx(Menu.Group, { children: fields.map((field) => /* @__PURE__ */ jsx(
          BlockBindingsSourceFieldsListItem,
          {
            args,
            attribute,
            field,
            source,
            sourceKey
          },
          sourceKey + JSON.stringify(field.args) || field.key
        )) }) })
      ]
    },
    sourceKey
  );
}
export {
  BlockBindingsSourceFieldsList as default
};
//# sourceMappingURL=source-fields-list.mjs.map

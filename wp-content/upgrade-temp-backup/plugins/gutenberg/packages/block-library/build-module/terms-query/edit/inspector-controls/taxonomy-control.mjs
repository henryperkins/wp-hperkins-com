// packages/block-library/src/terms-query/edit/inspector-controls/taxonomy-control.js
import { SelectControl } from "@wordpress/components";
import { usePublicTaxonomies } from "../../utils.mjs";
import { jsx } from "react/jsx-runtime";
function TaxonomyControl({ value, onChange, ...props }) {
  const taxonomies = usePublicTaxonomies();
  const taxonomyOptions = taxonomies.map((taxonomy) => ({
    label: taxonomy.name,
    value: taxonomy.slug
  }));
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      options: taxonomyOptions,
      value,
      onChange,
      ...props
    }
  );
}
export {
  TaxonomyControl as default
};
//# sourceMappingURL=taxonomy-control.mjs.map

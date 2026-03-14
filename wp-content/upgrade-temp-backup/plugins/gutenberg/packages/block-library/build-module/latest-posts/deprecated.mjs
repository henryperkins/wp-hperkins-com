// packages/block-library/src/latest-posts/deprecated.js
import metadata from "./block.json";
var { attributes } = metadata;
var deprecated_default = [
  {
    attributes: {
      ...attributes,
      categories: {
        type: "string"
      }
    },
    supports: {
      align: true,
      html: false
    },
    migrate: (oldAttributes) => {
      return {
        ...oldAttributes,
        categories: [{ id: Number(oldAttributes.categories) }]
      };
    },
    isEligible: ({ categories }) => categories && "string" === typeof categories,
    save: () => null
  }
];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map

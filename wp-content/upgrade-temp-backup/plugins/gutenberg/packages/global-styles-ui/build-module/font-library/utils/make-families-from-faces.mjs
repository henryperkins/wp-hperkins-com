// packages/global-styles-ui/src/font-library/utils/make-families-from-faces.ts
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { unlock } from "../../lock-unlock.mjs";
var { kebabCase } = unlock(componentsPrivateApis);
function makeFamiliesFromFaces(fontFaces) {
  const fontFamiliesObject = fontFaces.reduce(
    (acc, item) => {
      if (!acc[item.fontFamily]) {
        acc[item.fontFamily] = {
          name: item.fontFamily,
          fontFamily: item.fontFamily,
          slug: kebabCase(item.fontFamily.toLowerCase()),
          fontFace: []
        };
      }
      acc[item.fontFamily].fontFace.push(item);
      return acc;
    },
    {}
  );
  return Object.values(fontFamiliesObject);
}
export {
  makeFamiliesFromFaces as default
};
//# sourceMappingURL=make-families-from-faces.mjs.map

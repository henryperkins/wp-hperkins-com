// packages/block-editor/src/components/gradients/use-gradient.js
import { useCallback, useMemo } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { useBlockEditContext } from "../block-edit/index.mjs";
import { useSettings } from "../use-settings/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
function __experimentalGetGradientClass(gradientSlug) {
  if (!gradientSlug) {
    return void 0;
  }
  return `has-${gradientSlug}-gradient-background`;
}
function getGradientValueBySlug(gradients, slug) {
  const gradient = gradients?.find((g) => g.slug === slug);
  return gradient && gradient.gradient;
}
function __experimentalGetGradientObjectByGradientValue(gradients, value) {
  const gradient = gradients?.find((g) => g.gradient === value);
  return gradient;
}
function getGradientSlugByValue(gradients, value) {
  const gradient = __experimentalGetGradientObjectByGradientValue(
    gradients,
    value
  );
  return gradient && gradient.slug;
}
function __experimentalUseGradient({
  gradientAttribute = "gradient",
  customGradientAttribute = "customGradient"
} = {}) {
  const { clientId } = useBlockEditContext();
  const [
    userGradientPalette,
    themeGradientPalette,
    defaultGradientPalette
  ] = useSettings(
    "color.gradients.custom",
    "color.gradients.theme",
    "color.gradients.default"
  );
  const allGradients = useMemo(
    () => [
      ...userGradientPalette || [],
      ...themeGradientPalette || [],
      ...defaultGradientPalette || []
    ],
    [userGradientPalette, themeGradientPalette, defaultGradientPalette]
  );
  const { gradient, customGradient } = useSelect(
    (select) => {
      const { getBlockAttributes } = select(blockEditorStore);
      const attributes = getBlockAttributes(clientId) || {};
      return {
        customGradient: attributes[customGradientAttribute],
        gradient: attributes[gradientAttribute]
      };
    },
    [clientId, gradientAttribute, customGradientAttribute]
  );
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const setGradient = useCallback(
    (newGradientValue) => {
      const slug = getGradientSlugByValue(
        allGradients,
        newGradientValue
      );
      if (slug) {
        updateBlockAttributes(clientId, {
          [gradientAttribute]: slug,
          [customGradientAttribute]: void 0
        });
        return;
      }
      updateBlockAttributes(clientId, {
        [gradientAttribute]: void 0,
        [customGradientAttribute]: newGradientValue
      });
    },
    [allGradients, clientId, updateBlockAttributes]
  );
  const gradientClass = __experimentalGetGradientClass(gradient);
  let gradientValue;
  if (gradient) {
    gradientValue = getGradientValueBySlug(allGradients, gradient);
  } else {
    gradientValue = customGradient;
  }
  return { gradientClass, gradientValue, setGradient };
}
export {
  __experimentalGetGradientClass,
  __experimentalGetGradientObjectByGradientValue,
  __experimentalUseGradient,
  getGradientSlugByValue,
  getGradientValueBySlug
};
//# sourceMappingURL=use-gradient.mjs.map

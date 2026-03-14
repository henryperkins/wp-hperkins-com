// packages/block-editor/src/components/colors/with-colors.js
import { useMemo, Component } from "@wordpress/element";
import { compose, createHigherOrderComponent } from "@wordpress/compose";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import {
  getColorClassName,
  getColorObjectByColorValue,
  getColorObjectByAttributeValues,
  getMostReadableColor
} from "./utils.mjs";
import { useSettings } from "../use-settings/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { kebabCase } = unlock(componentsPrivateApis);
var upperFirst = ([firstLetter, ...rest]) => firstLetter.toUpperCase() + rest.join("");
var withCustomColorPalette = (colorsArray) => createHigherOrderComponent(
  (WrappedComponent) => function WithCustomColorPalette(props) {
    return /* @__PURE__ */ jsx(WrappedComponent, { ...props, colors: colorsArray });
  },
  "withCustomColorPalette"
);
var withEditorColorPalette = () => createHigherOrderComponent(
  (WrappedComponent) => function WithEditorColorPalette(props) {
    const [userPalette, themePalette, defaultPalette] = useSettings(
      "color.palette.custom",
      "color.palette.theme",
      "color.palette.default"
    );
    const allColors = useMemo(
      () => [
        ...userPalette || [],
        ...themePalette || [],
        ...defaultPalette || []
      ],
      [userPalette, themePalette, defaultPalette]
    );
    return /* @__PURE__ */ jsx(WrappedComponent, { ...props, colors: allColors });
  },
  "withEditorColorPalette"
);
function createColorHOC(colorTypes, withColorPalette) {
  const colorMap = colorTypes.reduce((colorObject, colorType) => {
    return {
      ...colorObject,
      ...typeof colorType === "string" ? { [colorType]: kebabCase(colorType) } : colorType
    };
  }, {});
  return compose([
    withColorPalette,
    (WrappedComponent) => {
      return class WithColors extends Component {
        constructor(props) {
          super(props);
          this.setters = this.createSetters();
          this.colorUtils = {
            getMostReadableColor: this.getMostReadableColor.bind(this)
          };
          this.state = {};
        }
        getMostReadableColor(colorValue) {
          const { colors } = this.props;
          return getMostReadableColor(colors, colorValue);
        }
        createSetters() {
          return Object.keys(colorMap).reduce(
            (settersAccumulator, colorAttributeName) => {
              const upperFirstColorAttributeName = upperFirst(colorAttributeName);
              const customColorAttributeName = `custom${upperFirstColorAttributeName}`;
              settersAccumulator[`set${upperFirstColorAttributeName}`] = this.createSetColor(
                colorAttributeName,
                customColorAttributeName
              );
              return settersAccumulator;
            },
            {}
          );
        }
        createSetColor(colorAttributeName, customColorAttributeName) {
          return (colorValue) => {
            const colorObject = getColorObjectByColorValue(
              this.props.colors,
              colorValue
            );
            this.props.setAttributes({
              [colorAttributeName]: colorObject && colorObject.slug ? colorObject.slug : void 0,
              [customColorAttributeName]: colorObject && colorObject.slug ? void 0 : colorValue
            });
          };
        }
        static getDerivedStateFromProps({ attributes, colors }, previousState) {
          return Object.entries(colorMap).reduce(
            (newState, [colorAttributeName, colorContext]) => {
              const colorObject = getColorObjectByAttributeValues(
                colors,
                attributes[colorAttributeName],
                attributes[`custom${upperFirst(
                  colorAttributeName
                )}`]
              );
              const previousColorObject = previousState[colorAttributeName];
              const previousColor = previousColorObject?.color;
              if (previousColor === colorObject.color && previousColorObject) {
                newState[colorAttributeName] = previousColorObject;
              } else {
                newState[colorAttributeName] = {
                  ...colorObject,
                  class: getColorClassName(
                    colorContext,
                    colorObject.slug
                  )
                };
              }
              return newState;
            },
            {}
          );
        }
        render() {
          return /* @__PURE__ */ jsx(
            WrappedComponent,
            {
              ...{
                ...this.props,
                colors: void 0,
                ...this.state,
                ...this.setters,
                colorUtils: this.colorUtils
              }
            }
          );
        }
      };
    }
  ]);
}
function createCustomColorsHOC(colorsArray) {
  return (...colorTypes) => {
    const withColorPalette = withCustomColorPalette(colorsArray);
    return createHigherOrderComponent(
      createColorHOC(colorTypes, withColorPalette),
      "withCustomColors"
    );
  };
}
function withColors(...colorTypes) {
  const withColorPalette = withEditorColorPalette();
  return createHigherOrderComponent(
    createColorHOC(colorTypes, withColorPalette),
    "withColors"
  );
}
export {
  createCustomColorsHOC,
  withColors as default
};
//# sourceMappingURL=with-colors.mjs.map

// packages/react-i18n/src/index.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "@wordpress/element";
import { defaultI18n } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function makeContextValue(i18n) {
  return {
    __: i18n.__.bind(i18n),
    _x: i18n._x.bind(i18n),
    _n: i18n._n.bind(i18n),
    _nx: i18n._nx.bind(i18n),
    isRTL: i18n.isRTL.bind(i18n),
    hasTranslation: i18n.hasTranslation.bind(i18n)
  };
}
var I18nContext = createContext(makeContextValue(defaultI18n));
I18nContext.displayName = "I18nContext";
function I18nProvider(props) {
  const { children, i18n = defaultI18n } = props;
  const [update, forceUpdate] = useReducer(() => [], []);
  useEffect(() => i18n.subscribe(forceUpdate), [i18n]);
  const value = useMemo(() => makeContextValue(i18n), [i18n, update]);
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
var useI18n = () => useContext(I18nContext);
function withI18n(InnerComponent) {
  const EnhancedComponent = (props) => {
    const i18nProps = useI18n();
    return /* @__PURE__ */ jsx(InnerComponent, { ...props, ...i18nProps });
  };
  const innerComponentName = InnerComponent.displayName || InnerComponent.name || "Component";
  EnhancedComponent.displayName = `WithI18n(${innerComponentName})`;
  return EnhancedComponent;
}
export {
  I18nProvider,
  useI18n,
  withI18n
};
//# sourceMappingURL=index.mjs.map

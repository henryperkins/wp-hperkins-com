// packages/plugins/src/components/plugin-context/index.tsx
import { createContext, useContext } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";
import deprecated from "@wordpress/deprecated";
import { jsx } from "react/jsx-runtime";
var Context = createContext({
  name: null,
  icon: null
});
Context.displayName = "PluginContext";
var PluginContextProvider = Context.Provider;
function usePluginContext() {
  return useContext(Context);
}
var withPluginContext = (mapContextToProps) => createHigherOrderComponent((OriginalComponent) => {
  deprecated("wp.plugins.withPluginContext", {
    since: "6.8.0",
    alternative: "wp.plugins.usePluginContext"
  });
  return (props) => /* @__PURE__ */ jsx(Context.Consumer, { children: (context) => /* @__PURE__ */ jsx(
    OriginalComponent,
    {
      ...props,
      ...mapContextToProps(context, props)
    }
  ) });
}, "withPluginContext");
export {
  PluginContextProvider,
  usePluginContext,
  withPluginContext
};
//# sourceMappingURL=index.mjs.map

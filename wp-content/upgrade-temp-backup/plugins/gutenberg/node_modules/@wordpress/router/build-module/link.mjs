// packages/router/src/link.tsx
import { useContext, useMemo } from "@wordpress/element";
import { getQueryArgs, getPath, buildQueryString } from "@wordpress/url";
import { ConfigContext, useHistory } from "./router.mjs";
import { jsx } from "react/jsx-runtime";
function useLink(to, options = {}) {
  const history = useHistory();
  const { pathArg, beforeNavigate } = useContext(ConfigContext);
  function onClick(event) {
    event?.preventDefault();
    history.navigate(to, options);
  }
  const query = getQueryArgs(to);
  const path = getPath("http://domain.com/" + to) ?? "";
  const link = useMemo(() => {
    return beforeNavigate ? beforeNavigate({ path, query }) : { path, query };
  }, [path, query, beforeNavigate]);
  const [before] = window.location.href.split("?");
  return {
    href: `${before}?${buildQueryString({
      [pathArg]: link.path,
      ...link.query
    })}`,
    onClick
  };
}
function Link({
  to,
  options,
  children,
  ...props
}) {
  const { href, onClick } = useLink(to, options);
  return /* @__PURE__ */ jsx("a", { href, onClick, ...props, children });
}
export {
  Link,
  useLink
};
//# sourceMappingURL=link.mjs.map

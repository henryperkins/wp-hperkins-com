// packages/server-side-render/src/index.js
import { ServerSideRenderWithPostId } from "./server-side-render.mjs";
import { useServerSideRender } from "./hook.mjs";
var ServerSideRenderCompat = ServerSideRenderWithPostId;
ServerSideRenderCompat.ServerSideRender = ServerSideRenderWithPostId;
ServerSideRenderCompat.useServerSideRender = useServerSideRender;
var index_default = ServerSideRenderCompat;
export {
  ServerSideRenderWithPostId as ServerSideRender,
  index_default as default,
  useServerSideRender
};
//# sourceMappingURL=index.mjs.map

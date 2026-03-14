// packages/boot/src/components/canvas/index.tsx
import { useState, useEffect } from "@wordpress/element";
import { Spinner } from "@wordpress/components";
import { useNavigate } from "@wordpress/route";
import BootBackButton from "./back-button.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Canvas({ canvas }) {
  const [Editor, setEditor] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    import("@wordpress/lazy-editor").then((module) => {
      setEditor(() => module.Editor);
    }).catch((error) => {
      console.error("Failed to load lazy editor:", error);
    });
  }, []);
  if (!Editor) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "2rem"
        },
        children: /* @__PURE__ */ jsx(Spinner, {})
      }
    );
  }
  const backButton = !canvas.isPreview ? ({ length }) => /* @__PURE__ */ jsx(BootBackButton, { length }) : void 0;
  return /* @__PURE__ */ jsxs("div", { style: { height: "100%", position: "relative" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: { height: "100%" },
        inert: canvas.isPreview ? "true" : void 0,
        children: /* @__PURE__ */ jsx(
          Editor,
          {
            postType: canvas.postType,
            postId: canvas.postId,
            settings: {
              isPreviewMode: canvas.isPreview,
              styles: canvas.isPreview ? [{ css: "body{min-height:100vh;}" }] : []
            },
            backButton
          }
        )
      }
    ),
    canvas.isPreview && canvas.editLink && /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => navigate({ to: canvas.editLink }),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate({ to: canvas.editLink });
          }
        },
        style: {
          position: "absolute",
          inset: 0,
          cursor: "pointer",
          zIndex: 1
        },
        role: "button",
        tabIndex: 0,
        "aria-label": "Click to edit"
      }
    )
  ] });
}
export {
  Canvas as default
};
//# sourceMappingURL=index.mjs.map

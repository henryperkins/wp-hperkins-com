// packages/widgets/src/blocks/legacy-widget/edit/form.js
import clsx from "clsx";
import { useRef, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { __, sprintf } from "@wordpress/i18n";
import { Popover } from "@wordpress/components";
import { useViewportMatch } from "@wordpress/compose";
import Control from "./control.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Form({
  title,
  isVisible,
  id,
  idBase,
  instance,
  isWide,
  onChangeInstance,
  onChangeHasPreview
}) {
  const ref = useRef();
  const isMediumLargeViewport = useViewportMatch("small");
  const outgoingInstances = useRef(/* @__PURE__ */ new Set());
  const incomingInstances = useRef(/* @__PURE__ */ new Set());
  const { createNotice } = useDispatch(noticesStore);
  useEffect(() => {
    if (incomingInstances.current.has(instance)) {
      incomingInstances.current.delete(instance);
      return;
    }
    const control = new Control({
      id,
      idBase,
      instance,
      onChangeInstance(nextInstance) {
        outgoingInstances.current.add(instance);
        incomingInstances.current.add(nextInstance);
        onChangeInstance(nextInstance);
      },
      onChangeHasPreview,
      onError(error) {
        window.console.error(error);
        createNotice(
          "error",
          sprintf(
            /* translators: %s: the name of the affected block. */
            __(
              'The "%s" block was affected by errors and may not function properly. Check the developer tools for more details.'
            ),
            idBase || id
          )
        );
      }
    });
    ref.current.appendChild(control.element);
    return () => {
      if (outgoingInstances.current.has(instance)) {
        outgoingInstances.current.delete(instance);
        return;
      }
      control.destroy();
    };
  }, [
    id,
    idBase,
    instance,
    onChangeInstance,
    onChangeHasPreview,
    isMediumLargeViewport
  ]);
  if (isWide && isMediumLargeViewport) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx({
          "wp-block-legacy-widget__container": isVisible
        }),
        children: [
          isVisible && /* @__PURE__ */ jsx("h3", { className: "wp-block-legacy-widget__edit-form-title", children: title }),
          /* @__PURE__ */ jsx(
            Popover,
            {
              focusOnMount: false,
              placement: "right",
              offset: 32,
              resize: false,
              flip: false,
              shift: true,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  ref,
                  className: "wp-block-legacy-widget__edit-form",
                  hidden: !isVisible
                }
              )
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: "wp-block-legacy-widget__edit-form",
      hidden: !isVisible,
      children: /* @__PURE__ */ jsx("h3", { className: "wp-block-legacy-widget__edit-form-title", children: title })
    }
  );
}
export {
  Form as default
};
//# sourceMappingURL=form.mjs.map

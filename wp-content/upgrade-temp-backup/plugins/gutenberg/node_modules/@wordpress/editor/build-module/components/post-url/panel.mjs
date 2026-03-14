// packages/editor/src/components/post-url/panel.js
import { useMemo, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { Dropdown, Button, ExternalLink } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { safeDecodeURIComponent } from "@wordpress/url";
import { store as coreStore } from "@wordpress/core-data";
import PostURLCheck from "./check.mjs";
import PostURL from "./index.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PostURLPanel() {
  const { isFrontPage } = useSelect((select) => {
    const { getCurrentPostId } = select(editorStore);
    const { getEditedEntityRecord, canUser } = select(coreStore);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    const _id = getCurrentPostId();
    return {
      isFrontPage: siteSettings?.page_on_front === _id
    };
  }, []);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverProps = useMemo(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  const label = isFrontPage ? __("Link") : __("Slug");
  return /* @__PURE__ */ jsx(PostURLCheck, { children: /* @__PURE__ */ jsxs(PostPanelRow, { label, ref: setPopoverAnchor, children: [
    !isFrontPage && /* @__PURE__ */ jsx(
      Dropdown,
      {
        popoverProps,
        className: "editor-post-url__panel-dropdown",
        contentClassName: "editor-post-url__panel-dialog",
        focusOnMount: true,
        renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
          PostURLToggle,
          {
            isOpen,
            onClick: onToggle
          }
        ),
        renderContent: ({ onClose }) => /* @__PURE__ */ jsx(PostURL, { onClose })
      }
    ),
    isFrontPage && /* @__PURE__ */ jsx(FrontPageLink, {})
  ] }) });
}
function PostURLToggle({ isOpen, onClick }) {
  const { slug } = useSelect((select) => {
    return {
      slug: select(editorStore).getEditedPostSlug()
    };
  }, []);
  const decodedSlug = safeDecodeURIComponent(slug);
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      className: "editor-post-url__panel-toggle",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Current post link.
        sprintf(__("Change link: %s"), decodedSlug)
      ),
      onClick,
      children: /* @__PURE__ */ jsx(Fragment, { children: decodedSlug })
    }
  );
}
function FrontPageLink() {
  const { postLink } = useSelect((select) => {
    const { getCurrentPost } = select(editorStore);
    return {
      postLink: getCurrentPost()?.link
    };
  }, []);
  return /* @__PURE__ */ jsx(
    ExternalLink,
    {
      className: "editor-post-url__front-page-link",
      href: postLink,
      target: "_blank",
      children: postLink
    }
  );
}
export {
  PostURLPanel as default
};
//# sourceMappingURL=panel.mjs.map

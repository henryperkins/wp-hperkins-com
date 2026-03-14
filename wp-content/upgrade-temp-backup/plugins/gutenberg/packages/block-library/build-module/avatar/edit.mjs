// packages/block-library/src/avatar/edit.js
import clsx from "clsx";
import {
  InspectorControls,
  useBlockProps,
  __experimentalUseBorderProps as useBorderProps
} from "@wordpress/block-editor";
import {
  RangeControl,
  ResizableBox,
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __, isRTL } from "@wordpress/i18n";
import { addQueryArgs, removeQueryArgs } from "@wordpress/url";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { useCommentAvatar, useUserAvatar } from "./hooks.mjs";
import UserControl from "./user-control.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var AvatarInspectorControls = ({
  setAttributes,
  avatar,
  attributes,
  selectUser
}) => {
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  return /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          size: 96,
          isLink: false,
          linkTarget: "_self",
          userId: void 0
        });
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Image size"),
            isShownByDefault: true,
            hasValue: () => attributes?.size !== 96,
            onDeselect: () => setAttributes({ size: 96 }),
            children: /* @__PURE__ */ jsx(
              RangeControl,
              {
                __next40pxDefaultSize: true,
                label: __("Image size"),
                onChange: (newSize) => setAttributes({
                  size: newSize
                }),
                min: avatar.minSize,
                max: avatar.maxSize,
                initialPosition: attributes?.size,
                value: attributes?.size
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Link to user profile"),
            isShownByDefault: true,
            hasValue: () => attributes?.isLink,
            onDeselect: () => setAttributes({ isLink: false }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Link to user profile"),
                onChange: () => setAttributes({ isLink: !attributes.isLink }),
                checked: attributes.isLink
              }
            )
          }
        ),
        attributes.isLink && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Open in new tab"),
            isShownByDefault: true,
            hasValue: () => attributes?.linkTarget !== "_self",
            onDeselect: () => setAttributes({ linkTarget: "_self" }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Open in new tab"),
                onChange: (value) => setAttributes({
                  linkTarget: value ? "_blank" : "_self"
                }),
                checked: attributes.linkTarget === "_blank"
              }
            )
          }
        ),
        selectUser && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("User"),
            isShownByDefault: true,
            hasValue: () => !!attributes?.userId,
            onDeselect: () => setAttributes({ userId: void 0 }),
            children: /* @__PURE__ */ jsx(
              UserControl,
              {
                value: attributes?.userId,
                onChange: (value) => {
                  setAttributes({
                    userId: value
                  });
                }
              }
            )
          }
        )
      ]
    }
  ) });
};
var AvatarLinkWrapper = ({ children, isLink }) => isLink ? /* @__PURE__ */ jsx(
  "a",
  {
    href: "#avatar-pseudo-link",
    className: "wp-block-avatar__link",
    onClick: (event) => event.preventDefault(),
    children
  }
) : children;
var ResizableAvatar = ({
  setAttributes,
  attributes,
  avatar,
  blockProps,
  isSelected
}) => {
  const borderProps = useBorderProps(attributes);
  const doubledSizedSrc = addQueryArgs(
    removeQueryArgs(avatar?.src, ["s"]),
    {
      s: attributes?.size * 2
    }
  );
  return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(AvatarLinkWrapper, { isLink: attributes.isLink, children: /* @__PURE__ */ jsx(
    ResizableBox,
    {
      size: {
        width: attributes.size,
        height: attributes.size
      },
      showHandle: isSelected,
      onResizeStop: (event, direction, elt, delta) => {
        setAttributes({
          size: parseInt(
            attributes.size + (delta.height || delta.width),
            10
          )
        });
      },
      lockAspectRatio: true,
      enable: {
        top: false,
        right: !isRTL(),
        bottom: true,
        left: isRTL()
      },
      minWidth: avatar.minSize,
      maxWidth: avatar.maxSize,
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src: doubledSizedSrc,
          alt: avatar.alt,
          className: clsx(
            "avatar",
            "avatar-" + attributes.size,
            "photo",
            "wp-block-avatar__image",
            borderProps.className
          ),
          style: borderProps.style
        }
      )
    }
  ) }) });
};
var CommentEdit = ({ attributes, context, setAttributes, isSelected }) => {
  const { commentId } = context;
  const blockProps = useBlockProps();
  const avatar = useCommentAvatar({ commentId });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      AvatarInspectorControls,
      {
        avatar,
        setAttributes,
        attributes,
        selectUser: false
      }
    ),
    /* @__PURE__ */ jsx(
      ResizableAvatar,
      {
        attributes,
        avatar,
        blockProps,
        isSelected,
        setAttributes
      }
    )
  ] });
};
var UserEdit = ({ attributes, context, setAttributes, isSelected }) => {
  const { postId, postType } = context;
  const avatar = useUserAvatar({
    userId: attributes?.userId,
    postId,
    postType
  });
  const blockProps = useBlockProps();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      AvatarInspectorControls,
      {
        selectUser: true,
        attributes,
        avatar,
        setAttributes
      }
    ),
    /* @__PURE__ */ jsx(
      ResizableAvatar,
      {
        attributes,
        avatar,
        blockProps,
        isSelected,
        setAttributes
      }
    )
  ] });
};
function Edit(props) {
  if (props?.context?.commentId || props?.context?.commentId === null) {
    return /* @__PURE__ */ jsx(CommentEdit, { ...props });
  }
  return /* @__PURE__ */ jsx(UserEdit, { ...props });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map

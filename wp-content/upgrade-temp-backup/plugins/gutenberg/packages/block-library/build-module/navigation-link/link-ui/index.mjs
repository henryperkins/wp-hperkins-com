// packages/block-library/src/navigation-link/link-ui/index.js
import { __unstableStripHTML as stripHTML, focus } from "@wordpress/dom";
import {
  Popover,
  Button,
  VisuallyHidden,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { LinkControl, useBlockEditingMode } from "@wordpress/block-editor";
import {
  useMemo,
  useState,
  useRef,
  useEffect,
  forwardRef
} from "@wordpress/element";
import { useResourcePermissions } from "@wordpress/core-data";
import { plus } from "@wordpress/icons";
import { useInstanceId } from "@wordpress/compose";
import { isURL } from "@wordpress/url";
import { LinkUIPageCreator } from "./page-creator.mjs";
import LinkUIBlockInserter from "./block-inserter.mjs";
import { useEntityBinding, useLinkPreview } from "../shared/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getSuggestionsQuery(type, kind) {
  const perPage = 20;
  switch (type) {
    case "post":
    case "page":
      return { type: "post", subtype: type, perPage };
    case "category":
      return { type: "term", subtype: "category", perPage };
    case "tag":
      return { type: "term", subtype: "post_tag", perPage };
    case "post_format":
      return { type: "post-format", perPage };
    default:
      if (kind === "taxonomy") {
        return { type: "term", subtype: type, perPage };
      }
      if (kind === "post-type") {
        return { type: "post", subtype: type, perPage };
      }
      return {
        // for custom link which has no type
        // always show pages as initial suggestions
        initialSuggestionsSearchOptions: {
          type: "post",
          subtype: "page",
          perPage
        }
      };
  }
}
function UnforwardedLinkUI(props, ref) {
  const { label, url, opensInNewTab, type, kind, id } = props.link;
  const { entityRecord, hasBinding, isEntityAvailable } = props.entity || {};
  const { image, badges } = useLinkPreview({
    url,
    entityRecord,
    type,
    hasBinding,
    isEntityAvailable
  });
  const { clientId } = props;
  const postType = type || "page";
  const [addingBlock, setAddingBlock] = useState(false);
  const [addingPage, setAddingPage] = useState(false);
  const [shouldFocusPane, setShouldFocusPane] = useState(null);
  const [initialSearchValue, setInitialSearchValue] = useState("");
  const searchInputValueRef = useRef("");
  const updateSearchValue = (value) => {
    searchInputValueRef.current = value;
    setInitialSearchValue(value);
  };
  const linkControlWrapperRef = useRef();
  const addPageButtonRef = useRef();
  const addBlockButtonRef = useRef();
  const permissions = useResourcePermissions({
    kind: "postType",
    name: postType
  });
  const { isBoundEntityAvailable } = useEntityBinding({
    clientId,
    attributes: props.link
  });
  const link = useMemo(
    () => ({
      url,
      opensInNewTab,
      title: label && stripHTML(label),
      kind,
      type,
      id,
      image,
      badges
    }),
    [label, opensInNewTab, url, kind, type, id, image, badges]
  );
  const handlePageCreated = (pageLink) => {
    props.onChange(pageLink);
    setAddingPage(false);
    setShouldFocusPane(true);
    updateSearchValue("");
  };
  const dialogTitleId = useInstanceId(
    LinkUI,
    "link-ui-link-control__title"
  );
  const dialogDescriptionId = useInstanceId(
    LinkUI,
    "link-ui-link-control__description"
  );
  useEffect(() => {
    if (shouldFocusPane && linkControlWrapperRef.current) {
      if (shouldFocusPane?.current) {
        shouldFocusPane.current.focus();
      } else {
        const tabbableElements = focus.tabbable.find(
          linkControlWrapperRef.current
        );
        const nextFocusTarget = tabbableElements[0] || linkControlWrapperRef.current;
        nextFocusTarget.focus();
      }
      setShouldFocusPane(false);
    }
  }, [shouldFocusPane]);
  const blockEditingMode = useBlockEditingMode();
  return /* @__PURE__ */ jsxs(
    Popover,
    {
      ref,
      placement: "bottom",
      onClose: props.onClose,
      anchor: props.anchor,
      shift: true,
      children: [
        !addingBlock && !addingPage && /* @__PURE__ */ jsxs(
          "div",
          {
            ref: linkControlWrapperRef,
            role: "dialog",
            "aria-labelledby": dialogTitleId,
            "aria-describedby": dialogDescriptionId,
            children: [
              /* @__PURE__ */ jsxs(VisuallyHidden, { children: [
                /* @__PURE__ */ jsx("h2", { id: dialogTitleId, children: __("Add link") }),
                /* @__PURE__ */ jsx("p", { id: dialogDescriptionId, children: __(
                  "Search for and add a link to your Navigation."
                ) })
              ] }),
              /* @__PURE__ */ jsx(
                LinkControl,
                {
                  hasTextControl: true,
                  hasRichPreviews: true,
                  value: link,
                  showInitialSuggestions: true,
                  withCreateSuggestion: false,
                  noDirectEntry: !!type,
                  noURLSuggestion: !!type,
                  suggestionsQuery: getSuggestionsQuery(type, kind),
                  onChange: props.onChange,
                  onInputChange: (value) => {
                    searchInputValueRef.current = value;
                  },
                  inputValue: initialSearchValue,
                  onRemove: props.onRemove,
                  onCancel: props.onCancel,
                  handleEntities: isBoundEntityAvailable,
                  forceIsEditingLink: link?.url ? false : void 0,
                  renderControlBottom: () => {
                    if (link?.url?.length) {
                      return null;
                    }
                    return /* @__PURE__ */ jsx(
                      LinkUITools,
                      {
                        addPageButtonRef,
                        addBlockButtonRef,
                        setAddingBlock: () => {
                          setAddingBlock(true);
                        },
                        setAddingPage: () => {
                          setAddingPage(true);
                        },
                        canAddPage: permissions?.canCreate && type === "page",
                        canAddBlock: blockEditingMode === "default"
                      }
                    );
                  }
                }
              )
            ]
          }
        ),
        addingBlock && /* @__PURE__ */ jsx(
          LinkUIBlockInserter,
          {
            clientId: props.clientId,
            onBack: () => {
              setAddingBlock(false);
              setShouldFocusPane(addBlockButtonRef);
              updateSearchValue(searchInputValueRef.current);
            },
            onBlockInsert: props?.onBlockInsert
          }
        ),
        addingPage && /* @__PURE__ */ jsx(
          LinkUIPageCreator,
          {
            postType,
            onBack: () => {
              setAddingPage(false);
              setShouldFocusPane(addPageButtonRef);
              updateSearchValue(searchInputValueRef.current);
            },
            onPageCreated: handlePageCreated,
            initialTitle: searchInputValueRef.current && !isURL(searchInputValueRef.current) ? searchInputValueRef.current : ""
          }
        )
      ]
    }
  );
}
var LinkUI = forwardRef(UnforwardedLinkUI);
var LinkUITools = ({
  addPageButtonRef,
  addBlockButtonRef,
  setAddingBlock,
  setAddingPage,
  canAddPage,
  canAddBlock
}) => {
  const blockInserterAriaRole = "listbox";
  if (!canAddPage && !canAddBlock) {
    return null;
  }
  return /* @__PURE__ */ jsxs(VStack, { spacing: 0, className: "link-ui-tools", children: [
    canAddPage && /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        ref: addPageButtonRef,
        icon: plus,
        onClick: (e) => {
          e.preventDefault();
          setAddingPage(true);
        },
        "aria-haspopup": blockInserterAriaRole,
        children: __("Create page")
      }
    ),
    canAddBlock && /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        ref: addBlockButtonRef,
        icon: plus,
        onClick: (e) => {
          e.preventDefault();
          setAddingBlock(true);
        },
        "aria-haspopup": blockInserterAriaRole,
        children: __("Add block")
      }
    )
  ] });
};
var link_ui_default = LinkUITools;
export {
  LinkUI,
  link_ui_default as default,
  getSuggestionsQuery
};
//# sourceMappingURL=index.mjs.map

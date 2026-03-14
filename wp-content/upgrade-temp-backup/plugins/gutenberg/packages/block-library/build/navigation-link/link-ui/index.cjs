"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation-link/link-ui/index.js
var link_ui_exports = {};
__export(link_ui_exports, {
  LinkUI: () => LinkUI,
  default: () => link_ui_default,
  getSuggestionsQuery: () => getSuggestionsQuery
});
module.exports = __toCommonJS(link_ui_exports);
var import_dom = require("@wordpress/dom");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_compose = require("@wordpress/compose");
var import_url = require("@wordpress/url");
var import_page_creator = require("./page-creator.cjs");
var import_block_inserter = __toESM(require("./block-inserter.cjs"));
var import_shared = require("../shared/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const { image, badges } = (0, import_shared.useLinkPreview)({
    url,
    entityRecord,
    type,
    hasBinding,
    isEntityAvailable
  });
  const { clientId } = props;
  const postType = type || "page";
  const [addingBlock, setAddingBlock] = (0, import_element.useState)(false);
  const [addingPage, setAddingPage] = (0, import_element.useState)(false);
  const [shouldFocusPane, setShouldFocusPane] = (0, import_element.useState)(null);
  const [initialSearchValue, setInitialSearchValue] = (0, import_element.useState)("");
  const searchInputValueRef = (0, import_element.useRef)("");
  const updateSearchValue = (value) => {
    searchInputValueRef.current = value;
    setInitialSearchValue(value);
  };
  const linkControlWrapperRef = (0, import_element.useRef)();
  const addPageButtonRef = (0, import_element.useRef)();
  const addBlockButtonRef = (0, import_element.useRef)();
  const permissions = (0, import_core_data.useResourcePermissions)({
    kind: "postType",
    name: postType
  });
  const { isBoundEntityAvailable } = (0, import_shared.useEntityBinding)({
    clientId,
    attributes: props.link
  });
  const link = (0, import_element.useMemo)(
    () => ({
      url,
      opensInNewTab,
      title: label && (0, import_dom.__unstableStripHTML)(label),
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
  const dialogTitleId = (0, import_compose.useInstanceId)(
    LinkUI,
    "link-ui-link-control__title"
  );
  const dialogDescriptionId = (0, import_compose.useInstanceId)(
    LinkUI,
    "link-ui-link-control__description"
  );
  (0, import_element.useEffect)(() => {
    if (shouldFocusPane && linkControlWrapperRef.current) {
      if (shouldFocusPane?.current) {
        shouldFocusPane.current.focus();
      } else {
        const tabbableElements = import_dom.focus.tabbable.find(
          linkControlWrapperRef.current
        );
        const nextFocusTarget = tabbableElements[0] || linkControlWrapperRef.current;
        nextFocusTarget.focus();
      }
      setShouldFocusPane(false);
    }
  }, [shouldFocusPane]);
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Popover,
    {
      ref,
      placement: "bottom",
      onClose: props.onClose,
      anchor: props.anchor,
      shift: true,
      children: [
        !addingBlock && !addingPage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            ref: linkControlWrapperRef,
            role: "dialog",
            "aria-labelledby": dialogTitleId,
            "aria-describedby": dialogDescriptionId,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.VisuallyHidden, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { id: dialogTitleId, children: (0, import_i18n.__)("Add link") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { id: dialogDescriptionId, children: (0, import_i18n.__)(
                  "Search for and add a link to your Navigation."
                ) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_block_editor.LinkControl,
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
                    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        addingBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_inserter.default,
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
        addingPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_page_creator.LinkUIPageCreator,
          {
            postType,
            onBack: () => {
              setAddingPage(false);
              setShouldFocusPane(addPageButtonRef);
              updateSearchValue(searchInputValueRef.current);
            },
            onPageCreated: handlePageCreated,
            initialTitle: searchInputValueRef.current && !(0, import_url.isURL)(searchInputValueRef.current) ? searchInputValueRef.current : ""
          }
        )
      ]
    }
  );
}
var LinkUI = (0, import_element.forwardRef)(UnforwardedLinkUI);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 0, className: "link-ui-tools", children: [
    canAddPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        ref: addPageButtonRef,
        icon: import_icons.plus,
        onClick: (e) => {
          e.preventDefault();
          setAddingPage(true);
        },
        "aria-haspopup": blockInserterAriaRole,
        children: (0, import_i18n.__)("Create page")
      }
    ),
    canAddBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        ref: addBlockButtonRef,
        icon: import_icons.plus,
        onClick: (e) => {
          e.preventDefault();
          setAddingBlock(true);
        },
        "aria-haspopup": blockInserterAriaRole,
        children: (0, import_i18n.__)("Add block")
      }
    )
  ] });
};
var link_ui_default = LinkUITools;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinkUI,
  getSuggestionsQuery
});
//# sourceMappingURL=index.cjs.map

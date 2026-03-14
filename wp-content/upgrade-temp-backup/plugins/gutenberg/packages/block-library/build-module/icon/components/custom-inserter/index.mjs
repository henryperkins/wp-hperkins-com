// packages/block-library/src/icon/components/custom-inserter/index.js
import { __ } from "@wordpress/i18n";
import { Modal, SearchControl } from "@wordpress/components";
import { useState, useMemo, useCallback } from "@wordpress/element";
import { useDebounce } from "@wordpress/compose";
import IconGrid from "./icon-grid.mjs";
import { normalizeSearchInput } from "../../../utils/search-patterns.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function CustomInserterModal({
  icons = [],
  setInserterOpen,
  attributes,
  setAttributes
}) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSetSearchInput = useDebounce(setSearchInput, 300);
  const setIcon = useCallback(
    (name) => {
      setAttributes({
        icon: name
      });
      setInserterOpen(false);
    },
    [setAttributes, setInserterOpen]
  );
  const filteredIcons = useMemo(() => {
    if (searchInput) {
      const input = normalizeSearchInput(searchInput);
      return icons.filter((icon) => {
        const iconName = normalizeSearchInput(icon.name);
        const iconLabel = normalizeSearchInput(icon.label);
        return iconName.includes(input) || iconLabel.includes(input);
      });
    }
    return icons;
  }, [searchInput, icons]);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      className: "wp-block-icon__inserter-modal",
      title: __("Icon library"),
      onRequestClose: () => setInserterOpen(false),
      isFullScreen: true,
      children: /* @__PURE__ */ jsxs("div", { className: "wp-block-icon__inserter", children: [
        /* @__PURE__ */ jsx("div", { className: "wp-block-icon__inserter-header", children: /* @__PURE__ */ jsx(
          SearchControl,
          {
            value: searchInput,
            onChange: debouncedSetSearchInput
          }
        ) }),
        /* @__PURE__ */ jsx(
          IconGrid,
          {
            icons: filteredIcons,
            onChange: setIcon,
            attributes
          }
        )
      ] })
    }
  );
}
export {
  CustomInserterModal as default
};
//# sourceMappingURL=index.mjs.map

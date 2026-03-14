// packages/editor/src/components/pattern-rename-modal/index.js
import { useDispatch, useSelect } from "@wordpress/data";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { store as coreStore } from "@wordpress/core-data";
import { store as interfaceStore } from "@wordpress/interface";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { PATTERN_POST_TYPE } from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
var { RenamePatternModal } = unlock(patternsPrivateApis);
var modalName = "editor/pattern-rename";
function PatternRenameModal() {
  const isActive = useSelect(
    (select) => select(interfaceStore).isModalActive(modalName)
  );
  const { record, postType } = useSelect(
    (select) => {
      if (!isActive) {
        return {};
      }
      const { getCurrentPostType, getCurrentPostId } = select(editorStore);
      const { getEditedEntityRecord } = select(coreStore);
      const _postType = getCurrentPostType();
      return {
        record: getEditedEntityRecord(
          "postType",
          _postType,
          getCurrentPostId()
        ),
        postType: _postType
      };
    },
    [isActive]
  );
  const { closeModal } = useDispatch(interfaceStore);
  if (!isActive || postType !== PATTERN_POST_TYPE) {
    return null;
  }
  return /* @__PURE__ */ jsx(RenamePatternModal, { onClose: closeModal, pattern: record });
}
export {
  PatternRenameModal as default,
  modalName
};
//# sourceMappingURL=index.mjs.map

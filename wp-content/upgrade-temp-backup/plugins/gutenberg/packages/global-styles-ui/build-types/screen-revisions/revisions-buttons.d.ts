/**
 * Internal dependencies
 */
import type { Revision } from './types';
interface RevisionButtonsProps {
    userRevisions: Revision[];
    selectedRevisionId?: string | number;
    onChange: (revision: Revision) => void;
    canApplyRevision?: boolean;
    onApplyRevision?: () => void;
}
/**
 * Returns a rendered list of revisions buttons.
 * @param root0
 * @param root0.userRevisions
 * @param root0.selectedRevisionId
 * @param root0.onChange
 * @param root0.canApplyRevision
 * @param root0.onApplyRevision
 */
declare function RevisionsButtons({ userRevisions, selectedRevisionId, onChange, canApplyRevision, onApplyRevision, }: RevisionButtonsProps): import("react").JSX.Element;
export default RevisionsButtons;
//# sourceMappingURL=revisions-buttons.d.ts.map
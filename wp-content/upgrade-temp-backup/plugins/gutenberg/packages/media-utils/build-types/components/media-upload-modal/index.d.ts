/**
 * Internal dependencies
 */
import type { Attachment } from '../../utils/types';
interface MediaUploadModalProps {
    /**
     * Array of allowed media types.
     */
    allowedTypes?: string[];
    /**
     * Whether multiple files can be selected.
     * @default false
     */
    multiple?: boolean;
    /**
     * The currently selected media item(s).
     * Can be a single ID number or array of IDs for multiple selection.
     */
    value?: number | number[];
    /**
     * Function called when media is selected.
     * Receives single attachment object or array of attachments.
     */
    onSelect: (media: Attachment | Attachment[]) => void;
    /**
     * Function called when the modal is closed without selection.
     */
    onClose?: () => void;
    /**
     * Function to handle media uploads.
     * If not provided, drag and drop will be disabled.
     */
    onUpload?: (args: {
        allowedTypes?: string[];
        filesList: File[];
        onFileChange?: (attachments: Partial<Attachment>[]) => void;
        onError?: (error: Error) => void;
        multiple?: boolean;
    }) => void;
    /**
     * Title for the modal.
     * @default 'Select Media'
     */
    title?: string;
    /**
     * Whether the modal is open.
     */
    isOpen: boolean;
    /**
     * Whether the modal can be closed by clicking outside or pressing escape.
     * @default true
     */
    isDismissible?: boolean;
    /**
     * Additional CSS class for the modal.
     */
    modalClass?: string;
    /**
     * Whether to show a search input.
     * @default true
     */
    search?: boolean;
    /**
     * Label for the search input.
     */
    searchLabel?: string;
}
/**
 * MediaUploadModal component that uses Modal and DataViewsPicker for media selection.
 *
 * This is a modern functional component alternative to the legacy MediaUpload class component.
 * It provides a cleaner API and better integration with the WordPress block editor.
 *
 * @param props               Component props
 * @param props.allowedTypes  Array of allowed media types
 * @param props.multiple      Whether multiple files can be selected
 * @param props.value         Currently selected media item(s)
 * @param props.onSelect      Function called when media is selected
 * @param props.onClose       Function called when modal is closed
 * @param props.onUpload      Function to handle media uploads
 * @param props.title         Title for the modal
 * @param props.isOpen        Whether the modal is open
 * @param props.isDismissible Whether modal can be dismissed
 * @param props.modalClass    Additional CSS class for modal
 * @param props.search        Whether to show search input
 * @param props.searchLabel   Label for search input
 * @return JSX element or null
 */
export declare function MediaUploadModal({ allowedTypes, multiple, value, onSelect, onClose, onUpload, title, isOpen, isDismissible, modalClass, search, searchLabel, }: MediaUploadModalProps): import("react").JSX.Element | null;
export default MediaUploadModal;
//# sourceMappingURL=index.d.ts.map
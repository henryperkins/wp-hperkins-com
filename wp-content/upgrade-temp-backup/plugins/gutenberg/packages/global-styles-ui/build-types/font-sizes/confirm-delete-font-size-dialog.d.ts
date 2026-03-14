import type { FontSize } from '@wordpress/global-styles-engine';
interface ConfirmDeleteFontSizeDialogProps {
    fontSize: FontSize;
    isOpen: boolean;
    toggleOpen: () => void;
    handleRemoveFontSize: (fontSize: FontSize) => void;
}
declare function ConfirmDeleteFontSizeDialog({ fontSize, isOpen, toggleOpen, handleRemoveFontSize, }: ConfirmDeleteFontSizeDialogProps): import("react").JSX.Element;
export default ConfirmDeleteFontSizeDialog;
//# sourceMappingURL=confirm-delete-font-size-dialog.d.ts.map
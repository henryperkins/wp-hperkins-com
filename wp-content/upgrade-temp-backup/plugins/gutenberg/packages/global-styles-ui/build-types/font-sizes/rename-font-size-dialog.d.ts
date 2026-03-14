import type { FontSize } from '@wordpress/global-styles-engine';
interface RenameFontSizeDialogProps {
    fontSize: FontSize;
    toggleOpen: () => void;
    handleRename: (newName: string) => void;
}
declare function RenameFontSizeDialog({ fontSize, toggleOpen, handleRename, }: RenameFontSizeDialogProps): import("react").JSX.Element;
export default RenameFontSizeDialog;
//# sourceMappingURL=rename-font-size-dialog.d.ts.map
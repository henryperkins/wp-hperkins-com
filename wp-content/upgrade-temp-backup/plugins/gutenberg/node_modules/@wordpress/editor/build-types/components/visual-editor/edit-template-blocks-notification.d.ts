/**
 * Component that:
 *
 * - Displays a 'Edit your template to edit this block' notification when the
 *   user is focusing on editing page content and clicks on a disabled template
 *   block.
 * - Displays a 'Edit your template to edit this block' dialog when the user
 *   is focusing on editing page content and double clicks on a disabled
 *   template block.
 *
 * @param {Object}                       props
 * @param {React.RefObject<HTMLElement>} props.contentRef Ref to the block
 *                                                        editor iframe canvas.
 */
export default function EditTemplateBlocksNotification({ contentRef }: {
    contentRef: React.RefObject<HTMLElement>;
}): import("react").JSX.Element | null;
//# sourceMappingURL=edit-template-blocks-notification.d.ts.map
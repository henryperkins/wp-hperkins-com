type CreateTemplatePartModalContentsProps = {
    defaultArea?: string;
    blocks: any[];
    confirmLabel?: string;
    closeModal: () => void;
    onCreate: (templatePart: any) => void;
    onError?: () => void;
    defaultTitle?: string;
};
/**
 * A React component that renders a modal for creating a template part. The modal displays a title and the contents for creating the template part.
 * This component should not live in this package, it should be moved to a dedicated package responsible for managing template.
 * @param props            The component props.
 * @param props.modalTitle
 */
export default function CreateTemplatePartModal({ modalTitle, ...restProps }: {
    modalTitle?: string;
} & CreateTemplatePartModalContentsProps): import("react").JSX.Element;
/**
 * A React component that renders the content of a model for creating a template part.
 * This component should not live in this package; it should be moved to a dedicated package responsible for managing template.
 *
 * @param {Object}   props                             - The component props.
 * @param {string}   [props.defaultArea=uncategorized] - The default area for the template part.
 * @param {Array}    [props.blocks=[]]                 - The blocks to be included in the template part.
 * @param {string}   [props.confirmLabel='Add']        - The label for the confirm button.
 * @param {Function} props.closeModal                  - Function to close the modal.
 * @param {Function} props.onCreate                    - Function to call when the template part is successfully created.
 * @param {Function} [props.onError]                   - Function to call when there is an error creating the template part.
 * @param {string}   [props.defaultTitle='']           - The default title for the template part.
 */
export declare function CreateTemplatePartModalContents({ defaultArea, blocks, confirmLabel, closeModal, onCreate, onError, defaultTitle, }: CreateTemplatePartModalContentsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
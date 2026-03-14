import type { Form } from '@wordpress/dataviews';
import type { ReactNode } from 'react';
/**
 * Props for MediaForm component.
 */
export interface MediaFormProps {
    form?: Form;
    header?: ReactNode;
}
/**
 * MediaForm component for editing media metadata.
 *
 * Renders a DataForm with fields for editing media properties like
 * title, alt text, caption, description, etc.
 *
 * @param props        - Component props.
 * @param props.form   - Optional form configuration.
 * @param props.header - Optional header content to display above the form.
 * @return The MediaForm component.
 */
export default function MediaForm({ form: formOverrides, header, }: MediaFormProps): import("react").JSX.Element;
//# sourceMappingURL=index.d.ts.map
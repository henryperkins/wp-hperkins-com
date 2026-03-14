import type { DataFormControlProps } from '@wordpress/dataviews';
/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
export declare const getItemPriority: (name: string, searchValue: string) => number;
export declare function PageAttributesParent({ data, onChangeControl, }: {
    data: BasePost;
    onChangeControl: (newValue: number) => void;
}): import("react").JSX.Element | null;
export declare const ParentEdit: ({ data, field, onChange, }: DataFormControlProps<BasePost>) => import("react").JSX.Element;
//# sourceMappingURL=parent-edit.d.ts.map
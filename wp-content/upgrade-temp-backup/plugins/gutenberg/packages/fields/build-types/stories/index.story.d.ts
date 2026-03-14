import { DataForm } from '@wordpress/dataviews';
declare const _default: {
    title: string;
    component: typeof DataForm;
};
export default _default;
export declare const DataFormsPreview: {
    render: ({ type }: {
        type: "regular" | "panel";
    }) => import("react").JSX.Element;
    argTypes: {
        type: {
            control: {
                type: string;
            };
            description: string;
            options: string[];
        };
    };
    args: {
        type: string;
    };
};
export declare const DataViewsPreview: () => import("react").JSX.Element;
//# sourceMappingURL=index.story.d.ts.map
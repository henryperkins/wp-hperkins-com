export function useSetAsHomepageAction(): {
    id: string;
    label: import("@wordpress/i18n").TranslatableText<"Set as homepage">;
    isEligible(post: any): boolean;
    modalFocusOnMount: string;
    RenderModal: ({ items, closeModal }: {
        items: any;
        closeModal: any;
    }) => import("react").JSX.Element;
};
//# sourceMappingURL=set-as-homepage.d.ts.map
export function useSetAsPostsPageAction(): {
    id: string;
    label: import("@wordpress/i18n").TranslatableText<"Set as posts page">;
    isEligible(post: any): boolean;
    modalFocusOnMount: string;
    RenderModal: ({ items, closeModal }: {
        items: any;
        closeModal: any;
    }) => import("react").JSX.Element;
};
//# sourceMappingURL=set-as-posts-page.d.ts.map
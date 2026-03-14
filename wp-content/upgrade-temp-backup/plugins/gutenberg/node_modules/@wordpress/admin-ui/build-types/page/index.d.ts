declare function Page({ breadcrumbs, badges, title, subTitle, children, className, actions, ariaLabel, hasPadding, showSidebarToggle, }: {
    breadcrumbs?: React.ReactNode;
    badges?: React.ReactNode;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
    ariaLabel?: string;
    hasPadding?: boolean;
    showSidebarToggle?: boolean;
}): import("react").JSX.Element;
declare namespace Page {
    var SidebarToggleFill: {
        (props: Omit<import("@wordpress/components").FillComponentProps, "name">): import("react").JSX.Element;
        displayName: string;
    };
}
export default Page;
//# sourceMappingURL=index.d.ts.map
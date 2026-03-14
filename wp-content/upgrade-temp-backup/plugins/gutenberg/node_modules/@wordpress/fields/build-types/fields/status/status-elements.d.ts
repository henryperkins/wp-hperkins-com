declare const STATUSES: ({
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Draft">;
    icon: import("react").JSX.Element;
    description: import("@wordpress/i18n").TranslatableText<"Not ready to publish.">;
} | {
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Scheduled">;
    icon: import("react").JSX.Element;
    description: import("@wordpress/i18n").TranslatableText<"Publish automatically on a chosen date.">;
} | {
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Pending Review">;
    icon: import("react").JSX.Element;
    description: import("@wordpress/i18n").TranslatableText<"Waiting for review before publishing.">;
} | {
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Private">;
    icon: import("react").JSX.Element;
    description: import("@wordpress/i18n").TranslatableText<"Only visible to site admins and editors.">;
} | {
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Published">;
    icon: import("react").JSX.Element;
    description: import("@wordpress/i18n").TranslatableText<"Visible to everyone.">;
} | {
    value: string;
    label: import("@wordpress/i18n").TranslatableText<"Trash">;
    icon: import("react").JSX.Element;
    description?: undefined;
})[];
export default STATUSES;
//# sourceMappingURL=status-elements.d.ts.map
declare const elements: {
    text: {
        description: import("@wordpress/i18n").TranslatableText<"Manage the fonts used on the site.">;
        title: import("@wordpress/i18n").TranslatableText<"Text">;
    };
    link: {
        description: import("@wordpress/i18n").TranslatableText<"Manage the fonts and typography used on the links.">;
        title: import("@wordpress/i18n").TranslatableText<"Links">;
    };
    heading: {
        description: import("@wordpress/i18n").TranslatableText<"Manage the fonts and typography used on headings.">;
        title: import("@wordpress/i18n").TranslatableText<"Headings">;
    };
    caption: {
        description: import("@wordpress/i18n").TranslatableText<"Manage the fonts and typography used on captions.">;
        title: import("@wordpress/i18n").TranslatableText<"Captions">;
    };
    button: {
        description: import("@wordpress/i18n").TranslatableText<"Manage the fonts and typography used on buttons.">;
        title: import("@wordpress/i18n").TranslatableText<"Buttons">;
    };
};
interface ScreenTypographyElementProps {
    element: keyof typeof elements;
}
declare function ScreenTypographyElement({ element }: ScreenTypographyElementProps): import("react").JSX.Element;
export default ScreenTypographyElement;
//# sourceMappingURL=screen-typography-element.d.ts.map
/**
 * Internal dependencies
 */
import { type NavigationOptions } from './router';
export declare function useLink(to: string, options?: NavigationOptions): {
    href: string;
    onClick: (event: React.SyntheticEvent<HTMLAnchorElement>) => void;
};
export declare function Link({ to, options, children, ...props }: {
    to: string;
    options?: NavigationOptions;
    children: React.ReactNode;
}): import("react").JSX.Element;
//# sourceMappingURL=link.d.ts.map
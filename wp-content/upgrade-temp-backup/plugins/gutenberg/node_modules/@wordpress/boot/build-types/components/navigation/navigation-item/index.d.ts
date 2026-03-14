import type { ReactNode } from 'react';
import type { IconType } from '../../../store/types';
import './style.scss';
interface NavigationItemProps {
    /**
     * Optional CSS class name.
     */
    className?: string;
    /**
     * Icon to display with the navigation item.
     */
    icon?: IconType;
    /**
     * Whether to show placeholder icons for alignment.
     */
    shouldShowPlaceholder?: boolean;
    /**
     * Content to display inside the navigation item.
     */
    children: ReactNode;
    /**
     * The path to navigate to.
     */
    to: string;
}
export default function NavigationItem({ className, icon, shouldShowPlaceholder, children, to, }: NavigationItemProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
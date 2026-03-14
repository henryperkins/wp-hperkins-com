import type { ReactNode } from 'react';
import type { IconType } from '../../../store/types';
import './style.scss';
interface DropdownItemProps {
    /**
     * Optional CSS class name.
     */
    className?: string;
    /**
     * Identifier of the parent menu item.
     */
    id: string;
    /**
     * Icon to display with the dropdown item.
     */
    icon?: IconType;
    /**
     * Whether to show placeholder icons for alignment.
     */
    shouldShowPlaceholder?: boolean;
    /**
     * Content to display inside the dropdown item.
     */
    children: ReactNode;
    /**
     * Whether this dropdown is currently expanded.
     */
    isExpanded: boolean;
    /**
     * Function to toggle this dropdown's expanded state.
     */
    onToggle: () => void;
}
export default function DropdownItem({ className, id, icon, children, isExpanded, onToggle, }: DropdownItemProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
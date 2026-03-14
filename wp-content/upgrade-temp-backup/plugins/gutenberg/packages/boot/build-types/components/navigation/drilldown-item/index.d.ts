import type { ReactNode } from 'react';
import type { IconType } from '../../../store/types';
interface DrilldownItemProps {
    /**
     * Optional CSS class name.
     */
    className?: string;
    /**
     * Identifier of the navigation item.
     */
    id: string;
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
     * Function to handle sidebar navigation when the item is clicked.
     */
    onNavigate: ({ id, direction, }: {
        id?: string;
        direction: 'forward' | 'backward';
    }) => void;
}
export default function DrilldownItem({ className, id, icon, shouldShowPlaceholder, children, onNavigate, }: DrilldownItemProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
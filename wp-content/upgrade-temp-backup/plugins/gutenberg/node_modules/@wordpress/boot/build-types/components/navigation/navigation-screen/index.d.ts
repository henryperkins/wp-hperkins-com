/**
 * External dependencies
 */
import type { ReactNode, RefObject } from 'react';
/**
 * Internal dependencies
 */
import './style.scss';
export default function NavigationScreen({ isRoot, title, actions, content, description, animationDirection, backMenuItem, backButtonRef, navigationKey, onNavigate, }: {
    isRoot?: boolean;
    title: string;
    actions?: ReactNode;
    content: ReactNode;
    description?: ReactNode;
    backMenuItem?: string;
    backButtonRef?: RefObject<HTMLButtonElement | null>;
    animationDirection?: 'forward' | 'backward';
    navigationKey?: string;
    onNavigate: ({ id, direction, }: {
        id?: string;
        direction: 'forward' | 'backward';
    }) => void;
}): import("react").JSX.Element;
//# sourceMappingURL=index.d.ts.map
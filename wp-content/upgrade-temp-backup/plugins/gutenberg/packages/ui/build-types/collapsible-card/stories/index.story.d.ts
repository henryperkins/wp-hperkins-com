import type { Meta, StoryObj } from '@storybook/react-vite';
import * as CollapsibleCard from '../index';
declare const meta: Meta<typeof CollapsibleCard.Root>;
export default meta;
type Story = StoryObj<typeof CollapsibleCard.Root>;
/**
 * A collapsible card that is open by default.
 */
export declare const Default: Story;
/**
 * A collapsible card that starts collapsed.
 */
export declare const InitiallyOpened: Story;
/**
 * A disabled collapsible card cannot be toggled by the user.
 */
export declare const Disabled: Story;
/**
 * Visual comparison: a `CollapsibleCard` (open) next to a regular `Card`
 * to verify identical spacing and layout.
 */
export declare const ComparedToCard: Story;
//# sourceMappingURL=index.story.d.ts.map
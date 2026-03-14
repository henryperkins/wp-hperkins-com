import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Dialog from '../index';
declare const meta: Meta<typeof Dialog.Root>;
export default meta;
type Story = StoryObj<typeof Dialog.Root>;
/**
 * An informational dialog with a close icon, where there is no ambiguity on
 * what happens when clicking the close icon.
 */
export declare const _Default: Story;
/**
 * A confirmation dialog that intentionally omits the close icon. The user
 * must explicitly choose "Cancel" or "Confirm" to make their intent clear,
 * since it is not obvious what would happen when clicking a close icon.
 */
export declare const ConfirmDialog: Story;
export declare const AllSizes: Story;
/**
 * Popovers in Gutenberg are managed with explicit z-index values, which can create
 * situations where a dialog renders below another popover, when you want it to be rendered above.
 *
 * The `--wp-ui-dialog-z-index` CSS variable controls the z-index of both the
 * backdrop and the popup. It can be overridden globally by setting the variable
 * on `:root` or `body`. (This story doesn't actually demonstrate the feature
 * because it requires a global CSS rule.)
 */
export declare const WithCustomZIndex: Story;
//# sourceMappingURL=index.story.d.ts.map
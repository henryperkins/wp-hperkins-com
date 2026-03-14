/**
 * Renders a title of the post type and the available quick actions available within a 3-dot dropdown.
 *
 * @param {Object}          props                     - Component props.
 * @param {string}          [props.postType]          - The post type string.
 * @param {string|string[]} [props.postId]            - The post id or list of post ids.
 * @param {boolean}         [props.hideActions]       - Whether to hide the actions. False by default.
 * @param {Function}        [props.onActionPerformed] - A callback function for when a quick action is performed.
 * @param {Function}        [props.onClose]           - A callback function for when the close button is clicked.
 * @return {React.ReactNode} The rendered component.
 */
export default function PostCardPanel({ postType, postId, hideActions, onActionPerformed, onClose, }: {
    postType?: string | undefined;
    postId?: string | string[] | undefined;
    hideActions?: boolean | undefined;
    onActionPerformed?: Function | undefined;
    onClose?: Function | undefined;
}): React.ReactNode;
//# sourceMappingURL=index.d.ts.map
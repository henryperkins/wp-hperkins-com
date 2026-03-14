/**
 * Renders a user label for the autocompleter.
 *
 * @param {Object} user User object.
 * @return {React.JSX.Element} User label component.
 */
export function getUserLabel(user: Object): React.JSX.Element;
declare const _default: {
    name: string;
    className: string;
    triggerPrefix: string;
    useItems(filterValue: any): {
        key: string;
        value: import("@wordpress/core-data").User<"edit">;
        label: import("react").JSX.Element;
    }[][];
    getOptionCompletion(user: any): string;
};
export default _default;
//# sourceMappingURL=user.d.ts.map
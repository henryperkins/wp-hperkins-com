export = config;
/** @type {PrettierConfig & WPPrettierOptions} */
declare const config: PrettierConfig & WPPrettierOptions;
declare namespace config {
    export { PrettierConfig, WPPrettierOptions };
}
type PrettierConfig = import("prettier").Config;
type WPPrettierOptions = {
    /**
     * Insert spaces inside parentheses.
     */
    parenSpacing?: boolean | undefined;
};
//# sourceMappingURL=index.d.ts.map
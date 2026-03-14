/**
 * Options for lazy importing a package.
 */
export interface LazyImportOptions {
    /**
     * Path to the local directory or file.
     */
    localPath?: string;
    /**
     *
     * Callback to invoke when install starts.
     */
    onInstall?: () => void;
}
/**
 * Given an arg string as would be passed to `npm install`, requires the package
 * corresponding to the name and specifier parsed from the arg. If the package
 * is not installed (or not installed at that version), the package is installed
 * to a temporary directory at `node_modules/.wp-lazy` relative to where the
 * current working directory.
 *
 * @param arg       A string that you might pass
 *                  to `npm install`.
 * @param [options] Optional options object.
 *
 * @return  Promise resolving to required module.
 */
export declare function lazyImport(arg: string, options?: Partial<LazyImportOptions>): Promise<NodeRequire>;
export default lazyImport;
//# sourceMappingURL=index.d.ts.map
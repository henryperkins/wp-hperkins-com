export function useGlobalStylesContext(): {
    isReady: any;
    user: boolean | {
        settings: any;
        styles: any;
        _links: any;
    } | ((callbackOrObject: Function | Object, options?: Object) => void);
    base: any;
    merged: import("@wordpress/global-styles-engine").GlobalStylesConfig;
    setUserConfig: boolean | {
        settings: any;
        styles: any;
        _links: any;
    } | ((callbackOrObject: Function | Object, options?: Object) => void);
};
//# sourceMappingURL=index.d.ts.map
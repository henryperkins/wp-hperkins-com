export declare const CUSTOM_VALUE_SETTINGS: {
    px: {
        max: number;
        step: number;
    };
    '%': {
        max: number;
        step: number;
    };
    vw: {
        max: number;
        step: number;
    };
    vh: {
        max: number;
        step: number;
    };
    em: {
        max: number;
        step: number;
    };
    rm: {
        max: number;
        step: number;
    };
    svw: {
        max: number;
        step: number;
    };
    lvw: {
        max: number;
        step: number;
    };
    dvw: {
        max: number;
        step: number;
    };
    svh: {
        max: number;
        step: number;
    };
    lvh: {
        max: number;
        step: number;
    };
    dvh: {
        max: number;
        step: number;
    };
    vi: {
        max: number;
        step: number;
    };
    svi: {
        max: number;
        step: number;
    };
    lvi: {
        max: number;
        step: number;
    };
    dvi: {
        max: number;
        step: number;
    };
    vb: {
        max: number;
        step: number;
    };
    svb: {
        max: number;
        step: number;
    };
    lvb: {
        max: number;
        step: number;
    };
    dvb: {
        max: number;
        step: number;
    };
    vmin: {
        max: number;
        step: number;
    };
    svmin: {
        max: number;
        step: number;
    };
    lvmin: {
        max: number;
        step: number;
    };
    dvmin: {
        max: number;
        step: number;
    };
    vmax: {
        max: number;
        step: number;
    };
    svmax: {
        max: number;
        step: number;
    };
    lvmax: {
        max: number;
        step: number;
    };
    dvmax: {
        max: number;
        step: number;
    };
};
export interface ShadowObject {
    x: string;
    y: string;
    blur: string;
    spread: string;
    color: string;
    inset: boolean;
}
export declare function getShadowParts(shadow: string): string[];
export declare function shadowStringToObject(shadowValue: string): ShadowObject;
export declare function shadowObjectToString(shadowObj: ShadowObject): string;
//# sourceMappingURL=shadow-utils.d.ts.map
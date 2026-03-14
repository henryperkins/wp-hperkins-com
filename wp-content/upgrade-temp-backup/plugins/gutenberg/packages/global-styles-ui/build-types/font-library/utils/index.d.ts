import type { FontFamily, FontFace } from '@wordpress/core-data';
import type { DataRegistry } from '@wordpress/data';
import type { FontFamilyToUpload, FontUploadResult } from '../types';
export declare function setUIValuesNeeded(font: FontFamily, extraValues?: Partial<FontFamily>): FontFamily;
export declare function isUrlEncoded(url: string): boolean;
export declare function getFontFaceVariantName(face: FontFace): string;
export declare function mergeFontFaces(existing?: FontFace[], incoming?: FontFace[]): FontFace[];
export declare function mergeFontFamilies(existing?: FontFamily[], incoming?: FontFamily[]): FontFamily[];
export declare function loadFontFaceInBrowser(fontFace: FontFace, source: string | File, addTo?: 'all' | 'document' | 'iframe'): Promise<void>;
export declare function unloadFontFaceInBrowser(fontFace: FontFace, removeFrom?: 'all' | 'document' | 'iframe'): void;
/**
 * Retrieves the display source from a font face src.
 *
 * @param {string|string[]} input - The font face src.
 * @return {string|undefined} The display source or undefined if the input is invalid.
 */
export declare function getDisplaySrcFromFontFace(input: string | string[]): string | undefined;
export declare function makeFontFamilyFormData(fontFamily: FontFamily): FormData;
export declare function makeFontFacesFormData(font: FontFamilyToUpload): FormData[];
export declare function batchInstallFontFaces(fontFamilyId: string, fontFacesData: FormData[], registry: DataRegistry): Promise<FontUploadResult>;
export declare function downloadFontFaceAssets(src: string | string[]): Promise<File | File[]>;
export declare function checkFontFaceInstalled(fontFace: FontFace, collection: FontFace[]): boolean;
//# sourceMappingURL=index.d.ts.map
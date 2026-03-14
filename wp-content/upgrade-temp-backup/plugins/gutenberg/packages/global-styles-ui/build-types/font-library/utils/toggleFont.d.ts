/**
 * Toggles the activation of a given font or font variant within a list of custom fonts.
 *
 * - If only the font is provided (without face), the entire font family's activation is toggled.
 * - If both font and face are provided, the activation of the specific font variant is toggled.
 *
 * @param {Object} font            - The font to be toggled.
 * @param {string} font.slug       - The unique identifier for the font.
 * @param {Array}  [font.fontFace] - The list of font variants (faces) associated with the font.
 *
 * @param {Object} [face]          - The specific font variant to be toggled.
 * @param {string} face.fontWeight - The weight of the font variant.
 * @param {string} face.fontStyle  - The style of the font variant.
 *
 * @param {Array}  initialfonts    - The initial list of custom fonts.
 *
 * @return {Array} - The updated list of custom fonts with the font/font variant toggled.
 *
 * @example
 * const customFonts = [
 *     { slug: 'roboto', fontFace: [{ fontWeight: '400', fontStyle: 'normal' }] }
 * ];
 *
 * toggleFont({ slug: 'roboto' }, null, customFonts);
 * // This will remove 'roboto' from customFonts
 *
 * toggleFont({ slug: 'roboto' }, { fontWeight: '400', fontStyle: 'normal' }, customFonts);
 * // This will remove the specified face from 'roboto' in customFonts
 *
 * toggleFont({ slug: 'roboto' }, { fontWeight: '500', fontStyle: 'normal' }, customFonts);
 * // This will add the specified face to 'roboto' in customFonts
 */
/**
 * WordPress dependencies
 */
import type { FontFamily, FontFace } from '@wordpress/core-data';
export declare function toggleFont(font: FontFamily, face?: FontFace, initialfonts?: FontFamily[]): FontFamily[];
//# sourceMappingURL=toggleFont.d.ts.map
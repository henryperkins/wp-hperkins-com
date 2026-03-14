import type { FontFace } from '@wordpress/core-data';
import type { DataRegistry } from '@wordpress/data';
export declare function fetchInstallFontFamily(data: FormData, registry: DataRegistry): Promise<{
    fontFace: never[];
    name: string;
    slug: string;
    fontFamily: string;
    preview?: string;
    id: string;
    source?: string;
    version?: string;
    author?: string;
    license?: string;
    description?: string;
    tags?: string[];
    variants?: FontFace[];
    category?: string;
}>;
export declare function fetchInstallFontFace(fontFamilyId: string, data: FormData, registry: DataRegistry): Promise<FontFace>;
//# sourceMappingURL=api.d.ts.map
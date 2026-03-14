/**
 * Extracts the best available avatar URL from a collaborator's avatar_urls map.
 * Prefers the 48px size, then 96px, then 24px.
 *
 * @param avatarUrls - The avatar_urls map from collaborator info.
 */
export declare function getAvatarUrl(avatarUrls?: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
}): string | undefined;
//# sourceMappingURL=get-avatar-url.d.ts.map
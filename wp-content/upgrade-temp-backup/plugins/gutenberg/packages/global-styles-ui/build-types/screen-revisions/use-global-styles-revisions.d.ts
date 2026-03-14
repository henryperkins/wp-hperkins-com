import type { Revision } from './types';
interface Query {
    per_page?: number;
    page?: number;
}
interface UseGlobalStylesRevisionsParams {
    query?: Query;
}
interface UseGlobalStylesRevisionsReturn {
    revisions: Revision[];
    hasUnsavedChanges: boolean;
    isLoading: boolean;
    revisionsCount: number;
}
export default function useGlobalStylesRevisions({ query, }?: UseGlobalStylesRevisionsParams): UseGlobalStylesRevisionsReturn;
export {};
//# sourceMappingURL=use-global-styles-revisions.d.ts.map
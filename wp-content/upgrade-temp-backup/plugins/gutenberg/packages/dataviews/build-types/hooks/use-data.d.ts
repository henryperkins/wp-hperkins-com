type PaginationInfo = {
    totalItems: number;
    totalPages: number;
    infiniteScrollHandler?: () => void;
};
export default function useData<Item>(data: Item[], isLoading: boolean | undefined, paginationInfo: PaginationInfo): {
    data: Item[];
    paginationInfo: PaginationInfo;
    hasInitiallyLoaded: boolean;
};
export {};
//# sourceMappingURL=use-data.d.ts.map
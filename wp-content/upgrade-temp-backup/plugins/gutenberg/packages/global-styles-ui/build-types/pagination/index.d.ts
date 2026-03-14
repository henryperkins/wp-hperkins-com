interface PaginationProps {
    currentPage: number;
    numPages: number;
    changePage: (page: number) => void;
    totalItems: number;
    className?: string;
    disabled?: boolean;
    buttonVariant?: 'primary' | 'secondary' | 'tertiary';
    label?: string;
}
export default function Pagination({ currentPage, numPages, changePage, totalItems, className, disabled, buttonVariant, label, }: PaginationProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
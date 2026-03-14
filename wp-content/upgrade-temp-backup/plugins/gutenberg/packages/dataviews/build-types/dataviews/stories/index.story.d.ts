/**
 * External dependencies
 */
import type { Meta } from '@storybook/react-vite';
/**
 * Internal dependencies
 */
import DataViews from '../index';
import './style.css';
declare const meta: Meta<typeof DataViews>;
export default meta;
export declare const LayoutTable: {
    render: ({ backgroundColor, hasClickableItems, groupBy, groupByLabel, perPageSizes, showMedia, }: {
        backgroundColor?: string;
        hasClickableItems?: boolean;
        groupBy?: boolean;
        groupByLabel?: boolean;
        perPageSizes?: number[];
        showMedia?: boolean;
    }) => import("react").JSX.Element;
    args: {
        groupBy: boolean;
        groupByLabel: boolean;
        hasClickableItems: boolean;
        perPageSizes: number[];
        showMedia: boolean;
    };
    argTypes: {
        backgroundColor: {
            control: string;
            description: string;
        };
        groupBy: {
            control: string;
            description: string;
        };
        groupByLabel: {
            control: string;
            description: string;
        };
        hasClickableItems: {
            control: string;
            description: string;
        };
        perPageSizes: {
            control: string;
            description: string;
        };
        showMedia: {
            control: string;
            description: string;
        };
    };
};
export declare const LayoutGrid: {
    render: ({ backgroundColor, hasClickableItems, groupBy, groupByLabel, perPageSizes, showMedia, }: {
        backgroundColor?: string;
        hasClickableItems?: boolean;
        groupBy?: boolean;
        groupByLabel?: boolean;
        perPageSizes?: number[];
        showMedia?: boolean;
    }) => import("react").JSX.Element;
    args: {
        groupBy: boolean;
        groupByLabel: boolean;
        hasClickableItems: boolean;
        perPageSizes: number[];
        showMedia: boolean;
    };
    argTypes: {
        backgroundColor: {
            control: string;
            description: string;
        };
        groupBy: {
            control: string;
            description: string;
        };
        groupByLabel: {
            control: string;
            description: string;
        };
        hasClickableItems: {
            control: string;
            description: string;
        };
        perPageSizes: {
            control: string;
            description: string;
        };
        showMedia: {
            control: string;
            description: string;
        };
    };
};
export declare const LayoutList: {
    render: ({ backgroundColor, fullWidth, hasClickableItems, groupBy, groupByLabel, perPageSizes, showMedia, }: {
        backgroundColor?: string;
        fullWidth?: boolean;
        hasClickableItems?: boolean;
        groupBy?: boolean;
        groupByLabel?: boolean;
        perPageSizes?: number[];
        showMedia?: boolean;
    }) => import("react").JSX.Element;
    args: {
        fullWidth: boolean;
        groupBy: boolean;
        groupByLabel: boolean;
        hasClickableItems: boolean;
        perPageSizes: number[];
        showMedia: boolean;
    };
    argTypes: {
        backgroundColor: {
            control: string;
            description: string;
        };
        fullWidth: {
            control: string;
            description: string;
        };
        groupBy: {
            control: string;
            description: string;
        };
        groupByLabel: {
            control: string;
            description: string;
        };
        hasClickableItems: {
            control: string;
            description: string;
        };
        perPageSizes: {
            control: string;
            description: string;
        };
        showMedia: {
            control: string;
            description: string;
        };
    };
};
export declare const LayoutActivity: {
    render: ({ backgroundColor, fullWidth, hasClickableItems, groupBy, groupByLabel, perPageSizes, showMedia, }: {
        backgroundColor?: string;
        fullWidth?: boolean;
        hasClickableItems?: boolean;
        groupBy?: boolean;
        groupByLabel?: boolean;
        perPageSizes?: number[];
        showMedia?: boolean;
    }) => import("react").JSX.Element;
    args: {
        fullWidth: boolean;
        groupBy: boolean;
        groupByLabel: boolean;
        hasClickableItems: boolean;
        perPageSizes: number[];
        showMedia: boolean;
    };
    argTypes: {
        backgroundColor: {
            control: string;
            description: string;
        };
        fullWidth: {
            control: string;
            description: string;
        };
        groupBy: {
            control: string;
            description: string;
        };
        groupByLabel: {
            control: string;
            description: string;
        };
        hasClickableItems: {
            control: string;
            description: string;
        };
        perPageSizes: {
            control: string;
            description: string;
        };
        showMedia: {
            control: string;
            description: string;
        };
    };
};
export declare const LayoutCustom: {
    render: () => import("react").JSX.Element;
};
export declare const Empty: {
    render: ({ customEmpty, containerHeight, isLoading, }: {
        customEmpty?: boolean;
        containerHeight?: "auto" | "50vh" | "100vh";
        isLoading?: boolean;
    }) => import("react").JSX.Element;
    args: {
        customEmpty: boolean;
        containerHeight: string;
        isLoading: boolean;
    };
    argTypes: {
        customEmpty: {
            control: string;
            description: string;
        };
        containerHeight: {
            control: string;
            options: string[];
            description: string;
        };
        isLoading: {
            control: string;
            description: string;
        };
    };
};
export declare const MinimalUI: {
    render: ({ layout, }: {
        layout: "table" | "list" | "grid";
    }) => import("react").JSX.Element;
    argTypes: {
        layout: {
            control: string;
            options: string[];
            defaultValue: string;
        };
    };
};
export declare const FreeComposition: {
    render: () => import("react").JSX.Element;
};
export declare const WithCard: {
    render: () => import("react").JSX.Element;
};
export declare const InfiniteScroll: {
    render: () => import("react").JSX.Element;
};
//# sourceMappingURL=index.story.d.ts.map
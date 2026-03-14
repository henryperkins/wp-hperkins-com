export const termDataFields: ({
    label: import("@wordpress/i18n").TranslatableText<"Term ID">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Name">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Slug">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Link">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Description">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Parent ID">;
    args: {
        field: string;
    };
    type: string;
} | {
    label: import("@wordpress/i18n").TranslatableText<"Count">;
    args: {
        field: string;
    };
    type: string;
})[];
declare const _default: {
    name: string;
    usesContext: string[];
    getValues({ select, context, bindings, clientId }: {
        select: any;
        context: any;
        bindings: any;
        clientId: any;
    }): {};
    setValues({ dispatch, context, bindings }: {
        dispatch: any;
        context: any;
        bindings: any;
    }): boolean;
    canUserEditValue({ select, context }: {
        select: any;
        context: any;
    }): boolean;
    getFieldsList({ context, select }: {
        context: any;
        select: any;
    }): ({
        label: import("@wordpress/i18n").TranslatableText<"Term ID">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Name">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Slug">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Link">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Description">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Parent ID">;
        args: {
            field: string;
        };
        type: string;
    } | {
        label: import("@wordpress/i18n").TranslatableText<"Count">;
        args: {
            field: string;
        };
        type: string;
    })[];
};
export default _default;
//# sourceMappingURL=term-data.d.ts.map
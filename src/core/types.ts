import type { ZodSchema } from 'zod';

export type CBLocalized<T> = Partial<Record<string, T>>;

export type CBAdaptive<T> = {
    default: T;
} & Partial<Record<string, T>>;

export type CBSortable<T> = {
    sortIds: string[];
    items: Record<string, T>;
};

export interface CBContext {
    locales: string[];
    defaultLocale: string;
    placeholders?: Partial<{
        string: string;
        imageSrc: string;
    }>;
    generateId: () => string;
}

export interface CBViewContext {
    locale: string;
    defaultLocale: string;
    isPreview?: boolean;
}

export interface CBValidationContext {
    required?: boolean;
    locales: string[];
    defaultLocale: string;
    validationMessages?: {
        requiredField: string;
        incorrectUrlKey: string;
        incorrectValue: string;
        arrayRange: (min: number, max: number) => string;
    };
}

export interface CBField<Data, ViewData> {
    name: string;
    hasResolver?: boolean;
    isEmpty: (data: Data) => boolean;
    getRequiredErrorPaths?: (
        data: Data,
        context: CBValidationContext
    ) => (string | number)[][];
    getInitialData: (data: Data | undefined, context: CBContext) => Data;
    getNormalizedData: (data: Data, context: CBContext) => Data | null;
    getViewData: (
        data: Data,
        context: CBViewContext
    ) => Promise<ViewData | null>;
    getValidationSchema: (context: CBValidationContext) => ZodSchema<any>;
}

export type InferData<T extends CBField<any, any>> = ReturnType<T['getInitialData']>;

export type InferViewData<T extends CBField<any, any>> = Awaited<
    NonNullable<ReturnType<T['getViewData']>>
>;

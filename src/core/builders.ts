import { z } from 'zod';
import type {
    CBField,
    CBSortable,
    CBLocalized,
    CBAdaptive,
    CBValidationContext,
} from './types';

type FieldsMap = Record<string, CBField<any, any>>;
type InferData<T> = T extends CBField<infer D, any> ? D : never;
type InferViewData<T> = T extends CBField<any, infer V> ? V : never;

const extend = <
    Base extends Record<string, any>,
    Overrides extends Partial<Base>,
    Extra extends Record<string, any> = Record<string, never>,
>(
    component: Base,
    overrides?: Overrides | ((base: Base) => Overrides),
    extra?: Extra | ((base: Base) => Extra)
) => {
    const resolvedOverrides =
        typeof overrides === 'function'
            ? overrides(component)
            : (overrides ?? {});

    const resolvedExtra =
        typeof extra === 'function' ? extra(component) : (extra ?? {});

    return {
        ...component,
        ...resolvedOverrides,
        ...resolvedExtra,
    } as Omit<Base, keyof Overrides> & Overrides & Extra;
};

const field = <Data, ViewData>(field: CBField<Data, ViewData>) => {
    return field;
};

const component = <
    Fields extends FieldsMap,
    OptionalKeys extends keyof Fields = never,
>(
    config: {
        name: string;
        hasResolver?: boolean;
        optional?: readonly OptionalKeys[];
    },
    fields: Fields
) => {
    type Data = {
        [K in keyof Fields]: InferData<Fields[K]>;
    };

    type ViewData = {
        [K in keyof Fields as K extends OptionalKeys
            ? never
            : K]: InferViewData<Fields[K]>;
    } & {
        [K in OptionalKeys]?: InferViewData<Fields[K]>;
    };

    const isOptional = (key: string) => config.optional?.includes(key as OptionalKeys);

    const requiredFields = Object.keys(fields).filter(
        (key) => !config.optional?.includes(key as OptionalKeys)
    );

    return {
        name: config.name,
        hasResolver: !!config.hasResolver,

        isEmpty: (data) => {
            return requiredFields.every((key) => fields[key].isEmpty(data[key]));
        },

        getInitialData: (data, context) => {
            const result = {} as Data;
            const { placeholders, ...restContext } = context;

            for (const key in fields) {
                result[key] = fields[key].getInitialData(data?.[key], {
                    ...restContext,
                    placeholders: isOptional(key) ? undefined : placeholders,
                });
            }

            return result;
        },

        getNormalizedData: (data, context) => {
            const result = {} as Data;

            for (const key in fields) {
                const keyData = fields[key].getNormalizedData(
                    data[key],
                    context
                );

                const isRequired = !isOptional(key);

                if (!keyData && isRequired) {
                    return null;
                }

                if (!keyData && !isRequired) {
                    continue;
                }

                //@ts-ignore
                result[key] = keyData;
            }

            return result;
        },

        getViewData: async (data, viewContext) => {
            const result = {} as ViewData;

            for (const key in fields) {
                if (data[key]) {
                    const keyData = await fields[key].getViewData(
                        data[key],
                        viewContext
                    );

                    if (!keyData && !isOptional(key)) {
                        return null;
                    }

                    if (keyData) {
                        //@ts-ignore
                        result[key] = keyData;
                    }
                }
            }

            return result;
        },

        getValidationSchema: (validationsContext) => {
            const shape: Record<string, z.ZodSchema> = {};

            for (const key in fields) {
                const newContext: CBValidationContext = {
                    ...validationsContext,
                    required:
                        validationsContext.required
                            ? (validationsContext.required && !isOptional(key))
                            : validationsContext.required === undefined
                                ? !isOptional(key)
                                : validationsContext.required,
                };

                shape[key] = fields[key].getValidationSchema(newContext);
            }

            const baseSchema = z.object(shape) as z.ZodType<Data>;

            if (!requiredFields.length) {
                return baseSchema;
            }

            return baseSchema.superRefine((value, ctx) => {
                const emptyKeys: string[] = [];
                const filledKeys: string[] = [];

                for (const key of requiredFields) {
                    if (fields[key].isEmpty(value[key])) {
                        emptyKeys.push(key);
                    } else {
                        filledKeys.push(key);
                    }
                }

                if (filledKeys.length === 0) {
                    return;
                }

                if (emptyKeys.length > 0) {
                    emptyKeys.forEach((key) => {
                        const field = fields[key];

                        const paths = field.getRequiredErrorPaths?.(
                            value[key],
                            validationsContext
                        ) ?? [[key]];

                        paths.forEach((subPath) => {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                path: [key, ...subPath],
                                message:
                                    validationsContext.validationMessages
                                        ?.requiredField ?? 'Required field',
                            });
                        });
                    });
                }
            });
        },
    } as CBField<Data, ViewData>;
};

const localized = <Data, ViewData>(cbField: CBField<Data, ViewData>) => {
    return field<CBLocalized<Data>, ViewData>({
        name: `localized-${cbField.name}`,

        isEmpty: (data) => {
            return Object.values(data).every((item) =>
                cbField.isEmpty(item as Data)
            );
        },

        getRequiredErrorPaths: (_, context) => [[context.defaultLocale]],

        getInitialData: (data, context) => {
            const result: CBLocalized<Data> = {};
            const { placeholders, ...restContext } = context;

            for (const locale of context.locales) {
                result[locale] = cbField.getInitialData(data?.[locale], {
                    ...restContext,
                    placeholders:
                        locale === context.defaultLocale
                            ? placeholders
                            : undefined,
                });
            }

            return result;
        },

        getNormalizedData: (data, context) => {
            const result: CBLocalized<Data> = {};

            for (const locale of context.locales) {
                if (!data[locale]) {
                    continue;
                }

                const localeData = cbField.getNormalizedData(
                    data[locale],
                    context
                );

                if (localeData) {
                    result[locale] = localeData;
                }
            }

            if (!result[context.defaultLocale]) {
                return null;
            }

            return result;
        },

        getViewData: async (data, context) => {
            const locale = context.locale;

            if (data[locale]) {
                const result = await cbField.getViewData(
                    data?.[locale],
                    context
                );

                if (result) {
                    return result;
                }
            }

            if (data[context.defaultLocale]) {
                const defaultData = await cbField.getViewData(
                    data[context.defaultLocale]!,
                    context
                );

                if (defaultData) {
                    return defaultData;
                }
            }

            return null;
        },

        getValidationSchema: (context) => {
            const shape: Record<string, z.ZodSchema<any>> = {};

            for (const locale of context.locales) {
                shape[locale] = cbField.getValidationSchema({
                    ...context,
                    required:
                        context.required === undefined
                            ? locale === context.defaultLocale
                            : locale === context.defaultLocale &&
                            context.required,
                });
            }

            return z.object(shape);
        },
    });
};

const adaptive = <Data, ViewData>(
    cbField: CBField<Data, ViewData>,
    screens: string[]
) => {
    return field<CBAdaptive<Data>, CBAdaptive<ViewData>>({
        name: `adaptive-${cbField.name}`,

        isEmpty: (data) => {
            return (
                cbField.isEmpty(data.default) ||
                Object.values(data).every((item) =>
                    cbField.isEmpty(item as Data)
                )
            );
        },

        getRequiredErrorPaths: () => [screens],

        getInitialData: (data, context) => {
            const result: CBAdaptive<Data> = {
                default: cbField.getInitialData(data?.default, context),
            };

            screens.forEach((screen) => {
                result[screen] = cbField.getInitialData(
                    data?.[screen],
                    context
                );
            });

            return result;
        },

        getNormalizedData: (data, context) => {
            const defaultData = cbField.getNormalizedData(
                data?.default,
                context
            );

            if (!defaultData) {
                return null;
            }

            const result: CBAdaptive<Data> = {
                default: defaultData,
            };

            screens.forEach((screen) => {
                if (data[screen]) {
                    const item = cbField.getNormalizedData(
                        data[screen],
                        context
                    );

                    if (item) {
                        result[screen] = item;
                    }
                }
            });

            return result;
        },

        getViewData: async (data, viewContext) => {
            const defaultData = await cbField.getViewData(
                data?.default,
                viewContext
            );

            if (!defaultData) {
                return null;
            }

            const result: CBAdaptive<ViewData> = {
                default: defaultData,
            };

            for (const screen in data) {
                if (screen === 'default') {
                    continue;
                }

                if (data[screen]) {
                    const item = await cbField.getViewData(
                        data[screen],
                        viewContext
                    );

                    if (item) {
                        result[screen] = item;
                    }
                }
            }

            return result;
        },

        getValidationSchema: (validationsContext) => {
            const itemSchema = cbField.getValidationSchema({
                ...validationsContext,
                required: true,
            });

            return z.object({
                default: itemSchema,
                ...screens.reduce(
                    (acc, screen) => {
                        acc[screen] = itemSchema;
                        return acc;
                    },
                    {} as Record<string, z.ZodSchema<any>>
                ),
            });
        },
    });
};

const sortable = <Data, ViewData>(
    cbField: CBField<Data, ViewData>,
    minCount: number,
    maxCount: number
) => {
    return field<CBSortable<Data>, ViewData[]>({
        name: `sortable-${cbField.name}`,

        isEmpty: (data) => {
            return (
                !data.sortIds.length ||
                data.sortIds.every((id) => cbField.isEmpty(data.items[id]))
            );
        },

        getInitialData: (data, context) => {
            const result: CBSortable<Data> = {
                sortIds: [],
                items: {},
            };

            if (data) {
                result.sortIds = data.sortIds;
            } else {
                result.sortIds = Array.from({ length: minCount }).map(() =>
                    context.generateId()
                );
            }

            result.sortIds.forEach((id) => {
                result.items[id] = cbField.getInitialData(
                    data?.items[id],
                    context
                );
            });

            return result;
        },

        getNormalizedData: (data, context) => {
            const result: CBSortable<Data> = {
                sortIds: [],
                items: {},
            };

            data.sortIds.forEach((id) => {
                const item = cbField.getNormalizedData(data.items[id], context);

                if (item) {
                    result.sortIds.push(id);
                    result.items[id] = item;
                }
            });

            if (
                result.sortIds.length < minCount ||
                result.sortIds.length > maxCount
            ) {
                return null;
            }

            return result;
        },

        getViewData: async (data, viewContext) => {
            const promiseList = data.sortIds.map((id) =>
                cbField.getViewData(data.items[id], viewContext)
            );
            const result = (await Promise.all(promiseList)).filter(
                Boolean
            ) as ViewData[];

            if (!result.length) {
                return null;
            }

            return result;
        },

        getValidationSchema: (validationsContext) => {
            const rangeMessage =
                validationsContext.validationMessages?.arrayRange(
                    minCount,
                    maxCount
                );

            return z.object({
                sortIds: z
                    .array(z.string())
                    .min(minCount, rangeMessage)
                    .max(maxCount, rangeMessage),
                items: z.record(
                    cbField.getValidationSchema(validationsContext)
                ),
            });
        },
    });
};

const variants = <Fields extends Record<string, CBField<any, any>>>(
    fields: Fields,
    defaultType?: keyof Fields & string,
) => {
    type TypeKey = keyof Fields & string;
    type ItemData = { [K in TypeKey]: { type: K; data: InferData<Fields[K]> } }[TypeKey];
    type ItemViewData = { [K in TypeKey]: { type: K } & InferViewData<Fields[K]> }[TypeKey];

    const resolvedDefaultType = (defaultType ?? Object.keys(fields)[0]) as TypeKey;

    return field<ItemData, ItemViewData>({
        name: 'variants',

        isEmpty: (data) => fields[data.type].isEmpty(data.data),

        getInitialData: (data, context) => {
            const type = (data?.type ?? resolvedDefaultType) as TypeKey;
            return {
                type,
                data: fields[type].getInitialData(data?.data, context),
            } as ItemData;
        },

        getNormalizedData: (data, context) => {
            const normalized = fields[data.type].getNormalizedData(data.data, context);
            if (!normalized) return null;
            return { type: data.type, data: normalized } as ItemData;
        },

        getViewData: async (data, viewContext) => {
            const viewData = await fields[data.type].getViewData(data.data, viewContext);
            if (!viewData) return null;
            return { type: data.type, ...viewData } as ItemViewData;
        },

        getValidationSchema: (validationsContext) => {
            const variantSchemas = (Object.entries(fields) as [TypeKey, CBField<any, any>][]).map(
                ([type, f]) =>
                    z.object({
                        type: z.literal(type),
                        data: f.getValidationSchema(validationsContext),
                    })
            );

            if (variantSchemas.length === 1) {
                return variantSchemas[0] as z.ZodType<ItemData>;
            }

            return z.discriminatedUnion(
                'type',
                variantSchemas as unknown as [z.ZodObject<any>, z.ZodObject<any>, ...z.ZodObject<any>[]]
            ) as unknown as z.ZodType<ItemData>;
        },
    });
};

const withoutPlaceholder = <Data, ViewData>(
    cbField: CBField<Data, ViewData>
) => {
    return extend(cbField, {
        getInitialData: (data, context) =>
            cbField.getInitialData(data, {
                ...context,
                placeholders: undefined,
            }),
    });
};

export const core = {
    extend,
    field,
    component,
    localized,
    sortable,
    variants,
    adaptive,
    withoutPlaceholder,
};

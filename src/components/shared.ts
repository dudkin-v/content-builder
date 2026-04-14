import { z } from 'zod';
import { core, type InferData, type InferViewData } from '../core';

const string = core.field<string, string>({
	name: 'string',

	isEmpty: (data) => !data || data.trim().length === 0,

	getInitialData: (data, context) =>
		data || context.placeholders?.string || '',

	getNormalizedData: (data) => {
		const trimmedData = data.trim();
		return trimmedData || null;
	},

	getViewData: async (data) => {
		return data || null;
	},

	getValidationSchema: ({ required, validationMessages }) => {
		const baseSchema = z.string();

		if (!required) {
			return baseSchema;
		}

		return baseSchema.trim().min(1, validationMessages?.requiredField);
	},
});

const localizedString = core.localized(string);
const stringWithoutPlaceholder = core.withoutPlaceholder(string);

const boolean = core.field<boolean, boolean>({
	name: 'boolean',
	isEmpty: (data) => data === undefined || data === null,
	getInitialData: (data) => !!data,
	getNormalizedData: (data) => data,
	getViewData: async (data) => data,
	getValidationSchema: () => z.boolean(),
});

const number = core.field<number, number>({
	name: 'number',
	isEmpty: (data) => {
		const numberData = Number(data);
		return isNaN(numberData);
	},
	getInitialData: (data) => {
		const numberData = Number(data);

		if (isNaN(numberData)) {
			return 0;
		}

		return numberData;
	},
	getNormalizedData: (data) => data,
	getViewData: async (data) => data,
	getValidationSchema: () => z.number(),
});

const imageSrc = core.extend(string, {
	name: 'image-src',
	getInitialData: (data, context) =>
		data || context.placeholders?.imageSrc || '',

	getValidationSchema: ({ required, validationMessages }) => {
		if (!required) {
			return z.string();
		}

		return z.string().url(validationMessages?.requiredField);
	},
});

const simplePicture = core.component(
	{ name: 'simple-picture' },
	{
		src: imageSrc,
		alt: localizedString,
	}
);

const simplePictureWithSize = core.component(
	{ name: 'simple-picture-with-size' },
	{
		src: imageSrc,
		alt: localizedString,
		width: number,
		height: number,
	}
);

const urlKey = core.extend(string, (base) => {
	return {
		name: 'url-key',
		getValidationSchema: (context) => {
			const baseSchema = base.getValidationSchema(context);

			return baseSchema.refine(
				(value) => {
					if (!value) {
						return true;
					}

					return /^(?:\/(?:$|[a-z0-9]+(?:-[a-z0-9]+)?(?:\/[a-z0-9-]+)*(?:\?[a-z0-9=&-]*)?)|#.+)$/.test(
						value
					);
				},
				{
					message: context.validationMessages?.incorrectUrlKey,
				}
			);
		},
	};
});

const localizedUrlKey = core.localized(urlKey);

const link = core.component(
	{ name: 'link' },
	{
		label: localizedString,
		urlKey: localizedUrlKey,
	}
);

const button = core.component(
	{ name: 'button', optional: ['variant', 'color', 'size'] },
	{
		label: localizedString,
		urlKey: localizedUrlKey,
		variant: stringWithoutPlaceholder,
		color: stringWithoutPlaceholder,
		size: stringWithoutPlaceholder,
	}
);

const configurableText = core.component(
	{
		name: 'configurable-text',
		optional: ['color', 'tag'],
	},
	{
		value: localizedString,
		tag: stringWithoutPlaceholder,
		color: stringWithoutPlaceholder,
	}
);

const staticComponent = core.field<'static', 'static'>({
	name: 'static',
	isEmpty: () => false,
	getInitialData: () => 'static',
	getNormalizedData: () => 'static',
	getViewData: async () => 'static',
	getValidationSchema: () => z.literal('static'),
});

export const shared = {
	string,
	boolean,
	number,
	localizedString,
	stringWithoutPlaceholder,
	imageSrc,
	simplePicture,
	simplePictureWithSize,
	urlKey,
	localizedUrlKey,
	button,
	link,
	configurableText,
	static: staticComponent,
};

export type StringData = InferData<typeof shared.string>;
export type StringViewData = InferViewData<typeof shared.string>;

export type LocalizedStringData = InferData<typeof shared.localizedString>;
export type LocalizedStringViewData = InferViewData<typeof shared.localizedString>;

export type SimplePictureData = InferData<typeof shared.simplePicture>;
export type SimplePictureViewData = InferViewData<typeof shared.simplePicture>;

export type SimplePictureWithSizeData = InferData<typeof shared.simplePictureWithSize>;
export type SimplePictureWithSizeViewData = InferViewData<typeof shared.simplePictureWithSize>;

export type LinkData = InferData<typeof shared.link>;
export type LinkViewData = InferViewData<typeof shared.link>;

export type ButtonData = InferData<typeof shared.button>;
export type ButtonViewData = InferViewData<typeof shared.button>;

export type UrlKeyData = InferData<typeof shared.urlKey>;
export type UrlKeyViewData = InferViewData<typeof shared.urlKey>;

export type ConfigurableTextData = InferData<typeof shared.configurableText>;
export type ConfigurableTextViewData = InferViewData<typeof shared.configurableText>;

export type SectionData = {
	title?: ConfigurableTextData;
	link?: LinkData;
};

export type SectionViewData = {
	title?: ConfigurableTextData;
	link?: LinkViewData;
};

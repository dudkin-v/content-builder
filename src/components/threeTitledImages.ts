import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const threeTitledImagesItem = core.component(
	{ name: 'Three titled images item' },
	{
		title: shared.localizedString,
		image: core.component(
			{ name: 'Adaptive Image' },
			{
				src: core.adaptive(shared.imageSrc, ['md']),
				alt: shared.localizedString,
			}
		),
	}
);

export const threeTitledImages = core.component(
	{ name: 'Three titled images', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(threeTitledImagesItem, 3, 3),
	}
);

export type ThreeTitledImagesData = InferData<typeof threeTitledImages>;
export type ThreeTitledImagesViewData = InferViewData<typeof threeTitledImages>;
export type ThreeTitledImagesItemData = InferData<typeof threeTitledImagesItem>;
export type ThreeTitledImagesItemViewData = InferViewData<typeof threeTitledImagesItem>;


import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const simpleImagesCarouselItem = core.component(
	{ name: 'Simple images carousel item', optional: ['urlKey'] },
	{
		image: shared.simplePicture,
		urlKey: shared.localizedUrlKey,
	}
);

export const simpleImagesCarousel = core.component(
	{ name: 'Simple images carousel', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(simpleImagesCarouselItem, 4, 16),
	}
);

export type SimpleImagesCarouselData = InferData<typeof simpleImagesCarousel>;
export type SimpleImagesCarouselViewData = InferViewData<typeof simpleImagesCarousel>;
export type SimpleImagesCarouselItemData = InferData<typeof simpleImagesCarouselItem>;
export type SimpleImagesCarouselItemViewData = InferViewData<typeof simpleImagesCarouselItem>;

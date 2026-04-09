import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const circleCardsCarouselItem = core.component(
	{ name: 'Circle cards carousel item', optional: ['urlKey', 'title', 'highlightedColor'] },
	{
		image: shared.simplePicture,
		urlKey: shared.localizedUrlKey,
		title: shared.localizedString,
		highlightedColor: shared.stringWithoutPlaceholder,
	}
);

export const circleCardsCarousel = core.component(
	{ name: 'Circle cards carousel', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(circleCardsCarouselItem, 4, 16),
	}
);

export type CircleCardsCarouselData = InferData<typeof circleCardsCarousel>;
export type CircleCardsCarouselViewData = InferViewData<typeof circleCardsCarousel>;
export type CircleCardsCarouselItemData = InferData<typeof circleCardsCarouselItem>;
export type CircleCardsCarouselItemViewData = InferViewData<typeof circleCardsCarouselItem>;

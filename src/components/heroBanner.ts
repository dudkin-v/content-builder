import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const heroBannerItem = core.component(
	{
		name: 'Hero banner item',
		optional: ['title', 'button', 'staticCTAButtons', 'variant', 'urlKey'],
	},
	{
		title: shared.configurableText,
		button: shared.button,
		staticCTAButtons: core.sortable(shared.staticCTAButton, 1, 2),
		variant: shared.stringWithoutPlaceholder,
		urlKey: shared.localizedUrlKey,
		image: core.component(
			{ name: 'Adaptive Image' },
			{
				src: core.adaptive(shared.imageSrc, ['md']),
				alt: shared.localizedString,
			}
		),
	}
);

export const heroBanner = core.component(
	{ name: 'Hero banner' },
	{
		items: core.sortable(heroBannerItem, 1, 4),
	}
);

export type HeroBannerData = InferData<typeof heroBanner>;
export type HeroBannerViewData = InferViewData<typeof heroBanner>;
export type HeroBannerItemData = InferData<typeof heroBannerItem>;
export type HeroBannerItemViewData = InferViewData<typeof heroBannerItem>;

import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const defaultProductsCarousel = core.component(
	{ name: 'Default products carousel', hasResolver: true },
	{
		type: shared.stringWithoutPlaceholder,
	}
);

export type DefaultProductsCarouselData = InferData<typeof defaultProductsCarousel>;
export type DefaultProductsCarouselViewData = InferViewData<typeof defaultProductsCarousel>;

import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const imagesGridItem = core.component(
	{ name: 'Images grid item', optional: ['title', 'urlKey'] },
	{
		image: shared.simplePicture,
		urlKey: shared.localizedUrlKey,
		title: shared.localizedString,
	}
);

export const imagesGrid = core.component(
	{ name: 'Images grid', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(imagesGridItem, 4, 20),
	}
);

export type ImagesGridData = InferData<typeof imagesGrid>;
export type ImagesGridViewData = InferViewData<typeof imagesGrid>;
export type ImagesGridItemData = InferData<typeof imagesGridItem>;
export type ImagesGridItemViewData = InferViewData<typeof imagesGridItem>;

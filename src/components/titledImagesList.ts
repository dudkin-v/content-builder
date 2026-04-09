import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const titledImagesListItem = core.component(
	{ name: 'Titled images list item' },
	{
		title: shared.localizedString,
		image: shared.simplePictureWithSize,
	}
);

export const titledImagesList = core.component(
	{ name: 'Titled images list', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(titledImagesListItem, 3, 10),
	}
);

export type TitledImagesListData = InferData<typeof titledImagesList>;
export type TitledImagesListViewData = InferViewData<typeof titledImagesList>;
export type TitledImagesListItemData = InferData<typeof titledImagesListItem>;
export type TitledImagesListItemViewData = InferViewData<typeof titledImagesListItem>;

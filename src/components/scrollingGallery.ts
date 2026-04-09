import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const scrollingGalleryItem = core.component(
	{ name: 'Scrolling gallery item', optional: ['title'] },
	{
		title: shared.localizedString,
		image: shared.simplePicture,
	}
);

export const scrollingGalleryRow = core.sortable(scrollingGalleryItem, 5, 10);

export const scrollingGallery = core.component(
	{ name: 'Scrolling gallery', optional: ['title'] },
	{
		title: shared.configurableText,
		rows: core.sortable(scrollingGalleryRow, 1, 3),
	}
);

export type ScrollingGalleryData = InferData<typeof scrollingGallery>;
export type ScrollingGalleryViewData = InferViewData<typeof scrollingGallery>;
export type ScrollingGalleryItemData = InferData<typeof scrollingGalleryItem>;
export type ScrollingGalleryItemViewData = InferViewData<typeof scrollingGalleryItem>;
export type ScrollingGalleryRowData = InferData<typeof scrollingGalleryRow>;
export type ScrollingGalleryRowViewData = InferViewData<typeof scrollingGalleryRow>;

import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const threeSimpleImages = core.component(
	{ name: 'Three simple images', optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		items: core.sortable(shared.simplePicture, 3, 3),
	}
);

export type ThreeSimpleImagesData = InferData<typeof threeSimpleImages>;
export type ThreeSimpleImagesViewData = InferViewData<typeof threeSimpleImages>;

import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const textWithImage = core.component(
	{
		name: 'Text with image',
		optional: ['title', 'link', 'reverse'],
	},
	{
		title: shared.configurableText,
		link: shared.link,
		description: shared.localizedString,
		image: shared.simplePicture,
		reverse: shared.boolean,
	}
);

export type TextWithImageData = InferData<typeof textWithImage>;
export type TextWithImageViewData = InferViewData<typeof textWithImage>;

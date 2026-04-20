import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const heroSection = core.component(
	{ name: 'Hero section', optional: ['buttons'] },
	{
		title: shared.configurableText,
		description: shared.localizedString,
		image: shared.simplePicture,
		buttons: core.sortable(shared.button, 1, 2),
	}
);

export type HeroSectionData = InferData<typeof heroSection>;
export type HeroSectionViewData = InferViewData<typeof heroSection>;

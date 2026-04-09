import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const heroSection = core.component(
	{ name: 'Hero section', optional: ['button', 'showContactsButton'] },
	{
		title: shared.configurableText,
		description: shared.localizedString,
		image: shared.simplePicture,
		button: shared.button,
		showContactsButton: shared.boolean,
	}
);

export type HeroSectionData = InferData<typeof heroSection>;
export type HeroSectionViewData = InferViewData<typeof heroSection>;

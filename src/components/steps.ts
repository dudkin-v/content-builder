import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const stepsItem = core.component(
	{ name: 'Steps item' },
	{
		title: shared.localizedString,
		description: shared.localizedString,
	}
);

export const steps = core.component(
	{ name: 'Steps', optional: ['title'] },
	{
		title: shared.configurableText,
		items: core.sortable(stepsItem, 3, 9),
	}
);

export type StepsData = InferData<typeof steps>;
export type StepsViewData = InferViewData<typeof steps>;
export type StepsItemData = InferData<typeof stepsItem>;
export type StepsItemViewData = InferViewData<typeof stepsItem>;

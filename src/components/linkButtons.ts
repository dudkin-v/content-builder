import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const linkButtons = core.component(
	{ name: 'Link buttons', optional: ['title'] },
	{
		title: shared.configurableText,
		items: core.sortable(shared.link, 5, 15),
	}
);

export type LinkButtonsData = InferData<typeof linkButtons>;
export type LinkButtonsViewData = InferViewData<typeof linkButtons>;

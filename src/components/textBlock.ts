import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const textBlock = core.component(
	{
		name: 'Text block',
		optional: [
			'title',
			'buttons',
			'align',
			'bgColor',
		],
	},
	{
		title: shared.configurableText,
		content: shared.configurableText,
		buttons: core.sortable(shared.button, 1, 2),
		align: shared.stringWithoutPlaceholder,
		bgColor: shared.stringWithoutPlaceholder,
	}
);

export type TextBlockData = InferData<typeof textBlock>;
export type TextBlockViewData = InferViewData<typeof textBlock>;

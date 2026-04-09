import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const textBlock = core.component(
	{
		name: 'Text block',
		optional: [
			'title',
			'button',
			'align',
			'bgColor',
			'showContactsButton',
		],
	},
	{
		title: shared.configurableText,
		content: shared.configurableText,
		button: shared.button,
		align: shared.stringWithoutPlaceholder,
		bgColor: shared.stringWithoutPlaceholder,
		showContactsButton: shared.boolean,
	}
);

export type TextBlockData = InferData<typeof textBlock>;
export type TextBlockViewData = InferViewData<typeof textBlock>;

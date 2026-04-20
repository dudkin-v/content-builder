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
		buttons: core.sortableVariants({
			[shared.customButton.name]: shared.customButton,
			[shared.staticButton.name]: shared.staticButton,
		}, 1, 2),
		align: shared.stringWithoutPlaceholder,
		bgColor: shared.stringWithoutPlaceholder,
	}
);

export type TextBlockData = InferData<typeof textBlock>;
export type TextBlockViewData = InferViewData<typeof textBlock>;

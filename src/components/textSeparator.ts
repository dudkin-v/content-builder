import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const textSeparator = core.component(
	{ name: 'Text separator' },
	{
		words: core.sortable(shared.localizedString, 3, 12),
	}
);

export type TextSeparatorData = InferData<typeof textSeparator>;
export type TextSeparatorViewData = InferViewData<typeof textSeparator>;

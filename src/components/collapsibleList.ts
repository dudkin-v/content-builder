import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const collapsibleListItem = core.component(
	{ name: 'Collapsible list item', optional: ['isDefaultExpanded'] },
	{
		title: shared.localizedString,
		description: shared.localizedString,
		isDefaultExpanded: shared.boolean,
	}
);

export const collapsibleList = core.component(
	{ name: 'Collapsible list' },
	{
		title: shared.configurableText,
		items: core.sortable(collapsibleListItem, 3, 10),
	}
);

export type CollapsibleListData = InferData<typeof collapsibleList>;
export type CollapsibleListViewData = InferViewData<typeof collapsibleList>;
export type CollapsibleListItemData = InferData<typeof collapsibleListItem>;
export type CollapsibleListItemViewData = InferViewData<typeof collapsibleListItem>;

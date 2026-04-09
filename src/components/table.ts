import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

export const tableRow = core.sortable(shared.localizedString, 2, 10);

export const table = core.component(
	{ name: 'Table', optional: ['title', 'caption'] },
	{
		title: shared.configurableText,
		caption: shared.localizedString,
		columns: tableRow,
		rows: core.sortable(tableRow, 2, 20),
	}
);

export type TableData = InferData<typeof table>;
export type TableViewData = InferViewData<typeof table>;
export type TableRowData = InferData<typeof tableRow>;
export type TableRowViewData = InferViewData<typeof tableRow>;

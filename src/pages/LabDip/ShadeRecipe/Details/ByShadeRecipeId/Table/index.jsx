import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

export default function Index({ shade_recipe_entry }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Dyes',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity (Solution %)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[shade_recipe_entry]
	);

	return (
		<ReactTableTitleOnly
			title='Details'
			data={shade_recipe_entry}
			columns={columns}
		/>
	);
}

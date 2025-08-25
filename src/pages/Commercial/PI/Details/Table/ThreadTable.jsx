import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { CustomLink, DateTime } from '@/ui';

export default function ThreadTable({ pi_cash_entry_thread }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_info_uuid',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<CustomLink
							label={order_number}
							url={`/thread/order-info/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},

			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi_cash_quantity',
				header: 'QTY (Cone)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price_pcs',
				// header: 'Unit Price(Cone) ($)',
				header: (
					<div className='flex flex-col'>
						<span>Unit Price</span>
						<span>(Cone) ($)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'value',
				header: 'Value ($)',
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[pi_cash_entry_thread]
	);

	const totalQty = pi_cash_entry_thread.reduce(
		(a, b) => a + Number(b.pi_cash_quantity),
		0
	);
	const totalValue = pi_cash_entry_thread.reduce(
		(a, b) => a + Number(b.value),
		0
	);

	return (
		<ReactTableTitleOnly
			title='Thread Details'
			data={pi_cash_entry_thread}
			columns={columns}
		>
			<tr className='text-sm'>
				<td colSpan='4' className='py-2 text-right'>
					Total QTY
				</td>
				<td className='pl-3 text-left font-semibold'>{totalQty}</td>

				<td className='text-right'>Total Value</td>
				<td className='pl-3 text-left font-semibold'>
					${Number(totalValue).toLocaleString()}
				</td>
			</tr>
		</ReactTableTitleOnly>
	);
}

import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { CustomLink, DateTime } from '@/ui';

export default function ZipperTable({ pi }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
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
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => (info.getValue() === 1 ? 'INCH' : 'CM'),
			},
			{
				accessorKey: 'pi_cash_quantity',
				header: (
					<>
						QTY <br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi_cash_quantity_dzn',
				header: (
					<>
						QTY <br />
						(Dzn)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
			},
			{
				accessorKey: 'unit_price_pcs',
				header: (
					<>
						Unit Price <br />
						(PCS) ($)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
			},
			{
				accessorKey: 'unit_price',
				header: (
					<div className='flex flex-col'>
						<span>Unit Price</span>
						<span>(Dzn) ($)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'value',
				header: 'Value ($)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
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
		[pi]
	);

	const totalQty = pi.reduce((a, b) => a + Number(b.pi_cash_quantity), 0);
	const totalValue = pi.reduce((a, b) => a + Number(b.value), 0);

	return (
		<ReactTableTitleOnly title='Zipper Details' data={pi} columns={columns}>
			<tr className='text-sm'>
				<td colSpan='5' className='py-2 text-right'>
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

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useWarehouseOutLog } from '@/state/Delivery';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, LinkWithCopy, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());

	const haveAccess = useAccess('delivery__warehouse_out');
	const { user } = useAuth();
	const { data, isLoading, url } = useWarehouseOutLog(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		{
			enabled: true,
		}
	);
	const info = new PageInfo('Warehouse Out', url, 'delivery__log');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'packing_number',
				header: 'Packing List',
				width: 'w-36',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/delivery/packing-list'
						/>
					);
				},
			},

			{
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-40',
				cell: (info) => {
					const { order_info_uuid, item_for } = info.row.original;

					if (item_for === 'thread' || item_for === 'sample_thread') {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_info_uuid}
								uri='/thread/order-info'
							/>
						);
					}
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse_received_date',
				header: 'Received Date',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan',
				width: 'w-36',
				cell: (info) => {
					const { challan_number, challan_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={challan_number}
							id={challan_uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},

			{
				accessorKey: 'gate_pass_date',
				header: (
					<span>
						Warehouse <br />
						Out Date
					</span>
				),
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},

			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn(row) {
					const { color } = row;
					return color?.join(', ') || '--';
				},
				id: 'color',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_size',
				header: 'Carton Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_weight',
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count',
				header: 'Count',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_wise_rank } = info.row.original;
					const { packing_list_wise_count } = info.row.original;

					return `${packing_list_wise_rank}/${packing_list_wise_count}`;
				},
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-2'}
			showDateRange={false}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'from'}
						value={from}
						placeholder='From'
						onChange={(data) => {
							setFrom(data);
						}}
						selected={from}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'to'}
						value={to}
						placeholder='To'
						onChange={(data) => {
							setTo(data);
						}}
						selected={to}
					/>
				</div>
			}
		/>
	);
}

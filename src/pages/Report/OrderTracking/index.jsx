import { useEffect, useMemo, useState } from 'react';
import { useOrderTracing } from '@/state/Report';
import { format } from 'date-fns';
import { Bus, CircleUserRound, Phone } from 'lucide-react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, Status } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const haveAccess = useAccess('report__order_tracking');

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url } = useOrderTracing(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const info = new PageInfo('Order Tracking', url, 'report__order_tracking');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const order_uuid = info.row.original.order_info_uuid;
					const link = info.getValue().includes('ST')
						? `/thread/order-info/${order_uuid}`
						: `/order/details/${info.getValue()}`;
					return (
						<CustomLink
							label={info.getValue()}
							url={link}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) =>
					format(row.order_created_at, 'dd MMM, yyyy'),
				id: 'order_created_at',
				header: (
					<>
						Order <br />
						Cre. Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_created_at}
						isTime={false}
						customizedDateFormate='dd MMM, yyyy'
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: true,
				width: 'w-32',
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
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => {
					const { challan_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${challan_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => format(row.challan_date, 'dd MMM, yyyy'),
				id: 'challan_date',
				header: (
					<>
						Challan <br />
						Cre. Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_date}
						isTime={false}
						customizedDateFormate='dd MMM, yyyy'
					/>
				),
			},
			{
				accessorFn: (row) =>
					format(row.challan_delivered_date, 'dd MMM, yyyy'),
				id: 'challan_delivered_date ',
				header: (
					<>
						Challan <br />
						Deli. Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_delivered_date}
						isTime={false}
						customizedDateFormate='dd MMM, yyyy'
					/>
				),
			},
			{
				accessorKey: 'challan_created_by_name',
				header: (
					<>
						Challan <br />
						Cre. By
					</>
				),
				enableColumnFilter: false,
				width: 'w-15',
				cell: (info) => info.getValue(),
			},

			// ? Vehicle
			{
				accessorFn: (row) =>
					`${row.vehicle_name ? row.vehicle_name : '--'}/${row.vehicle_number ? row.vehicle_number : '--'}/${row.driver_name ? row.driver_name : '--'}`,
				id: 'vehicle_name',
				header: 'Vehicle',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { vehicle_name, vehicle_number, driver_name } =
						info.row.original;
					if (!vehicle_name) return '--';
					return (
						<div className='flex flex-col gap-2'>
							<div className='flex items-center gap-1'>
								<Bus className='size-6' />
								<span>{vehicle_name}</span>
							</div>
							<div className='flex items-center gap-1'>
								<CircleUserRound className='size-6' />
								<span>{driver_name}</span>
							</div>
							<div className='flex items-center gap-1'>
								<Phone className='size-6' />
								<span>{vehicle_number}</span>
							</div>
						</div>
					);
				},
			},

			{
				accessorFn: (row) =>
					format(row.swatch_approval_date, 'dd MMM, yyyy'),
				id: 'swatch_approval_date',
				header: (
					<>
						Swatch <br />
						App. Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_date}
						isTime={false}
						customizedDateFormate='dd MMM, yyyy'
					/>
				),
			},

			// ? Style/color/size/unite
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					if (row.order_type === 'tape') return 'MTR';
					return row.is_inch ? 'IN' : 'CM';
				},
				id: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			// ? QTY
			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved_quantity',
				header: 'App. QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'not_approved_quantity',
				header: 'Not App. QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_quantity',
				header: 'Challan QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_batch_quantity',
				header: 'Total B/Q',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					return row.dyeing_batch
						?.map((item) => item.dyeing_batch_number)
						.join(', ');
				},
				id: 'dyeing_batch',
				header: 'Dyeing Batch',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { dyeing_batch } = row.original;

					if (!dyeing_batch?.length) return '--';

					return dyeing_batch?.map((item) => {
						return (
							<div
								key={item.dyeing_batch_number}
								className='flex flex-col border-b-2 border-primary/50 p-1 last:border-0'
							>
								<CustomLink
									label={item.dyeing_batch_number}
									url={`/dyeing-and-iron/zipper-batch/${item.dyeing_batch_uuid}`}
									openInNewTab={true}
								/>
								<div className='flex items-center gap-2'>
									<DateTime
										date={item.dyeing_batch_date}
										customizedDateFormate='dd MMM, yy'
										isTime={false}
									/>

									<Status status={item.received} />
								</div>
							</div>
						);
					});
				},
			},
			{
				accessorFn: (row) => {
					return row.finishing_batch
						?.map((item) => item.finishing_batch_number)
						.join(', ');
				},
				id: 'finishing_batch',
				header: 'Finishing Batch',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { finishing_batch } = row.original;
					if (!finishing_batch?.length) return '--';

					return (
						<table className='border-2 border-gray-300'>
							<thead>
								<tr className='text-xs text-gray-600'>
									<th className={cn(rowStyle)}>BA/N</th>
									<th className={cn(rowStyle)}>BA/Q</th>
									<th className={cn(rowStyle)}>P/Q</th>
									<th className={cn(rowStyle)}>BL/Q</th>
								</tr>
							</thead>
							<tbody>
								{finishing_batch?.map((item) => (
									<tr>
										<td className={cn(rowStyle)}>
											<CustomLink
												label={
													item.finishing_batch_number
												}
												url={`/planning/finishing-batch/${item.finishing_batch_uuid}`}
												showCopyButton={false}
												openInNewTab
											/>
											<DateTime
												date={item.finishing_batch_date}
												customizedDateFormate='dd MMM, yy'
												isTime={false}
											/>
										</td>
										<td className={cn(rowStyle)}>
											{item.finishing_batch_quantity}
										</td>
										<td className={cn(rowStyle)}>
											{item.finishing_batch_quantity -
												item.finishing_batch_balance_quantity}
										</td>
										<td className={cn(rowStyle)}>
											{
												item.finishing_batch_balance_quantity
											}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorKey: 'teeth_molding_prod',
				header: (
					<>
						Teeth Molding <br />
						Prod.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_finishing_stock',
				header: 'Slider QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_finished_quantity',
				header: (
					<>
						Total Finishing <br />
						QTY.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse',
				header: 'Warehouse',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			// ? PI
			{
				accessorKey: 'pi_number',
				header: 'PI No.',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/commercial/pi/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'pi',
				header: 'PI QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi_value',
				header: 'PI Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},

			// ? LC
			{
				accessorKey: 'lc_number',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lc_value',
				header: 'LC Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					format(row.order_created_at, 'dd MMM,yyyy'),
				id: 'order_created_at',
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.updated_at &&
					format(row.order_updated_at, 'dd MMM,yyyy'),
				id: 'order_updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
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

	let rowStyle = 'border border-gray-300 px-2 py-1';
	return (
		<ReactTable
			title={info.getTitle()}
			subtitle={
				<div className='flex flex-col'>
					<span>
						warehouse = when the packing list is warehouse received
					</span>
					<span>
						delivered = when the packing list is warehouse out
					</span>
					<span>balance = order qty - (warehouse + delivered)</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'Date'}
						value={date}
						placeholder='Date'
						onChange={(data) => {
							setDate(data);
						}}
						selected={date}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'toDate'}
						value={toDate}
						placeholder='To'
						onChange={(data) => {
							setToDate(data);
						}}
						selected={toDate}
					/>
				</div>
			}
		/>
	);
}

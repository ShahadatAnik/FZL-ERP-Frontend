import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useZipperProduction } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, Status, StatusButton } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

import { ProductionStatus } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__zipper_production');
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const { data, isLoading, url, refetch } = useZipperProduction(
		`status=${status}&${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Zipper Production Status',
		url,
		'report__zipper_production'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) =>
					`${row.is_sample ? 'Y' : 'N'}/${row.is_bill ? 'Y' : 'N'}/${row.is_cash ? 'Y' : 'N'}`,
				id: 'id',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={is_cash} />
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorFn: (row) => format(row.order_created_at, 'dd MMM, yy'),
				id: 'order_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_created_at}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.order_description_updated_at
						? format(row.order_description_updated_at, 'dd MMM, yy')
						: '--',
				id: 'order_description_updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_description_updated_at}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
				enableColumnFilter: false,
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
				accessorFn: (row) => row.colors.join(', '),
				id: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<div className='flex-wrap'>{info.getValue()}</div>
				),
			},
			{
				accessorKey: 'swatch_approval_count',
				header: 'Swatch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.styles.join(', '),
				id: 'styles',
				header: 'Styles',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<div className='flex-wrap'>{info.getValue()}</div>
				),
			},
			{
				accessorFn: (row) => row.sizes + ' (' + row.size_count + ')',
				id: 'sizes',
				header: 'Size (cm)',
				enableColumnFilter: false,
				cell: (info) => {
					const { sizes, size_count } = info.row.original;
					return (
						<div className='flex flex-col'>
							<span>{sizes} </span>
							<span>#{size_count}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.total_quantity - row.total_packing_list_quantity,
				id: 'prod_balance_quantity',
				header: 'Balance QTY',
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
												item.balance_quantity}
										</td>
										<td className={cn(rowStyle)}>
											{item.balance_quantity}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorKey: 'assembly_production_quantity',
				header: (
					<>
						Slider <br />
						Assembly
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_production_quantity',
				header: (
					<>
						Slider <br />
						Coloring
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_tape_coil_to_dyeing_quantity',
				header: (
					<>
						Tape Prep <br />
						(kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: (
					<>
						Dyeing <br />
						(kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.teeth_molding_quantity + ' ' + row.teeth_molding_unit,
				id: 'teeth_molding',
				header: (
					<>
						Teeth <br />
						Molding
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_coloring_quantity',
				header: (
					<>
						Teeth <br />
						Coloring
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_quantity',
				header: 'Finishing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_packing_list_quantity',
				header: 'Packing List',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.total_delivery_delivered_quantity +
					row.total_delivery_balance_quantity,
				id: 'total_delivery_balance_quantity',
				header: 'Challan',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_short_quantity',
				header: 'Short',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_reject_quantity',
				header: 'Reject',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivery_delivered_quantity',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	let rowStyle = 'border border-gray-300 px-2 py-1';
	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<ProductionStatus
					className='w-44'
					status={status}
					setStatus={setStatus}
					page='report__zipper_production'
				/>
			}
		/>
	);
}

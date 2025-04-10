import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadProductionOrderWise } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { ProductionStatus } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__thread_production_order_wise');
	const { user } = useAuth();

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [status, setStatus] = useState('pending');
	const { data, isLoading, url } = useThreadProductionOrderWise(
		`status=${status}&from=${format(from, 'yyyy-MM-dd')}&to=${format(to, 'yyyy-MM-dd')}${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo(
		'Thread Production Status (Order wise)',
		url,
		'report__thread_production_order_wise'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/thread/order-info/${order_info_uuid}`}
							openInNewTab={true}
						/>
					);
				},
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
					row.order_updated_at
						? format(row.order_updated_at, 'dd MMM, yy')
						: '--',
				id: 'order_updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_updated_at}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.style?.join(', '),
				id: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-24',
			},
			{
				accessorFn: (row) => row.color?.join(', '),
				id: 'color',
				header: 'Color',
				width: 'w-24',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) => {
					return row.thread_batch
						?.map((item) => item.finishing_batch_number)
						.join(', ');
				},
				id: 'thread_batch',
				header: 'Thread Batch',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { thread_batch } = row.original;

					if (!thread_batch?.length) return '--';

					return thread_batch?.map((item) => {
						const accomplishedPercentage =
							Math.round(
								((item.batch_quantity - item.balance_quantity) /
									item.batch_quantity) *
									100
							) || 0;
						return (
							<div
								key={item.batch_number}
								className='flex flex-col border-b-2 border-primary/50 p-1 last:border-0'
							>
								<CustomLink
									label={item.batch_number}
									url={`/planning/finishing-batch/${item.batch_uuid}`}
									openInNewTab={true}
								/>
								<div className='flex items-center gap-2'>
									<DateTime
										date={item.batch_date}
										customizedDateFormate='dd MMM, yy'
										isTime={false}
									/>
									<span className='badge badge-secondary badge-xs'>
										{accomplishedPercentage}%
									</span>
								</div>
							</div>
						);
					});
				},
			},
			// {
			// 	accessorFn: (row) =>
			// 		format(row.swatch_approval_date, 'dd/MM/yy'),
			// 	id: 'swatch_approval_date',
			// 	header: 'Swatch',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<DateTime
			// 			date={info.row.original.swatch_approval_date}
			// 			isTime={false}
			// 		/>
			// 	),
			// },
			{
				accessorFn: (row) => row.count_length_name?.join(', '),
				id: 'count',
				header: 'Count/Length',
				width: 'w-24',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_approved_quantity',
				header: 'Swatch App.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_weight',
				header: 'Expected',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'yarn_quantity',
				header: 'Issued',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_coning_production_quantity',
				header: 'Coning',
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
				accessorKey: 'balance_quantity',
				header: 'Balance',
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
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'from'}
							value={from}
							selected={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(data);
							}}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'to'}
							value={to}
							selected={to}
							placeholder='To'
							onChange={(data) => {
								setTo(data);
							}}
						/>
						<ProductionStatus
							className='w-44'
							status={status}
							setStatus={setStatus}
							page='report__thread_production'
						/>
					</div>
				}
			/>
		</>
	);
}

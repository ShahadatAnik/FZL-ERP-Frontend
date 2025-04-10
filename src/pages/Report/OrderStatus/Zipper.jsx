import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useZipperStatus } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__order_status');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading, url } = useZipperStatus(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

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
				accessorFn: (row) => row.pi_numbers.join(', '),
				id: 'pi_numbers',
				header: 'PI',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.lc_numbers.join(', '),
				id: 'lc_numbers',
				header: 'LC',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
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
				accessorFn: (row) => (row.style ? row.style : '---'),
				id: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.color ? row.color : '---'),
				id: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'not_approved_quantity',
				header: 'Not Approved QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved_quantity',
				header: 'Approved QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_quantity',
				header: 'Dyeing QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_coloring_quantity',
				header: 'Slider QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_finishing_quantity',
				header: 'Finishing QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: 'Company Price',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => format(row.created_at, 'dd MMM,yyyy'),
				id: 'created_at',
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
					row.updated_at && format(row.updated_at, 'dd MMM,yyyy'),
				id: 'updated_at',
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
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='zipper'
			showDateRange={false}
			title={'Zipper Status'}
			subtitle={
				<div className='flex flex-col'>
					<span>
						delivered = when the packing list is warehouse out
					</span>
					<span>balance = order qty - delivered</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
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

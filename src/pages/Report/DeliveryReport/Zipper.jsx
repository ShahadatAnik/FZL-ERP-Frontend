import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDeliveryReportZipper } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, StatusButton } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__delivery_report');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading, url } = useDeliveryReportZipper(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => (row.receive_status ? 'Y' : 'N'),
				id: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.receive_status}
					/>
				),
			},
			{
				accessorFn: (row) => format(row.delivery_date, 'dd MMM,yyyy'),
				id: 'delivery_date',
				header: 'Delivery Date',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan No',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab
						/>
					);
				},
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
				accessorFn: (row) => row.lc_numbers?.join(', '),
				id: 'lc_numbers',
				header: 'LC',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.pi_numbers?.join(', '),
				id: 'pi_numbers',
				header: 'PI',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
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
				header: 'Description',
				enableColumnFilter: false,
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
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered_quantity',
				header: 'Delivered QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Return QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'rate_per_dzn',
				header: 'Rate/DZN',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'rate_per_piece',
				header: 'Rate/PCS',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'commission',
				header: 'Comm.',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_commission',
				header: 'Total Comm.',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value_company',
				header: 'Net Sales',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			showDateRange={false}
			title={'Zipper Delivery Report'}
			subtitle={
				<div className='flex flex-col'>
					<span>
						delivered = when the packing list is entered in a
						CHALLAN, but it is not necessary to be delivered or not.
					</span>
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

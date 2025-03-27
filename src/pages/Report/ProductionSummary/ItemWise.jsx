import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useItemWise } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return `&all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__production_summary');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());

	const { data, isLoading, url } = useItemWise(
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
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_production',
				header: 'Total Production',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	const Total = data.reduce((acc, curr) => acc + curr.total_production, 0);

	return (
		<ReactTable
			key='Thread Status'
			showDateRange={false}
			title={'Item Wise'}
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
		>
			<tr className='bg-slate-200'>
				<td className='px-3 text-right font-semibold'>Total</td>
				<td className='px-3 font-semibold'>{Total}</td>
			</tr>
		</ReactTable>
	);
}

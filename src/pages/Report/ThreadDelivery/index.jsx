import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadDelivery } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const haveAccess = useAccess('report__thread_delivery');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url } = useThreadDelivery(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const info = new PageInfo(
		'Thread Delivery',
		url,
		'report__thread_delivery'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'sum',
				header: 'Sum',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'concat',
				header: 'Concat',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='bulk'
			title={info.getTitle()}
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

import { lazy, useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowRightCircle } from 'lucide-react';
import { useNavigate, useNavigation } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { useAccNeedToAccept } from './config/query';
import { storeType } from './utils';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, deleteData } = useAccNeedToAccept();
	const navigate = useNavigate();

	const info = new PageInfo(
		'Need to Accept',
		'/accounting/need-to-accept',
		'accounting__need_to_accept'
	);
	const haveAccess = useAccess('accounting__need_to_accept');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'purchase_id',
				header: 'ID',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_price',
				header: 'Total Price',
				enableColumnFilter: false,
				cell: (info) => (
					<div>
						<span className='text-sm'>{info.getValue()}</span>
						<span className='text-sm'>
							{info.row.original.currency_symbol}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'store_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='text-sm'>
						{storeType.find((x) => x.value === info.getValue())
							?.label || info.getValue()}
					</span>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-20',
				cell: (info) => {
					return <ArrowRightCircle onClick={() => handelUpdate()} />;
				},
			},
		],
		[data]
	);

	// Fetching data from server'
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelUpdate = () => {
		navigate('/accounting/voucher/entry');
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}

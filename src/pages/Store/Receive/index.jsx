import { lazy, useEffect, useMemo, useState } from 'react';
import { usePurchaseDescription } from '@/state/Store';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkOnly } from '@/ui';

import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('store__receive_rm');
	const { data, isLoading, url, deleteData } = usePurchaseDescription('rm');
	const info = new PageInfo(
		'Store / Material Receive',
		url,
		'store__receive_rm'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'purchase_id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkOnly
							uri='/store/receive'
							id={uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan No',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_local',
				header: 'Local/LC',
				enableColumnFilter: false,
				cell: (info) => {
					return info.getValue() == 1 ? 'Local' : 'LC';
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
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							// showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate('/store/receive-rm/entry');

	const handelUpdate = (idx) => {
		navigate(`/store/receive-rm/${data[idx].uuid}/update`);
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}

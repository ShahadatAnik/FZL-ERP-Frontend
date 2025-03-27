import { lazy, useEffect, useMemo, useState } from 'react';
import { useOtherVendor } from '@/state/Other';
import { usePurchaseVendor } from '@/state/Store';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { invalidateQuery: invalidateVendor } = useOtherVendor();
	const { data, isLoading, url, deleteData } = usePurchaseVendor();
	const info = new PageInfo('Store / Vendor', url, 'store__vendor');

	const haveAccessRm = useAccess('store__rm_vendor');
	const haveAccessAccessor = useAccess('store__accessories_vendor');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'contact_name',
				header: 'Person',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'contact_number',
				header: 'Phone',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'office_address',
				header: 'Address',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				width: 'w-32',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !(
					haveAccessRm?.includes('update') ||
					haveAccessAccessor?.includes('update') ||
					haveAccessRm?.includes('delete') ||
					haveAccessAccessor?.includes('delete')
				),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={
								haveAccessRm?.includes('update') ||
								haveAccessAccessor?.includes('update')
							}
							showDelete={
								haveAccessRm?.includes('delete') ||
								haveAccessAccessor?.includes('delete')
							}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateVendor, setUpdateVendor] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateVendor((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
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
			itemName: data[idx].name,
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
				accessor={
					haveAccessRm.includes('create') ||
					haveAccessAccessor.includes('create')
				}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateVendor,
						setUpdateVendor,
					}}
				/>
			</Suspense>
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
					invalidateQuery={invalidateVendor}
				/>
			</Suspense>
		</>
	);
}

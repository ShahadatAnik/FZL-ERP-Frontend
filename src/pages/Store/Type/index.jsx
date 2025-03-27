import { lazy, useEffect, useMemo, useState } from 'react';
import { useOtherMaterialType } from '@/state/Other';
import { useMaterialType } from '@/state/Store';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useMaterialType();
	const { invalidateQuery: invalidateMaterialType } = useOtherMaterialType();
	const info = new PageInfo('Store / Material Type', url, 'store__type');
	const haveAccessRm = useAccess('store__rm_type');
	const haveAccessAccessor = useAccess('store__accessories_type');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

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
				accessorKey: 'short_name',
				header: 'Short Name',
				enableColumnFilter: false,
				width: 'w-32',
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

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMaterialType, setUpdateMaterialType] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialType((prev) => ({
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
						updateMaterialType,
						setUpdateMaterialType,
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
					invalidateQuery={invalidateMaterialType}
				/>
			</Suspense>
		</>
	);
}

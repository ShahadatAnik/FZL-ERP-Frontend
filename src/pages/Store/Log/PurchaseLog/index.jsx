import { lazy, useMemo, useState } from 'react';
import { usePurchaseLog } from '@/state/Store';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkOnly } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = usePurchaseLog('rm');
	const info = new PageInfo('Store / Purchase', url);
	const haveAccessRm = useAccess('store__rm_log');
	const haveAccessAccessor = useAccess('store__accessories_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'purchase_id',
				header: 'Receive ID',
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
				accessorKey: 'is_local',
				header: 'Local/LC',
				enableColumnFilter: false,
				cell: (info) => {
					return info.getValue() == 1 ? 'Local' : 'LC';
				},
			},
			{
				accessorKey: 'lc_number',
				header: 'LC No',
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
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'price',
				header: 'Price',
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
				accessorKey: 'entry_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !(
					haveAccessRm?.includes('update_log') ||
					haveAccessAccessor?.includes('update_log') ||
					haveAccessRm?.includes('delete_log') ||
					haveAccessAccessor?.includes('delete_log')
				),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={
								haveAccessRm?.includes('update_log') ||
								haveAccessAccessor?.includes('update_log')
							}
							showDelete={
								haveAccessRm?.includes('delete_log') ||
								haveAccessAccessor?.includes('delete_log')
							}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updatePurchaseLog, setUpdatePurchaseLog] = useState({
		entry_uuid: null,
		material_name: null,
	});

	const handelUpdate = (idx) => {
		setUpdatePurchaseLog((prev) => ({
			...prev,
			entry_uuid: data[idx]?.purchase_entry_uuid,
			material_name: data[idx]?.material_name,
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
			itemId: data[idx].purchase_entry_uuid,
			itemName: data[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};
	//invalidateMaterial();

	if (isLoading)
		return (
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				isLoading={isLoading}
			/>
		);

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updatePurchaseLog,
						setUpdatePurchaseLog,
					}}
				/>

				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/purchase/entry',
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}

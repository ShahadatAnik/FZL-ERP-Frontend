import { useEffect, useMemo, useState } from 'react';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
} from '@/state/Store';
import { useOrderAgainstVislonTMRMLog } from '@/state/Vislon';
import { useAccess, useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';
import { SFG_TRX_NULL } from '@/util/Schema';

import RMAddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, isLoading, url, deleteData } = useOrderAgainstVislonTMRMLog();

	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateMaterialTrx } =
		useMaterialTrxAgainstOrderDescription();

	const info = new PageInfo(
		'RM Order Against Teeth Molding Log',
		url,
		'vislon__teeth_molding_log'
	);
	const haveAccess = useAccess(info.getTab());

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'trx_to',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue()?.replace(/_|n_/g, ' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue()?.replace(/_|n_/g, ' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue()?.replace(/_|n_/g, ' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Used QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('click_update_rm_order') &&
					!haveAccess.includes('click_delete_rm_order'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={haveAccess.includes(
								'click_update_rm_order'
							)}
							showDelete={haveAccess.includes(
								'click_delete_rm_order'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateLog, setUpdateLog] = useState({
		uuid: null,
		section: null,
		material_name: null,
		stock: null,
		trx_quantity: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateLog((prev) => ({
			...prev,
			...selected,
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
			itemName: data[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};
	invalidateMaterialInfo();
	invalidateMaterialTrx();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<RMAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateLog,
						setUpdateLog,
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
						url: `/zipper/material-trx-against-order`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}

import { lazy, useMemo, useState } from 'react';
import { useCommonTapeSFG } from '@/state/Common';
import {
	useSliderAssemblyStock,
	useSliderDieCastingStock,
} from '@/state/Slider';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
} from '@/state/Store';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url, deleteData } =
		useMaterialTrxAgainstOrderDescription(
			'maintenance',
			format(date, 'yyyy-MM-dd'),
			format(toDate, 'yyyy-MM-dd')
		);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateSliderDieCastingStock } =
		useSliderDieCastingStock();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { invalidateQuery: invalidateSliderAssemblyStock } =
		useSliderAssemblyStock();

	const info = new PageInfo(
		'Store ß(Maintenance) / Transfer Against Order',
		url
	);
	const haveAccessRm = useAccess('store_maintenance__log');
	const haveAccessAccessor = useAccess('store_maintenance__log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issue_id',
				header: 'Issue ID',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
			},

			{
				accessorKey: 'trx_to',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>
						{/* replace _ with space */}
						{info.getValue().replace(/_/g, ' ')}
					</span>
				),
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Transferred QTY',
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
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'created_at',
				header: 'Created At',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
				hidden: !(
					haveAccessRm?.includes('update_log_against_order') ||
					haveAccessAccessor?.includes('update_log_against_order') ||
					haveAccessRm?.includes('delete_log_against_order') ||
					haveAccessAccessor?.includes('delete_log_against_order')
				),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={
								haveAccessRm?.includes(
									'update_log_against_order'
								) ||
								haveAccessAccessor?.includes(
									'update_log_against_order'
								)
							}
							showDelete={
								haveAccessRm?.includes(
									'delete_log_against_order'
								) ||
								haveAccessAccessor?.includes(
									'delete_log_against_order'
								)
							}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateMaterialTrxToOrder, setUpdateMaterialTrxToOrder] = useState({
		uuid: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			material_name: data[idx]?.material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
			trx_quantity: data[idx]?.trx_quantity,
			stock: data[idx]?.stock,
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
	//invalidateMaterialInfo();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				showDateRange={false}
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

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateMaterialTrxToOrder,
						setUpdateMaterialTrxToOrder,
					}}
				/>

				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/zipper/material-trx-against-order',
						deleteData,
					}}
					invalidateQueryArray={[
						invalidateMaterialInfo,
						invalidateSliderDieCastingStock,
						invalidateCommonTapeSFG,
						invalidateSliderAssemblyStock,
					]}
				/>
			</Suspense>
		</div>
	);
}

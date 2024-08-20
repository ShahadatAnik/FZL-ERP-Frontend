import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useSliderDieCastingStock } from '@/state/Slider';

import { DateTime, EditDelete } from '@/ui';
import { CheckboxWithoutForm } from '@/ui/Core';
import PageContainer from '@/ui/Others/PageContainer';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useSliderDieCastingStock();
	const info = new PageInfo('Stock', url, 'slider__die_casting_stock');
	const haveAccess = useAccess('slider__die_casting_stock');

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Die Casting',
			isDisabled: true,
		},
		{
			label: 'Stock',
			href: '/slider/die-casting/stock',
		},
	];

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'item_name',
				header: 'Item Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'item_short_name',
				header: 'Item Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'zipper_number',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_name',
				header: 'Zipper Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_short_name',
				header: 'Zipper Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'end_type',
				header: 'End-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_name',
				header: 'End-Type Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_short_name',
				header: 'End-Type Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'puller_type',
				header: 'Puller-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_type_name',
				header: 'Puller-Type Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_type_short_name',
				header: 'Puller-Type Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'logo_type',
				header: 'Logo-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_type_name',
				header: 'Logo-Type Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_type_short_name',
				header: 'Logo-Type Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'slider_body_shape',
				header: 'Body Shape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Body Shape Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_short_name',
				header: 'Body Shape Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'puller_link',
				header: 'Puller Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_link_name',
				header: 'Puller Link Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_link_short_name',
				header: 'Puller Link Short Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'stopper_type',
				header: 'Stopper Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'stopper_type_name',
				header: 'Stopper Type Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'stopper_type_short_name',
				header: 'Stopper Type Short Name',
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
				accessorKey: 'weight',
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'pcs_per_kg',
				header: 'Pcs/Kg',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
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
				accessorKey: 'is_body',
				header: 'Body?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},

			{
				accessorKey: 'is_puller',
				header: 'Puller?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},

			{
				accessorKey: 'is_cap',
				header: 'Cap?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_link',
				header: 'Link?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_h_bottom',
				header: 'H Bottom?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_u_top',
				header: 'U Top?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_box_pin',
				header: 'Box Pin?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_two_way_pin',
				header: 'Two Way Pin?',
				enableColumnFilter: false,
				cell: (info) => (
					<CheckboxWithoutForm checked={info.getValue()} />
				),
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
							showDelete={haveAccess.includes('delete')}
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
	const [updateStock, setUpdateStock] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateStock((prev) => ({
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
		<PageContainer title='Stock Lists' breadcrumbs={breadcrumbs}>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateStock,
						setUpdateStock,
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
				/>
			</Suspense>
		</PageContainer>
	);
}
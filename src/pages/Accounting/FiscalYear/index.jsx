import { lazy, useEffect, useMemo, useState } from 'react';
import { format, getYear } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { useAccountingFiscalYear } from './config/query';
import { generateYearRanges } from './utils';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } =
		useAccountingFiscalYear();
	const info = new PageInfo('Fiscal Year', url, 'accounting__fiscal_year');
	const haveAccess = useAccess('accounting__fiscal_year');
	const handleActive = async (idx) => {
		const active = data[idx].active ? false : true;
		await updateData.mutateAsync({
			url: `${url}/${data[idx].uuid}`,
			uuid: data[idx].uuid,
			updatedData: { active },
		});
	};
	const handleLocked = async (idx) => {
		const locked = data[idx].locked ? false : true;
		await updateData.mutateAsync({
			url: `${url}/${data[idx].uuid}`,
			uuid: data[idx].uuid,
			updatedData: { locked },
		});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'active',
				header: 'Active',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						onChange={() => handleActive(info.row.index)}
						checked={info.getValue()}
					/>
				),
			},
			{
				accessorKey: 'locked',
				header: 'Locked',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						onChange={() => handleLocked(info.row.index)}
						checked={info.getValue()}
					/>
				),
			},
			{
				accessorKey: 'year_no',
				header: 'Year',
				enableColumnFilter: false,
				cell: (info) =>
					generateYearRanges(2025, getYear(new Date()) + 15).find(
						(y) => y.value === info.getValue()
					).label,
			},
			{
				accessorKey: 'start_date',
				header: 'Start',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => (
					<span>
						{format(new Date(info.getValue()), 'dd MMM, yyyy')}
					</span>
				),
			},
			{
				accessorKey: 'end_date',
				header: 'End',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => (
					<span>
						{format(new Date(info.getValue()), 'dd MMM, yyyy')}
					</span>
				),
			},
			{
				accessorKey: 'rate',
				header: 'Default Rate',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'currency_name',
				header: 'Currency',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'jan_budget',
				header: 'January',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'feb_budget',
				header: 'February',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'mar_budget',
				header: 'March',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'apr_budget',
				header: 'April',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'may_budget',
				header: 'May',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'jun_budget',
				header: 'June',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'jul_budget',
				header: 'July',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'aug_budget',
				header: 'August',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'sep_budget',
				header: 'September',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'oct_budget',
				header: 'October',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'nov_budget',
				header: 'November',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'dec_budget',
				header: 'December',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
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
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},

			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
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
	const [updateCountLength, setUpdateCountLength] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateCountLength((prev) => ({
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
			itemName: generateYearRanges(2025, getYear(new Date()) + 15).find(
				(y) => y.value === data[idx].year_no
			).label,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateCountLength,
						setUpdateCountLength,
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
		</div>
	);
}

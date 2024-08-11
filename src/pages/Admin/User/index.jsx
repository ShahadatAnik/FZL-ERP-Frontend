import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useUpdateFunc } from '@/hooks';
import { useAdminUsers } from '@/state/Admin';
import { DateTime, EditDelete, ResetPassword, StatusButton } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));
const ResetPass = lazy(() => import('./ResetPass'));
const PageAssign = lazy(() => import('./PageAssign'));

export default function Order() {
	const { data, url, isLoading, deleteData } = useAdminUsers();
	const info = new PageInfo('Admin/User', url, 'admin__user');
	const haveAccess = useAccess(info.getTab());

	const columns = useMemo(
		() => [
			{
				accessorKey: 'page_assign_actions',
				header: (
					<span>
						Page
						<br />
						Assign
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-24',
				hidden: !haveAccess.includes('click_page_assign'),
				cell: (info) => {
					return (
						<ResetPassword
							onClick={() => handelPageAssign(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				width: 'w-8',
				hidden: !haveAccess.includes('click_status'),
				cell: (info) => {
					return (
						<StatusButton
							size='btn-xs'
							value={info.getValue()}
							onClick={() => handelStatus(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'department',
				header: 'Department',
				enableColumnFilter: false,
				cell: (info) => {
					const { department, designation } = info.row.original;

					return (
						<div className='flex flex-col'>
							<span className='capitalize'>{department}</span>
							<span className='text-xs capitalize text-gray-400'>
								{designation}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'reset_pass_actions',
				header: (
					<span>
						Reset
						<br />
						Password
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-24',
				hidden: !haveAccess.includes('click_reset_password'),
				cell: (info) => (
					<ResetPassword
						onClick={() => handelResetPass(info.row.index)}
					/>
				),
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
				width: 'w-24',
				hidden: !haveAccess.includes('update'),
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

	const handelAdd = () => {
		window[info?.getAddOrUpdateModalId()]?.showModal();
	};

	// Update
	const [updateUser, setUpdateUser] = useState({
		uuid: null,
		department_designation: null,
	});

	const handelUpdate = (idx) => {
		setUpdateUser({
			uuid: data[idx].uuid,
			department_designation: data[idx].department_designation,
		});

		window[info.getAddOrUpdateModalId()]?.showModal();
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

	// Status
	const handelStatus = async (idx) => {
		const user = data[idx];
		const status = user?.status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await useUpdateFunc({
			uri: `/hr/user/status/${user?.uuid}/${status}/${updated_at}/${user?.name}`,
			data: user,
			itemId: user?.uuid,
			updatedData: { status, updated_at },
			setItems: setUsers,
		});
	};

	// Reset Password
	const [resPass, setResPass] = useState({
		uuid: null,
		name: null,
	});
	const handelResetPass = async (idx) => {
		setResPass((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			name: data[idx]?.name,
		}));

		window['reset_pass_modal'].showModal();
	};

	// Page Assign
	const [pageAssign, setPageAssign] = useState({
		uuid: null,
		name: null,
	});
	const handelPageAssign = async (idx) => {
		console.log(data[idx]);
		
		setPageAssign((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			name: data[idx]?.name,
		}));

		window['page_assign_modal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 sm:px-4'>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraClass={!haveAccess.includes('create') && 'py-2'}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateUser,
						setUpdateUser,
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
			<Suspense>
				<ResetPass
					modalId='reset_pass_modal'
					{...{
						resPass,
						setResPass,
					}}
				/>
			</Suspense>
			<Suspense>
				<PageAssign
					modalId='page_assign_modal'
					{...{
						pageAssign,
						setPageAssign,
					}}
				/>
			</Suspense>
		</div>
	);
}

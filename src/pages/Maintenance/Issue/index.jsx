import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useIssue, useMaintenanceMachine } from '@/state/Maintenance';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { EyeBtn } from '@/ui/Others/Button';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	DateTime,
	EditDelete,
	ReactSelect,
	StatusButton,
	Transfer,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const Procurement = lazy(() => import('./Procurement'));
const History = lazy(() => import('./History'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { user } = useAuth();
	const { data, isLoading, url, deleteData, updateData, invalidateQuery } =
		useIssue();
	const info = new PageInfo('Issue', url, 'maintenance__issue');
	const haveAccess = useAccess('maintenance__issue');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete')}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
			{
				accessorKey: 'issue_id',
				header: 'ID',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'section',
				header: 'Section',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'problem_type',
				header: 'Type',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'parts_problem',
				header: 'Parts Problem',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'section_machine_name',
				header: () => (
					<>
						Machine <br /> Name/No.
					</>
				),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'description',
				header: 'Description',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'emergence',
				header: 'Emergency',
				enableColumnFilter: false,
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
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'maintain_condition',
				header: () => <>Maintain Condition</>,
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { maintain_by_name, maintain_date } =
						info.row.original;
					const options = [
						{ value: 'pending', label: 'Pending' },
						{ value: 'ok', label: 'OK' },
						{ value: 'waiting', label: 'Waiting' },
					];
					return (
						<div>
							<ReactSelect
								className={'w-36'}
								menuPortalTarget={document.body}
								placeholder='Select condition'
								options={options}
								value={options?.filter(
									(item) => item.value === info.getValue()
								)}
								onChange={(e) => {
									handelCondition(e.value, info.row.index);
								}}
							/>

							<span className='flex flex-col text-xs'>
								{maintain_by_name}
								<DateTime date={maintain_date} isTime={false} />
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'verification_approved',
				header: () => (
					<>
						Verification <br /> Approved
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { verification_by_name, verification_date } =
						info.row.original;
					return (
						<div>
							<SwitchToggle
								onChange={() => {
									handelVerificationApprove(info.row.index);
								}}
								checked={info.getValue() === true}
							/>
							<span className='flex flex-col text-xs'>
								{verification_by_name}
								<DateTime
									date={verification_date}
									isTime={false}
								/>
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'procurement',
				header: 'Procurement',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex gap-2'>
							<Transfer
								onClick={() =>
									handelProcurement(info.row.index)
								}
							/>
							<EyeBtn
								onClick={() =>
									handelProcurementHistory(info.row.index)
								}
							/>
						</div>
					);
				},
			},
		],
		[data, haveAccess]
	);

	const handelVerificationApprove = async (idx) => {
		await updateData.mutateAsync({
			url: `/maintain/issue/${data[idx]?.uuid}`,
			updatedData: {
				verification_approved:
					data[idx]?.verification_approved === true ? false : true,
				verification_date:
					data[idx]?.verification_approved === true
						? null
						: GetDateTime(),
				verification_by: user.uuid,
			},
		});
	};

	const handelCondition = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/maintain/issue/${data[idx]?.uuid}`,
			updatedData: {
				maintain_condition: e,
				maintain_date: GetDateTime(),
				maintain_by: user.uuid,
			},
		});
	};

	const [procurement, setProcurement] = useState({
		uuid: null,
	});
	const handelProcurement = (idx) => {
		const val = data[idx];
		setProcurement((prev) => ({
			...prev,
			...val,
		}));

		window['ProcureModal'].showModal();
	};

	const [history, setHistory] = useState(null);
	let title = 'ProcurementHistory';

	const handelProcurementHistory = (idx) => {
		const val = data[idx];
		title = title + idx + 1;
		setHistory((prev) => ({
			...prev,
			...val,
		}));

		window['ProcurementHistory'].showModal();
	};

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateIssueData, setUpdateIssueData] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateIssueData((prev) => ({
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
			itemName: data[idx].section,
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
						updateIssueData,
						setUpdateIssueData,
					}}
				/>
			</Suspense>
			<Suspense>
				<Procurement
					modalId='ProcureModal'
					{...{
						procurement,
						setProcurement,
					}}
				/>
			</Suspense>
			<Suspense>
				<History
					modalId={'ProcurementHistory'}
					{...{
						history,
						setHistory,
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

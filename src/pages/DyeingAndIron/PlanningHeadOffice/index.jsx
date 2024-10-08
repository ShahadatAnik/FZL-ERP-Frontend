import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useDyeingPlanning } from '@/state/Dyeing';
import { useAccess, useFetch } from '@/hooks';
import { EditDelete, LinkWithCopy, DateTime } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingPlanning();
	const info = new PageInfo(
		'Planning Head Office',
		url,
		'dyeing__planning_head_office'
	);
	const haveAccess = useAccess('dyeing__planning_head_office');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			// * week
			{
				accessorKey: 'week',
				header: 'Week',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/dyeing-and-iron/planning-head-office'
					/>
				),
			},
			{
				accessorKey: 'add_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				width: 'w-24',
				cell: (info) => {
					const { week } = info.row.original;
					return (
						<button
							className='btn btn-primary btn-xs'
							onClick={() =>
								navigate(
									`/dyeing-and-iron/planning-head-office/entry/${week}`
								)
							}>
							Add
						</button>
					);
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			,
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-40',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showEdit={haveAccess.includes('update')}
						showDelete={false}
					/>
				),
			},
		],
		[data]
	);

	// Add
	const handelAdd = () =>
		navigate('/dyeing-and-iron/planning-head-office/entry');

	// Update
	const handelUpdate = (idx) => {
		const { week } = data[idx];

		navigate(`/dyeing-and-iron/planning-head-office/${week}/update`);
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			{/* <Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setSwatch,
						updateSwatch,
						setUpdateSwatch,
					}}
				/>
			</Suspense> */}
		</div>
	);
}

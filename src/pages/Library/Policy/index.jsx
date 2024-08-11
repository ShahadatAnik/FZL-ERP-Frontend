import { IconKey } from '@/assets/icons';
import { Suspense } from '@/components/Feedback';
import { Title } from '@/components/Table/ui';
import { useAuth } from '@/context/auth';
import { useAccess, useFetchFunc } from '@/hooks';
import { useLibraryPolicy } from '@/state/Library';
import { EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const Card = ({ title, subtitle, Icon, href, children }) => {
	return (
		<div className='group relative w-full overflow-hidden rounded-md border border-primary p-4'>
			<div className='absolute inset-0 translate-y-[100%] bg-gradient-to-r from-primary to-secondary transition-transform duration-300 group-hover:translate-y-[0%]' />
			<div className='flex items-center justify-between'>
				<IconKey className='absolute -right-12 -top-12 z-10 text-9xl text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary' />
				<IconKey className='relative z-10 mb-2 text-2xl text-primary transition-colors duration-300 group-hover:text-white' />
				<div className='relative z-50'>{children}</div>
			</div>

			<NavLink
				to={href}
				className='relative z-10 text-lg font-medium capitalize text-slate-950 duration-300 group-hover:text-white'
				target='_blank'>
				{title}
			</NavLink>
			<p className='relative z-10 text-slate-400 duration-300 group-hover:text-primary-content'>
				{subtitle}
			</p>
		</div>
	);
};

export default function Index() {
	const { data, isLoading, url, deleteData } = useLibraryPolicy();
	const info = new PageInfo('Library/Policy', url, 'library__policy');
	const haveAccess = useAccess(info.getTab());
	const { user } = useAuth();

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updatePolicy, setUpdatePolicy] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdatePolicy((prev) => ({
			...prev,
			uuid: idx.uuid,
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
			itemId: idx.uuid,
			itemName: idx.title,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<div className='container mx-auto p-4'>
				<div className='flex flex-col gap-4'>
					<Title
						title={info.getTitle()}
						accessor={haveAccess.includes('create')}
						handelAdd={handelAdd}
					/>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{data
							?.filter(
								(item) =>
									item.type === 'policy' &&
									(Number(item.status) === 1 ||
										user?.department === 'Admin')
							)
							?.map((item) => (
								<Card
									key={item.uuid}
									title={item.title}
									subtitle={item.sub_title}
									href={item.url}
									Icon={IconKey}>
									<EditDelete
										idx={item}
										handelUpdate={handelUpdate}
										handelDelete={handelDelete}
										showEdit={haveAccess.includes('update')}
										showDelete={haveAccess.includes(
											'delete'
										)}
									/>
								</Card>
							))}
					</div>
					<Title
						title='Notice'
						accessor={haveAccess.includes('create')}
						handelAdd={handelAdd}
					/>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{data
							?.filter(
								(item) =>
									item.type === 'notice' &&
									(Number(item.status) === 1 ||
										user?.department === 'Admin')
							)
							?.map((item) => (
								<Card
									key={item.uuid}
									title={item.title}
									subtitle={item.sub_title}
									href={item.url}
									Icon={IconKey}>
									<EditDelete
										idx={item}
										handelUpdate={handelUpdate}
										handelDelete={handelDelete}
										showEdit={haveAccess.includes('update')}
										showDelete={haveAccess.includes(
											'delete'
										)}
									/>
								</Card>
							))}
					</div>
				</div>
			</div>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updatePolicy,
						setUpdatePolicy,
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

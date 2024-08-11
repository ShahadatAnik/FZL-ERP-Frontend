import { AddModal } from '@/components/Modal';
import { DebouncedInput } from '@/components/Table/components';
import { useFetchForRhfResetForUserAccess, useRHF } from '@/hooks';
import { PRIVATE_ROUTES } from '@/routes';
import { useAdminUsers } from '@/state/Admin';
import { CheckBox } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { BOOLEAN } from '@/util/Schema';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Index({
	modalId = '',
	pageAssign = { uuid: null, name: null },
	setPageAssign,
}) {
	const { url, updateData } = useAdminUsers();
	const ALL_PAGE_ACTIONS = PRIVATE_ROUTES.filter(
		(item) => item.actions !== undefined
	);

	const [searchPageName, setSearchPageName] = useState('');
	const filteredPageActions = ALL_PAGE_ACTIONS.filter(({ page_name }) =>
		page_name.toLowerCase().includes(searchPageName.toLowerCase())
	);

	const PAGE_ACTIONS = ALL_PAGE_ACTIONS.reduce(
		(acc, { page_name, actions }) => {
			actions.forEach((action) => {
				const key = page_name + '___' + action;
				acc[key] = {
					schema: BOOLEAN,
					default: false,
					null: null,
				};
			});
			return acc;
		},
		{}
	);

	const PAGE_ACTIONS_SCHEMA = {};
	const PAGE_ACTIONS_DEFAULT = {};
	const PAGE_ACTIONS_NULL = {};

	Object.entries(PAGE_ACTIONS).forEach(([key, value]) => {
		PAGE_ACTIONS_SCHEMA[key] = value.schema;
		PAGE_ACTIONS_DEFAULT[key] = value.default;
		PAGE_ACTIONS_NULL[key] = value.null;
	});

	const { register, handleSubmit, errors, reset, getValues } =
		useRHF(PAGE_ACTIONS_SCHEMA);

	useFetchForRhfResetForUserAccess(
		`${url}/can-access/${pageAssign?.uuid}`,
		pageAssign?.uuid,
		reset
	);

	const onClose = () => {
		setPageAssign((prev) => ({
			...prev,
			uuid: null,
			name: null,
		}));
		reset(PAGE_ACTIONS_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const result = {};

		Object.entries(data).forEach(([key, value]) => {
			if (value) {
				const [page_name, action] = key.split('___');
				if (!result[page_name]) {
					result[page_name] = [];
				}
				result[page_name].push(action);
			}
		});

		const updatedData = {
			...data,
			can_access: JSON.stringify(result),
			updated_at: GetDateTime(),
		};

		await updateData.mutateAsync({
			url: `${url}/can-access/${pageAssign?.uuid}`,
			uuid: pageAssign.uuid,
			updatedData,
			onClose,
		});

		return;
	};

	return (
		<AddModal
			id={modalId}
			title={
				pageAssign?.uuid !== null
					? 'Page Assign: ' + pageAssign?.name
					: 'Page Assign'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			<DebouncedInput
				width='mb-4'
				placeholder='Search Page Name...'
				value={searchPageName ?? ''}
				onChange={(val) => setSearchPageName(val)}
			/>

			<div className='h-80 overflow-auto rounded-md p-2 shadow-xl'>
				{filteredPageActions.length === 0 ? (
					<div className='flex h-full animate-pulse items-center justify-center py-6 text-center text-2xl font-semibold text-error'>
						No page found
					</div>
				) : (
					filteredPageActions.map(({ page_name, actions, path }) => {
						return (
							<div
								key={page_name}
								className='flex flex-col gap-1 rounded-md border border-primary/30 p-2 transition-colors duration-300 ease-in-out hover:bg-primary/10'>
								<Link
									to={path}
									className='link-hover link link-primary font-semibold capitalize peer-hover:underline'
									target='_blank'>
									{page_name
										.replace(/__/, ': ')
										.replace(/_/g, ' ')}
								</Link>
								<div className='flex flex-wrap gap-1'>
									{actions.map((action) => (
										<div
											key={page_name + '___' + action}
											className='rounded-md border border-primary px-1'>
											<CheckBox
												key={page_name + '___' + action}
												label={
													page_name + '___' + action
												}
												title={action.replace(
													/_/g,
													' '
												)}
												type='peer checkbox-primary'
												text='rounded-full text-sm text-primary transition-colors duration-300 ease-in-out'
												defaultChecked={getValues?.(
													`${page_name}___${action}`
												)}
												{...{ register, errors }}
											/>
										</div>
									))}
								</div>
							</div>
						);
					})
				)}
			</div>
		</AddModal>
	);
}

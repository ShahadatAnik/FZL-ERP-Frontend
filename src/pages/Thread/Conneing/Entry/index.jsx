import { lazy, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchEntry,
} from '@/state/Dyeing';
import { useNavigate, useParams } from 'react-router';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DynamicDeliveryField, Input } from '@/ui';

import cn from '@/lib/cn';
import { DevTool } from '@/lib/react-hook-devtool';
import { THREAD_CONING_NULL, THREAD_CONING_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import isJSON from '@/util/isJson';

import Header from './Header';

const Transfer = lazy(() => import('./TransferQuantity'));

export default function Index() {
	const { url: threadBatchEntryUrl } = useDyeingThreadBatchEntry();
	const { url: threadBatchUrl, updateData } = useDyeingThreadBatch();
	const navigate = useNavigate();
	const { batch_uuid } = useParams();
	const [orderInfoIds, setOrderInfoIds] = useState('');
	const { user } = useAuth();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
		getFieldState,
	} = useRHF(THREAD_CONING_SCHEMA, THREAD_CONING_NULL);

	// batch_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	useFetchForRhfReset(
		`/thread/batch-details/by/${batch_uuid}`,
		orderInfoIds,
		reset
	);

	useEffect(() => {
		const uuid = getValues('uuid');

		if (uuid === null || uuid === '') {
			setOrderInfoIds(null);
		} else {
			if (isJSON(uuid)) {
				setOrderInfoIds(() => JSON.parse(uuid).split(',').join(','));
			} else {
				const uuid = getValues('uuid');
				if (!Array.isArray(uuid)) {
					setOrderInfoIds(() => uuid);
				} else {
					setOrderInfoIds(() => uuid.join(','));
				}
			}
		}
	}, [watch('uuid')]);

	// Transfer
	const [transfer, setTransfer] = useState({
		batch_entry_uuid: null,
		transfer_quantity: null,
	});

	const handelTransfer = (idx, e) => {
		setTransfer((prev) => ({
			...prev,
			batch_entry_uuid: data[idx].batch_entry_uuid,
			transfer_quantity: data[idx].transfer_quantity,
			//batch_id: data[idx].batch_id,
		}));
		window['Transfer'].showModal();
	};

	// Submit
	const onSubmit = async (data) => {
		// Update item

		if (getValues('coning_created_at') !== null) {
			const threadBatchData = {
				...data,
				coning_operator: data?.coning_operator,
				coning_supervisor: data?.coning_supervisor,
				coning_machines: data?.coning_machines,
				coning_updated_at: GetDateTime(),
				updated_at: GetDateTime(),
			};
			// update /commercial/pi/{uuid}
			const threadBatchPromise = await updateData.mutateAsync({
				url: `${threadBatchUrl}/${data?.uuid}`,
				updatedData: threadBatchData,
				uuid: orderInfoIds,
				isOnCloseNeeded: false,
			});

			// pi entry
			let updatedThreadBatchPromises = data.batch_entry.map(
				async (item) => {
					const updatedData = {
						...item,
						coning_production_quantity:
							item.coning_production_quantity,
						coning_production_quantity_in_kg:
							item?.coning_production_quantity_in_kg,
						updated_at: GetDateTime(),
					};

					return await updateData.mutateAsync({
						url: `${threadBatchEntryUrl}/${item?.batch_entry_uuid}`,
						updatedData: updatedData,
						uuid: item.batch_entry_uuid,
						isOnCloseNeeded: false,
					});
				}
			);
			try {
				await Promise.all([
					threadBatchPromise,
					...updatedThreadBatchPromises,
				])
					.then(() => reset(Object.assign({}, THREAD_CONING_NULL)))
					.then(() => navigate(`/thread/coning/${batch_uuid}`));
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
			return;
		} else {
			const threadBatchData = {
				...data,
				coning_operator: data?.coning_operator,
				coning_supervisor: data?.coning_supervisor,
				coning_machines: data?.coning_machines,
				coning_created_at: GetDateTime(),
				coning_created_by: user?.uuid,
				updated_at: GetDateTime(),
			};
			// update /commercial/pi/{uuid}
			const threadBatchPromise = await updateData.mutateAsync({
				url: `${threadBatchUrl}/${data?.uuid}`,
				updatedData: threadBatchData,
				uuid: orderInfoIds,
				isOnCloseNeeded: false,
			});

			// pi entry
			let updatedThreadBatchPromises = data.batch_entry.map(
				async (item) => {
					const updatedData = {
						...item,
						coning_production_quantity:
							item.coning_production_quantity,
						coning_production_quantity_in_kg:
							item?.coning_production_quantity_in_kg,
						updated_at: GetDateTime(),
					};

					return await updateData.mutateAsync({
						url: `${threadBatchEntryUrl}/${item?.batch_entry_uuid}`,
						updatedData: updatedData,
						uuid: item.batch_entry_uuid,
						isOnCloseNeeded: false,
					});
				}
			);
			try {
				await Promise.all([
					threadBatchPromise,
					...updatedThreadBatchPromises,
				])
					.then(() => reset(Object.assign({}, THREAD_CONING_NULL)))
					.then(() => navigate(`/thread/coning/${batch_uuid}`));
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
			return;
		}
	};

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
					}}
				/>
				<DynamicDeliveryField
					title={`Details: `}
					tableHead={
						<>
							{[
								'order number',
								'color',
								'po',
								'style',
								'count length',
								'shade Recipe',
								'order quantity',
								'quantity',
								'coning production quantity',
								'coning production quantity in kg',
								'Transfer Quantity',
								'total quantity',
								'balance quantity',
								'remarks',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'
								>
									{item}
								</th>
							))}
						</>
					}
				>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
							)}
						>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].color`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].po`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].style`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].count_length`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`batch_entry[${index}].recipe_name`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`batch_entry[${index}].quantity`)}
							</td>

							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity
									}
									register={register}
								/>
							</td>
							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity_in_kg`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity_in_kg
									}
									register={register}
								/>
							</td>
							<td className={`${rowClass}`}>
								<Input
									label={`batch_entry[${index}].transfer_quantity`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.transfer_quantity
									}
									register={register}
								/>
							</td>

							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].total_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].balance_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].batch_remarks`
								)}
							</td>
						</tr>
					))}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'
					>
						Save
					</button>
				</div>
			</form>
			<Suspense>
				<Transfer
					modalId={'Transfer'}
					{...{
						transfer,
						setTransfer,
					}}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}

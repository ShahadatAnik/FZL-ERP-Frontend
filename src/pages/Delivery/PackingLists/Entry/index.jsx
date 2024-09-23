import { Suspense, useEffect, useState } from 'react';
import { useCommercialPI, useCommercialPIEntry } from '@/state/Commercial';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import SubmitButton from '@/ui/Others/Button/SubmitButton';
import { CheckBoxWithoutLabel, DynamicDeliveryField, Input } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { PI_NULL, PI_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import isJSON from '@/util/isJson';

import Header from './Header';

export default function Index() {
	const { pi_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const { url: commercialPiEntryUrl } = useCommercialPIEntry();
	const {
		url: commercialPiUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialPI();

	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = pi_uuid !== undefined;
	const [orderInfoIds, setOrderInfoIds] = useState('');

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
	} = useRHF(PI_SCHEMA, PI_NULL);

	// pi_cash_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'pi_cash_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	isUpdate
		? useFetchForRhfReset(
				`/commercial/pi-cash/details/${pi_uuid}`,
				pi_uuid,
				reset
			)
		: useFetchForRhfReset(
				`/commercial/pi-cash/details/by/order-info-ids/${orderInfoIds}/${watch('party_uuid')}/${watch('marketing_uuid')}`,
				orderInfoIds,
				reset
			);

	useEffect(() => {
		if (!isUpdate) return;
		if (orderInfoIds === null) return;

		const updatedPiEntries = getValues('pi_cash_entry').map((item) => {
			if (!orderInfoIds.includes(item.order_info_uuid)) {
				return {
					...item,
					isDeletable: true,
				};
			}

			return item;
		});

		setValue('pi_cash_entry', updatedPiEntries);
	}, [isUpdate, orderInfoIds]);

	useEffect(() => {
		const order_info_uuids = getValues('order_info_uuids');

		if (order_info_uuids === null || order_info_uuids === '') {
			setOrderInfoIds(null);
		} else {
			if (isJSON(order_info_uuids)) {
				setOrderInfoIds(() =>
					JSON.parse(order_info_uuids).split(',').join(',')
				);
			} else {
				const order_info_uuids = getValues('order_info_uuids');
				if (!Array.isArray(order_info_uuids)) {
					setOrderInfoIds(() => order_info_uuids);
				} else {
					setOrderInfoIds(() => order_info_uuids.join(','));
				}
			}
		}
	}, [watch('order_info_uuids')]);

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const commercialPiData = {
				order_info_uuids: orderInfoIds
					? JSON.stringify(orderInfoIds)
					: '',
				bank_uuid: data?.bank_uuid,
				validity: data?.validity,
				payment: data?.payment,
				remarks: data?.remarks,
				updated_at: GetDateTime(),
			};

			// update /commercial/pi/{uuid}
			const commercialPiPromise = await updateData.mutateAsync({
				url: `${commercialPiUrl}/${data?.uuid}`,
				updatedData: commercialPiData,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const updatedId = commercialPiPromise?.data?.[0].updatedId;

			// pi entry
			let updatedableCommercialPiEntryPromises = data.pi_cash_entry
				.filter((item) => item.pi_quantity > 0 && !item.isDeletable)
				.map(async (item) => {
					if (item.uuid === null && item.pi_quantity > 0) {
						return await postData.mutateAsync({
							url: commercialPiEntryUrl,
							newData: {
								uuid: nanoid(),
								is_checked: item.is_checked,
								sfg_uuid: item?.sfg_uuid,
								pi_cash_quantity: item?.pi_cash_quantity,
								pi_cash_uuid: pi_uuid,
								created_at: GetDateTime(),
								remarks: item?.remarks || null,
							},
							isOnCloseNeeded: false,
						});
					}

					if (item.uuid && item.pi_quantity >= 0) {
						const updatedData = {
							pi_quantity: item.pi_quantity,
							is_checked: item.is_checked,
							updated_at: GetDateTime(),
						};

						return await updateData.mutateAsync({
							url: `${commercialPiEntryUrl}/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				});

			let deleteableCommercialPiEntryPromises = data.pi_cash_entry
				.filter((item) => item.isDeletable)
				.map(async (item) => {
					return await deleteData.mutateAsync({
						url: `${commercialPiEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					});
				});

			try {
				await Promise.all([
					commercialPiPromise,
					...updatedableCommercialPiEntryPromises,
					deleteableCommercialPiEntryPromises,
				])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						navigate(`/commercial/pi/details/${updatedId}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		var new_pi_uuid = nanoid();
		const created_at = GetDateTime();

		const commercialPiData = {
			...data,
			uuid: new_pi_uuid,
			order_info_uuids: JSON.stringify(orderInfoIds),
			created_at,
			created_by: user.uuid,
			is_pi: 1,
		};

		delete commercialPiData['is_all_checked'];
		delete commercialPiData['pi_cash_entry'];

		const commercialPiEntryData = [...data.pi_cash_entry]
			.filter((item) => item.is_checked && item.pi_quantity > 0)
			.map((item) => ({
				uuid: nanoid(),
				is_checked: true,
				sfg_uuid: item?.sfg_uuid,
				pi_cash_quantity: item?.pi_cash_quantity,
				pi_cash_uuid: new_pi_uuid,
				created_at,
				remarks: item?.remarks || null,
			}));

		if (commercialPiEntryData.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			// create new /commercial/pi
			await postData.mutateAsync({
				url: commercialPiUrl,
				newData: commercialPiData,
				isOnCloseNeeded: false,
			});

			// create new /commercial/pi-entry
			const commercial_pi_cash_entry_promises = commercialPiEntryData.map(
				(item) =>
					postData.mutateAsync({
						url: commercialPiEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			);

			try {
				await Promise.all([...commercial_pi_cash_entry_promises])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						navigate(`/commercial/pi`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return orderEntryField.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`pi_cash_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return orderEntryField.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`pi_cash_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`pi_cash_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('pi_cash_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
				setValue('is_all_checked', false);
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	return (
		<div>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
					}}
				/>
				<DynamicDeliveryField
					title={
						`Details: `
						// +
						// watch("pi_cash_entry").filter((item) => item.is_checked)
						// 	.length +
						// "/" +
						// orderEntryField.length
					}
					// handelAppend={handelOrderEntryAppend}
					tableHead={
						<>
							{!isUpdate && (
								<th
									key='is_all_checked'
									scope='col'
									className='group w-20 cursor-pointer px-3 py-2'>
									<CheckBoxWithoutLabel
										label='is_all_checked'
										checked={isAllChecked}
										onChange={(e) => {
											setIsAllChecked(e.target.checked);
											setIsSomeChecked(e.target.checked);
										}}
										{...{ register, errors }}
									/>
								</th>
							)}
							{[
								'O/N',
								'Item Description',
								'Style',
								'Color',
								'Size (CM)',
								'QTY (PCS)',
								'Given',
								'PI QTY',
								'Balance QTY',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									{item}
								</th>
							))}

							{isUpdate && (
								<th
									key='action'
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									Delete
								</th>
							)}
						</>
					}>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in',
								isUpdate &&
									watch(
										`pi_cash_entry[${index}].isDeletable`
									) &&
									'bg-error/10 text-error hover:bg-error/20 hover:text-error'
							)}>
							{!isUpdate && (
								<td className={cn(`w-8 ${rowClass}`)}>
									<CheckBoxWithoutLabel
										label={`pi_cash_entry[${index}].is_checked`}
										checked={watch(
											`pi_cash_entry[${index}].is_checked`
										)}
										onChange={(e) =>
											handleRowChecked(e, index)
										}
										disabled={
											getValues(
												`pi_cash_entry[${index}].pi_cash_quantity`
											) == 0
										}
										{...{ register, errors }}
									/>
								</td>
							)}
							{/* {isUpdate &&
								getValues(`pi_cash_entry[${index}].isDeletable`) && (
									<div className='absolute left-0 top-0 z-50 block h-full w-0 bg-red-500'>
										<span className=''></span>
									</div>
								)} */}

							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`pi_cash_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`pi_cash_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`pi_cash_entry[${index}].style`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`pi_cash_entry[${index}].color`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`pi_cash_entry[${index}].size`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`pi_cash_entry[${index}].pi_cash_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`pi_cash_entry[${index}].given_pi_quantity`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`pi_cash_entry[${index}].pi_cash_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.pi_cash_entry?.[index]
											?.pi_cash_quantity
									}
									disabled={
										getValues(
											`pi_cash_entry[${index}].pi_cash_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
								<Input
									label={`pi_cash_entry[${index}].sfg_uuid`}
									is_title_needed='false'
									className='hidden'
									{...{ register, errors }}
								/>
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`pi_cash_entry[${index}].balance_quantity`
								)}
							</td>
							{isUpdate && (
								<td className={`${rowClass}`}>
									<CheckBoxWithoutLabel
										className={cn(
											watch(
												`pi_cash_entry[${index}].isDeletable`
											)
												? 'checkbox-error'
												: 'checkbox-error'
										)}
										label={`pi_cash_entry[${index}].isDeletable`}
										{...{ register, errors }}
									/>
								</td>
							)}
						</tr>
					))}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<SubmitButton />
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'pi_cash_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
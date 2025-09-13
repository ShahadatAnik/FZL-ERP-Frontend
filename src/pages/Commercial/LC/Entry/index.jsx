import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useCommercialLC,
	useCommercialLCByQuery,
	useCommercialLCPIByUUID,
} from '@/state/Commercial';
import { useOtherManualPiValues, useOtherPiValues } from '@/state/Other';
import { useAuth } from '@context/auth';
import { format } from 'date-fns';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useAccess, useRHF } from '@/hooks';

import { DeleteModal, UpdateModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import { DynamicField, FormField, ReactSelect, RemoveButton } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { LC_NULL, LC_SCHEMA } from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('commercial__lc');
	const { user } = useAuth();
	const navigate = useNavigate();
	const { lc_uuid } = useParams();
	const { invalidateQuery: invalidate } = useCommercialLCByQuery(
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const {
		url: commercialLcUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialLC();

	const { data, invalidateQuery } = useCommercialLCPIByUUID(lc_uuid);

	const [deletablePi, setDeletablePi] = useState([]);
	const [deletableManualPi, setDeletableManualPi] = useState([]);
	const [updateItem, setUpdateItem] = useState({
		itemId: null,
		itemName: null,
	});

	const [status, setStatus] = useState(false);

	const isUpdate = lc_uuid !== undefined;

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
		context: form,
	} = useRHF(LC_SCHEMA, LC_NULL);

	let { data: pi } = useOtherPiValues(
		isUpdate
			? `party_uuid=${watch('party_uuid')}&is_update=true`
			: `party_uuid=${watch('party_uuid')}&is_update=false&page=lc`
	);
	let { data: ManualPi } = useOtherManualPiValues(
		isUpdate
			? `party_uuid=${watch('party_uuid')}&is_update=true`
			: `party_uuid=${watch('party_uuid')}&is_update=false`
	);

	const excludeItem = exclude(watch, pi, 'pi', 'uuid', status);
	const excludeManualItem = exclude(
		watch,
		ManualPi,
		'manual_pi',
		'uuid',
		status
	);
	// purchase
	const {
		fields: piFields,
		append: PiAppend,
		remove: PiRemove,
	} = useFieldArray({
		control,
		name: 'pi',
	});
	const {
		fields: manualPiFields,
		append: manualPiAppend,
		remove: manualPiRemove,
	} = useFieldArray({
		control,
		name: 'manual_pi',
	});

	// * UD dynamic field
	const {
		fields: udField,
		append: udAppend,
		remove: udRemove,
	} = useFieldArray({
		control,
		name: 'lc_entry_others',
	});

	// * progression dynamic field
	const {
		fields: progressionField,
		append: progressionAppend,
		remove: progressionRemove,
	} = useFieldArray({
		control,
		name: 'lc_entry',
	});

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data]);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const handelPiAppend = () => {
		PiAppend({
			lc_uuid,
		});
	};
	const handelManualPiAppend = () => {
		manualPiAppend({
			lc_uuid,
		});
	};

	const handleDeletePi = (uuid) => {
		if (!isUpdate || !uuid || deletablePi.includes(uuid)) return;

		setDeletablePi((prev) => [...prev, uuid]);
	};
	const handleDeleteManualPi = (uuid) => {
		if (!isUpdate || !uuid || deletableManualPi.includes(uuid)) return;

		setDeletableManualPi((prev) => [...prev, uuid]);
	};

	const getTotalValue = useCallback(
		(piArray) => {
			if (!piArray || !Array.isArray(piArray)) {
				return 0;
			}

			return piArray.reduce((acc, item) => {
				if (item.uuid === null || item.uuid === undefined) return acc;
				const piIdxValue = pi?.find((e) => e.value === item.uuid);
				return acc + piIdxValue?.pi_value;
			}, 0);
		},
		[status, pi]
	);
	// Submit
	const onSubmit = async (data) => {
		// Validation: at least one PI selected if not old PI
		if (data?.is_old_pi === false && data?.pi[0]?.uuid === null) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select at least one PI',
			});
			return;
		}

		// Helper function to format dates
		const formatDate = (dateString) =>
			dateString ? format(new Date(dateString), 'yyyy-MM-dd') : null;

		const lc_uuid = data.uuid;

		// Update existing LC
		if (isUpdate) {
			const updated_at = GetDateTime();
			const lc_updated_data = {
				...data,
				lc_date: formatDate(data?.lc_date),
				payment_date: formatDate(data?.payment_date),
				acceptance_date: formatDate(data?.acceptance_date),
				maturity_date: formatDate(data?.maturity_date),
				handover_date: formatDate(data?.handover_date),
				shipment_date: formatDate(data?.shipment_date),
				expiry_date: formatDate(data?.expiry_date),
				ud_received: formatDate(data?.ud_received),
				ud_no: data.ud_no ? 1 : 0,
				problematical: data.problematical ? 1 : 0,
				epz: data.epz ? 1 : 0,
				is_rtgs: data.is_rtgs ? 1 : 0,
				is_old_pi: data.is_old_pi ? 1 : 0,
				production_complete: data.production_complete ? 1 : 0,
				lc_cancel: data.lc_cancel ? 1 : 0,
				updated_at,
			};

			// Update LC master data
			const res = await updateData.mutateAsync({
				url: `${commercialLcUrl}/${data?.uuid}`,
				updatedData: lc_updated_data,
				isOnCloseNeeded: false,
			});

			// Handle deletable PIs
			if (deletablePi.length > 0) {
				const deletable_pi_promises = deletablePi.map(async (item) => {
					await updateData.mutateAsync({
						url: `/commercial/pi-cash-lc-null/${item}`,
						isOnCloseNeeded: false,
					});
				});

				await Promise.all(deletable_pi_promises)
					.then(() => {
						setDeletablePi([]);
						invalidateQuery();
					})
					.catch((err) => console.log(err));
			}

			// Update PI Numbers - only if not old PI
			if (!data.is_old_pi) {
				const pi_numbers = [...data.pi].map((item) => ({
					...item,
					lc_uuid,
				}));

				const pi_numbers_promise = pi_numbers.map(
					async (item) =>
						await updateData.mutateAsync({
							url: `/commercial/pi-cash-lc-uuid/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						})
				);

				await Promise.all(pi_numbers_promise);
			}

			// Handle LC Entry Others (UD entries)
			const lc_entry_others_promises = data.lc_entry_others.map(
				async (item) => {
					if (item.ud_no) {
						if (item.uuid) {
							return updateData.mutateAsync({
								url: `/commercial/lc-entry-others/${item.uuid}`,
								updatedData: {
									...item,
									updated_by: user?.uuid,
									updated_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						} else {
							return postData.mutateAsync({
								url: `/commercial/lc-entry-others`,
								newData: {
									...item,
									lc_uuid: data.uuid,
									uuid: nanoid(),
									created_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						}
					}
				}
			);

			// Handle LC Entries - FIX: Create entries from PI data when lc_entry is empty and is_old_pi is true
			let lc_entry_data = [...data.lc_entry];

			// If lc_entry is empty and is_old_pi is true, create entries from pi data
			if (
				lc_entry_data.length === 0 &&
				(data?.is_old_pi === 1 || data?.is_old_pi === true)
			) {
				console.log('Creating LC entries from PI data for old PI');
				lc_entry_data = data.pi.map((pi_item) => ({
					pi_uuid: pi_item.uuid,
					// Add other required fields as needed
				}));
			}

			console.log('LC Entry data to process:', lc_entry_data);
			const mannual_lc_entry_promeises = data?.manual_pi.map(
				async (item) => {
					return updateData.mutateAsync({
						url: `/commercial/manual-pi-lc-uuid/${item.uuid}`,
						updatedData: {
							lc_uuid: data.uuid,
							updated_by: user?.uuid,
							updated_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				}
			);

			const lc_entry_promises = lc_entry_data.map(async (item) => {
				if (item.uuid) {
					return updateData.mutateAsync({
						url: `/commercial/lc-entry/${item.uuid}`,
						updatedData: {
							...item,
							updated_by: user?.uuid,
							updated_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				} else {
					return postData.mutateAsync({
						url: `/commercial/lc-entry`,
						newData: {
							...item,
							lc_uuid: data.uuid,
							uuid: nanoid(),
							created_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				}
			});

			// Wait for all promises to complete
			await Promise.all([
				...lc_entry_others_promises.filter(Boolean),
				...lc_entry_promises.filter(Boolean),
				...mannual_lc_entry_promeises.filter(Boolean),
			]);

			// Reset form and navigate
			reset(LC_NULL);
			invalidateQuery();
			invalidate();
			navigate(`/commercial/lc/details/${lc_updated_data.uuid}`);
			return;
		}

		// Create new LC
		const new_lc_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		const lc_new_data = {
			...data,
			uuid: new_lc_uuid,
			lc_date: formatDate(data?.lc_date),
			shipment_date: formatDate(data?.shipment_date),
			expiry_date: formatDate(data?.expiry_date),
			ud_received: data.ud_received ? 1 : 0,
			ud_no: data.ud_no ? 1 : 0,
			problematical: data.problematical ? 1 : 0,
			epz: data.epz ? 1 : 0,
			is_rtgs: data.is_rtgs ? 1 : 0,
			is_old_pi: data.is_old_pi ? 1 : 0,
			production_complete: data.production_complete ? 1 : 0,
			lc_cancel: data.lc_cancel ? 1 : 0,
			created_at,
			created_by,
		};

		// Remove pi field from LC data to be sent
		delete lc_new_data['pi'];

		await postData.mutateAsync({
			url: commercialLcUrl,
			newData: lc_new_data,
			isOnCloseNeeded: false,
		});

		// Handle LC Entry Others (UD entries)
		const lc_entry_others_promises = data.lc_entry_others.map(
			async (item) => {
				if (item.ud_no) {
					return postData.mutateAsync({
						url: `/commercial/lc-entry-others`,
						newData: {
							...item,
							lc_uuid: new_lc_uuid,
							uuid: nanoid(),
							created_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				}
			}
		);

		// Handle LC Entries - FIX: Create entries from PI data when lc_entry is empty and is_old_pi is true
		let lc_entry_data = [...data.lc_entry];

		// If lc_entry is empty and is_old_pi is true, create entries from pi data
		if (
			lc_entry_data.length === 0 &&
			(data?.is_old_pi === 1 || data?.is_old_pi === true)
		) {
			console.log('Creating LC entries from PI data for old PI (new LC)');
			lc_entry_data = data.pi.map((pi_item) => ({
				pi_uuid: pi_item.uuid,
				// Add other required fields as needed
			}));
		}

		console.log('LC Entry data to process (new LC):', lc_entry_data);

		const lc_manual_entry_promises = data?.manual_pi.map(async (item) => {
			const pi_uuid = item.pi_uuid || item.uuid;
			updateData.mutateAsync({
				url: `/commercial/manual-pi-lc-uuid/${pi_uuid}`,
				updatedData: {
					lc_uuid: new_lc_uuid,
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				},
				isOnCloseNeeded: false,
			});
		});

		const lc_entry_promises = lc_entry_data.map(async (item) => {
			return postData.mutateAsync({
				url: `/commercial/lc-entry`,
				newData: {
					...item,
					lc_uuid: new_lc_uuid,
					uuid: nanoid(),
					created_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		});

		// Wait for all promises to complete
		await Promise.all([
			...lc_entry_others_promises.filter(Boolean),
			...lc_entry_promises.filter(Boolean),
			...lc_manual_entry_promises,
		]);

		// Handle PI linking for new PIs only
		if (!lc_new_data.is_old_pi) {
			const pi_numbers = [...data.pi].map((item) => ({
				uuid: item.uuid,
				lc_uuid: new_lc_uuid,
			}));

			const pi_numbers_promises = pi_numbers.map(async (item) =>
				updateData.mutateAsync({
					url: `/commercial/pi-cash-lc-uuid/${item.uuid}`,
					updatedData: item,
					isOnCloseNeeded: false,
				})
			);

			await Promise.all(pi_numbers_promises)
				.then(() => reset(LC_NULL))
				.then(() => {
					invalidate();
					navigate(`/commercial/lc`);
				})
				.catch((err) => console.log(err));
		} else {
			reset(LC_NULL);
			navigate(`/commercial/lc`);
		}
	};

	const handlePIRemove = (index) => {
		if (getValues(`pi[${index}].id`) !== undefined) {
			setUpdateItem({
				itemId: getValues(`pi[${index}].uuid`),
				itemName: getValues(`pi[${index}].id`),
			});
			window['lc_pi_delete'].showModal();
		}

		PiRemove(index);
	};
	const handleManualPiRemove = (index) => {
		if (getValues(`manual_pi[${index}].uuid`) !== undefined) {
			updateData.mutateAsync({
				url: `/commercial/manual-pi-lc-uuid/${getValues(`manual_pi[${index}].uuid`)}`,
				updatedData: {
					lc_uuid: null,
					updated_by: user?.uuid,
					updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		}

		manualPiRemove(index);
	};

	// delete lc_entry_others or UD dynamic field
	const [deleteLCEntryUD, setDeleteLCEntryUD] = useState({
		itemId: null,
		itemName: null,
	});

	// delete lc_entry or Progression dynamic field
	const [deleteLCEntry, setDeleteLCEntry] = useState({
		itemId: null,
		itemName: null,
	});

	return (
		<FormProvider {...form}>
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
						watch,

						progressionField,
						progressionAppend,
						progressionRemove,
						setDeleteLCEntry,

						udField,
						udAppend,
						udRemove,
						setDeleteLCEntryUD,
					}}
				/>

				{!watch('is_old_pi') && (
					<DynamicField
						title={`Details(Total Value: ${Number(
							getTotalValue(watch('pi'))
						)
							.toFixed(2)
							.toLocaleString()})`}
						handelAppend={handelPiAppend}
						tableHead={[
							'PI',
							'Bank',
							'Value($)',
							'Marketing',
							'O/N',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'
							>
								{item}
							</th>
						))}
					>
						{piFields.map((item, index) => {
							const piIdxValue = watch('is_old_pi')
								? ManualPi?.find(
										(e) =>
											e.value ===
											watch(`pi[${index}].uuid`)
									)
								: pi?.find(
										(e) =>
											e.value ===
											watch(`pi[${index}].uuid`)
									);
							const uuid = watch('is_old_pi')
								? watch(`manual_pi[${index}].uuid`)
								: watch(`pi[${index}].uuid`);

							return (
								<tr key={item.id} className='w-full'>
									<td className={cn(`pl-1 ${rowClass}`)}>
										<FormField
											label={uuid}
											title='PI'
											is_title_needed='false'
											dynamicerror={
												errors?.pi?.[index]?.uuid
											}
										>
											<Controller
												name={`pi[${index}].uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select PI'
															options={pi?.filter(
																(inItem) =>
																	!excludeItem?.some(
																		(
																			excluded
																		) =>
																			excluded?.value ===
																			inItem?.value
																	)
															)}
															value={pi?.filter(
																(inItem) =>
																	inItem.value ===
																	getValues(
																		`pi[${index}].uuid`
																	)
															)}
															onChange={(e) => {
																handleDeletePi(
																	getValues(
																		`pi[${index}].uuid`
																	)
																);
																onChange(
																	e.value
																);
																setStatus(
																	!status
																);
															}}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.pi_bank}
									</td>
									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.pi_value}
									</td>
									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.marketing_name}
									</td>
									<td className={cn(`pl-1 ${rowClass} `)}>
										<div className='flex flex-wrap items-center gap-2'>
											{piIdxValue?.order_number
												?.filter((e) => !!e)
												?.map((e) => (
													<span
														key={e}
														className='badge badge-accent badge-sm'
													>
														{e}
													</span>
												))}
										</div>
									</td>

									<td
										className={`w-16 border-l-4 border-l-primary ${rowClass}`}
									>
										<RemoveButton
											onClick={() => {
												handlePIRemove(index);
											}}
											showButton={piFields.length > 1}
										/>
									</td>
								</tr>
							);
						})}
					</DynamicField>
				)}
				{watch('is_old_pi') && (
					<DynamicField
						title={`Details(Total Value: ${Number(
							getTotalValue(watch('pi'))
						)
							.toFixed(2)
							.toLocaleString()})`}
						handelAppend={handelManualPiAppend}
						tableHead={[
							'PI',
							'Bank',
							'Value($)',
							'Marketing',
							'O/N',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'
							>
								{item}
							</th>
						))}
					>
						{manualPiFields.map((item, index) => {
							const piIdxValue = ManualPi?.find(
								(e) =>
									e.value ===
									watch(`manual_pi[${index}].uuid`)
							);

							return (
								<tr key={item.id} className='w-full'>
									<td className={cn(`pl-1 ${rowClass}`)}>
										<FormField
											label={`manual_pi[${index}].uuid`}
											title='Material'
											is_title_needed='false'
											dynamicerror={
												errors?.manual_pi?.[index]?.uuid
											}
										>
											<Controller
												name={`manual_pi[${index}].uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select PI'
															options={ManualPi?.filter(
																(inItem) =>
																	!excludeManualItem?.some(
																		(
																			excluded
																		) =>
																			excluded?.value ===
																			inItem?.value
																	)
															)}
															value={ManualPi?.filter(
																(inItem) =>
																	inItem.value ===
																	getValues(
																		`manual_pi[${index}].uuid`
																	)
															)}
															onChange={(e) => {
																handleDeleteManualPi(
																	getValues(
																		`manual_pi[${index}].uuid`
																	)
																);
																onChange(
																	e.value
																);
																setStatus(
																	!status
																);
															}}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.pi_bank}
									</td>
									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.pi_value}
									</td>
									<td className={cn(`pl-1 ${rowClass}`)}>
										{piIdxValue?.marketing_name}
									</td>
									<td className={cn(`pl-1 ${rowClass} `)}>
										<div className='flex flex-wrap items-center gap-2'>
											{piIdxValue?.order_number
												?.filter((e) => !!e)
												?.map((e) => (
													<span
														key={e}
														className='badge badge-accent badge-sm'
													>
														{e}
													</span>
												))}
										</div>
									</td>

									<td
										className={`w-16 border-l-4 border-l-primary ${rowClass}`}
									>
										<RemoveButton
											onClick={() => {
												handleManualPiRemove(index);
											}}
											showButton={
												manualPiFields.length > 1
											}
										/>
									</td>
								</tr>
							);
						})}
					</DynamicField>
				)}
				{/* <tr
						className={cn(
							'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
						)}>
						<td className='font-semibold' colSpan={11}>
							Total Value:
							{Number(getTotalValue(watch('pi')))
								.toFixed(2)
								.toLocaleString()}
							$ 
						</td>
					</tr> */}
				<Footer buttonClassName='!btn-primary' />
			</form>

			<Suspense>
				<UpdateModal
					modalId={'lc_pi_delete'}
					title={'PI'}
					updateItem={updateItem}
					setUpdateItem={setUpdateItem}
					url={`/commercial/pi-cash-lc-null`}
					updateData={updateData}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={'lc_entry_delete'}
					title={'Lc Entry Delete'}
					deleteItem={deleteLCEntry}
					setDeleteItem={setDeleteLCEntry}
					setItems={progressionField}
					deleteData={deleteData}
					url={`/commercial/lc-entry`}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={'lc_entry_details_delete'}
					title={'UD Delete'}
					deleteItem={deleteLCEntryUD}
					setDeleteItem={setDeleteLCEntryUD}
					setItems={udField}
					deleteData={deleteData}
					url={`/commercial/lc-entry-others`}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}

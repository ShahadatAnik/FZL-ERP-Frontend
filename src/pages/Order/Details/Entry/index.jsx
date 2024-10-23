import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useOrderDescription,
	useOrderDetails,
	useOrderDetailsByQuery,
} from '@/state/Order';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAccess, useFetchForOrderReset, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import DynamicFormSpreadSheet from '@/ui/Dynamic/DynamicFormSpreadSheet';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CheckBox } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	handelNumberDefaultValue,
	NUMBER,
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	ORDER_NULL,
	ORDER_SCHEMA,
	STRING,
	STRING_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import { UUID } from '@/util/Schema/utils';

import Header from './Header';

export function getRowsCount(matrix) {
	return matrix.length;
}

export function getColumnsCount(matrix) {
	const firstRow = matrix[0];
	return firstRow ? firstRow.length : 0;
}
export function getSize(matrix) {
	return {
		columns: getColumnsCount(matrix),
		rows: getRowsCount(matrix),
	};
}

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `/by/${userUUID}?approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return '?all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `/by/${userUUID}`;
	}

	return `?all=false`;
};

export default function Index() {
	const { url, updateData, postData, deleteData } = useOrderDescription();
	// const { invalidateQuery: OrderDetailsInvalidate } = useOrderDetails();
	const { order_number, order_description_uuid } = useParams();

	const haveAccess = useAccess('order__details');
	const { user } = useAuth();

	const { invalidateQuery: indexPageInvalidate } = useOrderDetailsByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const navigate = useNavigate();
	const isUpdate =
		order_description_uuid !== undefined && order_number !== undefined;

	const [endType, setEndType] = useState('');
	const [itemType, setItemType] = useState('');
	const [type, setType] = useState('full');
	console.log(type);
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		setValue,
		watch,
		clearErrors,
	} = useRHF(
		{
			...ORDER_SCHEMA,
			nylon_stopper: UUID.when({
				is: () => itemType.toLowerCase() === 'nylon',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema,
			}),
			hand: UUID.when({
				is: () => endType.toLowerCase() === 'open end',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema,
			}),

			order_entry: yup.array().of(
				yup.object().shape({
					style: STRING_REQUIRED,
					color: STRING.when({
						is: () => type.toLowerCase() === 'slider',
						then: (schema) => schema,
						otherwise: (schema) => schema.required('Required'),
					}),
					size: NUMBER_DOUBLE.when({
						is: () => type.toLowerCase() === 'slider',
						then: (schema) =>
							schema
								.nullable()
								.transform((value, originalValue) =>
									String(originalValue).trim() === ''
										? 0
										: value
								),
						otherwise: (schema) => schema.required('Required'),
					}),
					quantity: NUMBER.when({
						is: () => type.toLowerCase() === 'tape',
						then: (schema) =>
							schema.transform((value, originalValue) =>
								String(originalValue).trim() === '' ? 1 : value
							),
						otherwise: (schema) => schema.required('Required'),
					}),
					company_price: NUMBER_DOUBLE_REQUIRED.transform(
						handelNumberDefaultValue
					).default(0),
					party_price: NUMBER_DOUBLE_REQUIRED.transform(
						handelNumberDefaultValue
					).default(0),
					bleaching: STRING.when({
						is: () => type.toLowerCase() === 'slider',
						then: (schema) => schema,
						otherwise: (schema) => schema.required('Required'),
					}),
				})
			),
		},
		ORDER_NULL
	);

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

	if (isUpdate) {
		useFetchForOrderReset(
			`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`,
			order_description_uuid,
			reset,
			setType
		);
	}

	// order_entry
	const {
		fields: orderEntryField,
		append: orderEntryAppend,
		remove: orderEntryRemove,
		update: orderEntryUpdate,
	} = useFieldArray({
		control,
		name: 'order_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const [bleachAll, setBleachAll] = useState();

	useEffect(() => {
		if (bleachAll !== null) {
			orderEntryField.forEach((item, index) => {
				setValue(
					`order_entry[${index}].bleaching`,
					bleachAll ? 'bleach' : 'non-bleach'
				);
			});
		}
	}, [bleachAll, orderEntryField]);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			const { order_entry } = value;
			if (order_entry?.length > 0) {
				const allBleach = order_entry.every(
					(item) => item.bleaching === 'bleach'
				);
				const allNonBleach = order_entry.every(
					(item) => item.bleaching === 'non-bleach'
				);

				if (allBleach) {
					setBleachAll(true);
				} else if (allNonBleach) {
					setBleachAll(false);
				} else {
					setBleachAll(null);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	// * Updates the selectedUnit state and ensures only one checkbox is active.

	const headerButtons = [
		<div className='flex items-center gap-2'>
			<div className='flex rounded-md bg-secondary px-1'>
				{/* TODO: need to fix this */}

				<CheckBox
					text='text-secondary-content'
					label='is_inch'
					title='Inch'
					// checked={watch('is_inch')}
					{...{ register, errors }}
				/>
			</div>

			<label className='text-sm'>Bleach All</label>
			<SwitchToggle
				checked={bleachAll}
				onChange={() => setBleachAll(!bleachAll)}
			/>
		</div>,
	];

	// * if all size is false then default is cm is true
	// useEffect(() => {
	// 	if (
	// 		watch('is_cm') !== true &&
	// 		watch('is_inch') !== true &&
	// 		watch('is_meter') !== true
	// 	) {
	// 		setValue('is_cm', true);
	// 	}
	// }, [watch('is_cm'), watch('is_inch'), watch('is_meter')]);

	const handleOrderEntryRemove = (index) => {
		if (getValues(`order_entry[${index}].order_entry_uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`order_entry[${index}].order_entry_uuid`),
				itemName: getValues(`order_entry[${index}].order_entry_uuid`),
			});
			window['order_entry_delete'].showModal();
		}
		orderEntryRemove(index);
	};

	const handelOrderEntryAppend = () => {
		orderEntryAppend({
			style: '',
			color: '',
			size: '',
			quantity: '',
			company_price: 0,
			party_price: 0,
			bleaching: 'non-bleach',
			status: 1,
			remarks: '',
		});
	};
	const bleachingOptions = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];

	// Submit
	const onSubmit = async (data) => {
		const DEFAULT_SWATCH_APPROVAL_DATE = null;

		// * Update data * //
		if (isUpdate) {
			// * updated order description * //
			const order_description_updated = {
				...data,
				is_slider_provided: data?.is_slider_provided ? 1 : 0,
				is_logo_body: data?.is_logo_body ? 1 : 0,
				is_logo_puller: data?.is_logo_puller ? 1 : 0,
				is_inch: data?.is_inch ? 1 : 0,
				is_meter: data?.is_meter ? 1 : 0,
				is_cm: data?.is_cm ? 1 : 0,
				is_multi_color: data?.is_multi_color ? 1 : 0,
				hand: data?.hand,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/order-description/${data?.order_description_uuid}`,
				updatedData: order_description_updated,
				isOnCloseNeeded: false,
			});

			// * updated order entry * //
			const order_entry_updated = [...data.order_entry].map((item) => ({
				...item,
				status: item.order_entry_status ? 1 : 0,
				swatch_status: 'pending',
				swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
				updated_at: GetDateTime(),
			}));

			//* Post new entry */ //
			let order_entry_updated_promises = [
				...order_entry_updated.map(async (item) => {
					if (item.order_entry_uuid) {
						await updateData.mutateAsync({
							url: `/zipper/order-entry/${item.order_entry_uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: '/zipper/order-entry',
							newData: {
								...item,
								uuid: nanoid(),
								status: item.order_entry_status ? 1 : 0,
								swatch_status: 'pending',
								swatch_approval_date:
									DEFAULT_SWATCH_APPROVAL_DATE,
								order_description_uuid:
									data?.order_description_uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}
				}),
			];

			// * Slider
			const slider_quantity =
				data.order_entry.length === 1
					? data.order_entry[0].quantity
					: data.order_entry.reduce(
							(prev, curr) => prev + curr.quantity,
							0
						);

			const slider_info = {
				order_quantity: slider_quantity,
				updated_at: GetDateTime(),
			};

			if (watch('order_type') !== 'tape') {
				await updateData.mutateAsync({
					url: `/slider/stock/${data?.stock_uuid}`,
					updatedData: slider_info,
					isOnCloseNeeded: false,
				});
			}

			navigate(
				`/order/details/${order_number}/${order_description_uuid}`
			);

			return;
		}

		// * Add new data*//
		const new_order_description_uuid = nanoid();
		const created_at = GetDateTime();
		const special_requirement = JSON.stringify({
			values: data?.special_requirement || [],
		});

		const order_description = {
			...data,
			is_slider_provided: data?.is_slider_provided ? 1 : 0,
			is_logo_body: data?.is_logo_body ? 1 : 0,
			is_logo_puller: data?.is_logo_puller ? 1 : 0,
			is_inch: data?.is_inch ? 1 : 0,
			is_meter: data?.is_meter ? 1 : 0,
			is_cm: data?.is_cm ? 1 : 0,
			is_multi_color: data?.is_multi_color ? 1 : 0,
			hand: data?.hand,
			status: 0,
			special_requirement,
			uuid: new_order_description_uuid,
			created_at,
			created_by: user?.uuid,
		};

		//* Post new order description */ //
		await postData.mutateAsync({
			url,
			newData: order_description,
			isOnCloseNeeded: false,
		});

		const order_entry = [...data.order_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			status: item.order_entry_status ? 1 : 0,
			swatch_status: 'pending',
			swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
			order_description_uuid: new_order_description_uuid,
			created_at,
		}));

		//* Post new entry */ //
		let order_entry_promises = [
			...order_entry.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/zipper/order-entry',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		// * Slider
		const slider_quantity =
			data.order_entry.length === 1
				? data.order_entry[0].quantity
				: data.order_entry.reduce(
						(prev, curr) => prev + curr.quantity,
						0
					);

		const slider_info = {
			uuid: nanoid(),
			order_description_uuid: new_order_description_uuid,
			order_quantity: slider_quantity,
			created_at: GetDateTime(),
		};

		if (watch('order_type') !== 'tape') {
			await postData.mutateAsync({
				url: '/slider/stock',
				newData: slider_info,
				isOnCloseNeeded: false,
			});
		}

		// * All promises
		await Promise.all(order_entry_promises)
			.then(() => reset(Object.assign({}, ORDER_NULL)))
			.then(async () => {
				await indexPageInvalidate();
				navigate(`/order/details`);
			})
			.catch((err) => console.log(err));
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`order_entry[${index}]`);
			orderEntryAppend({ ...item, order_entry_uuid: undefined });
		},
		[getValues, orderEntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
		ENTER: 'enter',
	};

	const handlers = {
		NEW_ROW: handelOrderEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(orderEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const addRow = () => {
		orderEntryAppend({
			style: '',
			color: '',
			size: '',
			quantity: '',
			company_price: 0,
			party_price: 0,
			status: 1,
			remarks: '',
		});
	};

	return (
		<div>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<Header
						{...{
							endType,
							setEndType,
							itemType,
							setItemType,
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							is_logo_body: getValues('is_logo_body'),
							is_logo_puller: getValues('is_logo_puller'),
						}}
						setType={setType}
					/>

					<DynamicFormSpreadSheet
						title='Details'
						fieldArrayName='order_entry'
						handelAppend={addRow}
						handleRemove={handleOrderEntryRemove}
						headerButtons={
							watch('order_type') === 'full' && headerButtons
						}
						columnsDefs={[
							{
								header: 'Style',
								accessorKey: 'style',
								type: 'text',
								hidden: false,
								readOnly: false,
							},
							{
								header: 'Color',
								accessorKey: 'color',
								type: 'text',
								hidden: watch('order_type') === 'slider',
								readOnly: false,
							},
							{
								header: 'Bleach',
								accessorKey: 'bleaching',
								type: 'select',
								options: bleachingOptions,
								hidden: watch('order_type') === 'slider',
								readOnly: false,
							},
							{
								header: 'Size',
								accessorKey: 'size',
								type: 'text',
								hidden: watch('order_type') === 'slider',
								readOnly: false,
							},
							{
								header: 'Quantity',
								accessorKey: 'quantity',
								type: 'text',
								hidden: watch('order_type') === 'tape',
								readOnly: false,
							},
							{
								header: 'Company (USD/DZN)',
								accessorKey: 'company_price',
								type: 'text',
								hidden: false,
								readOnly: false,
							},
							{
								header: 'Party (USD/DZN)',
								accessorKey: 'party_price',
								type: 'text',
								hidden: false,
								readOnly: false,
							},

							{
								header: 'Actions',
								hidden: false,
								type: 'action',
							},
						]}
						{...{
							formContext: {
								register,
								watch,
								setValue,
								getValues,
								clearErrors,
								errors,
							},
							fields: orderEntryField,
							append: orderEntryAppend,
							remove: orderEntryRemove,
							update: orderEntryUpdate,
						}}
					/>

					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'order_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					url={`/zipper/order-entry`}
					deleteData={deleteData}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</div>
	);
}

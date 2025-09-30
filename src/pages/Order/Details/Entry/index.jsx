import React, { Suspense, useEffect, useState } from 'react';
import { useOrderDescription } from '@/state/Order';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAccess, useFetchForOrderReset, useRHF } from '@/hooks';

import FileUploading from '@/components/layout/file-uploading';
import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ErrorToast, ShowLocalToast } from '@/components/Toast';
import HandsonSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet'; //! why it is must??
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CheckBox } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	handelNumberDefaultValue,
	NUMBER,
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	ORDER_NULL,
	ORDER_SCHEMA,
	STRING,
	STRING_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import { UUID } from '@/util/Schema/utils';

import ReadFile from '../../../../ui/Others/read-file';
import Header from './header';
import FullOrder from './spread-sheets/full-order';
import Slider from './spread-sheets/slider';
import Tape from './spread-sheets/tape';
import { getPath, toggleBleach } from './utils';

export default function Index() {
	const { url, updateData, postData, deleteData } = useOrderDescription();
	const { order_number, order_description_uuid } = useParams();
	const navigate = useNavigate();
	const haveAccess = useAccess('order__details');
	const { user } = useAuth();

	// const { invalidateQuery: indexPageInvalidate } = useOrderDetailsByQuery(
	// 	getPath(haveAccess, user?.uuid),
	// 	{ enabled: !!user?.uuid }
	// );
	// const { invalidateQuery: swatchInvalidate } =
	// 	useDyeingSwatch(`type=pending`);

	const isUpdate =
		order_description_uuid !== undefined && order_number !== undefined;

	const [endType, setEndType] = useState('');
	const [itemType, setItemType] = useState('');
	const [type, setType] = useState('full');
	const [orderNo, setOrderNo] = useState(null);

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
		formState: { dirtyFields },
		context: form,
	} = useRHF(
		{
			...ORDER_SCHEMA,
			nylon_stopper: UUID.when({
				is: () => itemType.toLowerCase() === 'nylon',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema,
			}),
			hand: UUID.when({
				is: () =>
					endType === 'Open End' || endType === '2 Way - Open End',
				then: (schema) => schema.required('Required'),
				otherwise: (schema) => schema,
			}),

			order_entry: yup.array().of(
				yup.object().shape({
					index: NUMBER,
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
						otherwise: (schema) =>
							schema
								.required('Required')
								.moreThan(0, 'Must be greater than 0'),
					}),
					quantity: NUMBER.when({
						is: () => type.toLowerCase() === 'tape',
						then: (schema) =>
							schema.transform((value, originalValue) =>
								String(originalValue).trim() === '' ? 1 : value
							),
						otherwise: (schema) =>
							schema
								.required('Required')
								.moreThan(0, 'Must be greater than 0'),
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

	const [bleachAll, setBleachAll] = toggleBleach({
		item: orderEntryField,
		setValue,
		field: 'order_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	useEffect(() => {
		const subscription = watch((value) => {
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

	// * Updates the selectedUnit state and ensures only one checkbox is active
	const headerButtons = [
		<div className='flex items-center gap-2'>
			<div className='flex rounded-md bg-secondary px-1'>
				<CheckBox
					text='text-secondary-content'
					label='is_inch'
					title='Inch'
					{...{ register, errors }}
				/>
			</div>

			<label className='text-sm text-white'>Bleach All</label>
			<SwitchToggle
				checked={bleachAll}
				onChange={() => setBleachAll(!bleachAll)}
			/>
		</div>,
	];

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

	// Submit
	const onSubmit = async (data) => {
		const DEFAULT_SWATCH_APPROVAL_DATE = null;

		// * separate the order_entry
		const { order_entry, ...rest } = data;
		if (!order_entry.length > 0) {
			ShowLocalToast({
				type: 'warning',
				message: 'Add at least one Entry',
			});

			return;
		}

		// * Update data * //
		if (isUpdate) {
			// * updated order description * //
			const order_description_updated = {
				...rest,
				is_slider_provided: rest?.is_slider_provided ? 1 : 0,
				is_logo_body: rest?.is_logo_body ? 1 : 0,
				is_logo_puller: rest?.is_logo_puller ? 1 : 0,
				is_inch: rest?.is_inch ? 1 : 0,
				is_meter: rest?.is_meter ? 1 : 0,
				is_cm: rest?.is_cm ? 1 : 0,
				is_multi_color: rest?.is_multi_color ? 1 : 0,
				is_fashion: rest?.is_fashion,
				hand: rest?.hand,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `/zipper/order-description/${rest?.order_description_uuid}`,
				updatedData: order_description_updated,
				isOnCloseNeeded: false,
			});

			// * extract only the edited entries from the current entries & add color_ref_update_date if color_ref is dirty
			const extractedUpdatedEntries = order_entry
				.map((entry, index) => {
					const isDirty = dirtyFields?.order_entry?.[index];
					if (!isDirty) return null;

					const isColorRefDirty = isDirty?.color_ref;
					return {
						...entry,
						...(isColorRefDirty &&
							entry.order_entry_uuid && {
								color_ref_update_date: GetDateTime(),
							}),
					};
				})
				.filter(Boolean);

			// * updated order entry * //
			const order_entry_updated = [...extractedUpdatedEntries].map(
				(item) => ({
					...item,
					status: item.order_entry_status ? 1 : 0,
					swatch_status: 'pending',
					quantity:
						watch('order_type') === 'tape' ? 1 : item.quantity,
					swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
				})
			);

			const newOrder = order_entry_updated
				.filter((item) => !item.order_entry_uuid)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					order_description_uuid: rest?.order_description_uuid,
					created_at: GetDateTime(),
					color_ref_entry_date: item.color_ref ? GetDateTime() : null,
					created_by: user?.uuid,
				}));

			const updateOrder = order_entry_updated.filter(
				(item) => item.order_entry_uuid
			);

			const updatedOrderEntryPromise = updateOrder.map(async (item) => {
				await updateData.mutateAsync({
					url: `/zipper/order-entry/${item.order_entry_uuid}`,
					updatedData: {
						...item,
						updated_at: GetDateTime(),
						updated_by: user?.uuid,
					},
					isOnCloseNeeded: false,
				});
			});

			const newOrderEntryPromise =
				newOrder.length > 0
					? await postData.mutateAsync({
							url: '/zipper/order-entry',
							newData: newOrder,
							isOnCloseNeeded: false,
						})
					: null;

			// swatchInvalidate();

			await Promise.all([
				...updatedOrderEntryPromise,
				newOrderEntryPromise,
			]).then(() => {
				navigate(
					`/order/details/${order_number}/${order_description_uuid}`
				);
			});

			return;
		}

		// * Add new data*//
		const new_order_description_uuid = nanoid();
		const created_at = GetDateTime();
		const special_requirement = JSON.stringify({
			values: data?.special_requirement || [],
		});

		const order_description = {
			...rest,
			is_slider_provided: rest?.is_slider_provided ? 1 : 0,
			is_logo_body: rest?.is_logo_body ? 1 : 0,
			is_logo_puller: rest?.is_logo_puller ? 1 : 0,
			is_inch: rest?.is_inch ? 1 : 0,
			is_meter: rest?.is_meter ? 1 : 0,
			is_cm: rest?.is_cm ? 1 : 0,
			is_multi_color: rest?.is_multi_color ? 1 : 0,
			is_fashion: rest?.is_fashion,
			hand: rest?.hand,
			status: 0,
			special_requirement,
			uuid: new_order_description_uuid,
			created_at,
			created_by: user?.uuid,
		};

		//* Post new order description */ //
		const orderPromise = await postData.mutateAsync({
			url,
			newData: order_description,
			isOnCloseNeeded: false,
		});

		const new_order_entry = [...order_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			status: item.order_entry_status ? 1 : 0,
			swatch_status: 'pending',
			quantity: watch('order_type') === 'tape' ? 1 : item.quantity,
			swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
			order_description_uuid: new_order_description_uuid,
			color_ref_entry_date: item.color_ref ? created_at : null,
			created_at,
		}));

		//* Post new entry */ //
		let order_entry_promises = await postData.mutateAsync({
			url: '/zipper/order-entry',
			newData: new_order_entry,
			isOnCloseNeeded: false,
		});

		// * All promises
		await Promise.all([orderPromise, order_entry_promises])
			.then(() => reset(Object.assign({}, ORDER_NULL)))
			.then(async () => {
				// await indexPageInvalidate();
				// await swatchInvalidate();
				navigate(`/order/details/${orderNo}/${order_description.uuid}`);
			})
			.catch((err) => console.log(err));
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handleCopy = (index) => {
		const field = form.watch('order_entry')[index];

		const length = form.watch('order_entry').length;
		let newIndex;
		if (length > 0) {
			// Get the index value of the previous row
			const previousIndex = form.getValues(
				`order_entry.${length - 1}.index`
			);
			newIndex = previousIndex ? previousIndex + 1 : length + 1;
		} else {
			// For the first row, set index to 1
			newIndex = length + 1;
		}

		orderEntryAppend({
			index: newIndex,
			bleaching: field.bleaching,
			quantity: field.quantity,
			color: field.color,
			color_ref: field.color_ref,
			style: field.style,
			size: field.size,
			company_price: field.company_price,
			party_price: field.party_price,
		});
	};

	/// Upload file function ///

	const [isLoading, setIsLoading] = useState(false);

	const appendInChunks = async (appendFn, items, chunkSize = 10) => {
		let index = 0;

		return new Promise((resolve) => {
			const process = () => {
				const chunk = items.slice(index, index + chunkSize);

				chunk.forEach((item) => {
					appendFn(item, { shouldFocus: false }); // Prevent re-render/focus
				});

				index += chunkSize;

				if (index < items.length) {
					// Let UI breathe
					setTimeout(process, 0);
				} else {
					resolve();
				}
			};

			process();
		});
	};

	const handleUploadFile = async (data) => {
		if (!data || data.length === 0) return;

		// Prepare your data
		const newData = data.map((item, index) => ({
			index: index + 1,
			style: item.style,
			color: item.color,
			size: item.size,
			quantity: item.quantity,
			company_price: item.company_price,
			party_price: item.party_price,
			bleaching: item.bleaching,
		}));

		try {
			setIsLoading(true);

			const isValid = ORDER_SCHEMA.order_entry.isValid(newData[0]);
			if (!isValid) throw new Error('Invalid data');

			// Clear existing fields
			orderEntryRemove();

			// Append items in chunks with shouldFocus: false
			await appendInChunks(orderEntryAppend, newData, 20);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <FileUploading />;
	}

	const csvData = Object.keys(
		ORDER_SCHEMA.order_entry.describe().innerType.fields
	);

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
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
						reset,
						orderNo,
						setOrderNo,
						is_logo_body: getValues('is_logo_body'),
						is_logo_puller: getValues('is_logo_puller'),
						isUpdate,
						setValue,
					}}
					setType={setType}
				/>

				{watch('order_type') === 'full' && (
					<FullOrder
						handleUploadFile={handleUploadFile}
						handleAdd={handelOrderEntryAppend}
						handleRemove={handleOrderEntryRemove}
						handleCopy={handleCopy}
						title='Details'
						extraHeader={headerButtons}
						form={form}
						fieldName='order_entry'
						csvData={[csvData]}
						haveAccess={haveAccess}
					/>
				)}

				{watch('order_type') === 'tape' && (
					<Tape
						handleUploadFile={handleUploadFile}
						handleAdd={handelOrderEntryAppend}
						handleRemove={handleOrderEntryRemove}
						handleCopy={handleCopy}
						title='Details'
						extraHeader={headerButtons}
						form={form}
						fieldName='order_entry'
						csvData={[csvData]}
						haveAccess={haveAccess}
					/>
				)}
				{watch('order_type') === 'slider' && (
					<Slider
						handleUploadFile={handleUploadFile}
						handleAdd={handelOrderEntryAppend}
						handleRemove={handleOrderEntryRemove}
						handleCopy={handleCopy}
						title='Details'
						extraHeader={headerButtons}
						form={form}
						fieldName='order_entry'
						csvData={[csvData]}
						haveAccess={haveAccess}
					/>
				)}

				<Footer buttonClassName='!btn-primary' />
			</form>
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
		</FormProvider>
	);
}

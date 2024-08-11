import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderInfo } from '@/state/Order';
import { CheckBox, FormField, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { ORDER_INFO_NULL, ORDER_INFO_SCHEMA } from '@util/Schema';
import { useEffect, useState } from 'react';

export default function Index({
	modalId = '',

	updateOrderInfo = {
		uuid: null,
		order_number: null,
		reference_order_info_uuid: null,
		party_uuid: null,
		buyer_uuid: null,
		merchandiser_uuid: null,
		marketing_uuid: null,
		factory_uuid: null,
		issued_by_uuid: null,
	},
	setUpdateOrderInfo,
}) {
	const { url, updateData, postData } = useOrderInfo();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(ORDER_INFO_SCHEMA, ORDER_INFO_NULL);

	const [partyId, setPartyId] = useState(getValues('party_uuid'));
	const { value: ref_order } = useFetch('/other/order/info/value/label');
	const { value: party } = useFetch('/other/party/value/label');
	const { value: buyer } = useFetch('/other/buyer/value/label');
	const { value: marketing } = useFetch('/other/marketing/value/label');
	const { value: merchandiser } = useFetch(
		`/other/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: factory } = useFetch(
		`/other/factory/value/label/${partyId}`,
		[partyId]
	);

	const getResult = (key) =>
		typeof getValues(key) !== 'boolean' && getValues(key) === 1
			? true
			: false;

	const [isSample, setIsSample] = useState(getResult('is_sample'));
	const [isBill, setIsBill] = useState(getResult('is_bill'));

	const CashOptions = [
		{ value: 1, label: 'Cash' },
		{ value: 0, label: 'LC' },
	];

	const PriorityOptions = [
		{ value: 'FIFO', label: 'FIFO' },
		{ value: 'URGENT', label: 'URGENT' },
		{ value: '---', label: '---' },
	];

	useFetchForRhfReset(
		`${url}/${updateOrderInfo?.uuid}`,
		updateOrderInfo?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateOrderInfo((prev) => ({
			...prev,
			uuid: null,
			order_number: null,
			reference_order_info_uuid: null,
			party_uuid: null,
			buyer_uuid: null,
			merchandiser_uuid: null,
			marketing_uuid: null,
			factory_uuid: null,
			issued_by_uuid: null,
		}));
		reset(ORDER_INFO_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateOrderInfo?.uuid !== null &&
			updateOrderInfo?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				is_sample: isSample ? 1 : 0,
				is_bill: isBill ? 1 : 0,
				is_cash: data.is_cash ? 1 : 0,
				status: data.status ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateOrderInfo?.uuid}`,
				uuid: updateOrderInfo?.uuid,
				updatedData,
				onClose: onClose,
			});

			return;
		}

		const updatedData = {
			...data,
			uuid: nanoid(),
			is_sample: isSample ? 1 : 0,
			is_bill: isBill ? 1 : 0,
			is_cash: data.is_cash ? 1 : 0,
			status: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		// window.location.reload(true);
	};

	useEffect(() => {
		setPartyId(getValues('party_uuid'));
	}, [getValues('party_uuid')]);

	return (
		<AddModal
			id={modalId}
			title={
				updateOrderInfo?.uuid !== null
					? 'Order Info: ' + updateOrderInfo?.order_number
					: 'Order Info'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			// isSmall={true}
		>
			<div className='flex justify-end gap-2 p-2 text-sm'>
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						label='is_sample'
						title='Sample'
						text='text-primary-content'
						defaultChecked={isSample}
						onChange={(e) => setIsSample(e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						title='Bill'
						label='is_bill'
						text='text-primary-content'
						defaultChecked={isBill}
						onChange={(e) => setIsBill(e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
			</div>
			<div className='flex flex-col gap-1 md:flex-row'>
				<FormField
					label='reference_order_info_uuid'
					title='Ref. Order'
					errors={errors}>
					<Controller
						name={'reference_order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={ref_order}
									value={ref_order?.find(
										(item) =>
											item.value ==
											getValues(
												'reference_order_info_uuid'
											)
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='marketing_uuid'
					title='Marketing'
					errors={errors}>
					<Controller
						name={'marketing_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Marketing'
									options={marketing}
									value={marketing?.find(
										(item) =>
											item.value ==
											getValues('marketing_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='buyer_uuid' title='Buyer' errors={errors}>
					<Controller
						name={'buyer_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Buyer'
									options={buyer}
									value={buyer?.find(
										(item) =>
											item.value ==
											getValues('buyer_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='flex flex-col gap-1 md:flex-row'>
				<FormField label='party_uuid' title='Party' errors={errors}>
					<Controller
						name={'party_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Party'
									options={party}
									value={party?.find(
										(item) =>
											item.value ==
											getValues('party_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
										setPartyId(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='merchandiser_uuid'
					title='Merchandiser'
					errors={errors}>
					<Controller
						name={'merchandiser_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Merchandiser'
									options={merchandiser}
									value={merchandiser?.find(
										(item) =>
											item.value ==
											getValues('merchandiser_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='factory_uuid' title='Factory' errors={errors}>
					<Controller
						name={'factory_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Factory'
									options={factory}
									value={factory?.find(
										(item) =>
											item.value ==
											getValues('factory_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='flex flex-col gap-1 md:flex-row'>
				<FormField label='is_cash' title='Cash / LC' errors={errors}>
					<Controller
						name={'is_cash'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Cash Or LC'
									options={CashOptions}
									value={CashOptions?.find(
										(CashOptions) =>
											CashOptions.value ==
											getValues('is_cash')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='marketing_priority'
					title='S&M Priority'
					errors={errors}>
					<Controller
						name={'marketing_priority'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Priority'
									options={PriorityOptions}
									value={PriorityOptions?.find(
										(item) =>
											item.value ==
											getValues('marketing_priority')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateOrderInfo?.id !== null
									// }
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='factory_priority'
					title='Factory Priority'
					errors={errors}>
					<Controller
						name={'factory_priority'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Priority'
									options={PriorityOptions}
									value={PriorityOptions?.find(
										(item) =>
											item.value ==
											getValues('factory_priority')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateOrderInfo?.id !== null
									// }
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

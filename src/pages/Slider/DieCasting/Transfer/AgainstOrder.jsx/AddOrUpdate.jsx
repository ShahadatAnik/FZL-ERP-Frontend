import { AddModal } from '@/components/Modal';
import { useRHF, useFetch } from '@/hooks';
import { useSliderDieCastingTransferAgainstOrderByUUID } from '@/state/Slider';
import { FormField, Input, ReactSelect, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE,
} from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { data, url, updateData } =
		useSliderDieCastingTransferAgainstOrderByUUID(update?.uuid);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		context,
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL
	);

	const { value: order } = useFetch(
		'/other/slider/stock-with-order-description/value/label'
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_UPDATE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				update?.uuid !== null
					? 'Update Against Order > Slider Assembly'
					: ''
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			formContext={context}
			isSmall={true}>
			<FormField label='stock_uuid' title='Type' errors={errors}>
				<Controller
					name={'stock_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={order}
								value={order?.filter(
									(item) =>
										item.value === getValues('stock_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={update?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				title='Production Quantity'
				label='trx_quantity'
				unit='PCS'
				sub_label={`MAX: ${Number(getValues('max_quantity'))} PCS`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
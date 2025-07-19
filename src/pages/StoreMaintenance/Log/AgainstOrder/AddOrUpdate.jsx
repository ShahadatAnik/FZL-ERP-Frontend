import { useEffect } from 'react';
import {
	useCommonOrderAgainstCoilRMLog,
	useCommonOrderAgainstTapeRMLog,
	useCommonTapeSFG,
} from '@/state/Common';
import { useOrderAgainstDeliveryRMLog } from '@/state/Delivery';
import { useOrderAgainstDyeingRMLog } from '@/state/Dyeing';
import { useOrderAgainstLabDipRMLog } from '@/state/LabDip';
import {
	useOrderAgainstMetalFinishingRMLog,
	useOrderAgainstMetalTCRMLog,
	useOrderAgainstMetalTMRMLog,
} from '@/state/Metal';
import { useOrderAgainstNylonMetallicFinishingRMLog } from '@/state/Nylon';
import { useOtherMaterial } from '@/state/Other';
import {
	useOrderAgainstDieCastingRMLog,
	useOrderAgainstSliderAssemblyRMLog,
	useOrderAgainstSliderColorRMLog,
	useSliderAssemblyStock,
	useSliderDieCastingStock,
} from '@/state/Slider';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
	useMaterialTrxAgainstOrderDescriptionByUUID,
} from '@/state/Store';
import {
	useOrderAgainstVislonFinishingRMLog,
	useOrderAgainstVislonTMRMLog,
} from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	MATERIAL_TRX_AGAINST_ORDER_NULL,
	MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea, { getPurposes } from '@/util/TransactionArea';

import { sections } from './Utils';

export default function Index({
	modalId = '',
	updateMaterialTrxToOrder = {
		uuid: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdateMaterialTrxToOrder,
}) {
	const { data, updateData } = useMaterialTrxAgainstOrderDescriptionByUUID(
		updateMaterialTrxToOrder?.uuid
	);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateOrderAgainstDeliveryRMLog } =
		useOrderAgainstDeliveryRMLog();
	const { invalidateQuery: invalidateOrderAgainstDieCastingRMLog } =
		useOrderAgainstDieCastingRMLog();
	const { invalidateQuery: invalidateOrderAgainstLabDipRMLog } =
		useOrderAgainstLabDipRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetaFinishingRMLog } =
		useOrderAgainstMetalFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetalTCRMLog } =
		useOrderAgainstMetalTCRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetalTMRMLog } =
		useOrderAgainstMetalTMRMLog();
	const { invalidateQuery: invalidateOrderAgainstDyeingRMLog } =
		useOrderAgainstDyeingRMLog();
	const { invalidateQuery: invalidateOrderAgainstCoilRMLog } =
		useCommonOrderAgainstCoilRMLog();
	const { invalidateQuery: invalidateOrderAgainstTapeRMLog } =
		useCommonOrderAgainstTapeRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetallicFinishingRMLog } =
		useOrderAgainstNylonMetallicFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstVislonFinishingRMLog } =
		useOrderAgainstVislonFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstTMRMLog } =
		useOrderAgainstVislonTMRMLog();
	const { invalidateQuery: invalidateOrderAgainstSliderAssemblyRMLog } =
		useOrderAgainstSliderAssemblyRMLog();
	const { invalidateQuery: invalidateOrderAgainstSliderColorRMLog } =
		useOrderAgainstSliderColorRMLog();
	const { invalidateQuery: invalidateSliderDieCastingStock } =
		useSliderDieCastingStock();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { invalidateQuery: invalidateSliderAssemblyStock } =
		useSliderAssemblyStock();

	const { data: material } = useOtherMaterial();
	const MAX_QUANTITY =
		Number(updateMaterialTrxToOrder?.stock) +
		Number(updateMaterialTrxToOrder?.trx_quantity);

	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		trx_quantity:
			MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);
	const selectUnit = [
		{ label: 'kg', value: 'kg' },
		{ label: 'Litre', value: 'ltr' },
		{ label: 'Meter', value: 'mtr' },
		{ label: 'Piece', value: 'pcs' },
	];

	const onClose = () => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			uuid: null,
			material_name: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrxToOrder?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `/zipper/material-trx-against-order/${updateMaterialTrxToOrder?.uuid}`,
				uuid: updateMaterialTrxToOrder?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();
			invalidateOrderAgainstDeliveryRMLog();
			invalidateOrderAgainstDieCastingRMLog();
			invalidateOrderAgainstLabDipRMLog();
			invalidateOrderAgainstMetaFinishingRMLog();
			invalidateOrderAgainstMetalTCRMLog();
			invalidateOrderAgainstMetalTMRMLog();
			invalidateOrderAgainstDyeingRMLog();
			invalidateOrderAgainstCoilRMLog();
			invalidateOrderAgainstTapeRMLog();
			invalidateOrderAgainstMetallicFinishingRMLog();
			invalidateOrderAgainstVislonFinishingRMLog();
			invalidateOrderAgainstTMRMLog();
			invalidateOrderAgainstSliderAssemblyRMLog();
			invalidateOrderAgainstSliderColorRMLog();
			invalidateSliderDieCastingStock();
			invalidateCommonTapeSFG();
			invalidateSliderAssemblyStock();

			return;
		}
	};

	const transactionArea = getTransactionArea();

	const purposes = getPurposes;

	return (
		<AddModal
			id={modalId}
			title={`Against Order Log of ${updateMaterialTrxToOrder?.material_name}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			{/* <FormField label='purpose' title='Purpose' errors={errors}>
				<Controller
					name={'purpose'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select purpose'
								options={purposes}
								value={
									purposes?.filter(
										(item) =>
											item.value === getValues('purpose')
									) || null
								}
								onChange={(e) => onChange(e.value)}
								isDisabled={true}
							/>
						);
					}}
				/>
			</FormField> */}
			<FormField label='trx_to' title='Trx to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={sections}
								value={sections?.filter(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateMaterialTrxToOrder?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='trx_quantity'
				label={`trx_quantity`}
				sub_label={`Max: ${MAX_QUANTITY}`}
				unit={
					material?.find(
						(inItem) => inItem.value == getValues(`material_uuid`)
					)?.unit
				}
				register={register}
			/>
			<Input
				label='weight'
				// sub_label={`Max: ${updateMaterialDetails?.stock}`}
				// placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			{/* <Input
				label='trx_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/> */}
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

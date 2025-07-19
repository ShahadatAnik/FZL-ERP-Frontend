import { useAuth } from '@/context/auth';
import {
	useCommonOrderAgainstCoilRMLog,
	useCommonOrderAgainstTapeRMLog,
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
import { useOtherIssue, useOtherOrderStore } from '@/state/Other';
import {
	useOrderAgainstDieCastingRMLog,
	useOrderAgainstSliderAssemblyRMLog,
	useOrderAgainstSliderColorRMLog,
	useSliderAssemblyStock,
} from '@/state/Slider';
import { useMaterialInfo, useMaterialStockToSFG } from '@/state/Store';
import {
	useOrderAgainstVislonFinishingRMLog,
	useOrderAgainstVislonTMRMLog,
} from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	MATERIAL_TRX_AGAINST_ISSUE_NULL,
	MATERIAL_TRX_AGAINST_ISSUE_SCHEMA,
	NUMBER_DOUBLE_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea, { getPurposes } from '@/util/TransactionArea';

import { sections } from './Utils';

export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
		name: null,
		stock: null,
	},
	setUpdateMaterialDetails,
}) {
	const { postData } = useMaterialInfo();
	const { data: issues } = useOtherIssue();
	const { invalidateQuery: invalidateMaterialStockToSFG } =
		useMaterialStockToSFG();
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo('rm');
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
	const { invalidateQuery: invalidateSliderAssemblyStock } =
		useSliderAssemblyStock();

	const { user } = useAuth();

	const schema = {
		...MATERIAL_TRX_AGAINST_ISSUE_SCHEMA,
		trx_quantity: MATERIAL_TRX_AGAINST_ISSUE_SCHEMA.trx_quantity
			.moreThan(0)
			.max(Number(updateMaterialDetails?.stock).toFixed(3)),
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
	} = useRHF(schema, MATERIAL_TRX_AGAINST_ISSUE_NULL);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
			stock: 0,
		}));
		reset(MATERIAL_TRX_AGAINST_ISSUE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				material_uuid: updateMaterialDetails.uuid,
				created_by: user?.uuid,
				uuid: nanoid(),
				created_at: GetDateTime(),
			};

			await postData.mutateAsync({
				url: '/zipper/material-trx-against-issue',
				newData: updatedData,
				onClose,
			});

			invalidateMaterialStockToSFG();
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
			invalidateSliderAssemblyStock();

			return;
		}
	};

	const purposes = getPurposes;

	return (
		<AddModal
			id={modalId}
			title={'Material Trx Against Issue: ' + updateMaterialDetails?.name}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='issue_uuid' title='Issue' errors={errors}>
				<Controller
					name={'issue_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Issue'
								options={issues}
								value={
									issues?.filter(
										(item) =>
											item.value ===
											getValues('issue_uuid')
									) || null
								}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>

			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Section'
								options={sections}
								value={
									sections.filter(
										(item) =>
											item.value === getValues('trx_to')
									) || null
								}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>

			<Input
				label='trx_quantity'
				sub_label={`Max: ${updateMaterialDetails?.stock}`}
				placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			<Input
				label='weight'
				// sub_label={`Max: ${updateMaterialDetails?.stock}`}
				placeholder={`Max: ${updateMaterialDetails?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

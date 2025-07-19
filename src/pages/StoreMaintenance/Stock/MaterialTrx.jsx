import { useAuth } from '@/context/auth';
import { useMaterialInfo } from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { MATERIAL_STOCK_NULL, MATERIAL_STOCK_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import getTransactionArea from '@/util/TransactionArea';

import { sections } from './Utils';

export default function Index({
	modalId = '',
	// eslint-disable-next-line @eslint-react/no-unstable-default-props
	updateMaterialDetails = {
		uuid: null,
		stock: 0,
	},
	setUpdateMaterialDetails,
}) {
	const { user } = useAuth();
	const { postData } = useMaterialInfo();

	const schema = {
		...MATERIAL_STOCK_SCHEMA,
		trx_quantity: MATERIAL_STOCK_SCHEMA.trx_quantity
			.moreThan(0, "Quantity can't be zero.")
			.max(updateMaterialDetails?.stock, 'Quantity Exceeds Stock'),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		getValues,
		reset,
		context,
	} = useRHF(schema, MATERIAL_STOCK_NULL);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
			stock: 0,
		}));
		reset(MATERIAL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Create Item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				material_uuid: updateMaterialDetails.uuid,
				created_by: user?.uuid,
				uuid: nanoid(),
				created_at: GetDateTime(),
			};

			await postData.mutateAsync({
				url: '/material/trx',
				newData: updatedData,
				onClose,
			});

			return;
		}
	};

	const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={'Material Trx of ' + updateMaterialDetails?.name}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='trx_to' title='Transfer To' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={sections}
								value={sections?.filter(
									(item) => item.value === getValues('trx_to')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
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
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

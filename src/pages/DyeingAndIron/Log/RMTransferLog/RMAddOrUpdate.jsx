import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonMaterialUsed, useCommonTapeRM } from '@/state/Common';
import { useDyeingRM } from '@/state/Dyeing';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	RM_MATERIAL_USED_EDIT_NULL,
	RM_MATERIAL_USED_EDIT_SCHEMA,
} from '@util/Schema';
import getTransactionArea from '@/util/TransactionArea';
export default function Index({
	modalId = '',
	updateDyeingLog = {
		uuid: null,
		section: null,
		used_quantity: null,
		dying_and_iron: null,
	},
	setUpdateDyeingLog,
}) {
	const { url, updateData } = useCommonMaterialUsed();
	const { invalidateQuery: invalidateDyeingRM } = useDyeingRM();
	const MAX_QUANTITY =
		Number(updateDyeingLog?.dying_and_iron) +
		Number(updateDyeingLog?.used_quantity);
	const schema = {
		...RM_MATERIAL_USED_EDIT_SCHEMA,
		used_quantity:
			RM_MATERIAL_USED_EDIT_SCHEMA.used_quantity.max(MAX_QUANTITY),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		wa,
	} = useRHF(schema, RM_MATERIAL_USED_EDIT_NULL);

	useFetchForRhfReset(
		`${url}/${updateDyeingLog?.uuid}`,
		updateDyeingLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateDyeingLog((prev) => ({
			...prev,
			uuid: null,
			section: null,
			used_quantity: null,
			dying_and_iron: null,
		}));
		reset(RM_MATERIAL_USED_EDIT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateDyeingLog?.uuid !== null) {
			const updatedData = {
				...data,
				material_name: updateDyeingLog?.material_name,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateDyeingLog?.uuid}`,
				uuid: updateDyeingLog?.uuid,
				updatedData,
				onClose,
			});
			invalidateDyeingRM();

			return;
		}
	};

const transactionArea = getTransactionArea();

	return (
		<AddModal
			id={modalId}
			title={`Dyeing and Iron RM Log of ${updateDyeingLog?.material_name}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='section' title='Section' errors={errors}>
				<Controller
					name={'section'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Section'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('section')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled='1'
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='used_quantity'
				sub_label={`Max: ${Number(updateDyeingLog?.dying_and_iron) + Number(updateDyeingLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateDyeingLog?.dying_and_iron) + Number(updateDyeingLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input
				label='wastage'
				sub_label={`Max: ${Number(updateDyeingLog?.dying_and_iron) + Number(updateDyeingLog?.used_quantity)}`}
				placeholder={`Max: ${Number(updateDyeingLog?.dying_and_iron) + Number(updateDyeingLog?.used_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

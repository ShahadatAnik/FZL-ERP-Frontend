import { useAuth } from '@/context/auth';
import { useLabDipRM, useLabDipRMLog } from '@/state/LabDip';
import * as yup from 'yup';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast/ReactToastify';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { RM_MATERIAL_USED_NULL, RM_MATERIAL_USED_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateLabDipStock = {
		uuid: null,
		unit: null,
		lab_dip: null,
	},
	setUpdateLabDipStock,
}) {
	const { user } = useAuth();
	const { url, postData } = useLabDipRM();
	const { invalidateQuery: invalidateLabDipRMLog } = useLabDipRMLog();
	const MAX_QUANTITY = updateLabDipStock?.lab_dip;

	const schema = {
		used_quantity: RM_MATERIAL_USED_SCHEMA.remaining.max(
			updateLabDipStock?.lab_dip
		),
	};

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		schema,
		RM_MATERIAL_USED_NULL
	);
	const MAX_WASTAGE = MAX_QUANTITY - watch('used_quantity');
	const onClose = () => {
		setUpdateLabDipStock((prev) => ({
			...prev,
			uuid: null,
			unit: null,
			lab_dip: null,
		}));
		reset(RM_MATERIAL_USED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (MAX_WASTAGE < watch('wastage')) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		const updatedData = {
			...data,

			material_uuid: updateLabDipStock?.uuid,
			section: 'lab_dip',
			created_by: user?.uuid,
			created_by_name: user?.name,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};
		await postData.mutateAsync({
			url: '/material/used',
			newData: updatedData,
			onClose,
		});
		invalidateLabDipRMLog();
	};

	return (
		<AddModal
			id={modalId}
			title={updateLabDipStock?.uuid !== null && 'Material Usage Entry'}
			onSubmit={handleSubmit(onSubmit)}
			formContext={context}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='used_quantity'
				sub_label={`Max: ${Number(updateLabDipStock?.lab_dip)}`}
				unit={updateLabDipStock?.unit}
				max={updateLabDipStock?.lab_dip}
				placeholder={`Max: ${Number(updateLabDipStock?.lab_dip)}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit={updateLabDipStock?.unit}
				sub_label={`Max: ${(updateLabDipStock?.lab_dip -
					watch('used_quantity') <
				0
					? 0
					: updateLabDipStock?.lab_dip - watch('used_quantity')
				).toFixed(2)}`}
				placeholder={`Max: ${(updateLabDipStock?.lab_dip -
					watch('used_quantity') <
				0
					? 0
					: updateLabDipStock?.lab_dip - watch('used_quantity')
				).toFixed(2)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

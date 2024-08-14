import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import { useCommonCoilProduction } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	TAPE_OR_COIL_PRODUCTION_LOG_NULL,
	TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateCoilLog = {
		uuid: null,
		tape_type: null,
		tape_or_coil_stock_id: null,
		production_quantity: null,
		tape_prod: null,
		coil_stock: null,
		wastage: null,
		issued_by_name: null,
	},
	setUpdateCoilLog,
}) {
	const { url, updateData } = useCommonCoilProduction();

	const MAX_QUANTITY =
		Number(updateCoilLog.trx_quantity_in_coil) +
		Number(updateCoilLog.production_quantity);
	const schema = {
		...TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA,
		production_quantity:
			TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA.production_quantity.max(
				MAX_QUANTITY
			),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		TAPE_OR_COIL_PRODUCTION_LOG_NULL
	);

	useFetchForRhfReset(
		`${`/zipper/tape-coil-production`}/${updateCoilLog?.uuid}`,
		updateCoilLog?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCoilLog((prev) => ({
			...prev,
			uuid: null,
			tape_type: null,
			tape_or_coil_stock_id: null,
			prod_quantity: null,
			tape_prod: null,
			coil_stock: null,
			wastage: null,
			issued_by_name: null,
		}));
		reset(TAPE_OR_COIL_PRODUCTION_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateCoilLog?.uuid !== null && updateCoilLog?.uuid !== undefined) {
			const updatedData = {
				...data,
				type_of_zipper: updateCoilLog?.type_of_zipper,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${'/zipper/tape-coil-production'}/${updateCoilLog?.uuid}`,
				uuid: updateCoilLog?.uuid,
				updatedData,
				onClose,
			});
			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Production Log of ${updateCoilLog?.type_of_zipper}`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				sub_label={`Min: ${MAX_QUANTITY}`}
				unit='KG'
				placeholder={`Min: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

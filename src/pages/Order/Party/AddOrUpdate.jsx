import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderParty } from '@/state/Order';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { PARTY_NULL, PARTY_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateParty = {
		uuid: null,
	},
	setUpdateParty,
}) {
	const { url, updateData, postData } = useOrderParty();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		PARTY_SCHEMA,
		PARTY_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateParty?.uuid}`,
		updateParty?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateParty((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(PARTY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateParty?.uuid !== null && updateParty?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateParty?.uuid}`,
				uuid: updateParty?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateParty?.uuid !== null ? 'Update Party' : 'Party'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

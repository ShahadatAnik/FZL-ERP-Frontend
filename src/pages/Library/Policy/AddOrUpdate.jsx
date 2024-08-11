import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useLibraryPolicy } from '@/state/Library';
import { Input, Select, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { POLICY_NULL, POLICY_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updatePolicy = {
		uuid: null,
	},
	setUpdatePolicy,
}) {
	const { url, updateData, postData } = useLibraryPolicy();
	const { register, handleSubmit, errors, reset, control, getValues } =
		useRHF(POLICY_SCHEMA, POLICY_NULL);

	useFetchForRhfReset(
		`${url}/${updatePolicy?.uuid}`,
		updatePolicy?.uuid,
		reset
	);

	const onClose = () => {
		setUpdatePolicy((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(POLICY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updatePolicy?.uuid !== null && updatePolicy?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			console.log(`${url}/${updatePolicy?.uuid}`);

			await updateData.mutateAsync({
				url: `${url}/${updatePolicy?.uuid}`,
				uuid: updatePolicy?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		console.log(url);

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updatePolicy?.uuid !== null ? 'Update Policy' : 'Policy'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Select
				label='type'
				option={[
					{ value: 'policy', label: 'Policy' },
					{ value: 'notice', label: 'Notice' },
				]}
				{...{ register, errors }}
			/>
			<Textarea label='title' {...{ register, errors }} />
			<Textarea label='sub_title' {...{ register, errors }} />
			<Textarea label='url' {...{ register, errors }} />
			<Select
				label='status'
				option={[
					{ value: 1, label: 'Active' },
					{ value: 0, label: 'Inactive' },
				]}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

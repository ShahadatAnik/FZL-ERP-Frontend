import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMaterialSection } from '@/state/Material';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SECTION_NULL, SECTION_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	setSection,
	updateSection = {
		uuid: null,
	},
	setUpdateSection,
}) {
	const { url, updateData, postData } = useMaterialSection();
	const { register, handleSubmit, errors, reset } = useRHF(
		SECTION_SCHEMA,
		SECTION_NULL
	);

	useFetchForRhfReset(
		`/material/section/${updateSection?.uuid}`,
		updateSection?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateSection((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SECTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSection?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateSection?.uuid}`,
				uuid: updateSection?.uuid,
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

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateSection?.uuid !== null ? 'Update Section' : 'Section'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useAdminDepartments } from '@/state/Admin';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { USER_DEPARTMENT_NULL, USER_DEPARTMENT_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateDepartment = {
		uuid: null,
	},
	setUpdateDepartment,
}) {
	const { url, updateData, postData } = useAdminDepartments();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		USER_DEPARTMENT_SCHEMA,
		USER_DEPARTMENT_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateDepartment?.uuid}`,
		updateDepartment?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateDepartment((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(USER_DEPARTMENT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateDepartment?.uuid !== null &&
			updateDepartment?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateDepartment?.uuid}`,
				uuid: updateDepartment?.uuid,
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
			title={
				updateDepartment?.uuid !== null
					? 'Update Department'
					: 'Department'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='department' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

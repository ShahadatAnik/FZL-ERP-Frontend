import { AddModal } from '@/components/Modal';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useAdminDesignations } from '@/state/Admin';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { USER_DESIGNATION_NULL, USER_DESIGNATION_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateDesignation = {
		uuid: null,
	},
	setUpdateDesignation,
}) {
	const { url, updateData, postData } = useAdminDesignations();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
	} = useRHF(USER_DESIGNATION_SCHEMA, USER_DESIGNATION_NULL);

	useFetchForRhfReset(
		`${url}/${updateDesignation?.uuid}`,
		updateDesignation?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateDesignation((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(USER_DESIGNATION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateDesignation?.uuid !== null &&
			updateDesignation?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateDesignation?.uuid}`,
				uuid: updateDesignation?.uuid,
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

	const { value: userDepartment } = useFetch('/other/department/value/label');

	return (
		<AddModal
			id={modalId}
			title={
				updateDesignation?.uuid !== null
					? 'Update Designation'
					: 'Designation'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='department_uuid'
				title='Department'
				errors={errors}>
				<Controller
					name={'department_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Department'
								options={userDepartment}
								value={userDepartment?.find(
									(item) =>
										item.value ==
										getValues('department_uuid')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='designation' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

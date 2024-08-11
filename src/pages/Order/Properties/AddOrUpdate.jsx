import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderProperties } from '@/state/Order';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { PROPERTIES_NULL, PROPERTIES_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateOrderProperties = {
		uuid: null,
	},
	setUpdateOrderProperties,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useOrderProperties();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
	} = useRHF(PROPERTIES_SCHEMA, PROPERTIES_NULL);

	useFetchForRhfReset(
		`${url}/${updateOrderProperties?.uuid}`,
		updateOrderProperties?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateOrderProperties((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(PROPERTIES_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateOrderProperties?.uuid !== null &&
			updateOrderProperties?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateOrderProperties?.uuid}`,
				uuid: updateOrderProperties?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
			updated_at: null,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	const typeOptions = [
		{ value: 'end_type', label: 'End Type' },
		{ value: 'lock_type', label: 'Lock Type' },
		{ value: 'item', label: 'Item' },
		{ value: 'zipper_number', label: 'Zipper Number' },
		{ value: 'puller_type', label: 'Puller Type' },
		{ value: 'hand', label: 'Hand' },
		{ value: 'special_requirement', label: 'Special Requirement' },
		{ value: 'color', label: 'Color' },
		{ value: 'stopper_type', label: 'Stopper Type' },
		{ value: 'coloring_type', label: 'Coloring Type' },
		{ value: 'slider', label: 'Slider' },
		{ value: 'top_stopper', label: 'Top Stopper' },
		{ value: 'bottom_stopper', label: 'Bottom Stopper' },
		{ value: 'logo_type', label: 'Logo Type' },
	];

	const itemForOptions = [
		{ value: 'zipper', label: 'Zipper' },
		{ value: 'thread', label: 'Thread' },
	];


	return (
		<AddModal
			id={modalId}
			title={
				updateOrderProperties?.uuid !== null
					? 'Update Order Properties'
					: 'Order Properties'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='type' title='Type' errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={typeOptions}
								value={typeOptions?.filter((item) =>
									getValues('type').includes(item.value)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={
									updateOrderProperties?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>

			<FormField label='item_for' title='Item For' errors={errors}>
				<Controller
					name={'item_for'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Item For'
								options={itemForOptions}
								value={itemForOptions?.filter((item) =>
									getValues('item_for').includes(item.value)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={
									updateOrderProperties?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>

			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}

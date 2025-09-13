import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { typeOptions } from '../Ledger/utils';
import {
	useAccGroup,
	useAccGroupByUUID,
	useOtherAccHead,
} from './config/query';
import { GROUP_NULL, GROUP_SCHEMA } from './config/schema';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
}) {
	const { user } = useAuth();

	const { data, updateData, postData } = useAccGroupByUUID(updateItem?.uuid);
	const { invalidateQuery } = useAccGroup();
	const { data: headOptions } = useOtherAccHead(updateItem?.uuid);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(GROUP_SCHEMA, GROUP_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateItem((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(GROUP_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateItem?.uuid !== null && updateItem?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `/acc/group/${updateItem?.uuid}`,
				uuid: updateItem?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,

			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/acc/group',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={updateItem?.uuid !== null ? 'Update Group' : 'Group'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label='head_uuid'
				title='Accounting Head'
				errors={errors}
			>
				<Controller
					name={'head_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Head'
								options={headOptions}
								value={headOptions?.filter(
									(item) =>
										item.value == getValues('head_uuid')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			{/* <FormField label='type' title='Type' errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={typeOptions}
								value={typeOptions?.filter(
									(item) => item.value == getValues('type')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField> */}
			<Input label='name' {...{ register, errors }} />
			<Input label='code' {...{ register, errors }} />

			<FormField label='is_fixed' title='Fixed' errors={errors}>
				<Controller
					name={'is_fixed'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<SwitchToggle
								onChange={(e) => {
									onChange(e);
								}}
								checked={getValues('is_fixed')}
							/>
						);
					}}
				/>
			</FormField>
			<Textarea label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

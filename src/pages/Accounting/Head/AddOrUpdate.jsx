import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { headTypeOptions } from '../Ledger/utils';
import { useAccHead, useAccHeadByUUID } from './config/query';
import { HEAD_NULL, HEAD_SCHEMA } from './config/schema';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
}) {
	const { user } = useAuth();

	const { data, updateData, postData } = useAccHeadByUUID(updateItem?.uuid);
	const { invalidateQuery } = useAccHead();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(HEAD_SCHEMA, HEAD_NULL);

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
		reset(HEAD_NULL);
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
				url: `/acc/head/${updateItem?.uuid}`,
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
			url: '/acc/head',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={updateItem?.uuid !== null ? 'Update Head' : 'Head'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='type' title='Type' errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={headTypeOptions}
								value={headTypeOptions?.filter(
									(item) => item.value == getValues('type')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='name' {...{ register, errors }} />
			{/* <Input label='title' {...{ register, errors }} /> */}

			<div className='flex gap-2'>
				<FormField label='bs' title='Bs' errors={errors}>
					<Controller
						name={'bs'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<SwitchToggle
									onChange={(e) => {
										onChange(e);
									}}
									checked={getValues('bs')}
								/>
							);
						}}
					/>
				</FormField>
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
			</div>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

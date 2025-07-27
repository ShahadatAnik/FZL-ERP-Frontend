import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useIssueProcurement,
	useIssueProcurementByUUID,
} from '@/state/Maintenance';
import { useOtherMaterial } from '@/state/Other';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { ISSUE_PROCUREMENT_NULL, ISSUE_PROCUREMENT_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	procurement = {
		uuid: null,
		procurement_uuid: null,
	},
	setProcurement,
}) {
	const isUpdate =
		procurement?.procurement_uuid !== null &&
		procurement?.procurement_uuid !== undefined;
	const { user } = useAuth();
	const { data, postData, updateData } = useIssueProcurementByUUID(
		procurement?.procurement_uuid
	);
	const { data: materials, invalidateQuery } = useOtherMaterial();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		Controller,
		context,
		getValues,
	} = useRHF(ISSUE_PROCUREMENT_SCHEMA, ISSUE_PROCUREMENT_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setProcurement((prev) => ({
			...prev,
			uuid: null,
			procurement_uuid: null,
		}));

		reset(ISSUE_PROCUREMENT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/maintain/issue-procurement/${procurement?.procurement_uuid}`,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			issue_uuid: procurement.uuid,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/maintain/issue-procurement',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id={modalId}
			title={'Procurement'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='material_uuid' title='Material' errors={errors}>
				<Controller
					name={'material_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Material'
								options={materials}
								value={materials?.filter(
									(item) =>
										item.value ===
										getValues('material_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Quantity'
				label='quantity'
				unit='PCS'
				{...{ register, errors }}
			/>
			<Textarea label='description' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

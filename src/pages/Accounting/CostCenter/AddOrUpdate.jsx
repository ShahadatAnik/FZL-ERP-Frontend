import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { useOtherTableName, useOtherTableNameBy } from '../Ledger/config/query';
import {
	useAccCostCenter,
	useAccCostCenterByUUID,
	useOtherAccLedger,
} from './config/query';
import { COST_CENTER_NULL, COST_CENTER_SCHEMA } from './config/schema';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
}) {
	const { user } = useAuth();

	const { data, updateData, postData } = useAccCostCenterByUUID(
		updateItem?.uuid
	);
	const { invalidateQuery } = useAccCostCenter();
	const { data: ledgerOptions } = useOtherAccLedger();
	const { data: tableOptions } = useOtherTableName();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		setValue,
		getValues,
		watch,
	} = useRHF(COST_CENTER_SCHEMA, COST_CENTER_NULL);

	const { data: tableDataOptions } = useOtherTableNameBy(watch('table_name'));

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
		reset(COST_CENTER_NULL);
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
				url: `/acc/cost-center/${updateItem?.uuid}`,
				uuid: updateItem?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: updateItem?.new_uuid || nanoid(),
			created_by: user?.uuid,

			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/acc/cost-center',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		updateItem?.invalidQueryCostCenter();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateItem?.uuid !== null ? 'Update Cost Center' : 'Cost Center'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<div className='flex gap-2'>
				<FormField
					label='table_name'
					title='Table Name'
					errors={errors}
				>
					<Controller
						name={'table_name'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Table'
									options={tableOptions}
									value={tableOptions?.filter(
										(item) =>
											item.value ==
											getValues('table_name')
									)}
									onChange={(e) => {
										onChange(e.value);
										setValue('table_uuid', null);
									}}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='table_uuid'
					title='Table Data'
					errors={errors}
				>
					<Controller
						name={'table_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Table Data'
									options={tableDataOptions}
									value={
										tableDataOptions?.filter(
											(item) =>
												item.value ==
												getValues('table_uuid')
										) || []
									}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<FormField label='ledger_uuid' title='Ledger' errors={errors}>
				<Controller
					name={'ledger_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Ledger'
								options={ledgerOptions}
								value={ledgerOptions?.filter(
									(item) =>
										item.value == getValues('ledger_uuid')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='name' {...{ register, errors }} />

			<Input label='invoice_no' {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

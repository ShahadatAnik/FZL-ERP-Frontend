import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import {
	useAccLedger,
	useAccLedgerByUUID,
	useOtherAccGroup,
	useOtherTableName,
	useOtherTableNameBy,
} from './config/query';
import { LEDGER_NULL, LEDGER_SCHEMA } from './config/schema';
import { restrictionOptions, typeOptions } from './utils';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
}) {
	const { user } = useAuth();

	const { data, updateData, postData } = useAccLedgerByUUID(updateItem?.uuid);
	const { invalidateQuery } = useAccLedger();
	const { data: groupOptions } = useOtherAccGroup();
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
	} = useRHF(LEDGER_SCHEMA, LEDGER_NULL);

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
		reset(LEDGER_NULL);
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
				url: `/acc/ledger/${updateItem?.uuid}`,
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
			url: '/acc/ledger',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={updateItem?.uuid !== null ? 'Update Ledger' : 'Ledger'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div>
				<div className='flex text-right'>
					<FormField label='is_active' title='Active' errors={errors}>
						<Controller
							name={'is_active'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<SwitchToggle
										onChange={(e) => {
											onChange(e);
										}}
										checked={getValues('is_active')}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='is_cash_ledger'
						title='Cash'
						errors={errors}
					>
						<Controller
							name={'is_cash_ledger'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<SwitchToggle
										onChange={(e) => {
											onChange(e);
										}}
										checked={getValues('is_cash_ledger')}
									/>
								);
							}}
						/>
					</FormField>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<Input label='name' {...{ register, errors }} />
				<div className='flex gap-2'>
					<FormField label='type' title='Type' errors={errors}>
						<Controller
							name={'type'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Type'
										options={typeOptions}
										value={typeOptions?.filter(
											(item) =>
												item.value == getValues('type')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='group_uuid' title='Group' errors={errors}>
						<Controller
							name={'group_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Group'
										options={groupOptions}
										value={groupOptions?.filter(
											(item) =>
												item.value ==
												getValues('group_uuid')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
				</div>
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

				<FormField
					label='restrictions'
					title='Restriction'
					errors={errors}
				>
					<Controller
						name={'restrictions'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Restriction'
									options={restrictionOptions}
									value={restrictionOptions?.filter(
										(item) =>
											item.value ==
											getValues('restrictions')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<div className='flex gap-2'>
					<Input label='vat_deduction' {...{ register, errors }} />
					<Input label='tax_deduction' {...{ register, errors }} />
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
				<FormField
					label='is_bank_ledger'
					title='Bank Ledger'
					errors={errors}
				>
					<Controller
						name={'is_bank_ledger'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<SwitchToggle
									onChange={(e) => {
										onChange(e);
									}}
									checked={getValues('is_bank_ledger')}
								/>
							);
						}}
					/>
				</FormField>

				{watch('is_bank_ledger') && (
					<Input label='account_no' {...{ register, errors }} />
				)}
			</div>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

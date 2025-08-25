import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useAccCostCenter,
	useAccCostCenterByUUID,
	useOtherAccLedger,
} from '@/pages/Accounting/CostCenter/config/query';
import {
	COST_CENTER_NULL,
	COST_CENTER_SCHEMA,
	STRING,
} from '@/pages/Accounting/CostCenter/config/schema';
import {
	useOtherTableName,
	useOtherTableNameBy,
} from '@/pages/Accounting/Ledger/config/query';
import { nanoid } from 'nanoid';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
	postData,
}) {
	const { user } = useAuth();

	const { data } = useAccCostCenterByUUID(updateItem?.uuid);
	const { invalidateQuery } = useAccCostCenter();
	const { data: tableOptions } = useOtherTableName();
	const schema = { ...COST_CENTER_SCHEMA, ledger_uuid: STRING.nullable() };

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
	} = useRHF(schema, COST_CENTER_NULL);

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
		const new_uuid = nanoid();
		// Add new item
		const updatedData = {
			...data,
			uuid: new_uuid,
			ledger_uuid: updateItem?.leader_uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/acc/cost-center',
			newData: updatedData,
			onClose,
		});

		await invalidateQuery();
		await updateItem?.invalidQueryCostCenter();
		await updateItem?.invalidateLedger();
		updateItem?.voucher_entry_set_value(
			`voucher_entry[${updateItem.index}].voucher_entry_cost_center`,
			[
				...updateItem.currentCostCenters.filter(
					(item) =>
						item.cost_center_uuid !== null &&
						item.cost_center_uuid !== undefined &&
						item.cost_center_uuid !== ''
				),
				{
					cost_center_uuid: new_uuid,
					amount: updateItem?.amount || 0,
				},
			]
		);
	};

	return (
		<AddModal
			id={modalId}
			title={'Add Cost Center'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='table_name' title='Table Name' errors={errors}>
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
										item.value == getValues('table_name')
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
			<FormField label='table_uuid' title='Table Data' errors={errors}>
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
			<Input label='name' {...{ register, errors }} />

			<Input label='invoice_no' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

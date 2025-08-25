import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { useAccountingCurrency, useOtherCurrency } from './config/query';
import {
	ACCOUNTING_CURRENCY_NULL,
	ACCOUNTING_CURRENCY_SCHEMA,
} from './config/schema';

export default function Index({
	modalId = '',
	updateCountLength = {
		uuid: null,
	},
	setUpdateCountLength,
}) {
	const { url, updateData, postData } = useAccountingCurrency();
	const { invalidateQuery: invalidateCurrency } = useOtherCurrency();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		getValues,
		Controller,
	} = useRHF(ACCOUNTING_CURRENCY_SCHEMA, ACCOUNTING_CURRENCY_NULL);

	useFetchForRhfReset(
		`${url}/${updateCountLength?.uuid}`,
		updateCountLength?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCountLength((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(ACCOUNTING_CURRENCY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateCountLength?.uuid !== null &&
			updateCountLength?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `${url}/${updateCountLength?.uuid}`,
				uuid: updateCountLength?.uuid,
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
			url,
			newData: updatedData,
			onClose,
		});
		invalidateCurrency();
	};
	return (
		<AddModal
			id={modalId}
			title={
				updateCountLength?.uuid !== null
					? 'Update Currency'
					: 'Add Currency'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='is_fixed' title='Default' errors={errors}>
				<Controller
					name={'default'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<SwitchToggle
								onChange={(e) => {
									onChange(e);
								}}
								checked={getValues('default')}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='currency' {...{ register, errors }} />
			<Input label='currency_name' {...{ register, errors }} />
			<Input label='symbol' {...{ register, errors }} />
			<Input label='conversion_rate' {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

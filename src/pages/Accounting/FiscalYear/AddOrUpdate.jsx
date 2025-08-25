import { useAuth } from '@/context/auth';
import { Separator } from '@radix-ui/react-select';
import { getYear } from 'date-fns';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBox, DateInput, Switch, Textarea } from '@/ui/Core';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { useOtherCurrency } from '../Currency/config/query';
import { useAccountingFiscalYear } from './config/query';
import { FISCAL_YEAR_NULL, FISCAL_YEAR_SCHEMA } from './config/schema';
import { generateYearRanges } from './utils';

export default function Index({
	modalId = '',
	updateCountLength = {
		uuid: null,
	},
	setUpdateCountLength,
}) {
	const { url, updateData, postData } = useAccountingFiscalYear();
	const isUpdate = updateCountLength?.uuid !== null;
	const { data: currencyOptions } = useOtherCurrency();
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
		watch,
	} = useRHF(FISCAL_YEAR_SCHEMA, FISCAL_YEAR_NULL);

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
		reset(FISCAL_YEAR_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		try {
			if (updateCountLength?.uuid) {
				const updatedData = {
					...data,
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				};

				const res = await updateData.mutateAsync({
					url: `${url}/${updateCountLength?.uuid}`,
					uuid: updateCountLength?.uuid,
					updatedData,
					onClose,
				});
				onClose();
				return;
			}

			const newData = {
				...data,
				uuid: nanoid(),
				created_by: user?.uuid,
				created_at: GetDateTime(),
			};

			const res = await postData.mutateAsync({
				url,
				newData,
				onClose,
			});

			// Success reached here
			onClose();
		} catch (err) {
			ShowLocalToast({
				type: 'error',
				message:
					'Submit Failed. Please check year range unique or other issues.',
			});
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateCountLength?.uuid !== null
					? 'Update Fiscal Year'
					: 'Add Fiscal Year'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className='flex flex-col gap-2'>
				<div className='grid grid-cols-2 gap-4'>
					<div className='flex'>
						<FormField
							label='active'
							title='Active'
							is_title_needed='false'
							errors={errors}
						>
							<Controller
								name={'active'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<Switch
											label='active'
											title='Active'
											text='text-primary-content'
											onChange={(e) =>
												onChange(e.target.checked)
											}
											{...{ register, errors }}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='locked'
							title='Locked'
							is_title_needed='false'
							errors={errors}
						>
							<Controller
								name={'locked'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<Switch
											label='locked'
											title='Locked'
											text='text-primary-content'
											onChange={(e) =>
												onChange(e.target.checked)
											}
											{...{ register, errors }}
										/>
									);
								}}
							/>
						</FormField>
					</div>
					<FormField label='year_no' title='Year' errors={errors}>
						<Controller
							name={'year_no'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Year'
										options={generateYearRanges(
											2025,
											getYear(new Date()) + 15
										)}
										value={generateYearRanges(
											1971,
											getYear(new Date()) + 15
										)?.filter(
											(item) =>
												item.value ==
												getValues('year_no')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<DateInput
						label={`start_date`}
						Controller={Controller}
						control={control}
						selected={watch(`start_date`)}
						{...{ register, errors }}
					/>
					<DateInput
						label={`end_date`}
						Controller={Controller}
						control={control}
						selected={watch(`end_date`)}
						startDate={watch(`start_date`)}
						{...{ register, errors }}
					/>
					<FormField
						label='currency_uuid'
						title='Currency'
						errors={errors}
					>
						<Controller
							name={'currency_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										label='Currency'
										placeholder='Select Currency'
										options={currencyOptions}
										value={currencyOptions?.filter(
											(item) =>
												item.value ==
												getValues('currency_uuid')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<Input
						label='rate'
						title='Default Rate'
						type='number'
						{...{ register, errors }}
					/>
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
				<br />
				<p className='w-full rounded-sm border bg-secondary/5 text-center font-semibold text-primary'>
					Budget
				</p>
				<div className='grid grid-cols-3 gap-4'>
					<Input
						title='January'
						label='jan_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='February'
						label='feb_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='March'
						label='mar_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='April'
						label='apr_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='May'
						label='may_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='June'
						label='jun_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='July'
						label='jul_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='August'
						label='aug_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='September'
						label='sep_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='October'
						label='oct_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='November'
						label='nov_budget'
						type='number'
						{...{ register, errors }}
					/>
					<Input
						title='December'
						label='dec_budget'
						type='number'
						{...{ register, errors }}
					/>
				</div>
			</div>

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}

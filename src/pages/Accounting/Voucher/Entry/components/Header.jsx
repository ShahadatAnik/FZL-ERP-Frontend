import { useOtherCurrency } from '@/pages/Accounting/Currency/config/query';
import { useParams } from 'react-router';

import { DateInput, FormField, Radio } from '@/ui/Core';
import { Input, ReactSelect, SectionEntryBody, Textarea } from '@/ui';

import { categoryOptions } from '../../utils';

export default function Header({
	register,
	errors,
	control,
	setValue,
	Controller,
	watch,
	currencyOptions,
}) {
	return (
		<SectionEntryBody
			title={`Voucher Information: ${watch('voucher_id')}`}
			className='grid grid-cols-3 gap-4'
		>
			<div className='flex gap-4'>
				<DateInput
					label={`date`}
					Controller={Controller}
					control={control}
					selected={watch(`date`)}
					{...{ register, errors }}
				/>
				<Input label='vat_deduction' {...{ register, errors }} />
				<Input label='tax_deduction' {...{ register, errors }} />
			</div>
			<div className='flex gap-4'>
				<FormField
					label='currency_uuid'
					title='Currency'
					errors={errors}
				>
					<Controller
						name={'currency_uuid'}
						control={control}
						render={({ field: { onChange, value } }) => {
							// Find the selected option or fall back to default
							const selectedOption =
								currencyOptions?.find(
									(item) => item.value === value
								) ||
								currencyOptions?.find(
									(item) => item.default === true
								);

							return (
								<ReactSelect
									placeholder='Select Currency'
									options={currencyOptions}
									value={selectedOption || null}
									onChange={(selectedOption) => {
										if (selectedOption) {
											setValue(
												'conversion_rate',
												selectedOption.conversion_rate
											);
											onChange(selectedOption.value);
										}
									}}
								/>
							);
						}}
					/>
				</FormField>
				<Input label='conversion_rate' {...{ register, errors }} />
			</div>
			<Textarea label='remarks' {...{ register, errors }} />
			<Radio
				name='category'
				title='Category'
				options={categoryOptions}
				control={control}
				defaultValue=''
				Controller={Controller}
				register={register}
				errors={errors}
			/>
		</SectionEntryBody>
	);
}

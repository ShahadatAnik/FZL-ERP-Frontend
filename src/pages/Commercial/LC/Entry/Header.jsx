import { useOtherParty } from '@/state/Other';
import { useParams } from 'react-router';

import { DateInput } from '@/ui/Core';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import DynamicProgression from './DynamicProgression';
import DynamicUD from './DynamicUD';

const atSight = [
	{ value: 0, label: 'At Sight / 0 Day' },
	{ value: 30, label: '30' },
	{ value: 60, label: '60' },
	{ value: 90, label: '90' },
	{ value: 120, label: '120' },
	{ value: 150, label: '150' },
	{ value: 180, label: '180' },
];

const Section = ({ title, children }) => (
	<div className='flex flex-col gap-1 rounded-md bg-base-200/50 p-3'>
		<span className='ml-1 text-xl font-bold text-primary'>{title}</span>
		<div className='flex flex-col gap-1 text-secondary-content md:flex-row'>
			{children}
		</div>
	</div>
);

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,

	progressionField,
	progressionAppend,
	progressionRemove,
	setDeleteLCEntry,

	udField,
	udAppend,
	udRemove,
	deleteLCEntryUD,
	setDeleteLCEntryUD,
}) {
	const { lc_uuid } = useParams();
	const { data: party } = useOtherParty();

	return (
		<SectionEntryBody title='LC Information'>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-1 overflow-auto text-sm md:justify-end'>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Old PI'
							label='is_old_pi'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='RTGS'
							label='is_rtgs'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Problematic'
							label='problematical'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='EPZ'
							label='epz'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Production Complete'
							label='production_complete'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Cancelled'
							label='lc_cancel'
							text='text-primary-content'
							{...{ register, errors }}
						/>
					</div>
				</div>
				<Section title='File Details'>
					<FormField label='party_uuid' title='Party' errors={errors}>
						<Controller
							name={'party_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Party'
										options={party}
										value={party?.find(
											(item) =>
												item.value ===
												getValues('party_uuid')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>

					<Input
						label='lc_number'
						disabled={lc_uuid != null}
						{...{ register, errors }}
					/>
					<DateInput
						label='lc_date'
						Controller={Controller}
						control={control}
						selected={watch('lc_date')}
						{...{ register, errors }}
					/>

					{getValues('is_old_pi') && (
						<>
							<Input label='lc_value' {...{ register, errors }} />
							<Textarea
								label='pi_number'
								{...{ register, errors }}
							/>
						</>
					)}
				</Section>
				<Section title='Export'>
					<Input label='export_lc_number' {...{ register, errors }} />
					<DateInput
						label='export_lc_date'
						Controller={Controller}
						control={control}
						selected={watch('export_lc_date')}
						{...{ register, errors }}
					/>
					{/* <DateInput
						label='export_lc_expire_date'
						Controller={Controller}
						control={control}
						selected={watch('export_lc_expire_date')}
						{...{ register, errors }}
					/> */}
					<DateInput
						label='up_date'
						Controller={Controller}
						control={control}
						selected={watch('up_date')}
						{...{ register, errors }}
					/>
					<Input label='up_number' {...{ register, errors }} />
				</Section>
				<Section title='Commercial Details'>
					<Input
						label='commercial_executive'
						{...{ register, errors }}
					/>
					<Input label='party_bank' {...{ register, errors }} />
					<DateInput
						label='shipment_date'
						Controller={Controller}
						control={control}
						selected={watch('shipment_date')}
						{...{ register, errors }}
					/>{' '}
					<DateInput
						label='expiry_date'
						Controller={Controller}
						control={control}
						selected={watch('expiry_date')}
						{...{ register, errors }}
					/>
				</Section>
				{/* <Section title='Progression'>
					<Input
						label='ldbc_fdbc'
						title='LDBC/FDBC'
						{...{ register, errors }}
					/>
					<DateInput
						label='handover_date'
						Controller={Controller}
						control={control}
						selected={watch('handover_date')}
						{...{ register, errors }}
					/>
					<DateInput
						label='document_receive_date'
						Controller={Controller}
						control={control}
						selected={watch('document_receive_date')}
						{...{ register, errors }}
						disabled={watch('handover_date') ? false : true}
					/>
					<DateInput
						label='acceptance_date'
						Controller={Controller}
						control={control}
						selected={watch('acceptance_date')}
						{...{ register, errors }}
						disabled={watch('document_receive_date') ? false : true}
					/>
					<DateInput
						label='maturity_date'
						Controller={Controller}
						control={control}
						selected={watch('maturity_date')}
						{...{ register, errors }}
						disabled={watch('acceptance_date') ? false : true}
					/>
					<DateInput
						label='payment_date'
						Controller={Controller}
						control={control}
						selected={watch('payment_date')}
						{...{ register, errors }}
						disabled={watch('maturity_date') ? false : true}
					/>
					<Input label='payment_value' {...{ register, errors }} />
				</Section> */}
				<div className='my-2'>
					<DynamicProgression
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							progressionField,
							progressionAppend,
							progressionRemove,
							setDeleteLCEntry,
						}}
					/>
				</div>
				<div className='my-2'>
					<DynamicUD
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							udField,
							udAppend,
							udRemove,
							setDeleteLCEntryUD,
						}}
					/>
				</div>
				<Section title='Others'>
					<FormField
						label='at_sight'
						title='Payment Rec.'
						errors={errors}
					>
						<Controller
							name='at_sight'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Payment Receiving'
										options={atSight}
										value={atSight?.find(
											(item) =>
												item.value ==
												getValues('at_sight')
										)}
										onChange={(e) => {
											const value = parseInt(e.value);
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<DateInput
						label='amd_date'
						Controller={Controller}
						control={control}
						selected={getValues('amd_date')}
						{...{ register, errors }}
					/>
					<Input label='amd_count' {...{ register, errors }} />
					<Textarea label='remarks' {...{ register, errors }} />
				</Section>
			</div>
		</SectionEntryBody>
	);
}

import { format } from 'date-fns';
import { capitalize } from './utils';

const renderSubLabel = (sub_label) =>
	sub_label && <span className='label-text-alt ml-2'>{sub_label}</span>;

const renderError = (error) => {
	return (
		error?.message && (
			<label className='label px-2 pb-0 pt-[0.02rem]'>
				<span className='label-text-alt' />
				<span className='label-text-alt text-xs font-medium capitalize text-error'>
					{error?.message}
				</span>
			</label>
		)
	);
};

// Generic Form Field Component
export const FormField = ({
	label = '',
	title = '',
	sub_label = '',
	is_title_needed = 'true',
	errors = {},
	dynamicerror = {},
	children,
}) => {
	return (
		<div className='form-control w-full'>
			{is_title_needed === 'true' ? (
				<label name={label} className='label pb-1 pt-0'>
					<span className='label-text font-semibold capitalize text-secondary-content'>
						{title ? capitalize(title) : capitalize(label)}
					</span>
					{renderSubLabel(sub_label)}
				</label>
			) : null}

			{children}
			{renderError(dynamicerror) || renderError(errors?.[label])}
		</div>
	);
};

export const DatePickerDefaultConfig = {
	dateFormat: 'dd/MM/yy',
	closeOnScroll: true,
	weekDayClassName: () => 'font-semibold text-primary',
	peekNextMonth: true,
};

// Button Component
export const DatePickerChangeButton = ({ onClick, disabled, children }) => (
	<button
		type='button'
		className='btn btn-circle btn-primary btn-xs rounded-full'
		onClick={onClick}
		disabled={disabled}>
		{children}
	</button>
);

// Select Component
const DatePickerSelect = ({ value, onChange, options }) => (
	<select
		className='select select-primary select-xs flex w-auto items-center justify-between rounded-full font-semibold text-primary shadow-md transition-all duration-100 ease-in-out'
		value={value}
		onChange={onChange}>
		{options?.map((option) => (
			<option key={option} value={option}>
				{option}
			</option>
		))}
	</select>
);

export function DatePickerCustomHeader({
	date,
	changeYear,
	changeMonth,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}) {
	const formattedDate = new Date(date);
	const months = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC',
	];
	const years = Array.from({ length: 5 }, (_, i) => i + 2024);

	return (
		<div className='flex w-full flex-row items-center justify-around gap-1 rounded-t-md bg-secondary py-1.5 shadow-md transition-all duration-100 ease-in-out'>
			<DatePickerChangeButton
				onClick={decreaseMonth}
				disabled={prevMonthButtonDisabled}>
				{'<'}
			</DatePickerChangeButton>
			<DatePickerSelect
				value={format(formattedDate, 'yyyy')}
				onChange={({ target: { value } }) => changeYear(value)}
				options={years}
			/>
			<DatePickerSelect
				value={months[format(formattedDate, 'M') - 1]}
				onChange={({ target: { value } }) =>
					changeMonth(months.indexOf(value))
				}
				options={months}
			/>
			<DatePickerChangeButton
				onClick={increaseMonth}
				disabled={nextMonthButtonDisabled}>
				{'>'}
			</DatePickerChangeButton>
		</div>
	);
}


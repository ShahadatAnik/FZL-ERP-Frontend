import { CalenderIcon, IconKey, IconKeyOff } from '@/assets/icons';
import cn from '@lib/cn';
import { format } from 'date-fns';
import { forwardRef, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	DatePickerCustomHeader,
	DatePickerDefaultConfig,
	FormField,
} from './base';
import { capitalize } from './utils';

export const Input = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			className={cn(
				'input input-primary w-full rounded-md px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-primary/20',
				props?.width,
				props?.height,
				props?.className
			)}
			id={props.label}
			name={props.label}
			disabled={props.disabled}
			{...register(props?.label)}
			{...props}
		/>
	</FormField>
);

export const DateInput = ({ register, selected, ...props }) => {
	const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
		<button
			type='button'
			className='input input-primary flex w-full items-center justify-between rounded-md px-2 text-left text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-white'
			onClick={onClick}
			ref={ref}>
			{value || 'Select Date'}
			<CalenderIcon className='w-4' />
		</button>
	));
	return (
		<FormField {...props}>
			<props.Controller
				name={props.label}
				control={props.control}
				render={({ field: { onChange } }) => (
					<DatePicker
						customInput={<ExampleCustomInput />}
						selected={selected}
						onChange={(date) =>
							onChange(format(date, 'yyyy-MM-dd'))
						}
						renderCustomHeader={DatePickerCustomHeader}
						{...DatePickerDefaultConfig}
					/>
				)}
			/>
		</FormField>
	);
};

export const PasswordInput = ({ register, ...props }) => {
	const [show, setShow] = useState(false);
	return (
		<FormField {...props}>
			<label className='input input-bordered input-primary flex items-center gap-2 rounded-md px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-primary/20'>
				<input
					type={show ? 'text' : 'password'}
					className={cn(props?.width ? props.width : 'w-full')}
					id={props.label}
					name={props.label}
					disabled={props.disabled}
					{...register(props?.label)}
					{...props}
				/>
				<button
					type='button'
					className='btn btn-ghost btn-xs'
					onClick={() => setShow(!show)}>
					{show ? (
						<IconKeyOff className='w-4' />
					) : (
						<IconKey className='w-4' />
					)}
				</button>
			</label>
		</FormField>
	);
};

export const CheckBox = ({
	register,
	type = 'checkbox-success',
	text = 'text-primary',
	...props
}) => (
	<div className='form-control'>
		<label
			className={cn(
				'label cursor-pointer',
				props.height ? props.height : 'h-8'
			)}>
			<input
				type='checkbox'
				className={cn(`checkbox checkbox-sm rounded-full border`, type)}
				{...register(props.label)}
				{...props}
			/>
			<span className={cn('ml-2 font-semibold capitalize', text)}>
				{props.title
					? capitalize(props.title)
					: capitalize(props.label)}
			</span>
		</label>
	</div>
);

export const CheckBoxWithoutLabel = ({
	register,
	className = 'checkbox-primary',
	...props
}) => (
	<div className='form-control'>
		<label
			className={cn(
				'label cursor-pointer',
				props.height ? props.height : 'h-8'
			)}>
			<input
				type='checkbox'
				className={cn(`checkbox checkbox-sm`, className)}
				{...register(props.label)}
				{...props}
			/>
		</label>
	</div>
);

export const Switch = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			type='checkbox'
			className='toggle toggle-success bg-error'
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const SwitchOnly = ({ register, ...props }) => (
	<input
		type='checkbox'
		className='toggle toggle-primary'
		{...register(props.label)}
		{...props}
	/>
);

export const Select = ({ register, ...props }) => (
	<FormField {...props}>
		<select
			className='select select-bordered select-primary w-full'
			{...register(props.label)}>
			{props.option?.map((item, index) => (
				<option key={index} value={item.value}>
					{item.label}
				</option>
			))}
		</select>
	</FormField>
);

export const Radio = ({ register, checker = 0, value, rest, ...props }) => (
	<FormField {...props}>
		<div className='flex gap-6 rounded-md border border-primary bg-white px-2 py-2.5'>
			{props.option?.map((item) => (
				<label
					key={item.value}
					className='flex cursor-pointer items-center gap-2'>
					<input
						type='radio'
						className='radio checked:bg-primary'
						checked={checker == item.value}
						{...register(props.label)}
						{...rest}
					/>
					<span className='label-text'>{item.label}</span>
				</label>
			))}
		</div>
	</FormField>
);

export const Textarea = ({ register, ...props }) => (
	<FormField {...props}>
		<textarea
			className='textarea textarea-bordered textarea-primary w-full'
			rows={props.rows ? props.rows : 1}
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const FileInput = ({ register, ...props }) => (
	<FormField {...props}>
		<input
			type='file'
			className='file-input file-input-bordered file-input-primary file-input-sm w-full'
			{...register(props.label)}
			{...props}
		/>
	</FormField>
);

export const JoinInput = ({ register, ...props }) => (
	<FormField {...props}>
		<div className='join w-full'>
			<input
				className={cn(
					'input join-item input-primary rounded-md px-2 text-sm text-primary transition-all duration-100 ease-in-out placeholder:text-sm placeholder:text-primary/20',
					props?.width ? props.width : 'w-full'
				)}
				{...register(props.label)}
				{...props}
			/>
			<span className='btn-bordered btn btn-primary join-item'>
				{props.unit}
			</span>
		</div>
	</FormField>
);

export const JoinInputSelect = ({ register, ...props }) => (
	<FormField {...props}>
		<div className='join'>
			<input
				className='input join-item input-primary w-full text-primary transition-all duration-100 ease-in-out'
				id={props.label}
				{...register(props?.label)}
			/>

			<select
				className='join-item select select-bordered select-primary'
				{...register(props.join)}>
				{props.option?.map((item, index) => (
					<option key={index} value={item.value}>
						{item.label}
					</option>
				))}
			</select>
		</div>
	</FormField>
);

export const SearchBox = ({ ...props }) => (
	<input
		className={cn(
			'input input-xs input-primary h-10 rounded-md border-[0.1px] border-primary p-2 text-sm text-primary shadow-md duration-100 placeholder:text-primary placeholder:text-primary/40',
			props?.width ? props.width : 'w-full'
		)}
		{...props}
	/>
);

export const DescriptionStyle = ({ description }) => (
	<span className='text-md rounded-md bg-indigo-50 px-1 font-sans font-semibold capitalize text-indigo-600'>
		{description}
	</span>
);

export { FormField };
